// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

const getCategories = async (event, context) => {
  let ret = []
  let message = 'success'

  const pidData = await db.collection('categories')
    .aggregate()
    .group({
      _id: '$pid',
    })
    .sort({
      _id: 1
    })
    .end()
  
  const pids = pidData.list || []
  for (let i = 0, len = pids.length; i < len; ++i) {
    const pCateData = await db.collection('categories')
      .where({
        id: pids[i]._id,
      })
      .get()
    if (pCateData.data && pCateData.data.length) {
      const pCate = pCateData.data[0]
      const children = await db.collection('categories')
        .where({
          pid: pCate.id,
          id: _.neq(pCate.id),
        })
        .get()
        .then(({ data = [] }) => data)
      pCate.children = children
      ret.push(pCate)
    } else {
      console.log(`未找到 id 为 \`${pids[i]._id}\` 的分类`)
    }
  }
  return {
    data: ret,
    message,
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getCategories(event, context)
}