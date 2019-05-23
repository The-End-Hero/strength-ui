import * as maptalks from "maptalks";
import { bmapStyles } from "../../../utils/mapstyle";
import {
  buffer_select, self_select, dis_select, fence_select, editPolygonCfg,
  geo_types, editLinestringCfg, baseTextMarkerCfg
} from "../../../constants/constants";
import forEach from "lodash/forEach";
import get from "lodash/get";
import size from "lodash/size";
import map from "lodash/map";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import cloneDeep from "lodash/cloneDeep";
import bmapUtil from "../../../utils/bmapUtil";
import amapUtil from "../../../utils/amapUtil";
import coordtrans from "../../../utils/coordtrans";
import LZString from "lz-string";

const { bd09togcj02, bd09towgs84 } = coordtrans;
const uuidv1 = require("uuid/v1");

const mapStateTypeCookieKey = "page_mapStateType_";
const cookieKeyMap = {
  [self_select]: "page_mapStateType_self_select_value",
  [dis_select]: "page_mapStateType_dis_select_value"
};
const DrawTypes = {
  [dis_select]: "Circle",
  [self_select]: "Polygon"
};
const editSymbol = editPolygonCfg;

const map_click_key = "click";// 点击
const map_draw_key = "drawend";
const map_drawstart_key = "drawstart";
const map_mousemove_key = "mousemove";
const map_rightclick_key = "contextmenu";
const map_dblclick_key = "dblclick";
const map_mouseout_key = "mouseout";
const map_mousedown_key = "mousedown";
const map_mouseover_key = "mouseover";
const map_mouseenter_key = "mouseenter";
const map_adjust_key = "editrecord";

