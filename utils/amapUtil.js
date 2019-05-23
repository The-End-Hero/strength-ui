"use strict";
import coordtransform from "coordtransform";
import forEach from "lodash/forEach";
import find from "lodash/find";
import max from "lodash/max";
import findIndex from "lodash/findIndex";
import { interpolateRgbBasis } from "d3-interpolate";
import indexOf from "lodash/indexOf";
import size from "lodash/size";
import pullAt from "lodash/pullAt";
import uniq from "lodash/uniq";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { isNon } from "./strUtil";
import wkx from "wkx";
import { decodeUnicode } from "./strUtil";
import { getData, render, getMarkerStyleById } from "./LocaExt";
// import {Style} from '../constants/Constants'
const colors = ["#20C2E1", "#23D561", "#9CD523", "#F1E229", "#FFBF3A", "#FB8C00", "#FF5252"];
const Style = {
  "color": colors[0],
  "radius": 10,
  "opacity": 0.8,
  "size": 12
};
// let AMap = window.AMap;

/**
 * 转化为amap经纬度
 * @param lng
 * @param lat
 * @returns {AMap.LngLat}
 */
function wgs84togcj02(lng, lat) {
  let ps = coordtransform.wgs84togcj02(lng, lat);
  return new window.AMap.LngLat(ps[0], ps[1]);
}

/**
 * 转化为gps坐标
 * @param lng
 * @param lat
 * @returns {AMap.LngLat}
 */
function gcj02towgs84(lng, lat) {
  let ps = coordtransform.gcj02towgs84(lng, lat);
  return new window.AMap.LngLat(ps[0], ps[1]);
}

/**
 * 百度转化为高德坐标
 * @param lng
 * @param lat
 * @returns {AMap.LngLat}
 */
function bd09togcj02(lng, lat) {
  let ps = coordtransform.bd09togcj02(lng, lat);
  return new window.AMap.LngLat(ps[0], ps[1]);
}

/**
 * 高德坐标转化为百度
 * @param lng
 * @param lat
 * @returns {AMap.LngLat}
 */
function gcj02tobd09(lng, lat) {
  let ps = coordtransform.gcj02tobd09(lng, lat);
  return new window.AMap.LngLat(ps[0], ps[1]);
}

/**
 * 根据围栏添加polygon
 * @param fence
 * @param opt
 * @returns {Array}
 */
function addPolygon(fence, opt) {
  // console.log(fence,'根据围栏添加polygon fence')
  // console.log(opt,'根据围栏添加polygon opt')
  opt = opt || { bubble: true };
  let overlayList = [];
  let { geometry: polygon, ...properties } = fence;
  if (polygon.type == "MultiPolygon") {
    forEach(polygon.coordinates, (coo) => {
      let points = [];
      forEach(coo, (co) => {
        let tmpo = [];
        forEach(co, (c) => {
          tmpo.push(wgs84togcj02(c[0], c[1]));
        });
        points.push(tmpo);
      });
      let polygon = new window.AMap.Polygon({
        path: points,
        ...opt,
        extData: properties
      });
      overlayList.push(polygon);
    });
  } else if (polygon.type == "Polygon") {
    let points = [];
    forEach(polygon.coordinates, (coo) => {
      let tmpo = [];
      forEach(coo, (co) => {
        tmpo.push(wgs84togcj02(co[0], co[1]));
      });
      points.push(tmpo);
    });
    let apolygon = new window.AMap.Polygon({
      path: points,
      ...opt,
      extData: properties
    });
    overlayList.push(apolygon);
  }

  return overlayList;
}

/**
 *
 * @param fence
 * @param opt 配置信息,颜色样式等
 * @returns {Array}
 */
function addPolyline(fence, opt) {
  opt = opt || {};
  let lineList = [];
  let { geometry: line, ...properties } = fence;
  // console.log(fence, line, properties, 'fence---line')
  if (line.type == "MultiLineString") { // 多线  例如 名字一样的路有分叉
    forEach(line.coordinates, (coo) => {
      let points = [];
      forEach(coo, (co) => {
        points.push(wgs84togcj02(co[0], co[1]));
      });
      let polyline = new window.AMap.Polyline({
        path: points,
        ...opt,
        extData: properties
      });
      lineList.push(polyline);
    });
  } else if (line.type == "LineString") { // 单线
    let points = [];
    forEach(line.coordinates, (co) => { // line.coordinates 二维数组
      points.push(wgs84togcj02(co[0], co[1]));
    });
    let polyline = new window.AMap.Polyline({
      path: points,
      ...opt,
      extData: properties
    });
    lineList.push(polyline);
  }

  return lineList;
}

