import isNull from 'lodash/isNull'
import isNaN from 'lodash/isNaN'
import isUndefined from 'lodash/isUndefined'
import SparkMD5 from 'spark-md5'

const chartCode = 64;

function StringFromCharCode(n) {
  let code = chartCode + ~~n;
  return String.fromCharCode(code);
}

function StringFromCharCodeExt(n) {
  let str = "", code, nt;
  while (n > 0) {
    nt = (n - 1) % 26 + 1;
    code = chartCode + nt;
    str = String.fromCharCode(code) + "" + str;
    n = ~~((n - 1) / 26);
  }
  return str;
}

function CharCode2Int(s) {
  return s.charCodeAt() - chartCode;
}

function isNon(val) {
  return (isNull(val) || isNaN(val) || isUndefined(val) ||
    val == "NaN" || val == "null" || val == 'undefined');
}

function getMd5Str(str) {
  return SparkMD5.hash(str);
}

function getMd5Key(data) {
  return getMd5Str(JSON.stringify(data || {}));
}

function getJsonObj(str) {
  let rslt;
  if (str) {
    try {
      rslt = JSON.parse(str);
    } catch (e) {
      console.log('JSON parse err: ', e);
    }
  }
  return rslt;
}

function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}

function dataURLtoBlob(dataurl, onlyData) {
  try {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return onlyData ? u8arr : new Blob([u8arr], {type: mime});
  }catch (e) {
    console.error(e)
    console.error(dataurl,'dataurl')
  }

}

function blob2md5(blob, callback) {
  let a = new FileReader();
  a.readAsArrayBuffer(blob);
  a.onloadend = function () {
    callback && callback(SparkMD5.ArrayBuffer.hash(a.result));
  };
}

function testLink(str) {
  const LinkRegExp = new RegExp(/http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/);
  return LinkRegExp.test(str);
}
function getCommentReg(str) {
  const line = /(?:^|\s)\/\/(.+?)$/gm;
  const block = /\/\*([\S\s]*?)\*\//gm;
  return new RegExp(`(?:${line.source})|(?:${block.source})`, 'gm');
}

export {
  isNon,
  getMd5Str,
  getMd5Key,
  StringFromCharCode,
  StringFromCharCodeExt,
  CharCode2Int,
  getJsonObj,
  decodeUnicode,
  dataURLtoBlob,
  blob2md5,
  testLink,
  getCommentReg,
}
