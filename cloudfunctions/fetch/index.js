const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { url, ...options } = event
  return fetch(url, options)
    .then((resp) => {
      const data = resp.json()
      if (resp.ok) {
        return data
      }
      return Promise.reject(data)
    })
}