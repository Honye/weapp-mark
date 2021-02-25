// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const $ = db.command.aggregate;
  const { OPENID } = cloud.getWXContext();
  const res = await db.collection('cards').aggregate()
    .sort({
      createTime: -1
    })
    .limit(6)
    .lookup({
      from: 'card_like',
      let: {
        card_id: '$_id'
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$card_id', '$$card_id']),
          $.eq(['$state', 1])
        ])))
        .done(),
      as: 'like_list'
    })
    .addFields({
      like_count: $.size('$like_list')
    })
    .addFields({
      like_state: $.let({
        vars: {
          filtered: $.filter({
            input: '$like_list',
            as: 'item',
            cond: $.and($.eq(['$$item.openid', OPENID]), $.eq(['$$item.state', 1]))
          })
        },
        in: $.reduce({
          input: '$$filtered',
          initialValue: 0,
          in: '$$this.state'
        })
      })
    })
    .end();
  return res;
}
