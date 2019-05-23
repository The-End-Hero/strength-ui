import forEach from "lodash/forEach";
import pullAt from "lodash/pullAt";
import size from "lodash/size";
import uniq from "lodash/uniq";
import isArray from "lodash/isArray";
import coordtrans from "./coordtrans";
import * as maptalks from "maptalks";

function extd(a, b) {
  for (let c in b) {
    b.hasOwnProperty(c) && (a[c] = b[c]);
  }
  return a;
}

function transStyleJson(a) {
  for (var b = {
    featureType: "t",
    elementType: "e",
    visibility: "v",
    color: "c",
    lightness: "l",
    saturation: "s",
    weight: "w",
    zoom: "z",
    hue: "h"
  }, c = {
    all: "all",
    geometry: "g",
    "geometry.fill": "g.f",
    "geometry.stroke": "g.s",
    labels: "l",
    "labels.text.fill": "l.t.f",
    "labels.text.stroke": "l.t.s",
    "lables.text": "l.t",
    "labels.icon": "l.i"
  }, d = [], e = 0, f; f = a[e]; e++) {
    var g = f.stylers;
    delete f.stylers;
    extd(f, g);
    var g = [], i;
    for (i in b) {
      if (f[i]) {
        if ("elementType" === i) {
          g.push(b[i] + ":" + c[f[i]]);
        } else {
          switch (f[i]) {
            case "poilabel":
              f[i] = "poi";
              break;
            case "districtlabel":
              f[i] = "label";
          }
          g.push(b[i] + ":" + f[i]);
        }
      }
    }
    2 < g.length && d.push(g.join("|"));
  }
  return d.join(",");
}

function transPolygonWgs2Bd(geometry) {
  let { coordinates, type } = geometry;
  let transCds = [];
  if (type === "MultiPolygon") {
    forEach(coordinates, (coo) => {
      let tmp1 = [];
      forEach(coo, (co) => {
        let tmp2 = [];
        forEach(co, (c) => {
          let s = coordtrans.wgs84tobd09(c[0], c[1]);
          tmp2.push([s.lng, s.lat]);
        });
        tmp1.push(tmp2);
      });
      transCds.push(tmp1);
    });
  } else if (type === "Polygon") {
    forEach(coordinates, (co) => {
      let tmp1 = [];
      forEach(co, (c) => {
        let s = coordtrans.wgs84tobd09(c[0], c[1]);
        tmp1.push([s.lng, s.lat]);
      });
      transCds.push(tmp1);
    });
  }
  return { type, coordinates: transCds };
}

function getPolygonCoordsFromMultiEditor(layer, type) {
  let coords = layer.getCoordinates();
  let transCoords = [];
  if (type === "MultiPolygon") {
    forEach(coords, coo => {
      let tmp1 = [];
      forEach(coo, co => {
        let tmp2 = [];
        forEach(co, t => {
          let bLnglat = t.toArray();
          let tmp3 = coordtrans.bd09towgs84(...bLnglat);
          tmp2.push([tmp3.lng, tmp3.lat]);
        });
        tmp1.push(tmp2);
      });
      transCoords.push(tmp1);
    });
  } else {
    forEach(coords, coo => {
      let tmp1 = [];
      forEach(coo[0], t => {
        let bLnglat = t.toArray();
        let tmp2 = coordtrans.bd09towgs84(...bLnglat);
        tmp1.push([tmp2.lng, tmp2.lat]);
      });
      transCoords.push(tmp1);
    });
  }
  return transCoords;
}

function transPolylineWgs2Bd(geometry) {
  let { coordinates, type } = geometry;
  let transCds = [];
  if (type === "MultiLineString") {
    forEach(coordinates, (co) => {
      let tmp1 = [];
      forEach(co, (c) => {
        let s = coordtrans.wgs84tobd09(c[0], c[1]);
        tmp1.push([s.lng, s.lat]);
      });
      transCds.push(tmp1);
    });
  } else if (type === "LineString") {
    forEach(coordinates, (c) => {
      let s = coordtrans.wgs84tobd09(c[0], c[1]);
      transCds.push([s.lng, s.lat]);
    });
  }
  return { type, coordinates: transCds };
}

