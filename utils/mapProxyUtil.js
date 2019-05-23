// const createGlobleAMap = () => {
//   const obj = {};
//   const map_instance = new Proxy(obj, {
//     get: (target, key, receiver) => {
//       console.log(target, key, receiver);
//       console.log(`getting ${key}!`);
//       if (key in target || key === "default") {
//         return Reflect.get(target, key, receiver);
//       } else {
//         return `找不到 ${key} 地图实例化对象`;
//       }
//     },
//     set: (target, key, value, receiver) => {
//       console.log("target:", target);
//       console.log("key:", key);
//       console.log("value:", value);
//       console.log("receiver:", receiver);
//       return Reflect.set(target, key, value, receiver);
//     }
//   });
//   return map_instance
// };
// const AmapProxy = createGlobleAMap()
// window.AmapProxy = AmapProxy
// export default AmapProxy
//
//
//
// window.amap_proxy = new Proxy({}, {
//   get: (target, key, receiver) => {
//     console.log(target, key, receiver);
//     console.log(`getting ${key}!`);
//     if (key in target || key === "default") {
//       return Reflect.get(target, key, receiver);
//     } else {
//       return `找不到 ${key} 地图实例化对象`;
//     }
//   },
//   set: (target, key, value, receiver) => {
//     console.log("target:", target);
//     console.log("key:", key);
//     console.log("value:", value);
//     console.log("receiver:", receiver);
//     return Reflect.set(target, key, value, receiver);
//   }
// });


class AmapProxy {
  constructor() {
    this.amap = {};
    // window.amap_proxy = this.createGlobleAMap()
  }

  createGlobleAMap = () => {
    const map_instance = new Proxy(this.amap, {
      get: (target, key, receiver) => {
        console.log(target, key, receiver);
        console.log(`getting ${key}!`);
        if (key in target || key === "default") {
          return Reflect.get(target, key, receiver);
        } else {
          return `找不到 ${key} 地图实例化对象`;
        }
      },
      set: (target, key, value, receiver) => {
        console.log("target:", target);
        console.log("key:", key);
        console.log("value:", value);
        console.log("receiver:", receiver);
        return Reflect.set(target, key, value, receiver);
      }
    });
    return map_instance;
  };

  getAMapProxy = () => {
    if (!window.amap_proxy) {
      window.amap_proxy = this.createGlobleAMap();
    }
    return window.amap_proxy;
  };
}

let amap_proxy = new AmapProxy();

export default amap_proxy;
