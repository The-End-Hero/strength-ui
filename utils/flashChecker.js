/*!
 * 
 * 检测和获取浏览器flash版本
 * @Version 1.0.1
 * @return {hasFlash: hasFlash, v: flashVersion}
 *
 */

export default function flashChecker() {
  /*是否安装了flash*/
  let hasFlash = 0,
    /*flash版本*/
    flashVersion = 0,
    /*是否IE浏览器*/
    isIE = (!!window.ActiveXObject) || (!!navigator.userAgent.match(/Trident.*rv\:11\./));

  if (isIE) {
    try {
      let swf = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      if (swf) {
        hasFlash = 1;
        flashVersion = swf.GetVariable("$version");

        /* 转换为数字 */
        flashVersion = flashVersion.toString().split(",")[0];
        flashVersion = Number(flashVersion.replace(/[^\d]+/, ""));
      }
    } catch (e) {
    }
  } else {
    if (navigator.plugins && navigator.plugins.length > 0) {
      let swf = navigator.plugins["Shockwave Flash"];

      if (swf) {
        let desc = swf.description.split(" ");

        hasFlash = 1;

        /*获取版本号，一般情况*/
        for (let i = 0; i < desc.length; i++) {
          if (Number(desc[i]) > 0) {
            flashVersion = Number(desc[i]);
            break;
          }
        }
      }
    }
  }

  return {
    hasFlash: !!hasFlash,
    ver: flashVersion
  };
}
