const serialize = function(obj, unEncode = true, prefix) {
  let str = [];
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      let k = prefix ? `${prefix}[${p}]` : p, v = obj[p];
      //修改,api需要的格式:attr=name&attr=lng&attr=lat
      if (obj.hasOwnProperty("length")) {
        k = prefix ? prefix : p;
      }
      //end
      if (unEncode) {
        str.push(
          typeof v == "object" ?
            serialize(v, unEncode, k) :
            `${k}=${v}`
        );
      } else {
        str.push(typeof v == "object" ?
          serialize(v, unEncode, k) :
          `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
      }

    }
  }
  return str.join("&");
};

export default serialize;
