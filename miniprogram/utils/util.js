export function formatTime (date) {
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

export const getPreDate = (days) => {
  var time = Date.now();
  var preTime = time - days * 24 * 60 * 60 * 1000;
  var preDate = new Date(preTime);
  var year = preDate.getFullYear();
  var month = preDate.getMonth() + 1;
  var day = preDate.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

/**
 * Object参数格式化
 * @param {Object} params 参数
 */
export const parseParams = params => {
  let paramArr = [];
  for (const key in params) {
    paramArr.push(`${key}=${params[key]}`);
  }
  return paramArr.join('&');
};

export function isEmpty (object) {
  try {
    for(let item of object) 
      return false;
  } catch (e) {
    return true;
  }
  return true
}

/**
 * 比较两个版本号
 * @param {string} v1
 * @param {string} v2
 * @returns {-1|0|1}
 * - -1：v1 < v2
 * - 0：v1 = v2
 * - 1：v1 > v2
 */
export const compareVersions = (v1, v2) => {
  const v1nums = v1.split('.');
  const v2nums = v2.split('.');
  const [shorts, longs] = v1nums.length > v2nums.length ? [v2nums, v1nums] : [v1nums, v2nums];
  for (const i in shorts) {
    if (shorts[i] < longs[i]) {
      return v1nums.length > v2nums.length ? 1 : -1;
    }
    if (shorts[i] > longs[i]) {
      return v1nums.length > v2nums.length ? -1 : 1;
    }
  }
  return 0;
};

/**
 * 数字加千位分隔符（,）
 * @param {number} num
 */
export const milliFormat = (num) => {
  return num && num.toString()
    .replace(/\d+/, (s) => {
      return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    });
}