/**
 *
 * @param geometry
 * @param opt
 * @returns {Array}
 */
function addPolylineList(geometry, opt) {
  let list = [];

  forEach(geometry, (fence, index) => {
    let tmp = addPolyline(fence, opt);
    list = list.concat(tmp);
  });

  return list;
}

/**
 * 添加polygon数组
 * @param geometry
 * @param opt
 * @param strokeColors
 * @returns {Array}
 */
function addPolygonList(geometry, opt, strokeColors) {
  let list = [];

  forEach(geometry, (fence, index) => {
    let strokeColor = strokeColors && strokeColors[index];
    if (!strokeColor) strokeColor = strokeColors && strokeColors[strokeColors.length - 1];
    if (strokeColor) opt.strokeColor = strokeColor;
    let tmp = addPolygon(fence, opt);
    list = list.concat(tmp);
  });

  return list;
}

/**
 * 添加polygon数组
 * @param geometryList
 * @param opt
 * @param colors
 * @param key
 * @returns {Array}
 */
function addGridPolygonByAvg(geometryList, opt, colors, key = "value") {

  let max = 0, min = Infinity;
  forEach(geometryList, (item) => {
    let val = parseFloat(item[key]);
    if (max < val) {
      max = val;
    }
    if (min > val) {
      min = val;
    }
  });

  if (max == 0) {
    max = 1;
  }

  let list = [], renderlist = {}, cLen = colors.length - 1;
  forEach(geometryList, (item) => {
    let value = item[key] || 0;
    let index = Math.round((value - min) * cLen / (max - min));
    let rKey = `${index}_${value ? 1 : 0}`;
    if (!renderlist[rKey]) {
      let fillColor, fillOpacity = 0.8, strokeOpacity = 0.2;
      if (value) {
        fillColor = colors[index];
        fillOpacity = index ? 0.8 : 0.5;
      } else {
        fillColor = "transparent";
        fillOpacity = 0;
      }
      renderlist[rKey] = {
        fillColor,
        fillOpacity,
        strokeOpacity,
        points: []
      };
    }
    let points = renderlist[rKey].points;
    let { geometry: polygon } = item;
    if (!polygon) return true;
    if (polygon.type == "MultiPolygon") {
      forEach(polygon.coordinates, (coo) => {
        forEach(coo, (co) => {
          let tmpo = [];
          forEach(co, (c) => {
            tmpo.push(wgs84togcj02(c[0], c[1]));
          });
          points.push(tmpo);
        });
      });
    } else if (polygon.type == "Polygon") {
      forEach(polygon.coordinates, (coo) => {
        let tmpo = [];
        forEach(coo, (co) => {
          tmpo.push(wgs84togcj02(co[0], co[1]));
        });
        points.push(tmpo);
      });
    }
    renderlist[rKey].points = points;
  });

  forEach(renderlist, (item) => {
    let polygon = new window.AMap.Polygon({
      path: item.points,
      ...opt,
      fillColor: item.fillColor,
      fillOpacity: item.fillOpacity
    });
    list.push(polygon);
  });

  return list;
}

/**
 * 添加polygon数组
 * @param geometryList
 * @param opt
 * @param colors
 * @param key
 * @returns {Array}
 */
