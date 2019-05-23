"use strict";
import uuidv1 from "uuid/v1";
import {
  cloneDeep, map, find, forEach, indexOf, get, size, filter,
  isNumber, startsWith, minBy, maxBy
} from "lodash";
import { getMd5Str } from "../../../utils/strUtil";
import { polyOptA2S } from "../../../utils/bmapUtil";
import {
  searchDataSelectRef, geo_types,
  dis_select, self_select, fence_select, buffer_select,
  h_type_date, h_type_number, h_type_text, map_poi_icons as poi_icons, visualization_colors,
  mapHeaderKey, tableIcons, MapVisualTypes, source_customer,
  source_market, PolygonSourceKey, PolygonPackageIdKey, custom_card_menu,
  mapServerPointConfig, mapServerLineConfig, mapServerPolygonConfig, mapServerPointToPointConfig,
  mapServerPointToPolygonConfig, buffer_types
} from "../../../constants/Constants";
import { iconMap } from "../../../utils/iconUtil";

let normalOptIdx = 10;
let activeOptIdx = 9;
let staticOptIndx = 5;
let bgNormalOptIndx = 8;
const normalOpt = {
  bubble: true,
  strokeColor: "#00968e", strokeOpacity: 1, strokeWeight: 1,
  fillColor: "#00968e", fillOpacity: 0, zIndex: normalOptIdx
};
const activeOpt = {
  bubble: true,
  strokeColor: "#41D9FF", strokeOpacity: 1, strokeWeight: 3,
  fillColor: "#41D9FF", fillOpacity: 0, zIndex: activeOptIdx
};
const staticOpt = {
  bubble: true,
  strokeColor: "#5780FF", strokeOpacity: 1, strokeWeight: 3,
  fillColor: "#5780FF", fillOpacity: 0, zIndex: staticOptIndx
};
const bgNormalOpt = { ...normalOpt, zIndex: bgNormalOptIndx };
const lineOpt = {
  ...normalOpt, strokeOpacity: 0.6, strokeWeight: 6
};
const markerStyle = {
  "point": mapServerPointConfig,
  "line": mapServerLineConfig,
  "polygon": mapServerPolygonConfig,
  "point_to_point": mapServerPointToPointConfig,
  "point_to_polygon": mapServerPointToPolygonConfig
};

const unusedCols = ["id", "address", "lng", "lat"];
const _prepareBgActiveStyle = "_prepareBgActiveStyle";
const _prepareBgStyle = "_prepareBgStyle";
const _prepareStaticBgStyle = "_prepareStaticBgStyle";
/**
 * @method _prepareBgActiveStyle 准备点选围栏样式
 * @method _prepareBgStyle 准备底层围栏样式
 * @method _prepareStaticBgStyle 静态图底层围栏
 * @method _prepareStyle 准备查询图层样式
 */