function getPolylineCoordsFromMultiEditor(layer, type) {
  let coords = layer.getCoordinates();
  let transCoords = [];
  if (type === "MultiLineString") {
    forEach(coords, coo => {
      let tmp1 = [];
      forEach(coo, co => {
        let bLnglat = co.toArray();
        let tmp2 = coordtrans.bd09towgs84(...bLnglat);
        tmp1.push([tmp2.lng, tmp2.lat]);
      });
      transCoords.push(tmp1);
    });
  } else {
    forEach(coords, t => {
      let bLnglat = t.toArray();
      let tmp2 = coordtrans.bd09towgs84(...bLnglat);
      transCoords.push([tmp2.lng, tmp2.lat]);
    });
  }
  return transCoords;
}

/**
 * 传入polygon列表，返回MultiPolygon coordinates
 * @param polygons
 * @returns {Array} coordinates
 */

function checkAllContains(polygons) {
  let passed = {}, //key是小范围, value是大范围
    passedArr = [], //全部有包含关系的index
    passedArr2 = {}; //key是大范围, value是包含数组
  let len = size(polygons);
  for (let i = 0; i < len - 1; i++) {
    const p1 = polygons[i];
    if (passed[i] === undefined) {
      for (let j = i + 1; j < len; j++) {
        if (passed[j] === undefined) {
          const p2 = polygons[j];
          const status = checkContain(p1, p2);
          if (status == -1) {
            passed[i] = j;
            passedArr.push(i);
            passedArr.push(j);
            passedArr2[j] = passedArr2[j] || [];
            passedArr2[j].push(i);
          } else if (status == 1) {
            passed[j] = i;
            passedArr.push(i);
            passedArr.push(j);
            passedArr2[i] = passedArr2[i] || [];
            passedArr2[i].push(j);
          }
        }
      }
    }
  }
  // console.log(passedArr2);

  let cps = [];
  forEach(passedArr2, (arr, id) => {
    let paths = polygons[id].getCoordinates()[0];
    let coords = getTransCoords(paths);
    let cp = [];
    cp.push(coords);
    forEach(arr, v => {
      paths = polygons[v].getCoordinates()[0];
      coords = getTransCoords(paths);
      cp.push(coords);
    });
    cps.push(cp);
  });
  passedArr = uniq(passedArr);
  pullAt(polygons, passedArr);
  forEach(polygons, t => {
    let paths = t.getCoordinates()[0];
    let coords = getTransCoords(paths);
    let cp = [];
    cp.push(coords);
    cps.push(cp);
  });
  return cps;
}

/**
 *
 * @param paths
 * @param coordsys
 * @returns {Array} coordinates
 */
function getTransCoords(paths, coordsys = "wgs") {
  let coordinates = [];
  switch (coordsys) {
    case "wgs":
      forEach(paths, (path) => {
        if (isArray(path)) {
          let coords = [];
          forEach(path, t => {
            let pos = coordtrans.bd09towgs84(t.x, t.y);
            coordinates.push([pos.lng, pos.lat]);
          });
          // coordinates.push(coords)
        } else {
          let pos = coordtrans.bd09towgs84(path.x, path.y);
          coordinates.push([pos.lng, pos.lat]);
        }
      });
      break;
    case "bd":
      forEach(paths, (path) => {
        if (isArray(path)) {
          let coords = [];
          forEach(path, t => {
            coordinates.push([t.x, t.y]);
          });
          // coordinates.push(coords)
        } else {
          coordinates.push([path.x, path.y]);
        }
      });
      break;
    case "gcj":
      forEach(paths, (path) => {
        if (isArray(path)) {
          let coords = [];
          forEach(path, t => {
            let pos = coordtrans.bd09togcj02(t.x, t.y);
            coordinates.push([pos.lng, pos.lat]);
          });
          // coordinates.push(coords)
        } else {
          let pos = coordtrans.bd09togcj02(path.x, path.y);
          coordinates.push([pos.lng, pos.lat]);
        }
      });
      break;
  }
  return coordinates;
}