function addGridPolygonByBreaks(geometryList, opt, colors, breaks, key = "value") {
  let list = [], renderlist = {};
  forEach(geometryList, (item) => {
    let value = item[key] || 0;
    let index = value == 1 ? 0 : 1;
    if (value == 1) {
      index = 0;
    } else if (value > 1 && value < 4) {
      index = 1;
    } else if (value < 10) {
      index = 2;
    } else {
      let cMax = colors.length - 3;
      forEach(breaks, (breakItem, i) => {
        if (value < breakItem) {
          return false;
        }
        if (i < cMax) {
          index = i + 3;
        }
      });
    }
    let rKey = `${index}_${value ? 1 : 0}`;
    if (!renderlist[rKey]) {
      let fillColor, fillOpacity = 0.8, strokeOpacity = 0.2;
      if (value) {
        fillColor = colors[index];
        fillOpacity = index ? 0.8 : 0.5;
      } else {
        fillColor = "transparent";
        fillOpacity = 0;
      }
      renderlist[rKey] = {
        fillColor,
        fillOpacity,
        strokeOpacity,
        points: []
      };
    }
    let points = renderlist[rKey].points;
    let { geometry: polygon } = item;
    if (!polygon) return true;
    if (polygon.type == "MultiPolygon") {
      forEach(polygon.coordinates, (coo) => {
        forEach(coo, (co) => {
          let tmpo = [];
          forEach(co, (c) => {
            tmpo.push(wgs84togcj02(c[0], c[1]));
          });
          points.push(tmpo);
        });
      });
    } else if (polygon.type == "Polygon") {
      forEach(polygon.coordinates, (coo) => {
        let tmpo = [];
        forEach(coo, (co) => {
          tmpo.push(wgs84togcj02(co[0], co[1]));
        });
        points.push(tmpo);
      });
    }
    renderlist[rKey].points = points;
  });

  forEach(renderlist, (item) => {
    let polygon = new window.AMap.Polygon({
      path: item.points,
      ...opt,
      fillColor: item.fillColor,
      fillOpacity: item.fillOpacity
    });
    list.push(polygon);
  });

  return list;
}

/**
 * 根据名称匹配选择状态
 * @param values
 * @param polygons
 * @param activeOpt
 * @param normalOpt
 */
function updatePolygonSelectByKey(values, polygons, activeOpt, normalOpt, valKey = "id") {
  let selected = [], opt, keys = valKey.split("/");
  forEach(polygons, (polygon) => {
    let isSelect = false,
      data = polygon.getExtData();
    forEach(keys, (key) => {
      let val = data[key];
      if (findIndex(values, it => it == val) !== -1) {
        isSelect = true;
        return false;
      }
    });
    if (isSelect) {
      selected.push(polygon);
      opt = activeOpt;
    } else {
      opt = normalOpt;
    }
    polygon.setOptions(opt);
  });
  return selected;
}

/**
 * 根据名称匹配选择状态
 * @param names
 * @param polygons
 * @param activeOpt
 * @param normalOpt
 */
function updatePolygonSelectByName(names, polygons, activeOpt, normalOpt) {
  let selected = [], opt;
  forEach(polygons, (polygon) => {
    let { name } = polygon.getExtData();
    if (indexOf(names, name) != -1) {
      selected.push(polygon);
      opt = activeOpt;
    } else {
      opt = normalOpt;
    }
    polygon.setOptions(opt);
  });
  return selected;
}

/**
 * 根据id匹配选择状态
 * @param pId
 * @param polygons
 * @param activeOpt // 激活状态
 * @param normalOpt // 未激活
 */
function setSelectedPolygonColor(pId, polygons, activeOpt, normalOpt) {
  let selected = [], opt;
  forEach(polygons, (polygon) => {
    let { id, parent_id } = polygon.getExtData();
    if (pId == id || parent_id == pId) {
      selected.push(polygon);
      opt = activeOpt;
    } else {
      opt = normalOpt;
    }
    polygon.setOptions(opt);
  });
  return selected;
}

/**
 * 设置地图polygon根据数值大小的渐变色
 * @param data
 * @param polygons
 * @param colors
 * @param key
 * @param fixedNum
 * @param strokeColor
 */
function setPolygonColors(data, polygons, colors, key = "value", fixedNum = 2, strokeColor) {
  let maxVal = 0, minVal = Infinity;
  forEach(data, (item) => {
    let val = parseFloat(item[key]);
    if (maxVal < val) {
      maxVal = val;
    }
    if (minVal > val) {
      minVal = val;
    }
  });

  let color_func = interpolateRgbBasis(colors);

  forEach(polygons, (polygon) => {
    let extData = polygon.getExtData() || {};
    let ratio = 0;
    if (maxVal - minVal) {
      ratio = ((extData[key] - minVal) / (maxVal - minVal)).toFixed(fixedNum) || 0;
    }
    let fillColor;
    if (!isNon(ratio)) {
      fillColor = color_func(ratio);
    } else {
      fillColor = colors[0];
    }
    polygon.setOptions({
      strokeColor: strokeColor || fillColor,
      fillColor: fillColor,
      fillOpacity: 0.8
    });
  });
}

