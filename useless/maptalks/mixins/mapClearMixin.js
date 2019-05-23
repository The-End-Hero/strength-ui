import * as maptalks from "maptalks";
import { bmapStyles } from "../../../utils/mapstyle";
import forEach from "lodash/forEach";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import size from "lodash/size";
import map from "lodash/map";
import filter from "lodash/filter";
import startsWith from "lodash/startsWith";
import sortBy from "lodash/sortBy";
import queryUrl from "../../../utils/queryUrl";
import axios from "../../../utils/axiosUtil";
import {
  self_select, dis_select, fence_select, source_market, source_customer,
  h_type_number, h_type_text, h_type_date, PolygonSourceKey, PolygonPackageIdKey,
  staticOpt
} from "../../../constants/constants";
import bmapUtil from "../../../utils/bmapUtil";

const { polyOptA2M } = bmapUtil;
const MAP_TOOL_REF = "MAP_TOOL_REF";
const uuidv1 = require("uuid/v1");
const headers = {
  "Accept": "application/json", "Content-Type": "application/json",
  Authorization: "4683f5cc-1b44-43b6-8532-e14808f5f42a"
};


const model_api_url = "http://debug-www.maicedata.com/datamap/";
const map_api_url = "http://debug-www.maicedata.com/map/";
const PreStyle = superclass => class PreStyle extends superclass {
  // 删除 各种layers
  removeBgLayer = () => {
    this.layer && this.layer.remove();
    this.layer = null;
  };

  removeBgActiveLayer = () => {
    this.activeLayer && this.activeLayer.remove();
    this.activeLayer = null;
  };

  removeAllBgLayer = () => {
    this.removeBgLayer();
    this.removeBgActiveLayer();
  };

  
  renderMap = () => {
    // console.log('renderMap');
    this.init = true;
    // this.map = this.getMapInstance();
    let map_info = this.props.data ? this.props.data.extra.map_info : this.props.map_info;
    let center = new maptalks.Coordinate(map_info.location.split(","));
    this.map && this.map.setView({ zoom: map_info.zoom, center: center });
    let { cards, current_geo_filter: geo_filter, supp_filters, init_type } = this.state;
    let fence_geos = [], self_select_geos = [], dis_select_geos = [];
    forEach(cards, c => {
      if (c.geo_filters) {
        if (c.geo_filters.type === self_select) {
          self_select_geos.push(c.geo_filters.geoJson);
        } else if (c.geo_filters.type === dis_select) {
          dis_select_geos.push(c.geo_filters.circles);
        } else if (c.geo_filters.type === fence_select) {
          fence_geos.push(c);
        }
      }
      forEach(c.items, t => {
        this["render_style_" + t.geometry_type] = size(t.filters);
      });
    });
    if (size(this.buffer_filters)) {
      this.addBufferGeos(this.buffer_filters);
    } else {
      if (size(self_select_geos)) {
        this.addSelfGeo(self_select_geos);
        this.setState({ hasCustomDraw: true });
      }
      if (size(dis_select_geos)) {
        this.addCircleGeo(dis_select_geos);
        this.setState({ hasCustomDraw: true });
      }
    }

    setTimeout(() => {
      if (this.isUnmount) return;
      let mapIns = this.getMapPanelInstance ? this.getMapPanelInstance() : this.refs.mappanel;
      if (mapIns && mapIns.getMapRef) {
        mapIns.getMapRef().selectMapStyle(this.state.map_style);
      } else {
        mapIns && mapIns.selectMapStyle(this.state.map_style);
      }
      if (size(geo_filter) > 2) {
        this.fetchFenceGeo(() => {
          init_type && this.fetchData();
          mapIns && !init_type && mapIns.setMapBlocking(false);
        });
      } else {
        init_type && this.fetchData();
        mapIns && !init_type && mapIns.setMapBlocking(false);
      }
      this.getColumnTypes();
    }, 0);
  };

  //渲染静态卡片数据
  renderStaticCardsToMap = async () => {
    //this.map = this.getMapInstance();
    let { cards, supp_filters, static_cards } = this.state;
    let fence_geos = [],//围栏选择
      self_select_geos = [], //自助选择
      dis_select_geos = []; //距离选择
    static_cards = filter(static_cards, (current) => {
      if (!this.existStaticCards[current.uid]) {
        return true;
      }
    });

    forEach(static_cards, c => {//静态卡片需要知道card的uid
      if (c.geo_filters) {
        if (c.geo_filters.type == self_select) {
          self_select_geos.push({ uid: c.uid, data: c.geo_filters.geoJson });
        } else if (c.geo_filters.type == dis_select) {
          dis_select_geos.push({ uid: c.uid, data: c.geo_filters.circles });
        } else if (c.geo_filters.type == fence_select) {
          fence_geos.push(c);
        }
      }
      forEach(c.items, t => {
        this["render_style_" + t.geometry_type] = size(t.filters);
      });
    });

    if (size(this.buffer_filters)) {
      this.addBufferGeos(this.buffer_filters);
    } else {
      if (size(self_select_geos)) {
        this.addSelfGeo(self_select_geos, "static");
      }
      if (size(dis_select_geos)) {
        this.addCircleGeo(dis_select_geos, "static");
      }
    }

    for (let index = 0; index < static_cards.length; index++) {
      let current = static_cards[index];
      let geo_filter = current.geo_filters;
      if (geo_filter.type == 4) {// 围栏选择
        await this.fetchFenceGeoForStaticCards(current, index);
      }
    }
    await this.fetchDataForStaticCards();

    static_cards.map((current) => { // 将static_cards存到existStaticCards里，避免多次渲染
      if (current.uid) {
        this.existStaticCards[current.uid] = true;
      }
    });
  };

  //todo: buffer
  addBufferGeos = async () => {
    let pss = [], pssMap = {};
    forEach(this.buffer_filters, (bf, idx) => {
      pss.push(this.postBufferToMap(bf));
      pssMap[idx] = { filter_id: bf.filter_id };
    });
    let resp;
    try {
      resp = await Promise.all(pss);
      console.log(resp);
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
    }
    let respValid = filter(resp, t => !!(t && t.box2d));
    let layers = [];
    forEach(resp, (r, idx) => {
      if (r && r.box2d) {
        let { filter_id } = pssMap[idx];
        //删除图层
        this.buffer_layers = this.buffer_layers || {};
        let layer_id = "buffer_" + filter_id;
        let layer = this.buffer_layers[layer_id];
        layer && this.map && this.map.removeLayer(layer);
        layer = this._getMapTile({ style_id: r.style, layer_id });
        layers.push(layer);
        this.buffer_layers[layer_id] = layer;
      }
    });
    this.map && this.map.addLayer(layers);
  };

  addSelfGeo = (geos, type) => {
    let opt = polyOptA2M(activeOpt);
    if (type === "static") {// 如果来源于静态卡片
      opt = polyOptA2M(staticOpt);
      // 针对静态卡片的自定义图形渲染
      this.drawpolygonByStaticCards = this.drawpolygonByStaticCards || {};
    } else {
      this.drawpolygon = this.drawpolygon || {};
    }

    let layers = [];
    forEach(geos, geo => {
      let shape, uid;
      if (type === "static") {
        shape = addPolygon({ geometry: geo.data }, opt);
        uid = geo.uid;
      } else {
        shape = addPolygon({ geometry: geo }, opt);
        uid = "poly_" + uuidv1();
      }
      shape.setProperties({ uid });
      shape.on("rightclick", this.onShapeRightClick);
      layers.push(shape);
      if (type === "static") {// 如果来源于静态卡片
        this.drawpolygonByStaticCards[uid] = shape;
      } else {
        this.drawpolygon[uid] = shape;
      }
    });
    this.vector_layer.addGeometry(layers);
    this.intMapTools();
  };

  addCircleGeo = (geos, type) => {
    let opt = polyOptA2M(activeOpt);
    if (type === "static") {// 如果来源于静态卡片
      opt = polyOptA2M(staticOpt);
      // 针对静态卡片的自定义图形渲染
      this.drawpolygonByStaticCards = this.drawpolygonByStaticCards || {};
    } else {
      this.drawpolygon = this.drawpolygon || {};
    }
    let layers = [];
    forEach(geos, geo => {
      // console.log(geos,'addCircleGeo')
      if (type === "static") {// 如果来源于静态卡片
        const current = geo.data;
        forEach(current, circle => {
          let [lng, lat, dis] = circle;
          let ps = wgs84tobd09(lng, lat);
          let layer = new maptalks.Circle([ps.lng, ps.lat], dis, opt);
          let uid = geo.uid;
          layer.setProperties({ uid });
          layer.on("rightclick", this.onShapeRightClick);
          layers.push(layer);
          this.drawpolygonByStaticCards[uid] = layer;
        });
      } else {
        forEach(geo, circle => {
          let [lng, lat, dis] = circle;
          let ps = wgs84tobd09(lng, lat);
          let layer = new maptalks.Circle([ps.lng, ps.lat], dis, opt);
          let uid = "poly_" + uuidv1();
          layer.setProperties({ uid });
          layer.on("rightclick", this.onShapeRightClick);
          layers.push(layer);
          this.drawpolygon[uid] = layer;
        });
      }
    });
    this.vector_layer.addGeometry(layers);
    this.intMapTools();
  };

  getColumnTypes = () => {
    let { supp_filters, geo_filter } = this.state;
    let pss = [];
    forEach(supp_filters, supp => {
      pss.push(this.fetchDataColumnTypePromise({
        source: supp.source, packageId: supp.packageId,
        geo_type: supp.geometry_type, object_type: supp.object_type
      }));
    });
    if (size(geo_filter) >= 2) {
      pss.push(this.fetchDataColumnTypePromise({
        source: geo_filter.source, packageId: geo_filter.packageId,
        geo_type: geo_filter.geometry_type, object_type: geo_filter.object_type
      }));
    }
    Promise.all(pss).then(infos => {
      if (this.isUnmount) return;
      let { columnTypes } = this.state;
      forEach(infos, (rs, idx) => {
        if (!rs || !rs.resp) return true;
        let { args: { object_type, geo_type: geometry_type, source, packageId } } = rs;
        let { columns, types } = rs.resp;
        columnTypes[source] = columnTypes[source] || {};
        columnTypes[source][packageId] = columnTypes[source][packageId] || {};
        columnTypes[source][packageId][geometry_type] = columnTypes[source][packageId][geometry_type] || {};
        columnTypes[source][packageId][geometry_type][object_type] = [];
        forEach(columns, (col, index) => {
          if (indexOf(unusedCols, col) == -1) {
            let db = types[index], h_type = "";
            if (db === "int" || db === "float") {
              h_type = h_type_number;
            } else if (db === "str") {
              h_type = h_type_text;
            } else {
              h_type = db;
            }
            columnTypes[source][packageId][geometry_type][object_type].push({
              h_value: col,
              h_type,
              db,
              key: col
            });
          }
        });
      });
      this.setState({ columnTypes });
    }).catch(err => {
      console.error(err);
    });
  };

  fetchDataColumnTypePromise = (args) => {
    return new Promise((resolve) => {
      return this.fetchDataColumnType(args).then((resp) => {
        resolve && resolve({ args, resp });
      }).catch(() => {
        resolve && resolve();
      });
    });
  };

  fetchFenceGeo = async (callback) => {
    let { current_geo_filter: geo_filter, current_geo_filter, cards, mapState } = this.state;
    let { object_type, geometry_type, filters, source, packageId } = geo_filter;
    source = source || source_customer;
    packageId = packageId || "";
    let resp;
    try {
      resp = await this.fetchCustomerDataPromise(geo_filter);
    } catch (error) {
      console.log(error);
      return;
    }

    if (!resp) {
      callback && callback();
      return;
    }

    let { bgPolygonData } = this.state;
    let data = resp;
    forEach(data, t => {
      t.object_type = object_type;
      t[PolygonSourceKey] = source;
      t[PolygonPackageIdKey] = packageId;
    });
    if (!filters) {
      geo_filter.filters = [{
        uid: "filter_" + uuidv1(),
        style: {
          ...this.getRenderStyle(geometry_type),
          color: normalOpt.fillColor, fillOpacity: normalOpt.fillOpacity
        },
        data
      }];
    } else {
      geo_filter.filters[0].data = data;
    }
    bgPolygonData[source] = bgPolygonData[source] || {};
    bgPolygonData[source][packageId] = bgPolygonData[source][packageId] || {};
    bgPolygonData[source][packageId][object_type] = data;
    // console.log(bgPolygonData, 'bgPolygonData')
    if (cards[0] && cards[0].geo_filters) {
      let { type } = cards[0].geo_filters;
      if (mapState == fence_select) {
        // alert(1)
        // console.log(source, packageId, object_type, data,'source, packageId, object_type, data')
        await this.addBgPolygon({ source, packageId, object_type, geometry_type, fitView: true });
        await this.updateActiveBgPolygon(source, packageId, object_type);
      }
    }
    await this.setState({ bgPolygonData });
    callback && callback();
  };

  fetchFenceGeoForStaticCards = async (current, index) => { //error
    let geo_filters = current.geo_filters;
    let { object_type, geometry_type, filters, source, packageId } = geo_filters;
    source = source || source_customer;
    packageId = packageId || "";
    let resp;
    try {
      resp = await this.fetchCustomerDataPromise(geo_filters);
    } catch (error) {
      console.log(error);
      return;
    }
    if (!resp) return;
    let { bgPolygonDataByStaticCards } = this.state;
    let data = resp;
    forEach(data, t => {
      t.object_type = object_type;
      t[PolygonSourceKey] = source;
      t[PolygonPackageIdKey] = packageId;
    });
    if (!filters) {
      current.geo_filters.filters = [{
        uid: "filter_" + uuidv1(),
        style: {
          ...this.getRenderStyle(geometry_type),
          color: normalOpt.fillColor, fillOpacity: normalOpt.fillOpacity
        },
        data
      }];
    }
    bgPolygonDataByStaticCards[source] = bgPolygonDataByStaticCards[source] || {};
    bgPolygonDataByStaticCards[source][packageId] = bgPolygonDataByStaticCards[source][packageId] || {};
    bgPolygonDataByStaticCards[source][packageId][object_type] = data;
    if (current && current.geo_filters) {
      let { type } = current.geo_filters;
      if (type == fence_select) {
        //CenterPanel3.js
        await this.addBgPolygonByStaticCards(source, packageId, object_type, index, current);
      }
    }
    await this.setState({ bgPolygonDataByStaticCards });
  };

  fetchCustomerDataPromise = ({ object_type, geo_type, geometry_type, source, packageId }) => {
    // console.log({ object_type, geo_type, geometry_type, source, packageId }, 'fetchCustomerDataPromise')
    let params = {
      geo_type: geometry_type ? (geometry_type || "polygon") : (geo_type || "polygon"),
      check_geometry: false
    };
    let postdata = JSON.stringify({ object_types: [object_type] });
    // return new Promise((resolve, reject) => {
    //   let ps = source != source_market ?
    //     fetchUtil(queryUrl(`${model_api_url}upload/query`, params), { method: "POST", body: postdata, headers })
    //     : fetchUtil(queryUrl(`${model_api_url}data/market/geometry/${packageId}`));


    return new Promise((resolve, reject) => {
      let ps = source != source_market ?
        axios({
          method: "POST",
          url: queryUrl(`${model_api_url}upload/query`, params),
          data: postdata,
          headers
        })
        : axios({
          url: queryUrl(`${model_api_url}data/market/geometry/${packageId}`),
          headers
        });
      return ps.then(resp => {
        if (resp && resp.result) {
          resolve && resolve(resp.result);
        } else {
          resolve && resolve();
        }
      }).catch(err => {
        console.error(err);
        resolve && resolve();
      });
    });
  };

  isEqualGeoFilter = (a, b) => {
    a = a || {};
    b = b || {};
    let a_geo_type = a.geo_type || a.geometry_type;
    let b_geo_type = b.geo_type || b.geometry_type;
    let a_packageId = a.packageId || "";
    let b_packageId = b.packageId || "";
    let a_source = a.source || source_customer;
    let b_source = b.source || source_customer;
    let a_object_type = this.replaceMarketTip(a_source, a.object_type);
    let b_object_type = this.replaceMarketTip(b_source, b.object_type);
    return (a_geo_type == b_geo_type) && (a_object_type == b_object_type)
      && (a_source == b_source) && (a_packageId == b_packageId);
  };

  replaceMarketTip = (source, object_type) => {
    if (source === source_market) {
      object_type = object_type || "";
      let lastIndex = object_type.lastIndexOf(market_label_tip);
      if (lastIndex == -1) return object_type;
      let len = market_label_tip.length;
      let a_arr = object_type.split("");
      a_arr.splice(lastIndex, len, "");
      a_arr.join("");
      object_type = a_arr.join("");
    }
    return object_type;
  };

  removeStaticBgLayer = (card_id) => {
    let layer = this.staticLayers[card_id];
    layer && layer.remove && layer.remove();
    delete this.staticLayers[card_id];
  };

  //添加背景围栏
  addBgPolygon = async ({ source, packageId, object_type, fitView = true, geometry_type }) => {
    //删除图层
    this.removeAllBgLayer();
    await this.updateBgPolygon(source, packageId, object_type, fitView, geometry_type);
  };

  //添加静态卡片背景围栏
  addBgPolygonByStaticCards = async (source, packageId, object_type, index, current) => {
    // console.log(source, packageId, object_type, current.geo_filters, index, current);
    //删除static图层
    this.removeStaticBgLayer(current.uid);
    await this.updateStaticBgPolygon(source, packageId, object_type, index, current);
  };

  /**
   * 更新背景围栏
   * @param source
   * @param packageId
   * @param object_type
   * @param fitView
   * @returns {Promise<void>}
   */
  updateBgPolygon = async (source, packageId, object_type, fitView = false, geometry_type) => {
    // console.log('updateBgPolygon0-10-1')
    if (!this.map) return;
    if (!source && !object_type && !packageId) {
      let { current_geo_filter } = this.state;
      object_type = current_geo_filter.object_type;
      packageId = current_geo_filter.packageId;
      source = current_geo_filter.source;
    }
    this.removeBgLayer();
    source = source || source_customer;
    packageId = packageId || "";
    let node = { source, packageId, object_type, geometry_type: geometry_type || geo_types.polygon };
    let resp;
    try {
      resp = await this.postBgStyleToMap(node);
      console.log("resp:", resp);
      if (!resp) return;
      if (resp.rc) {
        let msg = resp.response && resp.response.error || resp.Msg || "请求出错";
        alertUtil.alertMsg(msg);
        return;
      }
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
      return;
    }
    let layer = this._getMapTile({ style_id: resp.style, layer_id: null, zIndex: BG_LAYER_ZINDEX });
    layer.addTo(this.map);
    // fitView && this.map.fitExtent(resp.box2d);
    this.layer = layer;
  };

  /**
   * 更新静态卡片背景围栏
   * @param source
   * @param packageId
   * @param object_type
   * @param index
   * @param current
   * @returns {Promise<void>}
   */
  updateStaticBgPolygon = async (source, packageId, object_type, index, current) => {
    if (!this.map) return;
    source = source || source_customer;
    packageId = packageId || "";
    let node = { source, packageId, object_type, geometry_type: geo_types.polygon };
    let resp;
    try {
      resp = await this.postStaticBgStyleToMap(node, current);
      console.log("resp:", resp);
      if (!resp) return;
      if (resp.rc) {
        alertUtil.alertMsg(resp.Msg || "暂无数据");
        return;
      }
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
      return;
    }
    let layer = this._getMapTile({ style_id: resp.style, layer_id: null, zIndex: BG_LAYER_ZINDEX });
    layer.addTo(this.map);
    // fitView && this.map.fitExtent(resp.box2d);
    this.staticLayers = this.staticLayers || {};
    this.staticLayers[current.uid] = layer;
  };

  //请求静态瓦片样式id
  /**
   * 请求背景围栏
   * @param node
   * @returns {*}
   */
  postBgStyleToMap = (node) => {
    let { source, packageId, object_type, geometry_type } = node;
    let body = this._prepareBgStyle(node);
    if (!body) return;
    let params = {};
    if (source == source_customer) {
      params = { geo_type: geometry_type };
    }
    return this._postStyleToMap(node, params, body);
  };

  /**
   * 请求静态卡片背景围栏
   * @param node
   * @param current
   * @returns {*}
   */
  postStaticBgStyleToMap = (node, current) => {
    let { source, packageId, object_type, geometry_type } = node;
    let body = this._prepareStaticBgStyle(node, current);
    if (!body) return;
    let params = {};
    if (source == source_customer) {
      params = { geo_type: geometry_type };
    }
    return this._postStyleToMap(node, params, body);
  };

  _trimExtra = (str, trimStr) => {
    return startsWith(str, trimStr) ? str.slice(trimStr.length) : str;
  };

  /**
   * postgis 数据请求
   * @param object_type 私有数据为数据名称,数据市场为包ID
   * @param packageId 包ID
   * @param geometry_type
   * @param source 私有数据/数据市场
   * @param params
   * @param body postgis请求body
   * @private
   */
  _postStyleToMap = ({ object_type, packageId, geometry_type, source }, params, body) => {
    object_type = source == source_customer ? object_type : packageId;
    if (!object_type) return;
    // return fetchUtil(queryUrl(`${map_api_url}${source}/${encodeURIComponent(object_type)}/postgis`, params), {
    //   method: "POST",
    //   body: JSON.stringify(body),
    //   headers
    // });

    return axios({
      method: "POST",
      url: queryUrl(`${map_api_url}${source}/${encodeURIComponent(object_type)}/postgis`, params),
      data: body,
      headers
    });
  };

  /**
   * 添加图层
   * @param style_id filter的uid
   * @param layer_id 之前接口返回的id值
   * @param zIndex 层级
   * @private
   */
  _getMapTile = ({ style_id, layer_id, zIndex }) => {
    let tile_layer_id = "boudaries_" + (layer_id || uuidv1());
    return new maptalks.TileLayer(tile_layer_id, {
      urlTemplate: `${map_api_url}${style_id}/{x}/{y}/{z}.png?srs=bd09`,
      // urlTemplate: `${map_api_url}${style_id}/{x}/{y}/{z}.png?srs=wgs84`,
      // urlTemplate: `${map_api_url}${style_id}/{x}/{y}/{z}.png?srs=gcj02`,
      background: true,
      backgroundZoomDiff: 1,
      zIndex: zIndex || 0
    });
  };

  getTileLayer = (layer_id) => {
    return this.map && this.map.getLayer("boudaries_" + layer_id);
  };

  // 清空地图
  clearMap = (withBuffer = true) => {
    this.clearOverlays();// 清空自定义绘制
    this.clearCardsLayers();
    this.removeAllBgLayer();
    withBuffer && this.clearBuffer();
    this.clearVoronoi(); //清空泰森多边形
  };

  clearBuffer = () => {
    let mapIns = this.map;
    forEach(this.buffer_layers, (c, card_id) => {
      mapIns.removeLayer(c);
    });
    this.buffer_filters = [];
    this.buffer_layers = {};
  };

  clearVoronoi = () => {
    let mapIns = this.map;
    forEach(this.voronoi_layers, (c, cid) => {
      forEach(c, (layer, filter_id) => {
        layer && mapIns && this.map.removeLayer(layer);
      });
    });
    this.voronoi_filters = [];
    this.voronoi_layers = {};
  };

  getDataColumnType = async (args) => {
    let resp;
    try {
      resp = await this.fetchDataColumnType(args);
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
      return;
    }
    if (!(resp && !resp.rc)) {
      alertUtil.alertMsg(resp.Msg || "暂无数据");
      return;
    }
    let { object_type, geo_type, source, packageId, geometry_type } = args;
    let { columns, types } = resp;
    let { columnTypes } = this.state;
    source = source || source_customer;
    packageId = packageId || "";
    geo_type = geo_type || geometry_type;
    columnTypes[source] = columnTypes[source] || {};
    columnTypes[source][packageId] = columnTypes[source][packageId] || {};
    columnTypes[source][packageId][geo_type] = columnTypes[source][packageId][geo_type] || {};
    columnTypes[source][packageId][geo_type][object_type] = [];
    forEach(columns, (col, index) => {
      if (indexOf(unusedCols, col) == -1) {
        let db = types[index], h_type = "";
        if (db === "int" || db === "float" || db === "bigint") {
          h_type = h_type_number; // 数字型
        } else if (db === "str" || db === "bool") {
          h_type = h_type_text; // 文本型
        } else if (db === "date" || db === "time" || db === "datetime") {
          h_type = h_type_date; // 日期型
        } else {// 其他
          h_type = db;
        }
        columnTypes[source][packageId][geo_type][object_type].push({
          h_value: col,
          h_type,
          db,
          key: col
        });
      }
    });
    this.setState({ columnTypes });
  };

  fetchDataColumnType = ({ object_type, geo_type, source, packageId, geometry_type }) => {
    source = source || source_customer;
    packageId = packageId || "";
    let params = {
      geometry_type: geo_type || geometry_type,
      offset: 0,
      limit: 0
    };
    if (source === source_market) {
      object_type = packageId || 0;
    }
    // return fetchUtil(queryUrl(`${model_api_url}graph/sample/${source}/${encodeURIComponent(object_type)}`, params));//返回目标数据集的样例  只能查看该用户有权限的数据
    return axios(
      {
        method: "get",
        headers,
        url: queryUrl(`${model_api_url}graph/sample/${source}/${encodeURIComponent(object_type)}`, params)
      }
    );//返回目标数据集的样例  只能查看该用户有权限的数据
  };

  checkCards = (cards, geo_filter) => {
    if (!size(cards)) { // 如果有cards, 即筛选条件等
      geo_filter = geo_filter || this.state.current_geo_filter;//this.state.geo_filter;
      if (!size(geo_filter)) return [{
        uid: "card_" + uuidv1(),
        geo_filters: null,
        items: []
      }];
      let { object_type, geometry_type, source, packageId } = geo_filter;
      source = source || source_customer;
      if (!this.layer) {
        this.addBgPolygon({ source, packageId, geometry_type, object_type });
      }
      cards.push({
        uid: "card_" + uuidv1(),
        geo_filters: object_type ? {
          type: fence_select,
          object_type,
          source,
          packageId,
          filters: []
        } : null,
        items: []
      });
    }
    return cards;
  };

  /**
   * 返回card_id的card, 返回对应filter_id的item, 返回对应filter_id的item里面的filter
   * @param cards
   * @param card_id
   * @param filter_id
   * @returns {*[]} [返回card_id的card, 返回对应filter_id的item, 返回对应filter_id的item里面的filter]
   */
  findCardAndFilter = (cards, card_id, filter_id) => {
    let card = find(cards, c => c.uid == card_id) || {};
    let fdFilter = {};
    let fdItem = find(card.items, t => {
      let tmp = t && find(t.filters, f => f.uid == filter_id);
      if (tmp) {
        fdFilter = tmp;
        return true;
      } else {
        return false;
      }
    }) || {};
    return [card, fdItem, fdFilter];
  };

  /**
   * 仅对cards的清空Layer
   * @param id
   */
  removeDataOnMapCard = (card_id) => {
    forEach(this.poiLayers[card_id], (layer, filter_id) => {
      layer && layer.remove();
      delete this.poiLayers[card_id][filter_id];
    });
    forEach(this.polygonLayers[card_id], (layer, filter_id) => {
      layer && layer.remove();
      delete this.polygonLayers[card_id][filter_id];
    });
    forEach(this.lineLayers[card_id], (layer, filter_id) => {
      layer && layer.remove();
      delete this.lineLayers[card_id][filter_id];
    });
    // 全部
    forEach(this.poiToPoiLayers[card_id], (v, filter_id) => {
      forEach(v, (layer, from_to) => {
        layer && layer.remove();
        delete this.poiToPoiLayers[card_id][filter_id][from_to];
      });
    });
  };

  removeDataOnMapFilter = (card_id, filter_id) => {
    if (this.poiLayers[card_id]) {
      let layer = this.poiLayers[card_id][filter_id];
      layer && layer.remove();
      delete this.poiLayers[card_id][filter_id];
    }
    if (this.polygonLayers[card_id]) {
      let layer = this.polygonLayers[card_id][filter_id];
      layer && layer.remove();
      delete this.polygonLayers[card_id][filter_id];
    }
    if (this.lineLayers[card_id]) {
      let layer = this.lineLayers[card_id][filter_id];
      layer && layer.remove();
      delete this.lineLayers[card_id][filter_id];
    }
    // 全部
    if (this.poiToPoiLayers[card_id] && this.poiToPoiLayers[card_id][filter_id]) {
      let layer_to = this.poiToPoiLayers[card_id][filter_id]["to"];
      let layer_from = this.poiToPoiLayers[card_id][filter_id]["from"];
      let layer_flow = this.poiToPoiLayers[card_id][filter_id]["flow"];
      layer_to && layer_to.remove();
      layer_from && layer_from.remove();
      layer_flow && layer_flow.remove();
      delete this.poiToPoiLayers[card_id][filter_id]["to"];
      delete this.poiToPoiLayers[card_id][filter_id]["from"];
      delete this.poiToPoiLayers[card_id][filter_id]["flow"];
    }
    //删除图层层级记录
    if (this.layerIndex[card_id]) {
      delete this.layerIndex[card_id][filter_id];
    }
  };

  clearCardsLayers = () => {
    let { static_cards, cards } = this.state;
    forEach(this.poiLayers, (l, card_id) => {
      forEach(l, (layer, filter_id) => {
        let [card] = this.findCardAndFilter(cards, card_id, filter_id);
        if (size(card)) {
          layer && layer.remove();
          delete this.poiLayers[card_id][filter_id];
        }
      });
    });
    forEach(this.polygonLayers, (l, card_id) => {
      forEach(l, (layer, filter_id) => {
        let [card] = this.findCardAndFilter(cards, card_id, filter_id);
        if (size(card)) {
          layer && layer.remove();
          delete this.polygonLayers[card_id][filter_id];
        }
      });
    });
    forEach(this.lineLayers, (l, card_id) => {
      forEach(l, (layer, filter_id) => {
        let [card] = this.findCardAndFilter(cards, card_id, filter_id);
        if (size(card)) {
          layer && layer.remove();
          delete this.lineLayers[card_id][filter_id];
        }
      });
    });

    // console.log(this.poiToPoiLayers,'this.poiToPoiLayers')
    forEach(this.poiToPoiLayers, (l, card_id) => {
      forEach(l, (v, filter_id) => {
        let [card] = this.findCardAndFilter(cards, card_id, filter_id);
        if (size(card)) {
          // console.log(v,'v_00019001900190100')
          forEach(v, (layer, from_to) => {
            // console.log(from_to,'from_to')
            // console.log(layer,'layer')
            layer && layer.remove();
            delete this.poiToPoiLayers[card_id][filter_id]["to"];
            delete this.poiToPoiLayers[card_id][filter_id]["from"];
            delete this.poiToPoiLayers[card_id][filter_id]["flow"];
            // console.log(cloneDeep(this.poiToPoiLayers),'this.poiToPoiLayers')
          });
        }
      });
    });
    // this.map && console.log(this.map.getLayers(),'this.map.layers')
    // forEach(this.poiToPoiLayers, (l, card_id) => {
    //     forEach(l, (v, filter_id) => {
    //         let [card] = this.findCardAndFilter(cards, card_id, filter_id)
    //         if (!size(card)) {
    //             forEach(v, (layer, from_to) => {
    //                 console.log(from_to,'from_to')
    //                 layer && layer.remove()
    //                 delete this.poiToPoiLayers[card_id][filter_id]['to']
    //                 delete this.poiToPoiLayers[card_id][filter_id]['from']
    //             })
    //         }
    //     })
    // })
  };

  /**
   * 更新cards 围栏筛选
   * @param cards
   * @param active_layer_ids
   * @param object_type
   * @param source
   * @param packageId
   * @returns {*}
   */
  updateCardsGeoFilters = (cards, active_layer_ids, object_type, source, packageId) => {
    cards[0].geo_filters = {
      type: fence_select,
      object_type,
      source, packageId,
      filters: map(active_layer_ids, t => {
        let sid = `${t.object_type}_${t.id}`;
        return { id: sid, pid: t.object_type, oid: t.id, name: t.name, source: t.source, packageId: t.packageId };
      })
    };
    return cards;
  };


  changeMapStyle = (map_style) => {
    this.setState({ map_style });
  };

  changeMapBaseLayer = (map_baselayer) => {
    this.setState({ map_baselayer });
  };

  /**
   *
   * 设置buffer范围
   */
  onFinishBuffer = (val) => {
    let { cards, selectCardId: card_id, selectFilterId: filter_id, buffer_type } = this.state;
    this.setState({ showBufferDis: false, bufferDis: val }, () => {
      this.generateBuffersEntrance(card_id, filter_id, val, buffer_type);
    });
  };

  onCancelBuffer = () => {
    this.setState({ showBufferDis: false });
  };

  // 更新 map tool 点选状态
  changeMapToolState = (pause = true) => {
    let ref = this.refs[MAP_TOOL_REF];
    ref && ref.pauseStyle(pause);
    if (pause) {
      this.offDrawAct();
    }
  };


  // 删除自定义绘制
  onClearDraw = () => {
    this.clearOverlays();
  };
};

export default PreStyle;
