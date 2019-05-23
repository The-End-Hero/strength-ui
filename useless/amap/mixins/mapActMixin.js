import forEach from "lodash/forEach";
import get from "lodash/get";
import size from "lodash/size";
import map from "lodash/map";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import {
  lastLeftWidth,
  marker_id_feedback,
  self_select,
  dis_select,
  normalOpt,
  normalColor,
  lightColor
} from "../../../constants/constants";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import amapUtil from "../../../utils/amapUtil";
import coordtransform from "coordtransform";

import LZString from "lz-string";

const mapStateTypeCookieKey = "page_mapStateType_";
const cookieKeyMap = {
  [self_select]: "page_mapStateType_self_select_value",
  [dis_select]: "page_mapStateType_dis_select_value"
};
const uuidv1 = require("uuid/v1");

const MapActMixin = (superclass) => class MapActMixin extends superclass {
  getMapStateKey = () => {
    return this.state.mapState;
  };
  /**
   * 保存图片
   */
  saveAsJpeg = () => {
    // if (this.state.loading) return;
    this.setState({ blocking: true });
    const node = document.getElementById(this.mapId);
    let preWidth = lastLeftWidth;
    // this.setLeftOffset(0);
    domtoimage
      .toBlob(node, { quality: 1 })
      .then(blob => {
        saveAs(blob, `picture_${new Date().getTime()}.jpg`);
        // this.setLeftOffset(preWidth);
        setTimeout(() => {
          this.setState({ blocking: false });
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ blocking: false });
        // this.setLeftOffset(preWidth);
        console.log("错误", "图片保存失败,请稍后再试!", "error");
      });
  };
  startDraw = () => { // 开始绘制
    // this.map = this.getMapInstance();
    // this.clearOverlays();
    this.intMapTools();
    let mapStateKey = this.getMapStateKey();
    this.mapStateKey = mapStateKey;
    this.addDrawTool();
  };
  intMapTools = () => {
    // 初始化鼠标绘制工具
    this.initMouseTool();
    // 初始化地图提示工具
    this.initHelpToolTip();
    //初始化右键菜单
    this.initContextMenu();
  };
  // 初始化鼠标绘制工具
  initMouseTool = () => {
    if (this.mouseTool) return;
    let mouseTool = new window.AMap.MouseTool(this.map);
    this.mouseTool = mouseTool;
  };

  // 初始化地图提示工具
  initHelpToolTip = () => {
    if (this.helpToolTip) return;
    // 追加提示
    this.helpToolTip = new amapUtil.HelpToolTip(this.map);
  };
  //初始化右键菜单
  initContextMenu = () => {
    if (this.contextMenu) return;
    this.contextMenu = new window.AMap.ContextMenu();  //创建右键菜单
    //右键
    this.contextMenu.addItem("删除", (...args) => {
      let { uid } = this.rightClickFence.getExtData();
      this.removeAllMeasureMarkers(uid);
      if (this.delayTimeId) {
        clearTimeout(this.delayTimeId[uid]);
        this.delayTimeId[uid] = undefined;
      }
      if (this.drawpolygon && this.drawpolygon[uid]) {
        this.map.remove(this.drawpolygon[uid]);
        delete this.drawpolygon[uid];
      }
      if (this.lineDistance && this.lineDistance[uid]) {
        this.map.remove(this.lineDistance[uid]);
        delete this.lineDistance[uid];
      }
      this.rightClickFence = null;
      this.setGeoFilter({ type: this.mapStateKey, filters: this.getFilters() });
      this.resetDraw();
    }, 0);
  };
  // 重新绘制
  resetDraw = () => {
    this.clearOverlays();
    this.intMapTools();
    let mapStateKey = Number(this.getMapStateKey());
    this.mapStateKey = mapStateKey;
    this.addDrawTool();
    this.drawpolygon = null;
    if (mapStateKey === self_select) {
      this.endPolygon = null;
    } else if (mapStateKey === dis_select) {
      this.endCircle = null;
      this.endCircleDis = null;
    }
    // setTimeout(() => {
    //   if (this.isUnmount) return;
    //   this.changeMapToolState(false);
    // })
  };
  onClearDraw = () => {
    this.clearOverlays();
  };
  // 绘制多边形入口
  addDrawTool = () => {
    let mapStateKey = Number(this.getMapStateKey());
    this.map.off("click", this.addDrawTool, this);
    if (mapStateKey === self_select || mapStateKey === dis_select) {
      const { map_style } = this.state;
      if (map_style === "normal") {
        normalOpt.strokeColor = lightColor.active;
        normalOpt.fillColor = lightColor.active;
      } else {
        normalOpt.strokeColor = normalColor.active;
        normalOpt.fillColor = normalColor.active;
      }
      let opt = normalOpt;
      this.newPolyUUID(); //面
      if (mapStateKey === self_select) {// 多边形
        this.mouseTool.polygon(opt);
      } else if (mapStateKey === dis_select) {// 圆
        this.mouseTool.circle(opt);
      }
      // 创建绘制提示
      this.createDrawHelpTooltip(mapStateKey);
      // 创建线段距离
      this.createLineDistanceTooltip();
      this.map.add([this.lineDistance[this.CreatingPolyUUID]]);
      // 注册绘制事件
      this.onDrawAct();
    }
  };

// 创建绘制提示
  createDrawHelpTooltip = (mapStateKey, prev = false) => {
    let { helpDrawTooltipElement, helpDrawTooltip } = this;
    if (!helpDrawTooltipElement) {
      helpDrawTooltipElement = document.createElement("div");
      helpDrawTooltipElement.className = "tooltip hidden";
      this.helpDrawTooltipElement = helpDrawTooltipElement;
    }

    let helpMsg = "";
    if (mapStateKey === self_select) {
      helpMsg = "单击开始绘制</br>双击或右键结束绘制";
      this.map.setDefaultCursor("crosshair");
    } else if (mapStateKey === dis_select) {
      helpMsg = "拖动绘制相应的圆形";
      this.map.setDefaultCursor("move");
    }
    helpDrawTooltipElement.innerHTML = helpMsg;

    if (!helpDrawTooltip) {
      helpDrawTooltip = new window.AMap.Marker({
        content: helpDrawTooltipElement,
        offset: new window.AMap.Pixel(15, 0),
        map: this.map
      });
      this.helpDrawTooltip = helpDrawTooltip;
    }
  };
// 创建线段距离
  createLineDistanceTooltip = () => {
    this.lineDistance = this.lineDistance || {};
    let lineDistance = this.lineDistance[this.CreatingPolyUUID];
    if (!lineDistance) {
      let color = "#4D87AE";
      lineDistance = new window.AMap.Polyline({
        strokeWeight: 2,
        strokeColor: color
      });
      this.lineDistance[this.CreatingPolyUUID] = lineDistance;
    }
  };
  newPolyUUID = () => {
    this.CreatingPolyUUID = `poly_${uuidv1()}`; //当前面数据的uuid
  };
// 注册绘制事件
  onDrawAct = () => {
    this.mouseTool.on("draw", this.completeOverlay, this);
    this.map.on("mousemove", this.mousemoveAct, this);
    this.map.on("mouseout", this.hideHelpTooltipElement, this);
    this.map.on("mousedown", this.addPointToLine, this);
    this.map.on("click", this.addPointToLine2, this);
    this.map.on("rightclick", this.addPointToLine3, this);
    this.map.on("dblclick", this.addPointToLine4, this);
  };
  // 追加覆盖物到地图上
  addDrawShapeToMap = async (shape, area, center, fitView, mapStateKey) => {
    this.drawpolygon = this.drawpolygon || {};
    this.drawpolygon[this.CreatingPolyUUID] = shape;
    await this.setGeoFilter({ type: this.mapStateKey, filters: this.getFilters() });
    this.area = area / 1000000;
    let opt = shape.getOptions();
    opt.bubble = true;
    shape.setOptions(opt);
    this.map.add([shape]); // amap
    fitView && this.map.setFitView([shape]);
    // 添加绘制面积提示
    this.createMeasureTooltip();
    this.addMeasureTooltip(area, center);
    // 追加事件
    this.addShapeAct(shape, area, center, mapStateKey);
    this.saveSelectedToCookie(mapStateKey);
    this.setState({ hasCustomDraw: true });
  };
  addShapeAct = (shape, area, center, mapStateKey) => {
    if (shape) {
      let line = this.getLineDistancePoints();
      shape.setExtData({ line: line, uid: this.CreatingPolyUUID });// 设置保存绘制路径
      shape.on("mouseover", () => {
        let { uid } = shape.getExtData();
        // console.log(uid,'uid') // 当前mouseover  uid
        this.delayTimeId = this.delayTimeId || {};
        clearTimeout(this.delayTimeId[uid]);
        let { measureTooltip, map } = this;
        measureTooltip && map.remove(measureTooltip);
        this.addMeasureTooltip(area, center, uid);
        if (!this.delayTimeId[uid]) {
          this.addLineDistanceTip(this.lineDistance && this.lineDistance[uid], mapStateKey, uid);
        }
      });
      shape.on("mouseout", () => this.delayRemoveMeasureMarkers(shape));
      shape.on("rightclick", this.onShapeRightClick);
      this.delayRemoveMeasureMarkers(shape);
    }
  };

  removeAllMeasureMarkers = (uid) => {
    this.removeMeasureMarkers(uid);
    let { measureTooltip, map } = this;
    measureTooltip && map && map.remove(measureTooltip);
  };

  onShapeRightClick = (e) => {
    // console.log('onShapeRightClick???')
    this.rightClickFence = e.target;
    this.contextMenu.open(this.map, e.lnglat);
  };

  delayRemoveMeasureMarkers = (shape) => {
    // console.log('onShapeRightClick???22')
    let { uid } = shape.getExtData();
    this.delayTimeId = this.delayTimeId || {};
    clearTimeout(this.delayTimeId[uid]);
    this.delayTimeId[uid] = setTimeout(() => {
      if (this.isUnmount) return;
      this.removeAllMeasureMarkers(uid);
      this.delayTimeId[uid] = undefined;
    }, 2000);
  };

  saveSelectedToCookie = (mapStateKey) => {
    if (this.props.useCookie) {
      let line = this.getLineDistancePoints(), value;
      if (mapStateKey === self_select) {
        let points = map(this.endPolygon, (c) => {
          // return [c.lng, c.lat];
          return coordtransform.gcj02towgs84(c.lng, c.lat);
        });
        if (size(points)) {
          // value = {points, line};
          value = { points };
        }
      } else if (mapStateKey === dis_select) {
        if (this.endCircle) {
          // let point = [this.endCircle.lng, this.endCircle.lat];
          let point = coordtransform.gcj02towgs84(this.endCircle.lng, this.endCircle.lat);
          value = { point, distance: this.endCircleDis, line };
        }
      }
      if (value) {
        localStorage.setItem(mapStateTypeCookieKey, mapStateKey);
        value = LZString.compress(JSON.stringify(value));
        localStorage.setItem(cookieKeyMap[mapStateKey], value);
      }
    }
  };

  // 创建面积提示
  createMeasureTooltip = () => {
    let { measureTooltipElement, measureTooltip, deleteDraw } = this;
    if (!measureTooltipElement) {
      measureTooltipElement = document.createElement("div");
      this.measureTooltipElement = measureTooltipElement;
    }
    measureTooltipElement.className = "tooltip tooltip-measure";

    if (!measureTooltip) {
      measureTooltip = new window.AMap.Marker({
        map: this.map,
        content: measureTooltipElement,
        offset: new window.AMap.Pixel(-46, -20)//new AMap.Pixel(0, -20),
      });
      this.measureTooltip = measureTooltip;
      // console.log(this.measureTooltip,'this.measureTooltip')
      this.measureTooltip.on("click", (e) => {
      });
    }
  };

  // 面积提示 close按钮单个删除逻辑
  addMeasureTooltip=(area, position, uid)=> {
    let { measureTooltip, measureTooltipElement: mte } = this;
    mte.innerHTML = "";
    mte.appendChild(this.formatArea(area, uid));
    mte.className = "tooltip tooltip-static new_map";
    this.map.add([measureTooltip]);
    measureTooltip.setPosition(position);
  };

  formatArea = (area, uid) => {
    let output = document.createElement("div");
    let close = document.createElement("i");
    close.className = "delete_custom_fence material-icons";
    close.innerText = "delete_forever";
    close.onclick = () => {
      this.hideCustomFence(uid);
    };
    close.onmouseenter = this.enterClose;
    close.onmouseleave = this.leaveClose;
    if (area <= 10000) {
      output.innerHTML = `${Math.round(area * 100) / 100} m<sup>2</sup>`;
    } else {
      output.innerHTML = `${Math.round(area / 1000000 * 100) / 100} km<sup>2</sup>`;
    }
    output.appendChild(close);
    return output;
  };
  setGeoFilter = async () => {
    let geo_filter = this.getGeoFilter();
    let { cards } = this.state;
    cards = this.checkCards(cards);
    cards[0].geo_filters = geo_filter;
    await this.setState({ cards });
  };
  getLineDistancePoints = () => {
    let points = this.lineDistance ? map(this.lineDistance[this.CreatingPolyUUID].getPath(), ({ lng, lat }) => {
      return [lng, lat];
    }) : [];
    return points;
  };
  // 绘制完成
  completeOverlay = ({ obj }) => {
    this.offDrawAct();
    if (obj.CLASS_NAME === "AMap.Polygon") {
      this.addDrawPolygonToMap(obj);
    } else if (obj.CLASS_NAME === "AMap.Circle") {
      this.addDrawCircleToMap(obj);
    }
    this.changeMapToolState();
  };
  addDrawPolygonToMap = (polygon, fitView) => {
    this.endPolygon = null;
    // this.drawpolygon = null;
    if (polygon) {
      polygon.getMap && !polygon.getMap() && polygon.setMap(this.map);
      let area = polygon.getArea();
      if (area < 100) {// 面积过小,直接移除
        this.map.remove(polygon);
        // this.resetDraw();
        setTimeout(() => {
          if (this.isUnmount) return;
          this.changeMapToolState(false);
          this.startDraw();
        });
        return;
      }
      let path = polygon.getPath(),
        centerLng = 0,
        centerLat = 0,
        pLen = path.length;
      this.endPolygon = path;
      forEach(path, (item) => {
        centerLng += item.lng;
        centerLat += item.lat;
      });
      centerLng = centerLng / pLen;
      centerLat = centerLat / pLen;
      let center = [centerLng, centerLat];
      // 追加绘制图形到地图上
      this.addDrawShapeToMap(polygon, area, center, fitView, self_select);
    }
  };
  addDrawCircleToMap = (circle, fitView) => {
    this.endCircle = null;
    // this.drawpolygon = null;
    if (circle) {
      circle.getMap && !circle.getMap() && circle.setMap(this.map);
      let r = circle.getRadius();
      let area = Math.PI * r * r;
      if (area < 100) {
        this.map.remove(circle);
        // this.resetDraw();
        setTimeout(() => {
          if (this.isUnmount) return;
          this.changeMapToolState(false);
          this.startDraw();
        });
        return;
      }
      let center = circle.getCenter();
      this.endCircle = center;
      this.endCircleDis = r;
      this.addDrawShapeToMap(circle, area, center, fitView, dis_select);
    }
  };
  // 鼠标移动
  mousemoveAct = (e) => {
    this.updateHelpTooltipPosition(e);
    this.updatePointOnLine(e);
  };
  // 修改提示的位置
  updateHelpTooltipPosition = (evt) => {
    this.helpDrawTooltip.setPosition(evt.lnglat);
    this.helpDrawTooltipElement.classList.remove("hidden");
  };
  // 鼠标移动更新线
  updatePointOnLine = (e) => {
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    let { path } = lineDistance[CreatingPolyUUID].getExtData() || {};
    if (size(path)) {
      path = [...path, e.lnglat];
      lineDistance[CreatingPolyUUID].setPath(path);
      this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
    }
  };
  // 隐藏提示
  hideHelpTooltipElement = () => {
    this.helpDrawTooltipElement.classList.add("hidden");
  };
  // 鼠标按下追加线开始点
  addPointToLine = (e) => {
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    if (mapStateKey === dis_select) {
      let { path = [] } = lineDistance[CreatingPolyUUID].getExtData() || {};
      path.push(e.lnglat);
      lineDistance[CreatingPolyUUID].setPath(path);
      lineDistance[CreatingPolyUUID].setExtData({ path: [...path] });
      this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
    }
  };
  // 鼠标点击追加线开始点
  addPointToLine2 = (e) => {
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    if (mapStateKey === self_select) {
      let { path = [] } = lineDistance[CreatingPolyUUID].getExtData() || {};
      path.push(e.lnglat);
      lineDistance[CreatingPolyUUID].setPath(path);
      lineDistance[CreatingPolyUUID].setExtData({ path: [...path] });
      this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
    }
  };
  // 鼠标点击追加线开始点
  addPointToLine3 = (e) => {
    // console.log('onShapeRightClick???44')
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    if (mapStateKey === self_select) {
      let { path = [] } = lineDistance[CreatingPolyUUID].getExtData() || {};
      if (size(path) < 3) {
        this.resetLineDistanceTip(CreatingPolyUUID);
      } else {
        lineDistance[CreatingPolyUUID].setPath(path);
        this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
      }
    }
  };
  // 鼠标双击追加线开始点
  addPointToLine4 = (e) => {
    // let {lineDistance, mapStateKey, CreatingPolyUUID} = this;
    // if (mapStateKey == self_select) {
    //     let {path=[]} = lineDistance[CreatingPolyUUID].getExtData() || {};
    //     if (size(path) < 3) {
    //         this.resetLineDistanceTip(CreatingPolyUUID);
    //     }
    // }
  };
  hideCustomFence = (uid) => { // 隐藏自定义围栏
    this.drawpolygon[uid] && this.map.remove(this.drawpolygon[uid]);
    this.lineDistance && this.lineDistance[uid] && this.map.remove(this.lineDistance[uid]);
    delete this.drawpolygon[uid];
    this.lineDistance && (this.lineDistance[uid] = undefined);
    this.setGeoFilter();
  };
  removeMeasureMarkers = (uid) => {
    // let marks = this.map.getAllOverlays('marker');
    // this.map.remove(filter(marks, m => {
    let marks = this.map && this.map.getAllOverlays("marker");
    this.map && this.map.remove(filter(marks, m => {
      let ext = m.getExtData();
      return ext.isLineMarkers && ext.uid == uid;
    }));
  };
// 计算点位
  addLineDistanceTip = (lineDistance, mapStateKey, uid) => {
    uid = uid || this.CreatingPolyUUID;
    if (lineDistance) {
      let path = lineDistance.getPath();
      this.removeMeasureMarkers(uid);
      let isPolygon = mapStateKey === self_select;
      let oLen = size(path);
      if (isPolygon && oLen > 2 && path[0] !== path[oLen - 1]) {
        path = [...path, path[0]];
      }
      let len = path.length - 1, marks = [];
      let tmpPolygon = new window.AMap.Polygon({ path });
      for (let i = 0; i < len; i++) {
        let f = path[i], s = path[i + 1];
        let dis = f.distance(s);
        let distance = this.formatDistance(dis);
        if (distance) {
          let [f1, s1] = sortBy([f, s], ["lng"]);
          let pcc;
          let pc = [(f1.lng + s1.lng) / 2, (f1.lat + s1.lat) / 2];
          for (let j = 0; j < 4; j++) {
            let lngX = j >= 2 ? 0 : (j - 0.5) * 2;
            let latX = j >= 2 ? (j - 2.5) * 2 : 0;
            pcc = new window.AMap.LngLat(pc[0] + (dis * 0.000001) * lngX, pc[1] + (dis * 0.000001) * latX);
            if (tmpPolygon.contains(pcc)) {
              break;
            }
          }
          let ag1 = this.calcAngle(f1, s1);
          let ag2 = this.calcAngle(f1, pcc);
          let angle = ag1;
          if (ag1 > ag2 && (ag1 * ag2) >= 0) {
            angle = 180 + ag1;
          }
          let text_trans = 180;
          if (angle < 90 && angle > -90) {
            text_trans = 0;
          }


          let content = `<div class="tooltip tooltip-measure" style="pointer-events: none;">
                                        <span style="transform: rotate(${isPolygon ? text_trans : 0}deg); display: inline-block;">
                                            ${distance}
                                        </span>
                                    </div>`;
          let mark = new window.AMap.Marker({
            angle: (isPolygon || (angle < 90 && angle > -90)) ? angle : 180 + angle,
            position: [(f.lng + s.lng) / 2, (f.lat + s.lat) / 2],
            content,
            offset: new window.AMap.Pixel(-35, -35),
            extData: { isLineMarkers: true, uid },
            bubble: true
          });

          marks.push(mark);
        }
      }
      this.map.add(marks);
    }
  };
  // 计算2点角度
  calcAngle = (start, end) => {
    if (!end) return 0;
    let p_start = this.map.lngLatToContainer(start),
      p_end = this.map.lngLatToContainer(end);
    let diff_x = p_end.x - p_start.x,
      diff_y = p_end.y - p_start.y;
    return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI);
  };