/**
 * 设置地图polygon根据数值大小的渐变色,
 * @param data:{id, name}
 * @param polygons
 * @param colors
 * @param strokeColor
 * @param mapKey
 * @param key
 * @param fixedNum
 */
function setPolygonColors2(data, polygons, colors, strokeColor, mapKey = "id", key = "value", fixedNum = 2) {
  let maxVal = 0, minVal = Infinity;
  forEach(data, (item) => {
    let val = parseFloat(get(item, key));
    if (maxVal < val) {
      maxVal = val;
    }
    if (minVal > val) {
      minVal = val;
    }
  });

  let color_func = interpolateRgbBasis(colors);

  forEach(polygons, (polygon) => {
    let extData = polygon.getExtData() || {};
    let fval = find(data, item => item[mapKey] == extData[mapKey]) || {};
    let ratio = 0;
    if (maxVal - minVal) {
      ratio = ((get(fval, key) - minVal) / (maxVal - minVal)).toFixed(fixedNum) || 0;
    }
    let fillColor;
    if (!isNon(ratio)) {
      fillColor = color_func(ratio);
    } else {
      fillColor = "transparent";
    }
    //设置value到polygon
    extData.value = get(fval, key);
    polygon.setOptions({
      strokeColor: strokeColor || fillColor,
      fillColor: fillColor,
      fillOpacity: 0.8,
      extData
    });
  });
}

function setPolygonColorsByType(types, dataMap, polygons, colors, strokeColor, key = "value") {
  forEach(polygons, polygon => {
    let extData = polygon.getExtData() || {};
    let val = get(dataMap[extData.id], key);
    let fid = indexOf(types, val);
    if (fid !== -1) {
      polygon.setOptions({
        strokeColor: strokeColor || colors[fid],
        fillColor: colors[fid],
        fillOpacity: 0.8,
        extData
      });
    } else {
      polygon.setOptions({
        strokeColor: strokeColor,
        fillColor: "transparent",
        fillOpacity: 0.8,
        extData
      });
    }
  });
}

/**
 * 构造地图提示组件
 */
class HelpToolTip {
  constructor(map, opt) {
    opt = opt || {};
    opt.offset = opt.offset || new window.AMap.Pixel(0, -10);
    opt.zIndex = opt.zIndex || 250;
    opt.className = opt.className || "tooltip tooltip-static-trans hidden";
    this.opt = opt;

    this.helpTooltipElement = null;
    this.helpTooltip = null;
    this.map = map;
    if (opt.map_mouseout) {
      map && map.on("mouseout", (e) => opt.map_mouseout && opt.map_mouseout(e));
    } else {
      map && map.on("mouseout", (e) => this.hide());
    }
    this.init(opt);
  }

  init(opt) {
    if (!this.helpTooltipElement) {
      this.helpTooltipElement = document.createElement("div");
      this.helpTooltipElement.className = opt.className;
    }
    this.helpTooltipElement.innerHTML = "";

    if (!this.helpTooltip) {
      this.helpTooltip = new window.AMap.Marker({
        content: this.helpTooltipElement,
        offset: opt.offset,
        zIndex: opt.zIndex,
        bubble: true,
        clickable: false
      });
    }
    this.map && this.map.add(this.helpTooltip);
  }

  update(lnglat, content) {
    this.helpTooltip && this.helpTooltip.setPosition(lnglat);
    this.helpTooltipElement && this.helpTooltipElement.classList.remove("hidden");
    this.helpTooltipElement.innerHTML = content;
    let height = this.helpTooltipElement.clientHeight + 10;
    this.helpTooltip.setOffset(new window.AMap.Pixel(this.opt.offset.getX(), this.opt.offset.getY() - height));
  }

  hide() {
    this.helpTooltipElement.classList.add("hidden");
  }
}

/**
 * 判断polygon是否包含关系
 * @param p1
 * @param p2
 * @returns {number} -1: p2包含p1, 0:无互相包含关系, 1: p1包含p2
 */
