/**
 * @param {string} xml
 */
export function getSVGUri(xml) {
  return 'data:image/svg+xml;utf8,' +
    xml.replace(/\n/g, '').replace(/\s+/, ' ')
      .replace(/[#%<>{}]/g, (s) => encodeURIComponent(s))
}