// 格式距离值
  formatDistance = (distance) => {
    if (distance < 100) {
      return "";
    } else if (distance < 1000) {
      return `${distance.toFixed(2)} m`;
    } else {
      return `${(distance / 1000).toFixed(2)} km`;
    }
  };
  // 清除绘制的覆盖物
  clearOverlays = (set = true, clearSearchMaker = true) => {
    this.offDrawAct(); // 解除事件绑定
    this.clearMapMarker(); // 清除点位相关信息
    let { map, drawpolygon, measureTooltip, lineDistance } = this;
    // console.log(drawpolygon,'drawpolygon')
    // console.log(measureTooltip,'measureTooltip')
    // console.log(lineDistance,'lineDistance')
    if (map) {
      forEach(drawpolygon, (p, uid) => { // 清除覆盖物（自绘制的多边形/圆）
        p && map.remove(p);
        delete drawpolygon[uid];
      });
      set && this.setGeoFilter({ type: this.mapStateKey, filters: [] });
      measureTooltip && map.remove(measureTooltip);
      if (lineDistance) { // 清除 线提示
        forEach(this.delayTimeId, (t, uid) => {
          clearTimeout(t);
          this.delayTimeId[uid] = undefined;
        });
        let marks = map.getAllOverlays("marker");
        if (!clearSearchMaker) {
          marks = filter(marks, m => {
            let ext = m.getExtData();
            return !(ext && ext.isSearch);
          });
        }
        map.remove(marks);
        forEach(lineDistance, (p, uid) => {
          p && map.remove(p);
          lineDistance[uid] = undefined;
        });
        this.lineDistance = null;
      }
      this.helpDrawTooltip && map.remove(this.helpDrawTooltip);
      this.helpDrawTooltip = null;
    }
    this.setState({ hasCustomDraw: false });
  };
  // 清除点位相关信息
  clearMapMarker = () => {
    let { poiMarker, map, positionPicker } = this;
    if (map) {
      poiMarker && map.remove(poiMarker);
      this.poiMarker = null;
      positionPicker && positionPicker.stop() && map.remove(positionPicker);
      this.positionPicker = null;
    }
  };
  getFilters = () => {
    let { mapStateKey, drawpolygon } = this;
    let geos = [];
    if (mapStateKey == self_select) {
      forEach(drawpolygon, p => {
        if (p && p.CLASS_NAME === "AMap.Polygon") {
          let path = [];
          forEach(p.getPath(), t => {
            path.push([t.lng, t.lat]);
          });
          geos.push([...path, path[0]]);
        }
      });
    } else if (mapStateKey === dis_select) {
      forEach(drawpolygon, p => {
        if (p && p.CLASS_NAME === "AMap.Circle") {
          let path = p.getCenter();
          let dis = p.getRadius();
          geos.push([path.lng, path.lat, dis]);
        }
      });
    }
    return geos;
  };
  // 解除绑定事件
  offDrawAct = () => {
    let { mouseTool, helpDrawTooltipElement: helpTip } = this;
    // this.map = this.getMapInstance();
    let map = this.map;
    mouseTool && mouseTool.close(true);
    mouseTool && mouseTool.off("draw", this.completeOverlay, this);
    map && map.off("mousemove", this.mousemoveAct, this);
    map && map.off("mouseout", this.hideHelpTooltipElement, this);
    map && map.off("mousedown", this.addPointToLine, this);// 绘制圆
    map && map.off("click", this.addPointToLine2, this);// 绘制polygon
    // map && map.off('click', this.addDrawTool, this);
    map && map.off("mousemove", this.updateHelpTooltipPosition, this);
    map && map.off("rightclick", this.addPointToLine3, this);// 绘制polygon
    map && map.off("dblclick", this.addPointToLine4, this);// 绘制polygon
    map && map.setDefaultCursor("points");
    helpTip && (helpTip.className = "tooltip hidden");
  };
};
export default MapActMixin;