/**
 * 判断polygon是否包含关系
 * @param p1
 * @param p2
 * @returns {number} -1: p2包含p1, 0:无互相包含关系, 1: p1包含p2
 */
function checkContain(p1, p2) {
  let paths = p1.getCoordinates()[0];
  let status = -1;
  forEach(paths, (point) => {
    if (!p2.containsPoint(point)) {
      status = 0;
      return false;
    }
  });
  if (status) return status;
  paths = p2.getCoordinates()[0];
  status = 1;
  forEach(paths, (point) => {
    if (!p1.containsPoint(point)) {
      status = 0;
      return false;
    }
  });
  return status;
}

function getCenterLngLat(data) {
  if (data.geometry.type == "Point") {
    return data.geometry.coordinates;
  }
  if (data.geometry.type == "Polygon") {
    let points = data.geometry.coordinates[0];
    let lngTat = 0, latTat = 0;
    forEach(points, p => {
      lngTat = lngTat + p[0];
      latTat = latTat + p[1];
    });
    return [lngTat / points.length, latTat / points.length];
  }
  if (data.geometry.type == "MultiPolygon") {
    let points = data.geometry.coordinates[0][0];
    let lngTat = 0, latTat = 0;
    forEach(points, p => {
      lngTat = lngTat + p[0];
      latTat = latTat + p[1];
    });
    return [lngTat / points.length, latTat / points.length];
  }
  if (data.geometry.type == "LineString") {
    let len = data.geometry.coordinates.length;
    return data.geometry.coordinates[Math.floor((len - 1) / 2)];
  }
  if (data.geometry.type == "MultiLineString") {
    let len = data.geometry.coordinates[0].length;
    return data.geometry.coordinates[0][Math.floor((len - 1) / 2)];
  }
}

//高德amap的polygon options 转换为maptalks polygon options
function polyOptA2M(amapOpt) {
  return {
    symbol: {
      lineColor: amapOpt.strokeColor,
      lineWidth: amapOpt.strokeWeight,
      lineDasharray: amapOpt.strokeDasharray,
      lineOpacity: amapOpt.strokeOpacity,
      polygonFill: amapOpt.fillColor,
      polygonOpacity: amapOpt.fillOpacity
    },
    zIndex: amapOpt.zIndex,
    simplifyTolerance: 1
  };
}

//高德amap的polygon options 转换为 map server options
function polyOptA2S(amapOpt) {
  return {
    "polygon": {
      "fill": amapOpt.fillColor,
      "fill_opacity": amapOpt.fillOpacity
    },
    "line": {
      "stroke": amapOpt.strokeColor,
      "stroke_opacity": amapOpt.strokeOpacity,
      "stroke_width": amapOpt.strokeWeight,
      "stroke_dasharray": amapOpt.strokeStyle !== "solid" ? amapOpt.strokeDasharray : undefined
    }
  };
}

function addPolygon(fence, opt) {
  let { geometry, ...properties } = fence;
  geometry = transPolygonWgs2Bd(geometry);
  let geometry_type = geometry.type, polygon;
  opt.properties = properties;
  if (geometry_type === "MultiPolygon") {
    polygon = new maptalks.MultiPolygon(geometry.coordinates, opt);
  } else if (geometry_type === "Polygon") {
    polygon = new maptalks.Polygon(geometry.coordinates, opt);
  }
  return polygon;
}

export default {
  transStyleJson,
  transPolygonWgs2Bd,
  getPolygonCoordsFromMultiEditor,
  transPolylineWgs2Bd,
  getPolylineCoordsFromMultiEditor,
  checkAllContains,
  getTransCoords,
  checkContain,
  getCenterLngLat,
  polyOptA2M,
  polyOptA2S,
  addPolygon
};