function checkContain(p1, p2) {
  let paths = p1.getPath();
  let status = -1;
  forEach(paths, (point) => {
    if (!p2.contains(point)) {
      status = 0;
      return false;
    }
  });
  if (status) return status;
  paths = p2.getPath();
  status = 1;
  forEach(paths, (point) => {
    if (!p1.contains(point)) {
      status = 0;
      return false;
    }
  });
  return status;
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
        let pos = coordtransform.gcj02towgs84(path.lng, path.lat);
        coordinates.push([pos[0], pos[1]]);
      });
      break;
    case "bd":
      forEach(paths, (path) => {
        let pos = coordtransform.gcj02tobd09(path.lng, path.lat);
        coordinates.push([pos[0], pos[1]]);
      });
      break;
    case "gcj":
      forEach(paths, (path) => {
        coordinates.push([path[0], path[1]]);
      });
      break;
  }
  return coordinates;
}

function getTransCoords2(paths, coordsys = "wgs") {
  let coordinates = [];
  switch (coordsys) {
    case "wgs":
      forEach(paths, (path) => {
        let pos = coordtransform.gcj02towgs84(path[0], path[1]);
        coordinates.push([pos[0], pos[1]]);
      });
      break;
    case "bd":
      forEach(paths, (path) => {
        let pos = coordtransform.gcj02tobd09(path[0], path[1]);
        coordinates.push([pos[0], pos[1]]);
      });
      break;
    case "gcj":
      forEach(paths, (path) => {
        coordinates.push([path[0], path[1]]);
      });
      break;
  }
  return coordinates;
}

/**
 *
 * @param paths
 * @param coordsys
 * @returns {Array}
 */
function getTransCoordsWrap(paths, coordsys = "wgs") {
  let coordinates = [];
  if (!size(paths)) return;
  if (paths && paths[0] instanceof Array) {
    forEach(paths, path => {
      let tpaths = getTransCoords(path, coordsys);
      tpaths.push(tpaths[0]);
      coordinates.push(tpaths);
    });
  } else {
    let tpaths = getTransCoords(paths, coordsys);
    tpaths.push(tpaths[0]);
    coordinates = [tpaths];
  }
  return coordinates;
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
    let paths = polygons[id].getPath();
    paths.push(paths[0]); //首位闭合
    let coords = getTransCoords(paths);
    let cp = [];
    cp.push(coords);
    forEach(arr, v => {
      paths = polygons[v].getPath();
      paths.push(paths[0]); //首位闭合
      coords = getTransCoords(paths);
      cp.push(coords);
    });
    cps.push(cp);
  });
  passedArr = uniq(passedArr);
  pullAt(polygons, passedArr);
  forEach(polygons, t => {
    let paths = t.getPath();
    paths.push(paths[0]); //首位闭合
    let coords = getTransCoords(paths);
    let cp = [];
    cp.push(coords);
    cps.push(cp);
  });
  return cps;
}

/**
 *
 * @param coords
 * @returns {{crs: {type: string, properties: {name: string}}, type: string, coordinates: *}}
 */
function wrapMultiPolygon(coords, isMulti = true) {
  return {
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:4326"
      }
    },
    "type": isMulti ? "MultiPolygon" : "Polygon",
    "coordinates": coords
  };
}

/**
 *
 * @param coords
 * @returns {{crs: {type: string, properties: {name: string}}, type: string, coordinates: *}}
 */
function wrapMultiPolyline(coords, isMulti = true) {
  return {
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:4326"
      }
    },
    "type": isMulti ? "MultiLineString" : "LineString",
    "coordinates": coords
  };
}

function geoJsonToEwkb(geojson) {
  let geometry = wkx.Geometry.parseGeoJSON(geojson);
  return geometry.toEwkb().toString("hex");
}

/**
 * addPolygon addPolyline 之后调用
 * @param polygon
 * @param val
 * @param normalOpt
 * @param robj
 * @param config
 */
