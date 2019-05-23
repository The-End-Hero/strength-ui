export default function loadMap(key = "6d57ea429648933acc255bafd379dcf1") {
  // 查重
  const hasScriptLink = src => {
    let scripts = document.head.querySelectorAll("script");
    scripts = Array.from(scripts);
    return scripts.some(current => {
      if (current.src.indexOf(src) > -1) {
        return true;
      }
    });
  };
  // 高得API
  const p1 = new Promise((resolve, reject) => {
    const src = `//webapi.amap.com/maps?v=1.4.13&key=${key}&callback=initTheMap`;
    const hasScript = hasScriptLink(src);
    if (window.AMap || hasScript) {
      const hasAMap = () => {
        console.log("检测AMap是否加载完成");
        setTimeout(() => {
          if (window.AMap) {
            resolve(window.AMap);
          } else {
            hasAMap();
          }
        }, 200);
      };
      hasAMap();
    } else {
      window.initTheMap = function() {
        console.log("amap-------onload");
        window.initAMapUI();
        resolve(window.AMap);
      };
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
  // 高德UI
  const p2 = new Promise((resolve, reject) => {
    const src = "//webapi.amap.com/ui/1.0/main-async.js";
    const hasScript = hasScriptLink(src);
    if (hasScript) {
      resolve("success");
    } else {
      let script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src = src;
      script2.onerror = reject;
      script2.onload = function() {
        console.log("amap-ui-------onload");
        resolve("success");
      };
      document.head.appendChild(script2);
    }
  });

  // loca v0.1.3加载
  const p3 = new Promise((resolve, reject) => {
    const src =
      "//a.amap.com/insight/static/loca/loca-0.1.3-rc1.js?v=2017121818";
    const hasScript = hasScriptLink(src);
    if (hasScript) {
      resolve("success");
    } else {
      let script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src = src;
      script2.onerror = reject;
      script2.onload = function(su) {
        console.log("loca-------onload", su);
        resolve("success");
      };
      document.head.appendChild(script2);
    }
  });

  // amapvplugins v0.0.1
  const p4 = new Promise((resolve, reject) => {
    const src = "//a.amap.com/insight/static/amapvplugins-0.1.0.js";
    const hasScript = hasScriptLink(src);
    if (hasScript) {
      resolve("success");
    } else {
      let script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src = src;
      script2.onerror = reject;
      script2.onload = function(su) {
        console.log("amapvplugins-------onload", su);
        resolve("success");
      };
      document.head.appendChild(script2);
    }
  });
  return Promise.all([p1, p2, p3, p4])
    .then(result => {
      console.log("result----------->all");
      return result[0];
    })
    .catch(e => {
      console.log(e);
    });
}
