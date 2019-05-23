import forEach from "lodash/forEach";
import get from "lodash/get";
import amapUtil from "../../../utils/amapUtil";
import size from "lodash/size";
import set from "lodash/set";
import { bgNormalOpt, activeOpt, lightColor, normalColor, PolygonPackageIdKey,PolygonSourceKey} from "../../../constants/constants";

const BgMixin = (superclass) => class BgMixin extends superclass {
  dealPolygonAct =(polygon, type) =>{
    // 移入bg
    polygon.on("mousemove", ({ lnglat }) => {
      let extData = polygon.getExtData() || {};
      let text = extData.name;
      this.updateMapHelper(lnglat, text);
    });
    // 移出bg
    polygon.on("mouseout", (e) => {
      // console.log('移出polygon')
      this.hideMapHelper();
    });
    // polygon点击
    if (type === "multdata") {
      console.log("mult数据");
    } else {
      polygon.on("click", this.onClickPolygon);
    }
  }
  /**
   * 点击围栏函数 选择 反选 针对单地理数据
   * @param e
   */
  onClickPolygon = (e) => {
    console.log("点击围栏 正反选  非mult数据:", e);
    let polygon = e.target
    // console.log(polygon,'polygon')
    let extData = polygon.getExtData() || {}
    let { object_type, id, name, [PolygonSourceKey]: source, [PolygonPackageIdKey]: packageId, lastOpt } = extData
    let { active_layer_ids, bgPolygonData,current_geo_filter: { filters } } = this.state
    let filter = filters && filters[0] || {};
    let bgData = filter.data//bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type]
    if (active_layer_ids[0]) { //全选;
      delete active_layer_ids[0]
      forEach(bgData, t => {
        active_layer_ids[t.id] = {
          id: t.id + '',
          object_type,
          name: t.name,
          source: t[PolygonSourceKey],
          packageId: t[PolygonPackageIdKey]
        }
      })
      delete active_layer_ids[id]
      polygon.setOptions(lastOpt)
    } else {
      if (active_layer_ids[id]) {
        polygon.setOptions(lastOpt)
        delete active_layer_ids[id]
      } else {
        polygon.setOptions(activeOpt)
        active_layer_ids[id] = { id: id + '', object_type, name: name, source, packageId }
        let allSelect = true
        let fence_data = bgData
        forEach(fence_data, t => {
          if (!active_layer_ids[t.id] && t.id) {
            allSelect = false
            return false
          }
        })
        if (allSelect) {
          active_layer_ids = { 0: { id: 0, name: `全部 ( ${object_type} )`, object_type, source, packageId } }
        }
      }
    }
    let { cards } = this.state
    cards = this.updateCardsGeoFilters(cards, active_layer_ids, object_type, source, packageId)
    this.setState({ cards, active_layer_ids })
  };

  initMapHelper =()=> {
    let map = this.map;
    if (map && !this.helpTip) {
      this.helpTip = new amapUtil.HelpToolTip(map);
    }
  }

  updateMapHelper=(lnglat, content) =>{
    if (this.helpTip) this.helpTip.update(lnglat, content);
  }

  hideMapHelper=()=> {
    if (this.helpTip) this.helpTip.hide();
  }

  addBgPolygon = () => {
    console.log(this.state, "this.state");
    let layers = [];
    const { active_layer_ids, current_geo_filter: { filters, source, packageId, object_type } } = this.state;
    let filter = filters && filters[0] || {};
    this.layers[source] = { [packageId]: { [object_type]: {} } };
    let { cur_visual, hidden, style: robj, data } = filter;
    let visual_cfg = null;
    let { type, col, title } = cur_visual || {};
    visual_cfg = filter["config_" + type] || {};
    visual_cfg = visual_cfg[col];
    let opt = { ...bgNormalOpt };
    forEach(data, t => {
      let { id } = t;
      let layer = amapUtil.addPolygon(t, opt);
      let val = visual_cfg ? get(t, visual_cfg.deps) : "";
      forEach(layer, (polygon) => {
        amapUtil.setOnePolygonByVal(polygon, val, opt, robj, visual_cfg);
        if (hidden) {
          // console.log('这个过滤是hidden addBgPolygon',data)
          polygon.hide();
        }
        let extData = polygon.getExtData() || {};
        let { fillColor, strokeColor, fillOpacity, strokeWeight, strokeStyle, strokeDasharray } = polygon.getOptions();
        extData.lastOpt = { fillColor, strokeColor, fillOpacity, strokeWeight, strokeStyle, strokeDasharray };
        polygon.setExtData(extData);
        this.dealPolygonAct(polygon);
        if (active_layer_ids[0] || active_layer_ids[id]) {
          polygon.setOptions(activeOpt);
        }
        let opts = polygon.getOptions();
      });

      layers = layers.concat(layer);
      set(this.layers, `${source}.${packageId}.${object_type}.${id}`, layer);
      // this.layers[source][packageId][object_type][id + ""] = layer;
    });
    let mapIns = this.map;
    // console.log(layers,'addBgPolygon layers')
    if (size(layers)) {
      // debugger
      console.log(this.layers, "layers");
      if (mapIns) mapIns.add(layers);
      // debugger
      if (!this.init && mapIns) mapIns.setFitView(layers);
    }
  };

  updateBgPolygon = ()=> { // 更新背景围栏
    // console.log('更新背景围栏')
    let mapIns = this.map;
    if (!mapIns) return;
    // let {geo_filter: {filters, object_type, source, packageId}, active_layer_ids} = this.state;
    let { current_geo_filter: { filters, object_type, source, packageId }, active_layer_ids } = this.state;
    packageId = packageId || "";
    let fdFilter = filters && filters[0] || {};
    let { cur_visual, hidden, style: robj } = filters && filters[0] || {};
    let visual_cfg = null;
    let { type, col, title } = cur_visual || {};
    visual_cfg = fdFilter["config_" + type];
    visual_cfg = visual_cfg || {};
    visual_cfg = visual_cfg[col];
    let dataSet = fdFilter.data || [];
    // console.log(dataSet, 'dataSet')
    if (robj && (robj.color && robj.color.toUpperCase() === normalColor.base || robj.color === normalColor.base) && this.state.map_style === "normal") {
      robj.color = lightColor.base;
    } else if (robj && robj.color.toUpperCase() === lightColor.base && this.state.map_style !== "normal") {
      robj.color = normalColor.base;
    }
    forEach(dataSet, t => {
      let { id } = t;
      let val = visual_cfg ? get(t, visual_cfg.deps) : "";
      forEach(this.layers && this.layers[source] && this.layers[source][packageId]
        && this.layers[source][packageId][object_type] && this.layers[source][packageId][object_type][id], polygon => {
        if (polygon) {
          let extData = polygon.getExtData() || {};
          if (!hidden) {
            !polygon.getVisible() && polygon.show();
            amapUtil.setOnePolygonByVal(polygon, val, bgNormalOpt, robj, visual_cfg);
            let { fillColor, strokeColor, fillOpacity, strokeWeight, strokeStyle, strokeDasharray } = polygon.getOptions();
            extData.lastOpt = {
              fillColor,
              strokeColor,
              fillOpacity,
              strokeWeight,
              strokeStyle,
              strokeDasharray
            };
            polygon.setExtData(extData);
            if (active_layer_ids[0] || active_layer_ids[id]) {
              polygon.setOptions(activeOpt);
            }
          } else {
            polygon.getVisible() && polygon.hide();
          }
        }
      });
    });
  }
};
export default BgMixin;
