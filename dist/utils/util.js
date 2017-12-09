function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var getPreDate = function (days) {
  var time = Date.now();
  var preTime = time - days * 24 * 60 * 60 * 1000;
  var preDate = new Date(preTime);
  var year = preDate.getFullYear();
  var month = preDate.getMonth() + 1;
  var day = preDate.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

module.exports = {
  formatTime: formatTime,
  getPreDate: getPreDate
}