function setOnePolygonByVal(polygon, val, normalOpt, robj, config) {
  let { color: oriColor } = robj || {};
  let color = oriColor;
  if (!polygon) return;
  let extData = polygon.getExtData() || {}, idx = -1;
  extData.oldColor = undefined;
  extData.oldStrockColor = undefined;
  extData.oldFillOpacity = undefined;
  extData.oldStrokeWeight = undefined;
  extData.oldStrokeStyle = undefined;
  extData.oldStrokeDasharray = undefined;
  let __other_idx__ = config ? indexOf(config.domain, "__other__") : -1;
  let noVal = false;
  if (config && config.visualize_type == 1) { // 数值可视化
    forEach(config.domain, (t, dix) => {
      if (dix == 0 && t === Number(val)) {
        idx = dix;
        return false;
      }
      if (val <= t) {
        idx = dix - 1;
        return false;
      }
    });
    // if (idx == -1) idx = 0;
    if (!config.range[idx]) {
      noVal = true;
    }
    color = config.range[idx] || "transparent";
  } else if (config && config.visualize_type == 2) { // 分类可视化
    forEach(config.domain, (t, dix) => {
      if (val === t) {
        idx = dix;
        return false;
      }
    });
    color = idx !== -1 ? config.range[idx] : config.range[__other_idx__];
  } else if (config && config.visualize_type == 6) { // 地理流向图
    if (config.lWType == 0) { // 线宽类型为0固定粗细 1按字段分类
      normalOpt.strokeWeight = config.line_width; // 线宽度 0固定 1根据数值字段
    } else if (config.lWType == 1) { // 线宽类型  数值分段
      // console.log(extData, 'extData')
      const field = get(extData, config.current_weight_visual);// 对应字段值
      // console.log(field, 'field')
      const weight_range = config.weight_range;
      const weight_visual_range = config.weight_visual_range;
      // if (weight_range === undefined || weight_visual_range === undefined) {
      //     return
      // }
      // console.log(weight_range, 'weight_range')
      // console.log(weight_visual_range, 'weight_visual_range')
      const weight = (weight_range[1] - weight_range[0]) / (weight_visual_range[1] - weight_visual_range[0]) * (field - weight_visual_range[0]) + weight_range[0];
      // console.log(weight, 'weight')
      if (isNaN(weight)) {
        return "no";
      }
      normalOpt.strokeWeight = weight;
    }
    if (config.colorType == 1) { // 颜色 可视化
      if (config.color_field_num == 1) { // 数值字段
        val = get(extData, config.current_color_visual);
        if (val === undefined) {
          return "no";
        }
        forEach(config.breaksForColor, (t, dix) => {
          if (dix == 0 && t === Number(val)) {
            idx = dix;
            return false;
          }
          if (val <= t) {
            idx = dix - 1;
            return false;
          }
        });
        // if (idx == -1) idx = 0;
        if (!config.rangeForColor[idx]) {
          noVal = true;
        }
        color = config.rangeForColor[idx] || "transparent";
        if (color.indexOf("rgba") == -1) {
          normalOpt.strokeOpacity = config.opacity; // 透明度 全部统一的
        }
      } else if (config.color_field_num == 2) { // 字符字段
        val = get(extData, config.current_color_visual);
        if (val === undefined) {
          return "no";
        }
        const __other_idx__color = config ? indexOf(config.breaksForColor, "__other__") : -1;
        forEach(config.breaksForColor, (t, dix) => {
          if (val === t) {
            idx = dix;
            return false;
          }
        });
        color = idx !== -1 ? config.rangeForColor[idx] : config.rangeForColor[__other_idx__color];
        if (!color || color.indexOf("rgba") == -1) {
          normalOpt.strokeOpacity = config.opacity; // 透明度 全部统一的
        }
      }
    }
  }
  if (robj && typeof(robj.strokeWeight) == "string") {
    robj.strokeWeight = robj.strokeWeight.split("px")[0];
    robj.strokeWeight = parseFloat(robj.strokeWeight);
  }
  polygon.setOptions({
    ...normalOpt,
    ...robj,
    strokeColor: !noVal ? color : oriColor,
    fillColor: color,
    extData
  });
}

