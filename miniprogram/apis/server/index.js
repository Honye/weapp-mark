import { request } from '../../utils/request'

/**
 * @param {RequestOption} config
 */
const fetch = async (config) => {
  config.baseURL = 'https://sanphantom.com/go'
  const resp = await request(config)
  if (resp.ok) {
    return resp
  }
  return Promise.reject(resp.data)
}

export const apiGetBanners = () => {
  return fetch({ url: '/banners' })
}

export const apiGetHotMovies = (data) => {
  return fetch({ url: '/douban/hot/items', data })
}

export const apiGetShowingMovies = (data) => {
  return fetch({ url: '/douban/showing/items', data })
}

export const apiGetSoonMovies = (data) => {
  return fetch({ url: '/douban/soon/items', data })
}

export const apiGetDetail = (params) => {
  const { id, type = 'movie' } = params
  return fetch({ url: `/douban/${type}/${id}` })
}

export const apiGetCelebrities = (params) => {
  const { id, type = 'movie' } = params
  return fetch({ url: `/douban/${type}/${id}/celebrities` })
}

export const apiSearch = (data) => {
  return fetch({ url: '/douban/search', data })
}

export const apiGetPhotos = (params) => {
  const { id, type = 'movie', ...data } = params
  return fetch({ url: `/douban/${type}/${id}/photos`, data })
}

export const apiGetInterests = (params) => {
  const { id, type = 'movie', ...data } = params
  return fetch({ url: `/douban/${type}/${id}/interests`, data })
}

export const apiGetUserInterests = (userID, data) => {
  return fetch({ url: `/douban/user/${userID}/interests`, data })
}

export const apiGetCaptcha = (data) => {
  return fetch({
    url: '/douban/login/request_phone_code',
    method: 'POST',
    data
  })
}

export const apiVerifyCaptcha = (data) => {
  return fetch({
    url: '/douban/login/verify_phone_code',
    method: 'POST',
    data
  })
}
