import { request } from '../utils/request'
import { GitHub } from '../config'

/**
 * 上传头像
 * @param {object} params
 * @param {string} params.filename 以用户的 openid 作为文件名最佳
 * @param {string} params.base64 图片的 base64
 */
export const rUploadAvatar = async ({ filename, base64 }) => {
  const path = `/public/avatars/${filename}`
  const apiBase = 'https://api.github.com'
  const apiPath = `/repos/${GitHub.owner}/${GitHub.repo}/contents${path}`
  const header = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${GitHub.token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }
  const { sha } = await request({
    baseURL: apiBase,
    url: apiPath,
    header,
    method: 'GET'
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.data
      }
      if (resp.statusCode === 404) {
        return {}
      }
      return Promise.reject(resp.data)
    })
  await request({
    baseURL: apiBase,
    url: apiPath,
    header,
    method: 'PUT',
    data: {
      message: 'upload avatar',
      content: base64,
      committer: {
        name: 'iMarkr Miniprogram',
        email: 'NULL'
      },
      sha
    }
  })
  return `https://d.imarkr.com/avatars/${filename}`
}