const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const _id = event._id;

  const promiseCard = db.collection('cards').doc(_id).get().then(({ data }) => data);
  const promiseLiked =
    db.collection('card_like')
      .where({ card_id: _id, state: 1 })
      .count()
      .then(({ total }) => total);
  const promiseState =
    db.collection('card_like')
      .where({ card_id: _id, openid })
      .limit(1)
      .get()
      .then(({ data }) => data[0] && data[0].state);

  const [card, liked, state] = await Promise.all([promiseCard, promiseLiked, promiseState]);

  return {
    ...card,
    like_count: liked,
    like_state: state,
  };
}
