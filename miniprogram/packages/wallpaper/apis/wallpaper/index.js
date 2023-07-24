import { fetch } from '../../../../utils/wxCloud'
import { URLSearchParams } from '../../../../utils/URLSearchParams'

export const fetchCategories = async () => {
  const res = await fetch({
    url: 'http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAllCategories'
  })
  await Promise.allSettled(
    Object.values(res.data).map((c) =>
      fetchListByCategory({ cid: c.id, count: 1 })
        .then((w) => c.cover = w.data[0]?.url)
    )
  )
  return res
}

/**
 * @param {object} data
 * @param {string} data.cid
 * @param {number} [data.start]
 */
export const fetchListByCategory = (data) => {
  const base = 'http://wallpaper.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory'
  const params = new URLSearchParams(data)
  const url = `${base}&${params}`
  return fetch({ url })
}