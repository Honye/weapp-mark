import wxCloud from '../../../../utils/wxCloud'

export const fetchCategories = async () => {
  return wxCloud('wallpaper', { action: 'fetchCategories' })
}

/**
 * @param {object} data
 * @param {string} data.cid
 * @param {number} [data.start]
 */
export const fetchListByCategory = (data) => {
  return wxCloud('wallpaper', {
    action: 'fetchListByCategory',
    payload: data
  })
}