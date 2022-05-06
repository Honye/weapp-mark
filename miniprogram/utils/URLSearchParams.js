export class URLSearchParams {
  map

  constructor(params) {
    this.map = new Map()
    for (const k of Object.keys(params)) {
      this.map.set(k, params[k])
    }
  }

  toString() {
    const arr = []
    for (const [k, v] of this.map) {
      arr.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    }
    return arr.join('&')
  }
}