// const CoordToArray = maptalks.Coordinate.toNumberArrays;
const PreStyle = superclass => class PreStyle extends superclass {

  getMapStateKey = () => {
    return this.state.mapState;
  };


  // 初始化鼠标绘制工具
  initMouseTool = () => {
    if (this.mouseTool) return;
    this.mouseTool = new maptalks.DrawTool({
      mode: "Point"
    }).addTo(this.map).disable();
  };


  intMapTools = () => {
    // 初始化鼠标绘制工具
    this.initMouseTool();
  };


  // 开始绘制
  startDraw = () => {
    // this.vector_layer;
    this.intMapTools();
    let mapStateKey = this.getMapStateKey();
    this.mapStateKey = mapStateKey;
    this.addDrawTool();
  };


  //重新绘制
  resetDraw = () => {
    this.startedDraw = false;
    this.clearOverlays();
    this.intMapTools();
    let mapStateKey = this.getMapStateKey();
    this.mapStateKey = mapStateKey;
    this.addDrawTool();
    this.drawpolygon = null;
    if (mapStateKey === self_select) {
      this.endPolygon = null;
    } else if (mapStateKey == dis_select) {
      this.endCircle = null;
      this.endCircleDis = null;
    }
    setTimeout(() => {
      this.changeMapToolState(false);
    });
  };

  continueDraw = () => {
    this.intMapTools();
    let mapStateKey = this.getMapStateKey();
    if (mapStateKey !== dis_select && mapStateKey !== self_select) return;
    this.mapStateKey = mapStateKey;
    this.addDrawTool();
    this.addLineDistance();
    this.endCircle = null;
  };


  //新增lineDistance
  addLineDistance = () => {
    this.newPolyUUID(); //面
    // 创建线段距离
    this.createLineDistanceTooltip();
    this.vector_layer.add([this.lineDistance[this.CreatingPolyUUID]]);
  };


  newPolyUUID = () => {
    this.CreatingPolyUUID = `poly_${uuidv1()}`; //当前面数据的uuid
  };


  // 绘制多边形入口
  addDrawTool = () => {
    let mapStateKey = this.getMapStateKey();
    if (mapStateKey == self_select || mapStateKey == dis_select) {
      this.newPolyUUID(); //面
      this.mouseTool.setMode(DrawTypes[mapStateKey]).setSymbol(editSymbol.symbol).enable();
      // 创建绘制提示
      this.createDrawHelpTooltip(mapStateKey);
      // 创建线段距离
      this.createLineDistanceTooltip();
      // 注册绘制事件
      this.onDrawAct();
    }
  };


  getDrawArea = () => {
    return this.area;
  };


  // 修改提示的位置
  updateHelpTooltipPosition = (e) => {
    this.helpDrawTooltip.setCoordinates(e.coordinate);
    this.helpDrawTooltipElement.classList.remove("hidden");
  };


  // 隐藏提示
  hideHelpTooltipElement = () => {
    if (this.helpDrawTooltipElement) this.helpDrawTooltipElement.classList.add("hidden");
  };


  // 创建绘制提示
  createDrawHelpTooltip = (mapStateKey) => {
    let { helpDrawTooltipElement, helpDrawTooltip } = this;
    if (!helpDrawTooltipElement) {
      helpDrawTooltipElement = document.createElement("div");
      helpDrawTooltipElement.className = "tooltip hidden";
      this.helpDrawTooltipElement = helpDrawTooltipElement;
    }

    let helpMsg = "";
    if (mapStateKey === self_select) {
      helpMsg = "单击开始绘制</br>双击结束绘制";
      this.map.setCursor("crosshair");
    } else if (mapStateKey === dis_select) {
      helpMsg = "单击开始绘制</br>单击结束绘制";
      this.map.setCursor("move");
    }
    helpDrawTooltipElement.innerHTML = helpMsg;

    //let { helpDrawTooltip } = this;
    if (!helpDrawTooltip) {
      helpDrawTooltip = new maptalks.ui.UIMarker([0, 0], {
        content: helpDrawTooltipElement,
        dx: 15,
        dy: 0
      }).addTo(this.map);
      this.helpDrawTooltip = helpDrawTooltip;
    }
  };


  // 创建线段距离
  createLineDistanceTooltip = () => {
    this.lineDistance = this.lineDistance || {};
    let lineDistance = this.lineDistance[this.CreatingPolyUUID];
    if (!lineDistance) {
      lineDistance = new maptalks.LineString([], {
        symbol: { ...editLinestringCfg.symbol, lineWidth: 1 },
        zIndex: 9999
      }).addTo(this.vector_layer);
      this.lineDistance[this.CreatingPolyUUID] = lineDistance;
    }
  };


  // 重制线段距离提示
  resetLineDistanceTip = (uid) => {
    this.removeMeasureMarkers(uid);
    this.lineDistance[uid].setProperties(null);
    this.lineDistance[uid].setCoordinates([]);
  };


  // 注册绘制事件
  onDrawAct = () => {
    this.mouseTool.on(map_draw_key, this.completeOverlay);
    this.mouseTool.on(map_drawstart_key, this.startDrawEvt, this);
    this.map.on(map_mousemove_key, this.mousemoveAct, this);
    this.map.on(map_mouseout_key, this.hideHelpTooltipElement, this);
    // this.map.on(map_mousedown_key, this.addPointToLine, this);
    this.map.on(map_click_key, this.addPointToLine, this);
    this.map.on(map_rightclick_key, this.addPointToLine3, this);
    // this.map.on(map_dblclick_key, this.addPointToLine4, this);
  };

  mousemoveAct = (e) => {
    this.updateHelpTooltipPosition(e);
    if (!this.startedDraw) return;
    this.updatePointOnLine(e);
  };


  completeOverlay = ({ geometry }) => {
    this.offDrawAct();
    let mapStateKey = this.getMapStateKey();
    if (mapStateKey === self_select) {
      this.addDrawPolygonToMap(geometry);
    } else if (mapStateKey === dis_select) {
      this.addDrawCircleToMap(geometry);
    }
    this.changeMapToolState();
    this.startedDraw = false;
  };


  addDrawPolygonToMap = (polygon, fitView) => {
    this.endPolygon = null;
    if (polygon) {
      let area = polygon.getArea();
      if (area < 100) {// 面积过小,直接移除
        setTimeout(() => {
          this.changeMapToolState(false);
          this.startDraw();
        });
        return;
      }
      let center = maptalks.Coordinate.toNumberArrays(polygon.getCenter());
      this.endPolygon = maptalks.Coordinate.toNumberArrays(polygon.getCoordinates());
      // 追加绘制图形到地图上
      this.addDrawShapeToMap(polygon, area, center, fitView, self_select);
    }
  };


  addDrawCircleToMap = (circle, fitView) => {
    this.endCircle = null;
    if (circle) {
      let r = circle.getRadius();
      let area = Math.PI * r * r;
      if (area < 100) {// 面积过小,直接移除
        setTimeout(() => {
          this.changeMapToolState(false);
          this.startDraw();
        });
        return;
      }
      let center = maptalks.Coordinate.toNumberArrays(circle.getCenter());
      this.endCircle = center;
      this.endCircleDis = r;
      this.addDrawShapeToMap(circle, area, center, fitView, dis_select);
    }
  };


  getGeoFilter = () => { // 获取geofilter 返回值用来给cards[0].geo_filter赋值
    let geo_filter;
    if (size(this.drawpolygon)) { //用户自定义绘制
      let allDp = map(this.drawpolygon, t => t);
      let clazz = allDp[0].getJSONType();
      if (clazz === "Polygon") {
        let cds = [];
        forEach(this.drawpolygon, polygon => {
          // let paths = maptalks.Coordinate.toNumberArrays(polygon.getCoordinates());
          // paths = cloneDeep(paths);//不用首尾闭合
          let coords = bmapUtil.getTransCoords(polygon.getCoordinates());
          cds.push([coords]);
        });
        let geoJson = amapUtil.wrapMultiPolygon(cds);
        geo_filter = { type: self_select, geoJson };
      } else if (clazz === "Circle") {
        let circles = [];
        forEach(this.drawpolygon, circle => {
          let center = circle.getCenter();
          let dis = circle.getRadius();
          let ps = bd09towgs84(center.x, center.y);
          circles.push([ps.lng, ps.lat, dis]);
        });
        geo_filter = { type: dis_select, circles };
      }
    } else if (size(this.state.active_layer_ids)) { //用户自由围栏选中 active_layer_ids
      let { object_type, source, packageId } = this.state.geo_filter || {};
      geo_filter = {
        type: fence_select,
        object_type,
        source,
        packageId,
        geometry_type: geo_types.polygon,
        filters: map(this.state.active_layer_ids, t => {
          let sid = `${t.object_type}_${t.id}`;
          return {
            id: sid,
            pid: t.object_type,
            oid: t.id,
            name: t.name,
            source: t.source,
            packageId: t.packageId
          };
        })
      };
    }
    return geo_filter;
  };


  setGeoFilter = async () => {
    let geo_filter = this.getGeoFilter();
    let { cards } = this.state;
    cards = this.checkCards(cards);
    cards[0].geo_filters = geo_filter;
    await this.setState({ cards });
  };


  addDrawShapeToMap = async (shape, area, center, fitView, mapStateKey) => {
    this.drawpolygon = this.drawpolygon || {};
    this.drawpolygon[this.CreatingPolyUUID] = shape;
    await this.setGeoFilter();
    this.area = area / 1000000;
    this.vector_layer.addGeometry(shape);
    if (fitView) {
      let extent = this.vector_layer.getExtent();
      this.map.fitExtent(extent);
    }
    // this.removeMeasureTooltip();
    // 添加绘制面积提示
    this.addMeasureTooltip(area, center);
    // 追加事件
    this.addShapeAct(shape, area, center, mapStateKey);
    this.saveSelectedToCookie(mapStateKey);
    this.setState({ hasCustomDraw: true });
  };


  saveSelectedToCookie = (mapStateKey) => {
    if (!this.props.useCookie) return;
    let line = this.getLineDistancePoints(), value;
    if (mapStateKey === self_select) {
      let points = map(this.endPolygon, (c) => {
        let p = bd09towgs84(c.lng, c.lat);
        return [p.lng, p.lat];
      });
      if (size(points)) {
        // value = {points, line};
        value = { points };
      }
    } else if (mapStateKey === dis_select) {
      if (this.endCircle) {
        // let point = [this.endCircle.lng, this.endCircle.lat];
        let p = bd09towgs84(this.endCircle.lng, this.endCircle.lat);
        value = { point: [p.lng, p.lat], distance: this.endCircleDis, line };
      }
    }
    if (value) {
      localStorage.setItem(mapStateTypeCookieKey, mapStateKey);
      value = LZString.compress(JSON.stringify(value));
      localStorage.setItem(cookieKeyMap[mapStateKey], value);
    }
  };


  addShapeAct = (shape, area, center, mapStateKey) => {
    if (!shape) return;
    let line = this.getLineDistancePoints();
    shape.setProperties({ line, uid: this.CreatingPolyUUID });// 设置保存绘制路径
    shape.on(map_mouseenter_key, () => {
      let { uid } = shape.getProperties();
      let { measureTooltip, vector_layer } = this;
      if (measureTooltip) vector_layer.removeGeometry(measureTooltip);
      this.measureTooltip = null;
      setTimeout(() => {
        this.addMeasureTooltip(area, center, uid);
        this.addLineDistanceTip(this.lineDistance && this.lineDistance[uid], mapStateKey, uid);
      });
    });
    shape.on(map_mouseout_key, () => this.removeAllMeasureMarkersShape(shape));
    shape.on(map_rightclick_key, this.onShapeRightClick);
    this.removeAllMeasureMarkersShape(shape);
  };


  onShapeRightClick = (e) => {
    this.rightClickFence = e.target;
    // this.contextMenu.open(this.map, e.lnglat);
    let options = {
      items: [{
        item: "删除", click: () => {
          let { uid } = this.rightClickFence.getProperties();
          this.removeAllMeasureMarkers(uid);
          this.vector_layer.removeGeometry(this.drawpolygon[uid]);
          if (this.lineDistance) this.vector_layer.removeGeometry(this.lineDistance[uid]);
          delete this.drawpolygon[uid];
          if (this.lineDistance) (this.lineDistance[uid] = undefined);
          this.rightClickFence = null;
          this.setGeoFilter();
          this.resetDraw();
        }
      }]
    };
    // this.map.setMenu(options).openMenu(e.coordinate);
  };


  removeAllMeasureMarkersShape = (shape) => {
    let { uid } = shape.getProperties();
    this.removeAllMeasureMarkers(uid);
  };


  removeAllMeasureMarkers = (uid) => {
    this.removeMeasureMarkers(uid);
    if (this.measureTooltip) {
      this.measureTooltip.remove();
      this.vector_layer.removeGeometry(this.measureTooltip);
      this.measureTooltip = null;
    }
  };


  removeMeasureMarkers = (uid) => {
    let marks = this.vector_layer && this.vector_layer.filter((poly) => {
      // console.log(poly.getJSONType(),'poly')
      return poly.getJSONType() === "Marker";
    }).getGeometries();
    // console.log(marks,'marks')
    if (this.vector_layer) this.vector_layer.removeGeometry(filter(marks, m => {
      let ext = m && m.getProperties();
      return ext && ext.isLineMarkers && ext.uid === uid;
    }));
  };


  // createMeasureTooltip() {
  //     let {measureTooltip} = this;
  //     if (!measureTooltip) {
  //         // measureTooltip = new maptalks.Marker();
  //         measureTooltip = new maptalks.ui.UIMarker([0,0],{
  //             eventsPropagation:false,
  //             content:'<div></div>'
  //         });
  //         this.measureTooltip = measureTooltip;
  //         console.log(this.vector_layer,'this.vector_layer')
  //         console.log(measureTooltip,'measureTooltip')
  //         // measureTooltip.addTo(this.vector_layer);
  //         measureTooltip.addTo(this.map);
  //          // this.vector_layer && this.vector_layer.addGeometry(measureTooltip);
  //     }
  // },
  // 面积提示 close按钮单个删除逻辑
  addMeasureTooltip = (area, position, uid) => {
    // console.log('面积提示')
    const dom = document.createElement("div");
    dom.style.fontSize = "12px";
    dom.style.fontWeight = "100";
    dom.style.color = "#000000";
    dom.style.textShadow = "1px 1px 0px #ffffff, -1px -1px 0px #ffffff, -1px 1px 0px #ffffff, 1px -1px 0px #ffffff";
    dom.style.padding = "0 5px";
    dom.style.borderRadius = "4px";
    dom.innerHTML = `<span>${this.formatArea(area)}</span>`;
    const close = document.createElement("i");
    close.className = "delete_custom_fence material-icons";
    close.innerText = "delete_forever";
    close.onclick = () => {
      // console.log('清除单个自定义围栏')
      this.removeAllMeasureMarkers(uid);
      this.vector_layer.removeGeometry(this.drawpolygon[uid]);
      if (this.lineDistance) this.vector_layer.removeGeometry(this.lineDistance[uid]);
      delete this.drawpolygon[uid];
      if (this.lineDistance) (this.lineDistance[uid] = undefined);
    };
    dom.appendChild(close);

    // this.createMeasureTooltip();
    let { measureTooltip } = this;
    if (!measureTooltip) {
      // measureTooltip = new maptalks.Marker();
      measureTooltip = new maptalks.ui.UIMarker(position, {
        eventsPropagation: false,
        animation: null,
        content: dom
      });
      this.measureTooltip = measureTooltip;
      // console.log(this.vector_layer,'this.vector_layer')
      // console.log(measureTooltip,'measureTooltip')
      measureTooltip.addTo(this.map);
    }
    // measureTooltip.setOptions({
    //     'symbol': {
    //         ...baseTextMarkerCfg,
    //         'textName': this.formatArea(area),
    //     },
    //     'title': this.formatArea(area),
    //     'zIndex': 999999,
    // });
    // measureTooltip.setContent(dom)
    // measureTooltip.setCoordinates(position);
    // measureTooltip.on('mousedown',()=>{console.log(123)})
    // console.log(measureTooltip)
  };


  // 面积文本
  formatArea = (area, uid) => {
    let output = area <= 10000 ? `${Math.round(area * 100) / 100}m²` :
      `${Math.round(area / 1000000 * 100) / 100}km²`;
    return output;
  };


  // 解绑绘制事件
  offDrawAct = () => {
    let { mouseTool } = this;
    // this.map = this.getMapInstance();
    let map = this.map;
    if (mouseTool) {
      mouseTool.disable();
      mouseTool.off(map_draw_key, this.completeOverlay, this);
      mouseTool.off(map_drawstart_key, this.startDrawEvt, this);
      mouseTool.remove();
      this.mouseTool = null;
    }
    if (map) {
      map.off(map_mousemove_key, this.mousemoveAct, this);
      map.off(map_mouseout_key, this.hideHelpTooltipElement, this);
      //  map.off(map_mousedown_key, this.addPointToLine, this);// 绘制圆
      map.off(map_click_key, this.addPointToLine, this);// 绘制polygon
      map.off(map_rightclick_key, this.addPointToLine3, this);// 绘制polygon
      // map.off(map_dblclick_key, this.addPointToLine4, this);// 绘制polygon
      map.setCursor("pointer");
    }
    this.hideHelpTooltipElement();
  };


  //清空绘制
  clearOverlays = (set = true, clearSearchMaker = true) => {
    // vector_layer
    this.offDrawAct();
    this.clearMapMarker();
    let { map, vector_layer, drawpolygon, measureTooltip, lineDistance } = this;
    if (map) {
      // console.log('drawpolygon: ', drawpolygon);
      forEach(drawpolygon, (p, uid) => {
        if (p) p.remove();
        delete drawpolygon[uid];
      });
      if (set) this.setGeoFilter();
      if (measureTooltip) measureTooltip.remove();
      if (lineDistance) {
        forEach(lineDistance, (p, uid) => {
          if (p) p.remove();
          lineDistance[uid] = undefined;
        });
        this.lineDistance = null;
      }
      if (this.helpDrawTooltip) {
        vector_layer.removeGeometry(this.helpDrawTooltip);
        this.helpDrawTooltip = null;
      }
    }
    this.setState({ hasCustomDraw: false });
  };


  startDrawEvt = (e) => {
    this.startedDraw = true;
  };


  // 鼠标按下追加线开始点
  addPointToLine = (e) => {
    if (!this.startedDraw) return;
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    if (mapStateKey === dis_select || mapStateKey === self_select) {
      let { path = [] } = lineDistance[CreatingPolyUUID].getProperties() || {};
      path.push(e.coordinate.toArray());
      lineDistance[CreatingPolyUUID].setCoordinates(path);
      lineDistance[CreatingPolyUUID].setProperties({ path: [...path] });
      this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
    }
  };

  addPointToLine3 = (e) => {
    if (!this.startedDraw) return;
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    if (mapStateKey === self_select) {
      let { path = [] } = lineDistance[CreatingPolyUUID].getProperties() || {};
      if (size(path) < 3) {
        this.resetLineDistanceTip(CreatingPolyUUID);
      } else {
        lineDistance[CreatingPolyUUID].setCoordinates(path);
        this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
      }
    }
  };

  // 鼠标移动更新线
  updatePointOnLine = (e) => {
    let { lineDistance, mapStateKey, CreatingPolyUUID } = this;
    let { path } = lineDistance[CreatingPolyUUID].getProperties() || {};
    if (size(path)) {
      path = [...path, e.coordinate.toArray()];
      lineDistance[CreatingPolyUUID].setCoordinates(path);
      this.addLineDistanceTip(lineDistance[CreatingPolyUUID], mapStateKey);
    }
  };

  // 计算点位
  addLineDistanceTip = (lineDistance, mapStateKey, uid) => {
    uid = uid || this.CreatingPolyUUID;
    if (!lineDistance) return;
    let path = maptalks.Coordinate.toNumberArrays(lineDistance.getCoordinates());
    this.removeMeasureMarkers(uid);
    let isPolygon = mapStateKey === self_select;
    let oLen = size(path);
    if (isPolygon && oLen > 2 && path[0] !== path[oLen - 1]) {
      path = [...path, path[0]];
    }
    let len = path.length - 1, marks = [];
    let tmpPolygon = new maptalks.Polygon([path]).addTo(this.vector_layer);
    let mapView = this.map;
    for (let i = 0; i < len; i++) {
      let f = new maptalks.Coordinate(path[i]), s = new maptalks.Coordinate(path[i + 1]);
      let pf = mapView.coordinateToPoint(f);
      let ps = mapView.coordinateToPoint(s);
      let dis = mapView.pointToDistance(pf.x - ps.x, pf.y - ps.y, mapView.getZoom());
      let distance = this.formatDistance(dis);
      if (distance) {
        let [f1, s1] = sortBy([f, s], ["x"]);
        let pcc, lngX, latX;
        let pc = [(f1.x + s1.x) / 2, (f1.y + s1.y) / 2];
        for (let j = 0; j < 4; j++) {
          lngX = j >= 2 ? 0 : (j - 0.5) * 2;
          latX = j >= 2 ? (j - 2.5) * 2 : 0;
          pcc = new maptalks.Coordinate([pc[0] + (dis * 0.000001) * lngX, pc[1] + (dis * 0.000001) * latX]);
          if (tmpPolygon.containsPoint(pcc)) {
            break;
          }
        }
        let ag1 = this.calcAngle(f1, s1);
        let ag2 = this.calcAngle(f1, pcc);
        let angle = ag1;
        if (ag1 > ag2) {
          angle = 180 + ag1;
        }
        let text_trans = 1;
        if (angle < 90 && angle > -90) {
          text_trans = -1;
        }


        let mark = new maptalks.Marker(pc, {
          "properties": { isLineMarkers: true, uid },
          "symbol": {
            ...baseTextMarkerCfg,
            "textName": distance,
            "textDy": 25 * text_trans,
            "textRotation": -ag1
          }
        });

        marks.push(mark);
      }
    }
    tmpPolygon.remove();
    if (this.vector_layer) this.vector_layer.addGeometry(marks);
    tmpPolygon = null;
    marks = null;
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

  // 计算2点角度
  calcAngle = (start, end) => {
    const mapView = this.map;
    if (!end) return 0;
    let p_start = mapView.coordToContainerPoint(start),
      p_end = mapView.coordToContainerPoint(end);
    let diff_x = p_end.x - p_start.x,
      diff_y = p_end.y - p_start.y;
    return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI);
  };

  // 清除点位相关信息
  clearMapMarker = () => {
    if (this.map) {
      if (this.poiMarker) this.poiMarker.remove();
      this.poiMarker = null;
    }
  };

  getLineDistancePoints = () => {
    let points = this.lineDistance ? map(this.lineDistance[this.CreatingPolyUUID].getCoordinates(), p => p.toArray()) : [];
    return points;
  };

  // 打开测距
  turnOnRangingTool = () => {
    this.distanceTool.enable();
  };

  //截图
  saveAsJpeg = () => {
    this.map.toDataURL({
      "mimeType": "image/jpeg", // or 'image/png'
      "save": true,             // to pop a save dialog
      "fileName": `picture_${new Date().getTime()}`         // file name
    });
  };
  onFullScreenCenter = async () => {
    await this.setState({ fullscreencenter: !this.state.fullscreencenter });
  };
};

export default PreStyle;