const PreStyleMixin = (superclass) => class PreStyleMixin extends superclass {
  _setBgNormalOptIdx = () => {
    bgNormalOptIndx = normalOptIdx + 1;
    activeOptIdx = bgNormalOptIndx;
    bgNormalOpt.zIndex = bgNormalOptIndx;
    activeOpt.zIndex = activeOptIdx;
  };

  _setNormalOptIdx = () => {
    normalOptIdx += 1;
    normalOpt.zIndex = normalOptIdx;
  };
  /**
   * 获取各种数据类型的基本样式信息
   * @param geometry_type 数据类型 点/线/面/etc.
   * @param robj {...样式设置}持久化存储的样式
   * @param color 颜色
   * @returns {*} 根据数据类型返回 基本样式
   */
  getBaseStyle = ({ geometry_type, robj, color, filter, from_to }:any) => {
    // console.log('getBaseStyle from_to:',from_to)
    // console.log('getBaseStyle geometry_type:',geometry_type)
    // console.log('getBaseStyle robj:',robj)
    // console.log('getBaseStyle color:',color)
    // 各类型的基本style
    let style = cloneDeep(markerStyle[geometry_type]);
    let icon;
    switch (geometry_type) {
      case geo_types.point:
        icon = robj.icon.icon;
        if (icon.indexOf(".svg") === -1) {
          icon = icon + "-15.svg";
        }
        style.marker.file = icon;
        style.marker.fill = color || robj.color;
        style.marker.allow_overlap = robj.allowOverlap;
        break;
      case geo_types.polygon:
        style.polygon.fill = color || robj.color;
        style.polygon.fill_opacity = robj.fillOpacity;
        style.line.stroke = color || robj.color;
        style.line.stroke_opacity = robj.strokeOpacity;
        style.line.stroke_width = robj.strokeWeight;
        if (robj.strokeStyle !== "solid") {
          style.line.stroke_dasharray = robj.strokeDasharray;
        }
        break;
      case geo_types.line:
        style.line.stroke = color || robj.color;
        style.line.stroke_width = robj.strokeWeight;
        if (robj.strokeStyle !== "solid") {
          style.line.stroke_dasharray = robj.strokeDasharray;
        }
        break;
      case geo_types.point_to_point: // from to
        const { hidden_to, hidden_from } = filter;
        if (hidden_to && !hidden_from) { //显示from
          from_to = "from";
        } else if (!hidden_to && hidden_from) { //显示to
          from_to = "to";
        }
        // icon = robj['icon_' + from_to].icon
        icon = robj["icon_" + from_to] ? (robj["icon_" + from_to].icon || "marker-15.svg") : "marker-15.svg";
        if (icon) {
          icon = iconMap(icon);
        }

        style.marker.file = icon; // 地图服务器点位显示的文件,例 xxx.svg
        style.marker.fill = color || robj["color_" + from_to]; // 显示的文件(点位)颜色
        style.marker.allow_overlap = robj.allowOverlap; // 重叠点显示/隐藏
        break;
      case geo_types.point_to_polygon: // 点到点
        if (from_to === "from") {
          icon = robj.icon.icon;
          if (icon.indexOf(".svg") === -1) {
            icon = icon + "-15.svg";
          }
          style.marker.file = icon;
          style.marker.fill = color || robj.color;
          style.marker.allow_overlap = robj.allowOverlap;
        }
        break;
    }
    return style;
  };

  //准备点选围栏样式
  _prepareBgActiveStyle = (active_layer_ids) => {
    if (!size(active_layer_ids)) return;
    let actOpt = { ...activeOpt };
    let layers: any = [], rules: any = [], styles: any = [], style;

    let uuid = `${JSON.stringify(active_layer_ids)}_%_${_prepareBgActiveStyle}`;
    uuid = getMd5Str(uuid);

    let styleName = `poly_style_${uuid}`;
    layers.push({
      name: styleName,
      stylename: styleName
    });

    if (active_layer_ids[0]) {
      style = polyOptA2S(actOpt);
      rules.push(style);
    } else {
      if (size(active_layer_ids)) {
        let ids: any = [];
        forEach(active_layer_ids, (t, id) => {
          ids.push(`[id] = ${id}`);
        });
        rules = [{
          filter: { value: ids.join(" or ") },
          ...polyOptA2S(actOpt)
        }];
      }
    }
    styles.push({ name: styleName, rules });

    let postBody = {
      srs: "bd09",
      map: { layers, styles }
    };
    return postBody;
  };

  //底层围栏样式
  _prepareBgStyle = (node) => {
    let { current_geo_filter: { filters } } = this.state;
    let filter = filters && filters[0] || {};
    let { cur_visual, hidden, style: robj, show_col } = filter;
    if (hidden) return; //如果隐藏则不请求
    let visual_cfg: any = null;
    cur_visual = cur_visual || {};
    let { type, col, title } = cur_visual;
    visual_cfg = filter["config_" + type] || {};
    let cfg = visual_cfg[col];
    let { source, packageId, object_type, geometry_type } = node;

    // console.log('====================================');
    // console.log("_prepareBgStyle:", robj, cfg, "source:",source);
    // console.log('====================================');
    let opt = { ...bgNormalOpt };
    if (robj) {
      opt = {
        ...bgNormalOpt,
        ...robj,
        strokeColor: robj.color,
        fillColor: robj.color
      };
    }
    let columns: any = [], layers: any = [], rules: any = [], styles: any = [], style;
    let uuid = getMd5Str(`${JSON.stringify(node)}_%_${_prepareBgStyle}`);
    //debugger;
    let styleName = `poly_style_${uuid}`;
    layers.push({
      name: "poly_layer_" + uuid,
      stylename: styleName
    });
    cfg = cfg || {};
    let { deps, visualize_type, domain, range } = cfg;
    col = source === source_customer ? deps : this._trimExtra(deps, "extra.");
    let colType = "";
    if (cfg && visualize_type == 1) {
      //数值可视化
      domain = domain || [];
      if (domain.length > 1) {
        for (let i = 0; i < domain.length - 1; i++) {
          let color = range[i] || robj.color;
          let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
          rules.push({
            filter: { value: `[${col}] >= ${domain[i]} and [${col}] < ${domain[i + 1]}` },
            ...style
          });
        }
      } else if (domain.length === 1) {
        let color = range[0] || robj.color;
        let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
        rules = [style];
      }
      if (!rules.length) return;
      colType = "float";
    } else if (cfg && cfg.visualize_type == 2) {
      //字段可视化
      domain = domain || [];
      let other = domain[domain.length - 1] === "__other__";
      let types = other ? domain.slice(0, -1) : domain, typeArr: any = [];
      for (let i = 0; i <= types.length - 1; i++) {
        let color = range[i] || robj.color;
        let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
        let str = `[${col}] = '${domain[i]}'`;
        rules.push({
          filter: { value: str },
          ...style
        });
        typeArr.push(str);
      }
      if (other) {
        let color = range[range.length - 1] || robj.color;
        let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
        rules.push({
          "else_filter": true,
          ...style
        });
      }
      if (!rules.length) return;
      colType = "str";
    } else {
      style = polyOptA2S(opt);
      rules.push(style);
    }
    styles.push({ name: styleName, rules });

    if (cfg && col !== "__by_count__") {
      columns = [[col, colType]];
    }
    //展示字段
    this._preShowColStyle(show_col, source, layers, styles, columns);

    let columnStr = map(columns, t => t.join(",")).join(",");

    let postBody = {
      srs: "bd09",
      columns: columnStr ? columnStr : undefined,
      map: { layers, styles }
    };
    // 点到面 围栏
    if (geometry_type === geo_types.point_to_polygon) {
      // alert('点到面')
      let use_select = false;// true
      let postBody = {
        srs: "bd09",
        actions: [{
          action: "multi_geometry",
          use_select //
        }]
      };
      if (use_select === false) {
        postBody['columns'] = columnStr ? columnStr : undefined;
        postBody['map'] = { layers, styles };
      } else {
        robj.icon = {
          icon: "marker-15.svg",
          content: "marker"
        };
        let style = this.getBaseStyle({ geometry_type, robj, filter, from_to: "from" });
        rules = [style];
        styles = [{ name: styleName, rules }];
        postBody['columns'] = columnStr ? columnStr : undefined;
        postBody['map'] = { layers, styles };
      }
      return postBody;
    }
    return postBody;
  };

  //准备静态底层围栏样式
  _prepareStaticBgStyle = (node, current) => {
    let { geo_filters: { filters } } = current || { geo_filters: {filters:[]} };
    let filter = filters && filters[0] || {};
    let { cur_visual, hidden, style: robj, show_col } = filter;
    if (hidden) return; //如果隐藏则不请求
    let visual_cfg:any = null;
    cur_visual = cur_visual || {};
    let { type, col, title } = cur_visual
    visual_cfg = filter["config_" + type] || {};
    let cfg = visual_cfg[col];
    let { source, packageId, object_type, geometry_type } = node;
    let active_layer_ids = this.state.active_layer_ids_for_static_cards[current.uid];

    let opt = { ...bgNormalOpt }, actOpt = { ...activeOpt };
    if (robj) {
      opt = {
        ...bgNormalOpt,
        ...robj,
        strokeColor: robj.color,
        fillColor: robj.color
      };
      actOpt = {
        ...activeOpt,
        ...robj,
        strokeWeight: activeOpt.strokeWeight, //active时边框粗细
        strokeColor: activeOpt.strokeColor, //active时边框颜色
        fillColor: robj.color
      };
    }

    let columns: any = [], layers: any = [], rules: any = [], styles: any = [], style;
    let uuid = getMd5Str(`${JSON.stringify(node)}_%_${_prepareStaticBgStyle}`);
    let styleName = `poly_style_${uuid}`;
    layers.push({
      name: "poly_layer_" + uuid,
      stylename: styleName
    });
    cfg = cfg || {};
    let { deps, visualize_type, domain, range } = cfg;
    col = source === source_customer ? deps : this._trimExtra(deps, "extra.");
    let colType = "";
    if (cfg && visualize_type == 1) {
      //数值可视化
      domain = domain || [];
      if (active_layer_ids[0]) {
        if (domain.length > 1) {
          for (let i = 0; i < domain.length - 1; i++) {
            let color = range[i] || robj.color;
            let style = polyOptA2S({ ...actOpt, fillColor: color });
            rules.push({
              filter: { value: `[${col}] >= ${domain[i]} and [${col}] < ${domain[i + 1]}` },
              ...style
            });
          }
        } else if (domain.length === 1) {
          let color = range[0] || robj.color;
          let style = polyOptA2S({ ...actOpt, fillColor: color });
          rules = [style];
        }
      } else {
        if (size(active_layer_ids)) {
          let ids: any = [];
          forEach(active_layer_ids, (t, id) => {
            ids.push(`[id] = ${id}`);
          });
          if (domain.length > 1) {
            for (let i = 0; i < domain.length - 1; i++) {
              var color = range[i] || robj.color;
              let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
              rules.push({
                filter: { value: `[${col}] >= ${domain[i]} and [${col}] < ${domain[i + 1]} and not (${ids.join(" or ")})` },
                ...style
              });
            }
            rules.push({
              elsefilter: true,
              ...polyOptA2S({ ...actOpt, fillColor: color })
            });
          } else if (domain.length === 1) {
            let color = range[0] || robj.color;
            rules = [{
              filter: { value: ids.join(" or ") },
              ...polyOptA2S({ ...actOpt, fillColor: color })
            }, {
              elsefilter: true,
              ...polyOptA2S({ ...opt, strokeColor: color, fillColor: color })
            }];
          }
        } else {
          if (domain.length > 1) {
            for (let i = 0; i < domain.length - 1; i++) {
              let color = range[i] || robj.color;
              let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
              rules.push({
                filter: { value: `[${col}] >= ${domain[i]} and [${col}] < ${domain[i + 1]}` },
                ...style
              });
            }
          } else if (domain.length === 1) {
            let color = range[0] || robj.color;
            let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
            rules = [style];
          }
        }
      }
      if (!rules.length) return;
      colType = "float";
    } else if (cfg && cfg.visualize_type == 2) {
      //字段可视化
      domain = domain || [];
      let other = domain[domain.length - 1] === "__other__";
      let types = other ? domain.slice(0, -1) : domain, typeArr: any = [];
      for (let i = 0; i <= types.length - 1; i++) {
        let color = range[i] || robj.color;
        let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
        let str = `[${col}] = '${domain[i]}'`;
        rules.push({
          filter: { value: str },
          ...style
        });
        typeArr.push(str);
      }
      if (other) {
        let color = range[range.length - 1] || robj.color;
        let style = polyOptA2S({ ...opt, strokeColor: color, fillColor: color });
        rules.push({
          "else_filter": true,
          ...style
        });
      }
      if (!rules.length) return;
      colType = "str";
    } else {
      if (active_layer_ids[0]) {
        style = polyOptA2S(actOpt);
        rules.push(style);
      } else {
        if (size(active_layer_ids)) {
          let ids: any = [];
          forEach(active_layer_ids, (t, id) => {
            ids.push(`[id] = ${id}`);
          });
          rules = [{
            filter: { value: ids.join(" or ") },
            ...polyOptA2S(actOpt)
          }, {
            elsefilter: true,
            ...polyOptA2S(opt)
          }];
        } else {
          style = polyOptA2S(opt);
          rules.push(style);
        }
      }
    }
    styles.push({ name: styleName, rules });

    if (cfg && col !== "__by_count__") {
      columns = [[col, colType]];
    }

    this._preShowColStyle(show_col, source, layers, styles, columns);

    let columnStr = map(columns, t => t.join(",")).join(",");

    let postBody = {
      srs: "bd09",
      columns: columnStr ? columnStr : undefined,
      map: { layers, styles }
    };
    return postBody;

  };

  /**
   * 获取样式准备 返回postbody
   * @param node 数据集{geometry_type: "point_to_point",object_type: "无锡人迹_娱乐-工作(测试)",packageId: 2062,source: "market"}
   * @param filter
   * @param geo_filter
   * @param from_to
   * @returns {{srs: string, actions: Array, columns: any, map: {layers: Array, styles: Array}}|*}
   * @private
   */
  _prepareStyle = (node, filter, geo_filter, from_to) => {
    let { object_type, geometry_type, source, packageId } = node;
    let columns: any = [], rules: any = [], layers: any = [], styles: any = [], actions: any = [], postBody;
    let { uid, style: robj, filters, cur_visual, hidden, hidden_to, hidden_from, show_col, size_visual } = filter;
    // 隐藏就不返回postbody
    if (hidden) return;
    if (hidden_to && hidden_from) {
      return;
    }
    // console.log('_prepareStyle:node', node)
    // console.log('_prepareStyle:filter', filter)
    // console.log('_prepareStyle:geo_filter', geo_filter)
    // 图层
    let styleName = `poly_style_${uid}`; // 使用的cards中的filter_uid
    let layerName = `poly_layer_${uid}`;// 使用的cards中的filter_uid

    // 各种可视化etc.
    let { col, type } = cur_visual || [];
    if (from_to && filter[`cur_visual_to`]) {
      type = filter[`cur_visual_to`].type;
      if (type === 6) { // 流向图
        filter[`cur_visual_to`].col = "extra.flow";
      }
      col = filter[`cur_visual_to`].col;
    }
    let cfg = filter["config_" + type];
    // console.log(cfg,'cfg')
    let link_points = false;
    if (cfg && cfg[col]) {
      cfg = cfg[col];
      let { visualize_type } = cfg;
      col = source === source_customer ? col : this._trimExtra(col, "extra.");

      if (col === "extra.__by_count__" || col === "__by_count__" || col === "flow") {
        col = undefined;
      }
      let colType = "";
      if (visualize_type === 1) { //数值分段
        let { domain, range } = cfg;
        domain = domain || [];
        if (domain.length > 1) {
          for (let i = 0; i < domain.length - 1; i++) {
            let style = this.getBaseStyle({ geometry_type, robj, color: range[i], filter, from_to });
            rules.push({
              filter: { value: `[${col}] >= ${domain[i]} and [${col}] < ${domain[i + 1]}` },
              ...style
            });
          }
        } else if (domain.length === 1) {
          let style = this.getBaseStyle({ geometry_type, robj, color: range[0], filter, from_to });
          rules = [style];
        }
        if (!rules.length) return;
        colType = "float";
        layers.push({
          name: layerName,
          stylename: styleName
        });
        styles.push({ name: styleName, rules });
      } else if (visualize_type === 2) { //类型可视化
        let { domain, range } = cfg;
        domain = domain || [];
        let other = domain[domain.length - 1] === "__other__";
        let types = other ? domain.slice(0, -1) : domain, typeArr: any = [];
        for (let i = 0; i <= types.length - 1; i++) {
          let style = this.getBaseStyle({ geometry_type, robj, color: range[i], filter, from_to });
          let str = `[${col}] = '${domain[i]}'`;
          rules.push({
            filter: { value: str },
            ...style
          });
          typeArr.push(str);
        }
        if (other) {
          let style = this.getBaseStyle({
            geometry_type,
            robj,
            color: range[range.length - 1],
            filter,
            from_to
          });
          rules.push({
            "else_filter": true,
            ...style
          });
        }
        if (!rules.length) return;
        colType = "str";
        layers.push({
          name: layerName,
          stylename: styleName
        });
        styles.push({ name: styleName, rules });
      } else if (visualize_type === 3) { //热力可视化
        colType = "float";
        let { module: { color, radius }, nature_breaks, use_custom } = cfg;
        let colors = map(color.value, t => t.v) || [];
        let breakOpt = {};
        //如果使用了自定义分段或非自然断点
        if (use_custom || !nature_breaks || !col) {
          //按点位自然断点功能暂无
          let breaks = map(color.value, t => t.k) || [];
          breaks = [...breaks, 0];
          breaks.reverse();
          breakOpt = {
            "breaks": breaks,
            "breaks_percentage": true
          };
        }
        actions.push({
          "action": "heat_map",
          "column_to_break": col,
          "colors": colors.reverse(),
          "scale": 0.025 * radius.value,
          ...breakOpt
        });
      } else if (visualize_type === 6) {
        link_points = true; // 是 流向图
        this._preShowLinkPointStyle({ config: cfg, layers, styles, columns, actions });
      } else {
        return;
      }
      if (cfg && col) {
        columns = [[col, colType]];
      }
    } else { // 如果没有可视化
      let style = this.getBaseStyle({ geometry_type, robj, filter, from_to });
      rules = [style];
      layers.push({
        name: layerName,
        stylename: styleName
      });
      styles.push({ name: styleName, rules });
    }
    // 多地理-点到点 基础版本
    if (geometry_type === geo_types.point_to_point) {
      const { hidden_to, hidden_from } = filter;
      let use_select = false;
      if (hidden_to && !hidden_from) { // 只有select
        use_select = true;
      } else if (!hidden_to && hidden_from) { // 只有display
        use_select = false;
      } else if (hidden_to && hidden_from) { // 全部隐藏
        return;
      } else if (!hidden_to && !hidden_from) { // 全部显示
        if (from_to === "from") use_select = true;
      }
      const mult_action = {
        "action": "multi_geometry",
        // if true, 使用筛选围栏样式, 并且展示筛选围栏样式
        "use_select": use_select,
        // 如果true,需要传入line的style
        "link_points": link_points
      };
      if (link_points) {
        delete mult_action.use_select;
      }
      actions.push(mult_action);
      // 如果生成流向图
      // if (link_points) {
      //     // 流向图配置等etc.
      //     this._preShowLinkPointStyle(source, layers, styles, columns)
      // }
    }
    // 展示字段
    this._preShowColStyle(show_col, source, layers, styles, columns);

    // 大小可视化
    this._preSizeVisualStyle(size_visual, actions, styles, columns, node);

    let columnStr = map(columns, t => t.join(",")).join(",");

    let fts = this.computeMapFilters(filters, source);
    if (size(fts)) {
      actions.push({
        "action": "filter",
        "filters": fts
      });
    }
    if (size(geo_filter)) {
      actions.push({
        // 地理筛选
        "action": "geometry_filter",
        ...geo_filter
      });
    }
    postBody = {
      srs: "bd09",
      actions: actions,
      columns: columnStr ? columnStr : undefined,
      map: { layers, styles }
    };
    // console.log('_prepareStyle:postBody',postBody, )
    return postBody;
  };

  /**
   * buffer_type:
   *  1: "buffer"
   *  2: "voronoi" 泰森多边形
   */
  _prepareBufferStyle = (node, buffer_type = buffer_types.buffer) => {
    let { card_id, filter_id, object_type, geometry_type, source, packageId, filters, geo_filter, distance } = node;
    let columns = [], rules: any = [], layers: any = [], styles:any = [], actions: any = [], postBody;
    console.log(node, buffer_type, "stylename");
    //图层
    let styleName = `${buffer_type}_style_${filter_id}`;
    let layerName = `${buffer_type}_layer_${filter_id}`;

    let fts = this.computeMapFilters(filters, source);
    if (size(fts)) {
      actions.push({
        "action": "filter",
        "filters": fts
      });
    }
    if (size(geo_filter)) {
      actions.push({
        // 地理筛选
        "action": "geometry_filter",
        ...geo_filter
      });
    }
    if (buffer_type == buffer_types.buffer) {
      actions.push({
        // 扩展n米
        "action": "buffer",
        "distance": distance
      });
    } else if (buffer_type == buffer_types.voronoi) {
      actions.push({
        // voronoi 泰森多边形
        "action": "voronoi",
        // 生成的地理类型, 支持polygons和lines
        "geometry": "polygons",
        // 将点buffer 1000米与voronoi计算交叉, 用于计算势力范围
        "buffer": distance
      });
    }

    let style = this.getBaseStyle({
      geometry_type: geo_types.polygon,
      robj: activeOpt,
      color: activeOpt.strokeColor
    });
    rules = [style];
    layers.push({
      name: layerName,
      stylename: styleName
    });
    styles.push({ name: styleName, rules });
    postBody = {
      srs: "bd09",
      actions: actions,
      map: { layers, styles }
    };
    return postBody;
  };

  /**
   * 流向图-style
   * @param config 流向图配置信息
   * @param layers
   * @param styles
   * @param columns
   * @private
   */
  _preShowLinkPointStyle = ({ config, layers, styles, columns, actions }) => {
    const col = "extra.flow";
    // console.log(config,'config---0--0----0')
    /**
     * breaksForColor 数值分段[0,3,6,9]
     * rangeForColor 颜色分段[rgb(0,0,255),rgb(),rgb(),...]
     * current_color_visual "extra.人数"
     * current_weight_visual 线宽可视化 字段"extra.人数"
     * colorType 0单色 1可视化
     * opacity 透明度
     * color_field_num 1数值 2字符
     * showDir 是否显示箭头 true显示  false不显示
     * color 线在单色情况下的颜色
     * line_width 线宽度
     * lWType 线宽类型 0固定宽度 1数值变化
     * weight_range 当lWType 为1 线宽范围
     */
    const { breaksForColor, rangeForColor, current_color_visual, current_weight_visual, colorType, opacity, color_field_num, showDir, line_width, color, lWType, weight_range } = config;
    let stroke_color = color || "#00e5ff";
    let stroke_width = line_width || 6;
    let stroke_opacity = opacity || 0.1;
    const filter: any = [];
    const lineStyleName = `line_flow`;
    console.log(config, layers, styles, columns, actions, "config, layers, styles, columns, actions stylename");
    layers.push({
      name: "line-lay",
      stylename: lineStyleName
    });
    const base_line: any = [];
    // 数值 可视化分段
    const sw: object = { "stroke_opacity": stroke_opacity };
    if (lWType == 0) {
      sw["stroke_width"] = stroke_width;
    } else {
      sw["stroke_width"] = "[_mapped_]";
    }
    if (colorType == 1 && color_field_num == 1) {
      const ccv = current_color_visual.replace(/extra\./g, "");
      breaksForColor.forEach((current, index, arr) => {
        if ((index + 1) == arr.length) {
          return;
        }
        filter.push(
          {
            "filter": {
              "value": `[${ccv}] >= ${breaksForColor[index]} and [${ccv}] <= ${breaksForColor[index + 1]}`
              // 'value': `[id] >= ${breaksForColor[index]} and [id] <= ${breaksForColor[index + 1]}`
            },
            "line": {
              "stroke": `${rangeForColor[index]}`,
              ...sw
            }
          }
        );
      });
      filter.push({
        "else_filter": true,
        "line": {
          "stroke_opacity": 0,
          "stroke": "white"
        }
      });
      let fd = find(columns, t => t[0] === ccv);
      if (!fd) {
        columns.push([ccv, "float"]);
      }
    } else {
      base_line.push(
        {
          "line": {
            "stroke": stroke_color, // 线的颜色
            "stroke_width": stroke_width, // 线的粗细
            "stroke_opacity": stroke_opacity // 线透明度
          }
        }
      );
    }
    if (lWType == 1) {
      const cwv = current_weight_visual.replace(/extra\./g, "");
      if (cwv) {
        actions.push({
          "action": "min_max_scaler",
          "column_for_domain": cwv,
          "domain_max": weight_range[1],
          "domain_min": weight_range[0],
          "overall": false
        });
        actions.push({
          "action": "filter",
          "filters": [{
            // where abc < 1
            // 支持 lt(<), gt(>), le(<=), ge(>=), eq(=), ne(!=), 数值只会取values的第一个, 支持输入数值(20180101, "20180101")或日期("2018-01-01")
            "column": cwv,
            "operator": "not_empty"
          }]
        });
      }
    }
    const marker = [];
    // 箭头样式 等
    if (showDir) {
      const stylename = `marker_flow_arrow`;
      layers.push({
        name: "marker-lay",
        stylename: stylename
      });
      styles.push({
        name: stylename,
        rules: [{
          "marker": {
            "file": "triangle-15.svg",
            "transform": {
              "rotate": [90]
            },
            "placement": "line",// 'point', 'interior', 'line', 'vertex-last', 'vertex-first'
            "width": stroke_width < 6 ? 6 : stroke_width,
            "fill": "white"
          }
        }]
      });
    }
    // 配置流向图线样式
    styles.push({
      name: lineStyleName,
      rules: [
        ...base_line,
        ...marker,
        ...filter
      ]
    });
  };

  /**
   * 字段显示-style
   * @param {*} show_col
   * @param {*} source
   * @param {*} layers
   * @param {*} styles
   * @param {*} columns
   * @private
   */
  _preShowColStyle = (show_col, source, layers, styles, columns) => {
    if (show_col) {
      const text_stylename = `text_style`;
      let col = source === source_customer ? ((unusedCols.indexOf(show_col) !== -1 || show_col === "name") ? show_col : "extra." + show_col) : show_col;
      layers.push({
        name: "text_layer",
        stylename: text_stylename
      });
      styles.push({
        name: text_stylename,
        rules: [
          {
            "text": {
              "fill": "#fff",
              "name": `[${col}]`,
              "face_name": "Microsoft YaHei Regular",
              "dy": -10,
              "avoid_edges": true,
              "size": 12
            }
          }
        ]
      });
      let fd = find(columns, t => t[0] === col);
      if (!fd) {
        columns.push([col, "str"]);
      }
    }
  };

  /** TODO: size_visual 大小可视化样式问题
   * @param {*} size_visual
   * @param {*} actions
   * @param {*} styles
   * @param {*} columns
   */
  _preSizeVisualStyle = (size_visual, actions, styles, columns, node) => {
    if (size_visual && size_visual.size_range) {
      // console.log(this.state,'state')
      // console.log(size_visual, 'size_visual')
      // console.log(styles, 'styles')
      // console.log(columns, 'columns')
      const isMarket = node.source == "market";
      actions.push({
        "action": "min_max_scaler",
        "column_for_domain": isMarket ? `${size_visual.key}` : `extra.${size_visual.key}`,
        "domain_max": size_visual.size_range[1],
        "domain_min": size_visual.size_range[0],
        "overall": false
      });
      if (styles && styles[0] && styles[0].rules && styles[0].rules[0] && styles[0].rules[0].marker) {
        styles[0].rules = map(styles[0].rules, (c) => {
          c.marker.width = "[_mapped_]";
          return c;
        });
      }
      let fd = find(columns, t => t[0] === size_visual.key);
      if (!fd) {
        columns.push([isMarket ? `${size_visual.key}` : `extra.${size_visual.key}`, size_visual.db]);
      }
    }
  };

  //地图服务器准备样式的filter
  computeMapFilters = (filters, source) => {
    let flts: any = [];
    map(filters, r => {
      let col = r.key;
      if (unusedCols.indexOf(r.key) === -1 && source == source_customer) {
        if (r.key === "name") { // 不在extra内
          col = r.key;
        } else {
          col = "extra." + r.key;
        }
      }
      if (r.h_type === h_type_text) {
        flts.push({
          "column": col,
          "operator": "equal",
          "values": r.list || []
        });
      } else if (r.h_type === h_type_number) {
        let { min, max } = r;
        if (min && max) {
          flts.push({
            "column": col,
            "operator": "between",
            "values": [min, max]
          });
        } else if (min) {
          flts.push({
            "column": col,
            "operator": "ge",
            "values": [min]
          });
        } else if (max) {
          flts.push({
            "column": col,
            "operator": "lt",
            "values": [max]
          });
        }
      } else if (r.h_type === h_type_date) {
        let { start, end, fast_type, end_is_today } = r;
        if (fast_type) {
          flts.push({
            "column": col,
            "operator": "fast_date_between",
            "values": [fast_type]
          });
        } else if (end_is_today) {
          flts.push({
            "column": col,
            "operator": "fast_date_between",
            "values": [start, "end_is_today"]
          });
        } else if (start) {
          flts.push({
            "column": col,
            "operator": "between",
            "values": [start, end]
          });
        }
      }
    });
    return flts;
  };

  //查询数据 datamap的filter
  computeFilters = (filter) => {
    let flts = map(filter.filters, r => {
      if (r.h_type === h_type_text) {
        return [r.key, r.h_type, r.list];
      } else if (r.h_type === h_type_number) {
        let { min, max } = r;
        return [r.key, r.h_type, [min === undefined ? null : min, max === undefined ? null : max]];
      } else if (r.h_type === h_type_date) {
        let { start, end, fast_type, end_is_today } = r;
        return [r.key, r.h_type, { start, end: end_is_today ? undefined : end, fast_type, end_is_today }];
      }
    });
    return flts;
  };
};
export default PreStyleMixin;
