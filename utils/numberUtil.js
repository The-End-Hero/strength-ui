import {isNon} from './strUtil'
import {ckmeans} from 'simple-statistics'
import uniq from 'lodash/uniq'
import forEach from 'lodash/forEach'
import trimEnd from 'lodash/trimEnd'

// 格式化数字
function formatNumber(n) {
  if (isNon(n)) {
    return 0;
  }
  let isNeg = n < 0;
  var s = n.toString().split(".")[1];
  var b = parseInt(Math.abs(n)).toString();
  var len = b.length;
  var rslt = b;
  if (len <= 3) {
    if (s) {
      rslt = b + "." + s
    }
    return isNeg ? `-${rslt}` : rslt;
  }
  var r = len % 3;
  rslt = r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
  if (s) {
    rslt = rslt + "." + s
  }
  return isNeg ? `-${rslt}` : rslt;
}

var rand = (function () {
  var today = new Date();
  var seed = today.getTime();

  function rnd() {
    seed = ( seed * 9301 + 49297 ) % 233280;
    return seed / ( 233280.0 );
  }

  return function rand(number) {
    number = number || 1;
    return rnd(seed) * number;
  };
})();

var calculateAverageBreaks = function (min, max, breakLen) {
  min = Math.floor(min);
  // max = Math.floor(max);
  max = Math.ceil(max)
  // max = Math.abs(max) < 1 ? max.toExponential(2) * 1 : max.toFixed() * 1;
  max = Math.abs(max) < 1 ? max.toExponential(2) * 1 : Math.ceil(max) * 1;
  var vals = [max], radio = (max - min) / breakLen;
  for (let i = breakLen - 1; i > 0; i--) {
    let val = min * 1 + radio * i;
    val = Math.abs(val) < 1 ? val.toExponential(2) : val.toFixed(Math.abs(max - min) > 10 ? 0:1);
    // (val == min || val == max) && (val = '');
    val = val * 1;
    if (val == val) {
      vals.push(val);
    }
  }
  if (max !== max || max === -Infinity) {
    vals[0] = Infinity;
  }
  if (min === min && min !== Infinity) {
    // vals.push(Math.abs(min) < 1 ? min.toExponential(2) * 1 : min.toFixed() * 1);
    vals.push(Math.abs(min) < 1 ? min.toExponential(2) * 1 : Math.floor(min) * 1);
  } else {
    vals.push(-Infinity);
  }
  vals = uniq(vals);
  return vals.reverse();
}

var calculateNBC = function (max, data, breakLen) {
  if (breakLen > data.length) {
    return [];
  }
  var breaks = ckmeans(data, breakLen).map((cluster) => {
    return cluster[0];
  });
  // 自然分段中,最后一个数据集可能出现全为最大值情况,这种情况下,直接返回breaks
  if (breaks[breaks.length - 1] == max) {
    return breaks
  }
  breaks.push(max);
  return breaks;
}

var trimFloatZero = function (num, pre = 2) {
  let rslt = trimEnd(trimEnd((num * 1).toFixed(pre), '0'), '.') || 0;
  if (pre === 0) {
    rslt = (num * 1).toFixed(pre);
  }
  if (rslt == 'NaN') {
    rslt = 0;
  }
  return rslt;
}

var strip = function(num, precision = 12) {
  if (num.toString().split('.').length == 2) {
    return +parseFloat(num.toPrecision(precision));
  }else{
    return num;
  }
}

var stripObjAll = function(obj) {
  if (typeof obj === 'object') {
    forEach(obj, (t, key) => {
      obj[key] = stripObjAll(obj[key]);
    })
    return obj;
  }else if (typeof obj === 'number'){
    return strip(obj);
  }else {
    return obj;
  }
}

var getLabelFormatter = function (value, splitNum) {
  let e1 = 0.1, e2 = 0.01, e3 = 0.001, e4 = 0.0001;
  if (value < e1 && value >= e2 || value > -e1 && value <= -e2) {// 百分比
    return [e2, '%']
  }
  if (value < e2 && value >= e3 || value > -e2 && value <= -e3) {// 千分比
    return [e3, '‰']
  }
  if (value < e3 && value > 0 || value > -e3 && value < 0) {// 万分比
    return [e4, '‱']
  }

  let w = 10000, k = 1000;
  // 第一个超过1w或有一半数字超过1w
  if (value >= w || Math.ceil(splitNum * 0.5) * value >= w ||
    value <= -w || Math.ceil(splitNum * 0.5) * value <= -w) {
    return [w, 'w'];
  } else if ((value >= k || Math.ceil(splitNum * 0.5) * value >= k) && value < w ||
    (value <= -k || Math.ceil(splitNum * 0.5) * value <= -k) && value > -w) {
    return [k, 'k'];
  }
  return [1, ''];
}

export {
  rand,
  formatNumber,
  calculateAverageBreaks,
  calculateNBC,
  trimFloatZero,
  strip,
  stripObjAll,
  getLabelFormatter,
};
