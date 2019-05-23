import map from "lodash/map";
import forEach from "lodash/forEach";
import size from "lodash/size";
import cloneDeep from "lodash/cloneDeep";
import {geo_types,source_customer} from '../../../constants/constants'


let normalOptIdx = 10;
const normalOpt = {
  bubble: true,
  strokeColor: "#00968e", strokeOpacity: 1, strokeWeight: 1,
  fillColor: "#00968e", fillOpacity: 0, zIndex: normalOptIdx
};
const staticType = "static";
const unusedCols = ["id", "address", "lng", "lat"];
const ZINDEX_INTERVAL = 2;

const MapCardMixin = superclass => class MapCardMixin extends superclass {
  /**
   * 更新图层
   * @param card_id
   * @param filter_id
   * @param geo_type
   * @param type
   * @param from_to
   * @returns {Promise<void>}
   */
  updateDataOnMap = async ({ card_id, filter_id, geo_type, type, from_to }) => {
    // console.log('updateDateOnMap:', {card_id, filter_id, geo_type, type, from_to})
    let {
      cards, static_cards,
      active_layer_ids_for_static_cards: act_ids_st,
      bgPolygonDataByStaticCards: bgdtbsc
    } = this.state;
    let cds = type == "static" ? static_cards : cards;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(cds, card_id, filter_id);

    let { geo_filter, selectPolygons } = type == "static" ? this.computeGeoFilter(card, act_ids_st[card.uid], bgdtbsc) : this.computeGeoFilter(card);
    let { object_type, geometry_type, source, packageId } = fdItem;
    let node = { object_type, geometry_type, source, packageId };

    let mapIns = this.getMapPanelInstance(); // 获取MapPanel实例
    // mapIns && mapIns.setMapBlocking(true) // 设置地图阻塞状态 开启阻塞
    this.setState({ loading: true });
    //删除图层
    this.removeDataOnMapFilter(card.uid, fdFilter.uid);
    let resp;
    // console.log(this.poiToPoiLayers,'this.poiToPoiLayers')
    try {
      resp = await this.postStyleToMap(node, fdFilter, geo_filter, from_to);
      if (!resp) {
        // mapIns && mapIns.setMapBlocking(false) // 设置地图阻塞状态 开启阻塞
        this.setState({ loading: false });
        return;
      }
      if (resp.rc) {
        let msg = resp.response && resp.response.error || resp.Msg || "请求出错";
        alertUtil.alertMsg(msg);
        this.setState({ loading: false });
        return;
      }
    } catch (err) {
      console.error(err);
      // mapIns && mapIns.setMapBlocking(false) // 设置地图阻塞状态 开启阻塞
      this.setState({ loading: false });
      alertUtil.alertMsg("网络错误");
      return;
    }
    //删除图层
    this.removeDataOnMapFilter(card.uid, fdFilter.uid);
    // console.log(this.poiToPoiLayers,'poiToPoiLayers')
    // if(from_to){
    //     fdFilter.uid = 'filter_' + uuidv1()
    // }
    let layer = this._getMapTile({ style_id: resp.style, layer_id: fdFilter.uid, zIndex: this.lastZIndex });
    this.map && this.map.addLayer(layer);
    this.addToLayers({ card_id: card.uid, filter_id: fdFilter.uid, geometry_type, layer, from_to });
    fdFilter._count_ = resp.count;
    // mapIns && mapIns.setMapBlocking(false) // 设置地图阻塞状态 开启阻塞
    this.setState({ cards, loading: false });
  };

  async updateDataOnMapByStaticCards(card_id, filter_id) {
    this.updateDataOnMap({ card_id, filter_id, type: "static" });
  }

  // 添加到图层对象保存
  addToLayers = ({ card_id, filter_id, geometry_type, layer, type, from_to = "from" }) => {
    // console.log(geometry_type,'geometry_type')
    // console.log(layer,'layer')
    // console.log(type,'type')
    switch (geometry_type) {
      // 多地理-点到点
      case geo_types.point_to_point:
        this.poiToPoiLayers[card_id] = this.poiToPoiLayers[card_id] || {};
        this.poiToPoiLayers[card_id][filter_id] = this.poiToPoiLayers[card_id][filter_id] || {};
        this.poiToPoiLayers[card_id][filter_id][from_to] = layer;
        break;
      case geo_types.point:
        this.poiLayers[card_id] = this.poiLayers[card_id] || {};
        this.poiLayers[card_id][filter_id] = layer;
        break;
      case geo_types.polygon:
        this.polygonLayers[card_id] = this.polygonLayers[card_id] || {};
        this.polygonLayers[card_id][filter_id] = layer;
        break;
      case geo_types.line:
        this.lineLayers[card_id] = this.lineLayers[card_id] || {};
        this.lineLayers[card_id][filter_id] = layer;
        break;
    }
    let cards = type === "static" ? this.state.static_cards : this.state.cards;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    let { object_type, packageId, source } = fdItem;
    this.layerIndex[card_id] = this.layerIndex[card_id] || {};
    this.layerIndex[card_id][filter_id] = { object_type, packageId, source, geometry_type, zIndex: this.lastZIndex };
    this.lastZIndex = this.lastZIndex + ZINDEX_INTERVAL;
  };

  onDeleteCol = (card_id, filter_id, col) => {
    // console.log('onDeleteCol')
    let { cards, edit_cols } = this.state;
    let [card, item, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    let { object_type, geometry_type, source, packageId } = item;
    fdFilter.filters = filter(fdFilter.filters, t => t.key != col.key);
    if (!size(fdFilter.filters)) {
      item.filters = filter(item.filters, t => t.uid != filter_id);
      this["render_style_" + geometry_type]--;
    }
    if (!size(item.filters)) {
      card.items = [];
    }
    delete edit_cols[source][packageId][geometry_type][object_type][col.key];
    this.setState({ cards, edit_cols });
  };

  /**
   * 删除卡片
   */
  deleteCard = (card) => {
    let { cards } = this.state;
    let { uid } = card;
    cards = filter(cards, c => c.uid != uid);
    forEach(geo_types, t => {
      this["render_style_" + t] = 0;
    });
    this.setState({ cards, edit_cols: {}, active_layer_ids: {} }, () => {
      this.removeDataOnMapCard(uid);
      this.deleteVoronoiCard(uid);
      // this.removeAllBgLayer();
    });
  };

  /**
   * 卡片(对应筛选)menu弹出层，移除按钮 事件
   * @param card_id
   * @param filter_id
   */
  deleteFilterCallback = (card_id, filter_id) => {
    let { cards } = this.state;
    let [card, fdItem] = this.findCardAndFilter(cards, card_id, filter_id);
    let { object_type, geometry_type } = cloneDeep(fdItem);
    fdItem.filters = filter(fdItem.filters, f => f.uid != filter_id);
    this["render_style_" + fdItem.geometry_type]--;
    card.items = filter(card.items, t => !!size(t.filters));
    this.setState({ cards }, () => {
      this.removeDataOnMapFilter(card_id, filter_id);
      this.deleteVoronoi(card_id, filter_id);
    });
  };

  /**
   * 更新单过滤条件可视化 眼睛显示/隐藏
   * @param card_id
   * @param filter_id
   * @param key
   * @param val
   * @param from_to 在多地理情况下, 点击的from还是to
   */
  updateFilter = (card_id, filter_id, key, val, from_to) => {
    // console.log('updateFilter',card_id, filter_id, key, val, from_to)
    const { cards } = this.state;
    const [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    fdFilter[key] = val;
    if (fdItem.geometry_type === geo_types.point_to_point) { // 多地理 点->点
      this.setState({ cards }, () => {
        this.updateDataOnMap({ card_id, filter_id, geo_type: fdItem.geometry_type, from_to });
      });
    } else { // 单地理
      this.setState({ cards }, () => {
        this.updateDataOnMap({ card_id, filter_id, geo_type: fdItem.geometry_type });
      });
    }
  };

  /**
   * 更新单过滤条件可视化 -静态卡片
   * @param card_id
   * @param filter_id
   * @param key
   * @param val
   */
  updateFilterByStaticCards = (card_id, filter_id, key, val) => {
    let { static_cards } = this.state;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(static_cards, card_id, filter_id);
    fdFilter[key] = val;
    this.setState({ static_cards }, () => {
      this.updateDataOnMapByStaticCards(card_id, filter_id);
    });
  };

  /**
   * 更新可视化
   * @param card_id
   * @param filter_id
   * @param current_visual
   * @param from_to
   */
  updateCurrentVisual = (card_id, filter_id, current_visual, from_to) => {
    // console.log('updateCurrentVisual:', card_id, filter_id, current_visual,from_to, 'card_id, filter_id, current_visual')
    let { cards } = this.state;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    let cv = "cur_visual";
    if (from_to) cv = cv + `_${from_to}`;
    if (!size(card)) return;
    if (!current_visual) {
      let lastVisual = fdFilter[cv];
      delete fdFilter[cv];
      if (lastVisual) {
        this.updateDataOnMap({ card_id, filter_id, geo_type: fdItem.geometry_type, from_to });
      }
    } else {
      fdFilter[cv] = current_visual;
    }
  };

  /**
   * cards menu的点击回调
   * @param card_id
   * @param filter_id
   * @param e
   * @param menu
   * @param sub
   * @param type //卡片类型
   */
  filterMoreMenuCallback = (card_id, filter_id, e, menu, sub, type, from_to) => {
    // console.log('menu的点击回调', card_id, filter_id, e, menu, sub, type)
    e && e.preventDefault();
    e && e.stopPropagation();
    let { id: menu_id } = menu;
    let { cards, static_cards } = this.state;
    let [card, fdItem, fdFilter] = type !== staticType ? this.findCardAndFilter(cards, card_id, filter_id) : this.findCardAndFilter(static_cards, card_id, filter_id);
    // console.log('card,', card, ',fdItem,', fdItem, ',fdFilter,', fdFilter)
    if (!size(card)) return;
    switch (menu_id) {
      case custom_card_menu.detail: // 显示详情
        this.showDetail(card, fdItem, fdFilter);
        break;
      case custom_card_menu.info_cfg: // 信息卡片配置
        if (find(fdFilter.info_cfg, t => t.key == sub.key)) {
          fdFilter.info_cfg = filter(fdFilter.info_cfg, t => t.key != sub.key);
        } else {
          fdFilter.info_cfg = fdFilter.info_cfg || [];
          fdFilter.info_cfg.push(sub);
        }
        break;
      case custom_card_menu.show_col: // 展示字段
        if (sub.key == "__delete__") {
          fdFilter.show_col = undefined;
        } else {
          fdFilter.show_col = sub.key;
        }
        this.updateDataOnMap({ card_id, filter_id, from_to });
        break;
      case custom_card_menu.buffer_general: // 生成buffer选区
        if (sub.key === "custom") {
          this.setState({
            showBufferDis: true,
            selectCardId: card_id,
            selectFilterId: filter_id,
            buffer_type: buffer_types.buffer
          });
        } else {
          this.generateBuffersEntrance(card_id, filter_id, sub.key, buffer_types.buffer);
        }
        break;
      case custom_card_menu.voronoi: // 生成泰森多边形
        if (sub.key === "custom") {
          this.setState({
            showBufferDis: true,
            selectCardId: card_id,
            selectFilterId: filter_id,
            buffer_type: buffer_types.voronoi
          });
        } else if (sub.key === "delete") {
          this.deleteVoronoi(card_id, filter_id);
        } else {
          this.generateBuffersEntrance(card_id, filter_id, sub.key, buffer_types.voronoi);
        }
        break;
      case custom_card_menu.size_visual: // 大小可视化
        let min, max;
        if (fdFilter.data) {
          [min, max] = this.getRangeForSizeVisual(fdFilter.data, sub);
        }
        this.changeSizeVisual(card_id, filter_id, {
          key: sub.key,
          size_range: [14, 28], // 默认字体大小范围 最大[1,50]
          key_range: (isNumber(min) && isNumber(max)) ? [min, max] : [0, 1],// 字段数值范围
          db: sub.db
        }, type !== staticType);
        break;
    }
  };

  /** 改变大小可视化设置
   * card_id 卡片uid
   * filter_id 过滤条件uid
   * static_type 是否是静态卡片
   */
  changeSizeVisual = async (card_id, filter_id, size_visual, no_static = true) => {
    if (no_static) { // 非静态卡片
      const { cards } = this.state;
      let [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
      fdFilter.size_visual = size_visual;
      await this.setState({ cards });
      await this.updateDataOnMap({ card_id, filter_id });
      // await this.updatePoiOnMap(card_id, filter_id)
    } else {// 静态卡片
      const { static_cards } = this.state;
      let [card, fdItem, fdFilter] = this.findCardAndFilter(static_cards, card_id, filter_id);
      fdFilter.size_visual = size_visual;
      await this.setState({ static_cards });
      await this.updateDataOnMap({ card_id, filter_id });
      // await this.updatePoiOnMapByStaticCard(card_id, filter_id)
    }
  };

  generateBuffersEntrance = (card_id, filter_id, val, buffer_type) => {
    switch (buffer_type) {
      case buffer_types.buffer:
        this.generateBuffers(card_id, filter_id, val);
        break;
      case buffer_types.voronoi:
        this.generateVoronoi(card_id, filter_id, val);
        break;
    }
  };

  // 生成泰森多边形
  generateVoronoi = async (card_id, filter_id, val) => {
    let [card, fdItem, fdFilter] = this.findCardAndFilter(this.state.cards, card_id, filter_id);
    let { object_type, geometry_type, source, packageId } = fdItem;
    let { geo_filter } = this.computeGeoFilter(card);
    this.voronoi_filters = this.voronoi_filters || [];
    let fd = find(this.voronoi_filters, { card_id, filter_id }), node;
    if (fd) {
      fd.geo_filter = geo_filter;
      fd.filters = fdFilter.filters;
      fd.distance = val;
      node = fd;
    } else {
      node = {
        card_id,
        filter_id,
        object_type,
        geometry_type,
        source,
        packageId,
        geo_filter,
        filters: fdFilter.filters,
        distance: val
      };
      this.voronoi_filters.push(node);
    }

    let resp;
    try {
      resp = await this.postBufferToMap(node, buffer_types.voronoi);
      console.log("resp:", resp);
      if (!resp) return;
      if (resp.rc) {
        let msg = resp.response && resp.response.error || resp.Msg || "请求出错";
        alertUtil.alertMsg(msg);
        return;
      }
    } catch (error) {
      console.log(error);
      alertUtil.alertMsg("网络错误");
      return;
    }
    this.voronoi_layers = this.voronoi_layers || {};
    this.voronoi_layers[card_id] = this.voronoi_layers[card_id] || {};
    let layer_id = "voronoi_" + filter_id;
    let layer = this.voronoi_layers[card_id][filter_id];
    layer && this.map.removeLayer(layer);
    layer = this._getMapTile({ style_id: resp.style, layer_id });
    layer.addTo(this.map);
    this.voronoi_layers[card_id][filter_id] = layer;
  };

  deleteVoronoiCard = (card_id) => {
    forEach(this.voronoi_layers, (c, cid) => {
      if (cid == card_id) {
        forEach(c, (layer, filter_id) => {
          layer && this.map && this.map.removeLayer(layer);
        });
      }
    });
    delete this.voronoi_layers[card_id];
    this.voronoi_filters = filter(this.voronoi_filters, t => t.card_id !== card_id);
  };

  deleteVoronoi = (card_id, filter_id) => {
    forEach(this.voronoi_layers, (c, card_id) => {
      forEach(c, (layer, fid) => {
        if (filter_id == fid) {
          layer && this.map && this.map.removeLayer(layer);
          delete this.voronoi_layers[card_id][filter_id];
        }
      });
    });
    this.voronoi_filters = filter(this.voronoi_filters, t => !(t.card_id == card_id && t.filter_id == filter_id));
  };


  // 生成buffer选区
  generateBuffers = async (card_id, filter_id, val) => {
    let [card, fdItem, fdFilter] = this.findCardAndFilter(this.state.cards, card_id, filter_id);
    let { object_type, geometry_type, source, packageId } = fdItem;
    let { geo_filter } = this.computeGeoFilter(card);
    this.buffer_filters = this.buffer_filters || [];
    let fd = find(this.buffer_filters, { card_id, filter_id }), node;
    if (fd) {
      fd.geo_filter = geo_filter;
      fd.filters = fdFilter.filters;
      fd.distance = val;
      node = fd;
    } else {
      node = {
        card_id,
        filter_id,
        object_type,
        geometry_type,
        source,
        packageId,
        geo_filter,
        filters: fdFilter.filters,
        distance: val
      };
      this.buffer_filters.push(node);
    }

    let resp;
    try {
      resp = await this.postBufferToMap(node);
      console.log("resp:", resp);
      if (!resp) return;
      if (resp.rc) {
        let msg = resp.response && resp.response.error || resp.Msg || "请求出错";
        alertUtil.alertMsg(msg);
        return;
      }
    } catch (error) {
      console.log(error);
      alertUtil.alertMsg("网络错误");
      return;
    }
    this.buffer_layers = this.buffer_layers || {};
    let layer_id = "buffer_" + filter_id;
    let layer = this.buffer_layers[layer_id];
    layer && this.map.removeLayer(layer);
    layer = this._getMapTile({ style_id: resp.style, layer_id });
    layer.addTo(this.map);
    this.buffer_layers[layer_id] = layer;
    this.changeMapState(buffer_select, null);
  };

  // 添加buffer显示
  postBufferToMap = (node, buffer_type) => {
    let { geometry_type, source } = node;
    let body = this._prepareBufferStyle(node, buffer_type);
    if (!body) return;
    let params = {};
    if (source == source_customer) {
      params = { geo_type: geometry_type };
    }
    return this._postStyleToMap(node, params, body);
  };

  // 显示详情
  showDetail = async (card, fdItem, fdFilter) => {
    let { setTabData } = this.props;
    let { geo_filter, selectPolygons } = this.computeGeoFilter(card);
    let { object_type, geometry_type, source, packageId } = fdItem;
    let flts = this.computeFilters(fdFilter);
    // console.log(geo_filter, flts);

    //获取表头
    let resp;
    try {
      resp = await this.fetchDataColumnType(fdItem);
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
      return;
    }
    if (!(resp && !resp.rc)) {
      alertUtil.alertMsg(resp.Msg || "暂无数据");
      return;
    }
    let { columns } = resp;
    let tableHeader = [];
    forEach(columns, (col, index) => {
      if (indexOf(unusedCols, col) == -1) {
        tableHeader.push({
          id: `extra.${col}`,
          title: col
        });
      }
    });
    tableHeader.unshift(...mapHeaderKey);

    //获取数据 todo:: 围栏选择和自定义绘制可以通过之前的query查询，但buffer是地图服务器渲染获取不到，这里需要后端支持
    let dataResp;

    let params = { object_type, geo_type: geometry_type };
    if (source === source_market) {
      params.object_type = packageId || 0;
    }
    if (geo_filter) params = { ...params, ...geo_filter };
    if (size(flts)) params.filters = flts;
    dataResp = await this.fetchDataPromise(params, source);

    if (dataResp.error) {
      console.error(dataResp.error);
      alertUtil.alertMsg("网络错误");
      return;
    }
    if (!dataResp || dataResp.rc) {
      alertUtil.alertMsg(dataResp && dataResp.Msg || "暂无数据");
      return;
    }

    setTabData && setTabData([{
      object_type,
      geometry_type,
      id: JSON.stringify({ object_type, geometry_type }),
      name: object_type,
      icon: tableIcons[geometry_type],
      data: dataResp.result
    }], tableHeader);
  };

  fetchDataPromise = (data, source) => {
    source = source || source_customer;
    let params = {
      address: true
    };
    data.spatial_relation = this.state.screening_method; // 筛选包含关系
    let postdata = JSON.stringify(data);
    return new Promise((resolve, reject) => { // 筛选客户上传的poi点, 使用用户自画的图形
      return fetchUtil(queryUrl(`${model_api_url}datamap/poi/v2/${source}/query`, params), {
        method: "POST",
        body: postdata,
        headers
      }).then(resp => {
        resolve && resolve(resp);
      }).catch(err => {
        console.error(err);
        resolve && resolve({ error: err });
      });
    });
  };

  filterMoreMenuCallbackByStaticCards(card_id, filter_id, e, menu, sub) {
    this.filterMoreMenuCallback(card_id, filter_id, e, menu, sub, staticType);
  }

  // 清空
  onClearSelect = (card_id, filter_id, e, menu) => {
    // console.log('onClearSelect')
    e && e.preventDefault();
    e && e.stopPropagation();
    let { id: menu_id } = menu;
    let { setTabData } = this.props;
    let { cards } = this.state;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(cards, card_id, filter_id);
    if (!size(card)) return;
    fdFilter.info_cfg = [];
  };

  // 展开收起
  onConstrict = (constrict) => {
    this.setState({ constrict });
  };

  // 显示交互图层可视化
  onShowBgVisual = () => {
    this.setState({ bg_polygon_visual: !this.state.bg_polygon_visual });
  };

  /**
   * 根据filter_id添加静态卡片
   */
  addStaticCards = (filter_id) => {
    const { cards, static_cards, current_geo_filter } = this.state;
    for (let i = 0; i < cards[0].items.length; i++) {
      if (cards[0].items[i].filters[0].uid === filter_id) {
        // console.warn('匹配 成功')
        const data = {
          uid: "card_" + uuidv1(),
          "items": [],
          "geo_filters": {}
        };
        const item = cloneDeep(cards[0].items[i]);
        // if(item.uid){
        //     item.uid = 'filter_' + uuidv1()
        // }
        for (let i = 0; i < item.filters.length; i++) {
          if (item.filters[i].uid) {
            item.filters[i].uid = "filter_" + uuidv1();
          }
          if (item.filters[i].VList) {
            delete item.filters[i].VList;
          }
        }
        delete item.data;
        delete item.fake;
        data.items.push(item);
        data.geo_filters = cards[0].geo_filters || {};
        const geometry_type = data.geo_filters.geometry_type || "polygon";
        data.geo_filters.filters_g = [
          {
            "uid": "filter_" + uuidv1(),
            "style": this.getRenderStyle(geometry_type)
          }
        ];
        const current = cloneDeep(current_geo_filter) || {};
        if (current.geometry_type) {
          data.geo_filters.geometry_type = current.geometry_type;
        }
        // console.log(data, cards, this.state, '参考数据比对')
        static_cards.push(data);
        this.setState({ static_cards }, async () => {
          await this.setactive_layer_idsByStaticCards();
          await this.renderStaticCardsToMap(); // CenterPreFetchMixin
        });
      }
    }
  };

  /**
   * 对应整个cards 添加到static_cards尾部
   */
  addStaticCardsByAll = () => {
    const { cards, current_geo_filter, static_cards } = this.state;
    if (!size(cards) || !size(cards[0].items)) { //没有数据时不添加
      return false;
    }
    const static_card = cloneDeep(cards[0]);
    static_card.uid = "card_" + uuidv1();
    if (!static_card.geo_filters) {
      static_card.geo_filters = {};
    }
    if (current_geo_filter.geometry_type) {
      static_card.geo_filters.geometry_type = current_geo_filter.geometry_type;
    }
    //过滤data,_count_,VList字段，重设uuid
    for (let i = 0; i < static_card.items.length; i++) {
      if (size(static_card.items[i].filters)) {
        for (let j = 0; j < static_card.items[i].filters.length; j++) {
          if (static_card.items[i].filters[j].uid) {
            static_card.items[i].filters[j].uid = "filter_" + uuidv1();
          }
          if (static_card.items[i].filters[j].data) {
            delete static_card.items[i].filters[j].data;
          }
          if (static_card.items[i].filters[j]._count_) {
            delete static_card.items[i].filters[j]._count_;
          }
          if (static_card.items[i].filters[j].VList) {
            delete static_card.items[i].filters[j].VList;
          }
        }
      }
    }

    if (size(current_geo_filter.filters)) {
      static_card.geo_filters.filters_g = current_geo_filter.filters;
      for (let i = 0; i < static_card.geo_filters.filters_g.length; i++) {
        if (static_card.geo_filters.filters_g[i].uid) {
          static_card.geo_filters.filters_g[i].uid = "filter_" + uuidv1();
          delete static_card.geo_filters.filters_g[i].data; // -- 11.30
          delete static_card.geo_filters.filters_g[i]._count_; // -- 11.30
        }
      }
    } else {
      static_card.geo_filters.filters_g = [
        {
          "uid": "filter_" + uuidv1(),
          "style": this.getRenderStyle(static_card.geo_filters.geometry_type || "polygon")
        }
      ];
    }

    // console.log(static_card, 'static_card')
    static_cards.push(static_card);
    this.setState({ static_cards }, async () => {
      // console.log(this.state.static_cards)
      await this.setactive_layer_idsByStaticCards();
      await this.renderStaticCardsToMap();
    });
  };
  // 选择卡片, 设置当前高亮 层级
  setCurrentCardId = (cardId) => {
    const { current_card_id } = this.state;
    if (cardId == current_card_id) return false;
    const isCard = cardId === "";// 当前为card
    this.setState({
      current_card_id: cardId
    }, () => {
      if (!isCard) {
        const cId = cardId;
        if (this.polygonLayers[cId]) {
          const fIdList = Object.keys(this.polygonLayers[cId]);
          // this._setNormalOptIdx()
          this.updateStaticBgPolygon();
          for (let i = 0; i < fIdList.length; i++) {
            this.updateDataOnMapByStaticCards(cId, fIdList[i]);
          }
        }
      } else {
        const { cards } = this.state;
        const cId = cards[0].uid;
        // this._setBgNormalOptIdx()
        this.updateBgPolygon();
        if (this.polygonLayers[cId]) {
          // this._setNormalOptIdx()
          const fIdList = Object.keys(this.polygonLayers[cId]);
          for (let i = 0; i < fIdList.length; i++) {
            this.updateDataOnMap({ card_id: cId, filter_id: fIdList[i], geo_type: "polygon" });
          }
        }

      }
    });
  };

  /**
   * 设置active_layer_ids_for_static_cards
   * @returns {Promise<void>}
   */
  setactive_layer_idsByStaticCards = async () => {
    await this.setState({ active_layer_ids_for_static_cards: {} }); // 重置
    const { static_cards, active_layer_ids_for_static_cards } = this.state;
    map(static_cards,(current) => {
      if (current && current.geo_filters) {
        const obj = {};
        forEach(current.geo_filters.filters, t => {
          obj[t.oid] = {
            id: t.oid + "",
            object_type: t.pid,
            name: t.name,
            source: t.source || source_customer,
            packageId: t.packageId || ""
          };
        });
        active_layer_ids_for_static_cards[current.uid] = obj;
      }
    })
    await this.setState({ active_layer_ids_for_static_cards });
  };

  /**
   * 静态卡片(对应筛选)menu弹出层，移除按钮 事件
   * @param card_id
   * @param filter_id
   */
  deleteFilterCallbackByStaticCards = (card_id, filter_id) => {
    let { static_cards } = this.state;
    let [card, fdItem] = this.findCardAndFilter(static_cards, card_id, filter_id);
    let { object_type, geometry_type } = cloneDeep(fdItem);
    fdItem.filters = filter(fdItem.filters, f => f.uid != filter_id);
    this["render_style_" + fdItem.geometry_type]--;
    card.items = filter(card.items, t => !!size(t.filters));
    this.setState({ static_cards }, () => {
      this.removeDataOnMapFilter(card_id, filter_id);
      this.deleteVoronoi(card_id, filter_id);
    });
  };

  /**
   * 更新静态图层配置
   * @param {string} card_id
   * @param {string} filter_id
   * @param {object} current_visual
   */
  updateCurrentVisualByStaticCard = (card_id, filter_id, current_visual) => {
    // console.log('updateCurrentVisualByStaticCard',card_id, filter_id, current_visual)
    let { static_cards } = this.state;
    let [card, fdItem, fdFilter] = this.findCardAndFilter(static_cards, card_id, filter_id);
    // console.log([card, fdItem, fdFilter],'[card, fdItem, fdFilter]')
    if (!size(card)) return;
    // console.log(current_visual)
    if (!current_visual) {
      let lastVisual = fdFilter.cur_visual;
      delete fdFilter.cur_visual;
      if (lastVisual) {
        // console.log('updateDataOnMap')
        this.updateDataOnMapByStaticCards(card_id, filter_id);
      }
    } else {
      fdFilter.cur_visual = current_visual;

      // console.log('updateDataOnMap')// 新增逻辑
      this.updateDataOnMapByStaticCards(card_id, filter_id);// 新增逻辑
    }
  };

  /**
   * 根据uid删除某个静态卡片
   */
  deleteStaticCard = (card_id) => {
    // console.log(this.drawpolygonByStaticCards,'this.drawpolygon')
    // console.log(this.staticLayer,'this.staticLayer')
    const { static_cards } = this.state;
    const data = [];
    for (let i = 0; i < static_cards.length; i++) {
      if (static_cards[i].uid !== card_id) {
        data.push(static_cards[i]);
      }
    }
    this.setState({ static_cards: data }, async () => {
      this.removeDataOnMapCard(card_id);
      this.deleteVoronoiCard(card_id);
      this.removeStaticBgLayer(card_id);
      // await this.clearMapByStaticCards(card_id) // 清空地图对应card_id的layers
      const { map, drawpolygonByStaticCards } = this;
      if (map) { // 清除card_id下的覆盖物
        forEach(drawpolygonByStaticCards, (p, uid) => { // 清除覆盖物（自绘制的多边形/圆）
          if (uid === card_id) {
            p && map.remove(p);
            delete drawpolygonByStaticCards[uid];
          }
        });
      }
    });
  };
};


export default MapCardMixin;
