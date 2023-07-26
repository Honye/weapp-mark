const fetch = require('node-fetch')

const fetchCategories = async () => {
  const res = await fetch('http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAllCategories')
    .then((resp) => {
      const data = resp.json()
      if (resp.ok) return data
      return Promise.reject(data)
    })
  await Promise.allSettled(
    Object.values(res.data).map((c) =>
      fetchListByCategory({ cid: c.id, count: 1 })
        .then((w) => c.cover = w.data[0]?.url)
    )
  )
  return res
}

const fetchListByCategory = async (data) => {
  const base = 'http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory'
  const params = new URLSearchParams(data)
  const url = `${base}&${params}`
  return fetch(url)
    .then((resp) => {
      const data = resp.json()
      if (resp.ok) return data
      return Promise.reject(data)
    })
}

exports.main = async (event, context) => {
  const { action, payload } = event
  return { fetchCategories, fetchListByCategory }[action]?.(payload)
}
