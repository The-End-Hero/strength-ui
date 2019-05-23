import forEach from "lodash/forEach";
import get from "lodash/get";
import size from "lodash/size";
import amapUtil from "../../../utils/amapUtil";
import set from "lodash/set";
import { staticType, normalOpt, geo_types } from "../../../constants/constants";
import { trimFloatZero } from "../../../utils/numberUtil";

import coordtransform from "coordtransform";

const RenderDataMixin = (superclass) => class RenderDataMixin extends superclass {
  addCardsDataToMap = () => {
    if (!this.map) return;
    const { cards } = this.state;
    console.log(cards, "cards addcardsto");
    forEach(cards, (c) => {
      const { uid: card_uid, items } = c;
      forEach(items, (t) => {
        const { geometry_type, filters } = t; // 数据类型
        console.log(geometry_type, "cards.items.geometry_type");
        forEach(filters, (v) => {
          const { data, style } = v;
          if (geometry_type === "point") {
            alert("point");
            const arg = {
              dataSet: data,
              card: c,
              item: t,
              filter: v,
              typeStr: ""
            };
            this.addPoiToMapExt(arg);
          } else if (geometry_type === "polygon") {
            alert("polygon");
            const arg = {
              dataSet: data,
              card: c,
              item: t,
              filter: v,
              typeStr: ""
            };
            this.addPolygonToMapExt(arg);
          } else if (geometry_type === "line") {
            alert("line");
            const arg = {
              dataSet: data,
              card: c,
              item: t,
              filter: v,
              typeStr: ""
            };
            this.addLineToMapExt(arg);
          }
        });
      });
    });
    this.generateMarkCols();
  };
  /**
   * 添加地图点位
   * @param dataSet  数据源
   * @param card  card字段
   * @param item  card中item
   * @param filter  过滤条件
   * @param typeStr  是否是静态
   * @param from_to  多地理 from/to
   */
  addPoiToMapExt = ({ dataSet, card, item, filter, typeStr, from_to }) => {
    this.removeLayerOrHeatMap(card.uid, filter.uid, from_to); // 清除之前的
    const { cur_visual, size_visual } = filter || {};// size_visual大小可视化
    if (!from_to && filter.hidden) { //隐藏
      return;
    }
    if (from_to && filter[`hidden_${from_to}`]) { // 多地理显示/隐藏
      return;
    }
    // console.log(cur_visual, 'cur_visual')
    let visual_cfg = null;
    let { type, col, title } = cur_visual || {};
    type = Number(type);
    if (from_to && filter[`cur_visual_${from_to}`]) { // 多地理
      // { type, col, title } = cur_visual_from || {}
      type = filter[`cur_visual_${from_to}`].type;
      col = filter[`cur_visual_${from_to}`].col;
      title = filter[`cur_visual_${from_to}`].title;
    }
    visual_cfg = filter["config_" + type];
    visual_cfg = visual_cfg || {};
    visual_cfg = visual_cfg[col];
    if (!type || type === 1 || type === 2) { // menu里面的点击区域
      if (from_to) { // 有该字段,则为多地理
        if (from_to === "from") { // from
          const style = filter.style;
          style.icon = style.icon_from;
          style.color = style.color_from;
          const option = amapUtil.getVisualMapOption(style);
          if (size(this.layers)) {
            option.fitView = false;
          }
          set(this.multMassMarkers, `${card.uid}.${filter.uid}.${from_to}`, amapUtil.createVisualMap(this.map, dataSet, visual_cfg, option, size_visual));
          this.multMassMarkers[card.uid][filter.uid][from_to].on("click", e => {
            this.onMassClick(e, card.uid, filter.uid, typeStr);
          });
        } else if (from_to === "to") { // to
          const style = filter.style;
          style.icon = style.icon_to;
          style.color = style.color_to;
          const option = amapUtil.getVisualMapOption(style);
          if (size(this.layers)) {
            option.fitView = false;
          }
          set(this.multMassMarkers, `${card.uid}.${filter.uid}.${from_to}`, amapUtil.createVisualMap(this.map, dataSet, visual_cfg, option, size_visual));
          this.multMassMarkers[card.uid][filter.uid][from_to].on("click", e => {
            this.onMassClick(e, card.uid, filter.uid, typeStr);
          });
        }
      } else {
        const option = amapUtil.getVisualMapOption(filter.style); // 地图 可视化设置
        if (size(this.layers)) {
          option.fitView = false;
        }
        if (!this.massMarkers) return;
        set(this.massMarkers, `${card.uid}.${filter.uid}`, amapUtil.createVisualMap(this.map, dataSet, visual_cfg, option, size_visual));
        this.massMarkers[card.uid][filter.uid].on("click", e => {
          this.onMassClick(e, card.uid, filter.uid, typeStr);
        });
      }
    } else if (type === 3 || type === 4 || type === 5) {
      if (from_to) {
        set(this.multHeatMaps, `${card.uid}.${filter.uid}.${from_to}`, amapUtil.createHeatMap(this.map, dataSet, visual_cfg, col));
      } else {
        set(this.heatMaps, `${card.uid}.${filter.uid}`, amapUtil.createHeatMap(this.map, dataSet, visual_cfg, col));
      }
    } else if (type === 6) { // 流向图
      if (from_to === "to") {
        // alert('初始化地理流向图')
        // const flowData = filter.flow_data;
        // this.addLineToMapExtByFlow(flowData, card, item, filter);
      }
    }
  };
  onMassClick = (e, card_id, filter_id, type) => {
    console.log("点位点击:", e);
    const data = e.originalData.rawData;
    const pos = e.originalData.target.getPosition();
    const { cards, static_cards } = this.state;
    let card, fdItem, fdFilter;
    if (type === staticType) {
      [card, fdItem, fdFilter] = this.findCardAndFilter(static_cards, card_id, filter_id);
    } else {
      [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    }
    this.hideInfoWindow();
    this.createInfoWindow(fdFilter, pos, data);
  };
  /**
   * 给地图添加围栏图层 可视化
   * @param dataSet
   * @param card
   * @param item
   * @param filter
   * @param typeStr
   */
  addPolygonToMapExt = ({ dataSet, card, item, filter, typeStr }) => {// 
    // console.log('给地图添加围栏图层')
    if (!this.map) return;
    // console.log(dataSet, card, item, filter, '给地图添加围栏图层00')
    this.removeDataOnMapFilter(card.uid, filter.uid);
    let { cur_visual, hidden, style: robj } = filter || {};
    let visual_cfg = null;
    let { type, col, title } = cur_visual || {};
    visual_cfg = filter["config_" + type];
    visual_cfg = visual_cfg || {};
    visual_cfg = visual_cfg[col];
    let { color } = robj || {};
    let layersMap = {}, layers = [];
    forEach(dataSet, d => {
      let { id } = d;
      let layer = amapUtil.addPolygon(d, {
        ...normalOpt,
        ...robj,
        strokeColor: color,
        fillColor: color
      });
      let val = visual_cfg ? get(d, visual_cfg.deps) : "";
      // console.log(layer, 'layer')
      forEach(layer, polygon => {
        amapUtil.setOnePolygonByVal(polygon, val, normalOpt, robj, visual_cfg);
        if (hidden) {
          // console.log('这个过滤是hidden addPolygonToMapExt',data)
          polygon.hide();
        }
        let opts = polygon.getOptions();
      });
      layersMap[id] = layer;
      layers = layers.concat(layer);
      forEach(layer, p => {
        p.on("click", e => {
          this.onShowPolygonInfo(e, card.uid, filter.uid, typeStr);// 显示围栏的提示信息框
        });
      });
    });
    this.map.add(layers);
    set(this.polygonLayers, `${card.uid}.${filter.uid}`, layersMap);

    // this.polygonLayers[card.uid] = this.polygonLayers[card.uid] || {};
    // this.polygonLayers[card.uid][filter.uid] = layersMap;
  };

  /**
   * 给地图添加线图层
   * @param dataSet
   * @param card
   * @param item
   * @param filter
   * @param typeStr
   */
  addLineToMapExt = ({ dataSet, card, item, filter, typeStr }) => {
    // console.log('给地图添加线图层')
    if (!this.map) return;
    this.removeDataOnMapFilter(card.uid, filter.uid);
    let { cur_visual, hidden, style: robj } = filter || {};
    let visual_cfg = null;
    let { type, col, title } = cur_visual || {};
    visual_cfg = filter["config_" + type];
    visual_cfg = visual_cfg || {};
    visual_cfg = visual_cfg[col];
    let { color } = robj || {};
    let layersMap = {}, layers = [];
    forEach(dataSet, d => {
      let { id } = d;
      let layer = amapUtil.addPolyline(d, {
        ...lineOpt,
        ...robj,
        strokeColor: color,
        fillColor: color
      });
      let val = visual_cfg ? get(d, visual_cfg.deps) : "";
      forEach(layer, polygon => {
        amapUtil.setOnePolygonByVal(polygon, val, lineOpt, robj, visual_cfg);
        if (hidden) {
          polygon.hide();
        }
      });
      layersMap[id] = layer;
      layers = layers.concat(layer);
      forEach(layer, p => {
        p.on("click", e => {
          this.onShowPolygonInfo(e, card.uid, filter.uid, typeStr);// 显示围栏的提示信息框
        });
      });
    });
    this.map.add(layers);
    set(this.lineLayers, `${card.uid}.${filter.uid}`, layersMap);
    //
    // this.lineLayers[card.uid] = this.lineLayers[card.uid] || {};
    // this.lineLayers[card.uid][filter.uid] = layersMap;
  };


  onShowPolygonInfo(e, card_id, filter_id, type) {
    console.log("onShowPolygonInfo");
    let pos = e.lnglat;
    let data = e.target.getExtData();
    let { cards, static_cards } = this.state;
    let card, fdItem, fdFilter;
    if (type === staticType) {
      [card, fdItem, fdFilter] = this.findCardAndFilter(static_cards, card_id, filter_id);
    } else {
      [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    }
    this.hideInfoWindow();
    this.createInfoWindow(fdFilter, pos, data, e);
  }


  // 生成 展示字段
  generateMarkCols() {
    let map = this.map;
    this.markerData = [];
    this.multMarkerData = [];
    // console.log(this.multMarkValue,'this.multMarkValue')
    // console.log(this.markValue,'this.markValue')
    // console.log(this.state.cards,'state.cards')
    forEach(this.multMarkValue, (c, card_id) => {
      forEach(c, (f, filter_id) => {
        forEach(f, (ft, key) => {
          // console.log(ft, key)
          // console.log(this.multMarkValue[card_id][filter_id][key], 'this.multMarkValue[card_id][filter_id][from]')
          this.multMarkValue[card_id] && this.multMarkValue[card_id][filter_id]["from"] && map.remove(this.multMarkValue[card_id][filter_id]["from"]);
          this.multMarkValue[card_id] && this.multMarkValue[card_id][filter_id]["to"] && map.remove(this.multMarkValue[card_id][filter_id]["to"]);
          this.multMarkValue[card_id] && delete this.multMarkValue[card_id][filter_id]["from"];
          this.multMarkValue[card_id] && delete this.multMarkValue[card_id][filter_id]["to"];
        });
      });
    });
    forEach(this.markValue, (c, card_id) => {
      forEach(c, (f, filter_id) => {
        map && map.remove(this.markValue[card_id][filter_id]);
        delete this.markValue[card_id][filter_id]; // 极有可能是card_id和filter_id都为""，导致delete this.markValue;
      });
    });


    forEach(this.state.cards, (c, i) => {
      forEach(c.items, (item, j) => {
        if (item.geometry_type === geo_types.point_to_point) { // 多地理 点->点
          forEach(item.filters, (f, k) => {
            !f.hidden_to && f.show_col && f.data && this.addMarkValToMapInMult(c.uid, f.uid, f.data, f.show_col, "to");
            !f.hidden_from && f.show_col && f.data && this.addMarkValToMapInMult(c.uid, f.uid, f.select_data, f.show_col, "from");
          });
        } else {
          forEach(item.filters, (f, k) => {
            !f.hidden && f.show_col && f.data && this.addMarkValToMap({
              card_id: c.uid,
              filter_id: f.uid,
              dataSet: f.data,
              col: f.show_col
            });
          });
        }
      });
    });
    forEach(this.state.static_cards, (c, i) => {
      forEach(c.items, (item, j) => {
        forEach(item.filters, (f, k) => {
          !f.hidden && f.show_col && f.data && this.addMarkValToMap({
            card_id: c.uid,
            filter_id: f.uid,
            dataSet: f.data,
            col: f.show_col
          });
        });
      });
    });
    forEach(this.state.current_geo_filter.filters, (f, k) => {
      !f.hidden && f.show_col && f.data && this.addMarkValToMap("geo_filter", f.uid, f.data, f.show_col);
    });
  }

  /**
   * 给地图添加mark文字
   * @param card_id
   * @param filter_id
   * @param dataSet
   * @param col
   */
  addMarkValToMap = ({ card_id, filter_id, dataSet, col }) => {
    this.markValue = this.markValue || {}; // 及可能是delete
    this.markValue[card_id] = this.markValue[card_id] || {};
    this.markValue[card_id][filter_id] = [];
    let pois = this.markerData || [];
    forEach(dataSet, data => {
      let valKey = "";
      if (col === "name" || col === "address") {
        valKey = col;
      } else {
        valKey = `extra.${col}`;
      }
      let val = get(data, valKey);
      if (!val) return;
      if (val * 1 === val * 1) {
        val = parseFloat(val);
        if (Math.abs(val) > 1) {
          val = trimFloatZero(val);
        } else {
          val = val.toPrecision(2);
        }
      }
      let valContent = document.createElement("div");
      valContent.className = "card-tip";
      valContent.title = `${val}`;
      valContent.innerHTML = "";
      valContent.innerHTML = `${val}`;

      let lnglat = this.getCenterLngLat(data);
      if (!lnglat) return;
      let lng = lnglat[0];
      let lat = lnglat[1];
      let pos = coordtransform.wgs84togcj02(lng, lat);
      if (!this.checkDisPoints(pois, pos)) {
        pois.push(pos);
        // console.log(pos,'addMarkValToMap pos')
        let marker = new window.AMap.Marker({
          map: this.map,
          position: pos,
          content: valContent,
          offSet: new window.AMap.Pixel(0, 0),
          zIndex: 100
        });
        this.markValue[card_id][filter_id].push(marker);
      }
    });
    this.markerData = pois;
  };

  //是否有交叉，有则返回true
  checkDisPoints =(points, point) =>{
    let found = false;
    forEach(points, p => {
      if (this.checkDis(p, point)) {
        found = true;
        return false;
      }
    });
    return found;
  }

  //是否有交叉，有则返回true
  checkDis=(p1, p2)=> {
    let map = this.map
    if (!map) return true;
    let zoom = map.getZoom();
    let pix1 = map.lnglatToPixel(p1, zoom);
    let pix2 = map.lnglatToPixel(p2, zoom);
    let disX = pix1.getX() - pix2.getX();
    let disY = pix1.getY() - pix2.getY();
    return Math.abs(disX) < 100 && Math.abs(disY) < 20;
  }
};
export default RenderDataMixin;