function coordtransAll(data) {
  let poi = [];
  forEach(data, item => {
    let [lng_84, lat_84, lng_gcj, lat_gcj, lng_bd, lat_bd] = item;
    if (lng_84 || lat_84) {
      poi = coordtransform.wgs84togcj02(lng_84, lat_84);
      item[2] = poi[0] || undefined;
      item[3] = poi[1] || undefined;
      poi = coordtransform.gcj02tobd09(poi[0], poi[1]);
      item[4] = poi[0] || undefined;
      item[5] = poi[1] || undefined;
    } else if (lng_gcj || lat_gcj) {
      poi = coordtransform.gcj02towgs84(lng_gcj, lat_gcj);
      item[0] = poi[0] || undefined;
      item[1] = poi[1] || undefined;
      poi = coordtransform.gcj02tobd09(lng_gcj, lat_gcj);
      item[4] = poi[0] || undefined;
      item[5] = poi[1] || undefined;
    } else if (lng_bd || lat_bd) {
      poi = coordtransform.bd09togcj02(lng_bd, lat_bd);
      item[2] = poi[0] || undefined;
      item[3] = poi[1] || undefined;
      poi = coordtransform.gcj02towgs84(poi[0], poi[1]);
      item[0] = poi[0] || undefined;
      item[1] = poi[1] || undefined;
    }
  });
  return data;
}

/**
 *
 * @param robj {color, icon: {icon:"",content:""}}
 * @returns object
 */
function getVisualMapOption(robj) {
  return {
    blendMode: "source-over",
    fitView: true,
    lnglat: "lnglat",
    style: {
      className: `icomoon ${robj.icon.icon}`,
      color: robj.color,
      content: decodeUnicode(robj.icon.content),
      fontFamily: "icomoon",
      radius: [6, 16],
      size: 14
    },
    type: "iconfont"
  };
}

/**
 *
 * @param mapView
 * @param dataSet
 * @param config 可视化配置，字段数值可视化
 *      {
            visualize_type, //数值可视化
            cLen: cLen,
            breakType: breakType,
            deps: poiVisualCol,
            domain,
            range: range
        }
 * @param option 通用配置  getVisualMapOption
 * @returns {Loca.VisualMap}
 */
function createVisualMap(mapView, dataSet, config, option,size_visual) {
  try {
    if (!mapView || !dataSet) return;
    let Loca = this.Loca = window.Loca;
    Loca.VisualMap.prototype.getData = function () {
      return getData.bind(this)();
    }
    Loca.VisualMap.prototype.render = function () {
      return render.bind(this)();
    }
    Loca.VisualMap.prototype.getMarkerStyleById = function (id) {
      return getMarkerStyleById.bind(this)(id);
    }
    let massMarks = new Loca.VisualMap(mapView, {zIndex: 2000});
    if(size(size_visual))massMarks._size_visual = size_visual
    massMarks._visualconf = config;
    massMarks.setOption(option);
    massMarks.setData(dataSet);
    massMarks.render();
    return massMarks;
  } catch (err) {
    console.error('create massmarks err: ', err);
  }
}

/**
 * 生成热力图
 * @param mapView
 * @param dataSet
 * @param conf
 * @returns {*}
 */
function createHeatMap(mapView, dataSet, conf = {}, column) {
  let map = mapView;

  let modules = conf.module || {};
  let countColumn = column || "";
  let gradient = {};
  let heatmapRadius = 20;
  let subType = conf.subType || "normal";
  let dataMode = "count";
  //处理模块配置
  for (let key in modules) {
    if (modules.hasOwnProperty(key)) {
      let module = modules[key];
      let { type, column, value } = module;
      if (type == "color") {
        //含分类信息的需要将数据按照分类展开
        if (subType === "normal") {
          // countColumn = column;
          dataMode = "sum";
        }
        value = value || [];
        let num = value.length;
        if (num > 1) {
          let i = 0;
          while (i < num) {
            gradient[value[i].k] = value[i].v || Style["color"];
            i++;
          }
        }
      }
      else if (type == "radius") {
        heatmapRadius = value || 20;
      } else if (type == "dataMode") {
        if (subType !== "normal") {
          // countColumn = column;
          dataMode = value || dataMode;
        }
      }
    }
  }

  let finalData = [];

  for (let i = 0; i < dataSet.length; i++) {
    let curData = dataSet[i];
    if (curData.lnglat) {
      let finalLnglat = curData.lnglat.split(",");
      // this.lngLats.push(finalLnglat);
      let val = parseFloat(get(curData, countColumn));
      if (countColumn === "extra.__by_count__") {
        val = 100;
      }
      if (!val) continue;
      finalData.push({
        lng: finalLnglat[0] || "",
        lat: finalLnglat[1] || "",
        count: isNon(val) ? 0 : val
      });
    }

  }

  if (subType === "normal") {
    return getHeatMap(window.AMap.Heatmap);
  } else {
    return window.AMapVPlugins && getHeatMap(AMapVPlugins.AMapHeatMap);
  }

  function getHeatMap(createObj) {
    try {
      let shape;
      if (subType === "heatMap_4") {
        shape = "grid";
      } else if (subType === "heatMap_6") {
        shape = "hex";
      } else {
        shape = "normal";
      }
      //初始化heatmap对象
      let heatMapConfig = {
        shape: shape,
        radius: heatmapRadius, //给定半径
        opacity: [0, 0.8],
        gap: 1,
        zIndex: 150
      };
      if (!isEmpty(gradient)) {
        heatMapConfig.gradient = gradient;
      }
      let heatmap = new createObj(map, heatMapConfig);
      let heatMapDataConfig = {
        data: finalData,
        mode: dataMode
      };
      heatMapDataConfig.max = max(finalData.map(item => item.count));
      heatmap.setDataSet(heatMapDataConfig);
      return heatmap;
    } catch (err) {
      console.error("create heatmap err: ", err);
    }
  }

}

