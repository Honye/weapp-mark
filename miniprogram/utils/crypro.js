import CryptoJS from "crypto-js";

const encryptKey = 'JvQv7SnUUIHLXcOCYPsRcg=='
const iv = '0f358c9961014d65'

/**
 * @param {string} message
 * @param {object} cfg
 * @param {string} cfg.key
 * @param {string} cfg.iv
 */
export function encrypt(message) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(encryptKey)
  const ivWordArray = CryptoJS.enc.Hex.parse(iv)
  const encrypted = CryptoJS.AES.encrypt(
    message,
    keyWordArray,
    {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex)
}

export function decrypt(message) {
  const keyWordArray = CryptoJS.enc.Utf8.parse(encryptKey)
  const ivWordArray = CryptoJS.enc.Hex.parse(iv)
  const encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(message))
  const decrypted = CryptoJS.AES.decrypt(
    encrypted,
    keyWordArray,
    {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}