function setBounds(map, lngLatList = []) {
  try {
    if (!map || (lngLatList && !lngLatList.length)) {
      return;
    }
    let { minLng, minLat, maxLng, maxLat } = getBounds(lngLatList);
    let AMap = window.AMap;
    let sw = new AMap.LngLat(minLng, minLat);
    let ne = new AMap.LngLat(maxLng, maxLat);
    map.setBounds(new AMap.Bounds(sw, ne));
  } catch (err) {
    console.error("setBounds err: ", err);
  }
}

function getBounds(lngLatList = []) {
  let minLng, minLat, maxLng, maxLat;

  minLng = minLat = Infinity;
  maxLng = maxLat = 0;

  for (let i = 0; i < lngLatList.length; i++) {
    let lnglat = lngLatList[i];
    let lng = parseFloat(lnglat[0]);
    let lat = parseFloat(lnglat[1]);

    if (lat) {

      if (lat > maxLat) {
        maxLat = lat;
      }

      if (lat < minLat) {
        minLat = lat;
      }
    }

    if (lng) {

      if (lng > maxLng) {
        maxLng = lng;
      }

      if (lng < minLng) {
        minLng = lng;
      }
    }
  }

  minLng = minLng == Infinity ? null : minLng;
  minLat = minLat == Infinity ? null : minLat;

  return {
    minLng, minLat, maxLng, maxLat
  };
}

function wrapGeoJson(geometry) {
  return {
    ...geometry,
    "crs": {
      "type": "name",
      "properties": {
        "name": "EPSG:4326"
      }
    }
  };
}

function geoJsonToEwkbWrap(geometry) {
  return geoJsonToEwkb(wrapGeoJson(geometry));
}

function getPolygonCenter(points) {
  let maxlng = -Infinity;
  let maxlat = -Infinity;
  let minlng = Infinity;
  let minlat = Infinity;
  forEach(points, p => {
    if (p[0] > maxlng) {
      maxlng = p[0];
    }
    if (p[0] < minlng) {
      minlng = p[0];
    }
    if (p[1] > maxlat) {
      maxlat = p[1];
    }
    if (p[1] < minlat) {
      minlat = p[1];
    }
  });
  return [(maxlng + minlng) / 2, (maxlat + minlat) / 2];
}

export default {
  wgs84togcj02,
  gcj02towgs84,
  bd09togcj02,
  gcj02tobd09,
  addPolygon,
  addPolygonList,
  addPolyline,
  addPolylineList,
  addGridPolygonByAvg,
  addGridPolygonByBreaks,
  setPolygonColors,
  setPolygonColors2,
  setPolygonColorsByType,
  setSelectedPolygonColor,
  updatePolygonSelectByName,
  updatePolygonSelectByKey,
  HelpToolTip,
  checkContain,
  getTransCoords,
  getTransCoords2,
  getTransCoordsWrap,
  checkAllContains,
  wrapMultiPolygon,
  wrapMultiPolyline,
  geoJsonToEwkb,
  setOnePolygonByVal,
  coordtransAll,
  getVisualMapOption,
  createVisualMap,
  createHeatMap,
  getBounds,
  setBounds,
  wrapGeoJson,
  geoJsonToEwkbWrap,
  getPolygonCenter
};
