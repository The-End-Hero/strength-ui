import forEach from "lodash/forEach";
import size from "lodash/size";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import filter from "lodash/filter";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import * as maptalks from "maptalks";
import amapUtil from "../../../utils/amapUtil";
import {
  geo_types, poi_icons, visualization_colors, source_customer, PolygonSourceKey,
  PolygonPackageIdKey, source_market, fence_select, buffer_select, self_select, dis_select
} from "../../../constants/constants";

const uuidv1 = require("uuid/v1");

const FetchDataMixin = superclass => class FetchDataMixin extends superclass {
  /**
   * 根据地理数据类型 获取初始化样式
   * @param geometry_type
   * @returns {*}
   */
  getRenderStyle = (geometry_type) => {
    this["render_style_" + geometry_type] = this["render_style_" + geometry_type] || 0;
    let len = this["render_style_" + geometry_type];
    this["render_style_" + geometry_type]++;
    switch (geometry_type) {
      case geo_types.point:
        return {
          color: visualization_colors[len] || visualization_colors[0],
          icon: poi_icons[0]
        };
      case geo_types.polygon:
        return {
          color: visualization_colors[len] || visualization_colors[0],
          strokeStyle: "solid",
          strokeDasharray: [0, 0, 0, 0],
          strokeWeight: 1,
          strokeOpacity: 1,
          fillOpacity: 0.5
        };
      case geo_types.line:
        return {
          color: visualization_colors[len] || visualization_colors[0],
          strokeStyle: "solid",
          strokeDasharray: [0, 0, 0, 0],
          strokeWeight: 6
        };
      case geo_types.point_to_point:
        return {
          color_from: visualization_colors[len] || visualization_colors[0],
          color_to: visualization_colors[len + 1] || visualization_colors[1],
          icon_from: poi_icons[0],
          icon_to: poi_icons[1]
        };
    }
  };

  /**
   * 拖拽添加围栏时调用，多个围栏 围栏筛选 onSelect调用
   * @param args
   * @param clearActive //是否清除active_layers_ids
   * @returns {Promise<void>}
   */
  addPolygonFilter = async (args, clearActive = true) => {
    let { object_type, geo_type, source, packageId } = args;
    source = source || source_customer;
    packageId = packageId || "";
    const geo_filters = cloneDeep(this.state.geo_filters);
    const noHadGeo = geo_filters.every((current) => {
      return !this.isEqualGeoFilter(current, args);
    });
    let cgf = {};
    if (noHadGeo) { // 如果没有，则添加
      // console.log('没有重复-->添加')
      args.geometry_type = geo_type;
      cgf = {
        object_type,
        geometry_type: geo_type,
        source,
        packageId
      };
      geo_filters.push(args);
    } else { // 重复
      // const data = cloneDeep(this.state.geo_filters)
      geo_filters.map((current) => {
        if (this.isEqualGeoFilter(current, args)) {
          current.current = true;
          cgf = current;
        } else {
          return current;
        }
      });
    }
    this.clearMap(); // 重置 清空地图
    await this.setState({
      geo_filter: {
        object_type,
        geometry_type: geo_type,
        source,
        packageId
      },
      geo_filters,
      current_geo_filter: cgf,
      active_layer_ids: clearActive ? {} : this.state.active_layer_ids,
      bg_polygon_visual: false
    });

    let resp = await this.fetchCustomerDataWithOutFilter(args);
    if (!resp) {
      return;
    }

    let { bgPolygonData, geo_filter, current_geo_filter } = this.state;
    let { filters } = current_geo_filter; //geo_filter
    let data = resp.result;
    forEach(data, t => {
      t.object_type = object_type;
      t[PolygonSourceKey] = source;
      t[PolygonPackageIdKey] = packageId;
    });
    if (!filters) {
      current_geo_filter.filters = [{
        uid: "filter_" + uuidv1(),
        style: {
          ...this.getRenderStyle(geo_type),
          color: normalOpt.fillColor, fillOpacity: normalOpt.fillOpacity
        },
        data
      }];
    } else {
      current_geo_filter.filters[0].data = data;
    }
    bgPolygonData[source] = bgPolygonData[source] || {};
    bgPolygonData[source][packageId] = bgPolygonData[source][packageId] || {};
    bgPolygonData[source][packageId][object_type] = data;
    await this.addBgPolygon({ source, packageId, object_type, geometry_type: geo_type, fitView: clearActive }); // 添加背景围栏
    let cards = this.checkCards(this.state.cards);
    // console.log(cards, 'onSelected Cards')
    this.setState({ cards, bgPolygonData });
  };

  fetchCustomerDataWithOutFilter = async ({ object_type, geo_type, source, packageId, geometry_type }) => {
    source = source || source_customer;
    packageId = packageId || "";
    let params = {
      geo_type: geo_type ? geo_type : geometry_type,
      check_geometry: false
    };
    let postdata = JSON.stringify({ object_types: [object_type] });
    let mapIns = this.getMapPanelInstance();
    mapIns && mapIns.setMapBlocking(true);
    let ps = source !== source_market ?
      fetchUtil(queryUrl(`${model_api_url}upload/query`, params), { method: "POST", body: postdata, headers })
      : fetchUtil(queryUrl(`${model_api_url}data/market/geometry/${packageId}`));

    let resp;
    try {
      resp = await ps;
      mapIns && mapIns.setMapBlocking(false);
      if (!resp || !resp.result) {
        alertUtil.alertMsg("暂无数据");
        return;
      }
    } catch (err) {
      console.error(err);
      mapIns && mapIns.setMapBlocking(false);
      alertUtil.alertMsg("网络错误");
      return;
    }
    return resp;
  };

  /**
   * 点击topfilter的清空按钮触发
   * @returns {Promise<void>}
   */
  clearGeoFilter = async () => {
    const { cards } = this.state;
    for (let i = 0; i < cards.length; i++) {
      //删除
    }
    await this.setState({
      geo_filter: {},
      geo_filters: [],// 新版本 多个围栏
      current_geo_filter: {},//新版本 当前选择的围栏
      cards: [],
      edit_cols: {},
      active_layer_ids: {}
    });
    await this.clearMap();
  };

  //编辑过滤条件
  updateEditCols = (edit_cols) => {
    let { cards } = this.state;
    cards = this.checkCards(cards);
    let { items } = cards[0] || {};
    let self = this;
    forEach(items, t => {
      let { geometry_type } = t;
      forEach(t.filters, f => {
        if (f.fake) {
          this["render_style_" + geometry_type]--;
        }
      });
      t.filters = filter(t.filters, t => !t.fake);
    });
    items = filter(items, t => size(t.filters));
    forEach(edit_cols, (fsrc, source) => {
      forEach(fsrc, (fp, packageId) => {
        forEach(fp, (g, geometry_type) => {
          forEach(g, (o, object_type) => {
            let f = { object_type, geometry_type, source, packageId };
            let fd = find(items, t => this.isEqualGeoFilter(t, f));
            if (fd) { //已存在相同数据集
              // console.log('已存在相同数据集')
              //未添加成筛选条件
              let fdFakeFilter = find(fd.filters, t => t.fake);
              if (!fdFakeFilter) { //未找到
                fd.filters = [{
                  uid: "filter_" + uuidv1(),
                  filters: cloneDeep(map(o, t => t)),
                  style: self.getRenderStyle(geometry_type),
                  fake: true //未添加设置为fake
                }];
              } else {
                fdFakeFilter.filters = cloneDeep(map(o, t => t));
              }
            } else {
              // console.log('非存在相同数据集')
              items.push({
                ...f,
                filters: [{
                  uid: "filter_" + uuidv1(),
                  filters: cloneDeep(map(o, t => t)),
                  style: self.getRenderStyle(geometry_type),
                  fake: true //未添加设置为fake
                }]
              });
              // console.log(items,'items')
            }
          });
        });
      });
    });
    cards[0].items = items;
    this.setState({ edit_cols }, () => {
      // console.log(this.state.edit_cols, 'edit_cols') // 对应数据的 筛选器
    });
  };

  onAdd = async () => { // topfilter 添加按钮触发 新版本需要去掉添加按钮，直接出现启动查询
    let self = this;
    let ref = this.refs.topFilter;
    let select_filter = ref && ref.getSelectFilter();
    let {
      filter_object_type: fot,
      filter_geometry_type: fgt,
      filter_source: fsrc,
      filter_packageId: fp
    } = select_filter;
    let { cards, edit_cols } = this.state;
    forEach(cards, c => {
      forEach(c.items, t => {
        forEach(t.filters, f => {
          f.fake = undefined;
        });
      });
    });
    // console.log(edit_cols,'1')
    // 如果没有对应tag，而且在当前数据集添加, 则添加"全部"筛选
    if (fgt && fot && !(edit_cols && edit_cols[fsrc] && edit_cols[fsrc][fp] && edit_cols[fsrc][fp][fgt] && size(edit_cols[fsrc][fp][fgt][fot]))) {
      // console.log('2')
      cards = this.checkCards(cards);
      // console.log(cards,'3')
      let card = cards[0];
      let { items } = card;
      let f = { object_type: fot, geometry_type: fgt, source: fsrc, packageId: fp };
      let fd = find(items, t => this.isEqualGeoFilter(t, f)); // items数组下 相同数据集
      if (fd) { //已存在相同数据集
        //未添加成筛选条件
        let fdFakeFilter = find(fd.filters, t => t.fake);
        if (fdFakeFilter) {
          fdFakeFilter.filters = cloneDeep(map(edit_cols[fsrc][fp][fgt][fot], t => t));
        }
      } else {
        const data = {
          ...f,
          filters: [{
            uid: "filter_" + uuidv1(),
            filters: [],
            style: self.getRenderStyle(fgt)
          }]
        };
        if (fgt === geo_types.point_to_point) { // 多地理 点=>点
          data.filters[0].hidden_to = true; // 多地理 to 默认不显示
        }
        items.push(data);
      }
    }
    await this.setState({ cards });
  };

  // 开始分析点击执行函数
  onSearch = async () => {
    this.init = false;
    // await this.onAdd();
    let { cards, edit_cols, supp_filters } = this.state;
    // console.log(this,'onSearch this')
    // console.log(supp_filters, 'supp_filters')
    if (this.state.loading) return;
    this.clearCardsLayers();
    forEach(cards, c => {
      forEach(c.items, t => {
        forEach(t.filters, f => {
          f.fake = undefined;
        });
      });
    });
    this.changeMapToolState();
    await this.setState({ cards, loading: true });
    await this.fetchData();
  };

  // 计算当前geofilter筛选
  computeGeoFilter = (card, act_ids, bg_polygon_data) => {
    let { active_layer_ids, bgPolygonData: bgdt } = this.state;
    if (act_ids) active_layer_ids = act_ids;
    if (bg_polygon_data) bgdt = bg_polygon_data;
    let buffer_geo = null;
    //todo:: buffer
    if (size(this.buffer_filters)) {
      // let cds = []
      // forEach(this.buffer_filters, (c, card_id) => {
      //     forEach(c, (b, filter_id) => {
      //         cds = cds.concat(map(b, geo => geo.coordinates))
      //     })
      // })
      // let geoJson = amapUtil.wrapMultiPolygon(cds)
      // buffer_geo = amapUtil.geoJsonToEwkb(geoJson);
    }
    let { geo_filters, uid } = card;
    let geo_filter, selectPolygons = [];
    if (buffer_geo) {
      geo_filter = { geometry: buffer_geo };
    } else if (geo_filters) {
      geo_filters.type = Number(geo_filters.type)
      if (geo_filters.type === fence_select) { // 围栏数据
        if (size(active_layer_ids)) {
          let { source, packageId, object_type } = geo_filters;
          source = source || source_customer;
          packageId = packageId || "";
          let isMarket = source === source_market;
          let keyword = isMarket ? "markets" : "customers";
          let ids = map(active_layer_ids, t => t.id);
          let bgdata = bgdt[source] && bgdt[source][packageId] && bgdt[source][packageId][object_type];
          forEach(bgdata, t => {
            if (indexOf(ids, t.id) !== -1) {
              selectPolygons.push({ id: t.id, geometry: t.geometry });
            }
          });
          if (active_layer_ids["0"]) { //如果全部
            ids = map(bgdata, t => t.id);
            selectPolygons = map(bgdata, t => {
              return { id: t.id, geometry: t.geometry };
            });
            isMarket && (ids = [{ package_id: packageId, ids: ids }]);
          } else if (isMarket) {
            ids = [{ package_id: packageId, ids: ids }];
          }
          geo_filter = { [keyword]: ids };
        }
      } else if (geo_filters.type === self_select) { // 自助选择
        // console.log(JSON.stringify(geo_filters.geoJson))
        geo_filter = { geometry: amapUtil.geoJsonToEwkb(geo_filters.geoJson) };
      } else if (geo_filters.type === dis_select) { // 距离选择
        geo_filter = { circles: geo_filters.circles };
      }
    }

    let wRef = this.refs.WorkBenchSearch,
      circle = wRef && wRef.circle;
    if (wRef && circle) {
      let radius = Number(circle.getRadius());
      let s = circle.getCenter();
      const { lng, lat } = bd09towgs84(s.x, s.y);
      geo_filter = { circles: [[lng, lat, radius]] };
    }
    return { geo_filter, selectPolygons };
  };

  /**
   * 发送配置给后端
   * @param node  筛选数据 例:星巴克poi
   * @param filter 过滤条件
   * @param geo_filter 例如 {"customers":["29509015"]}
   * @param from_to 多地理  from/to
   * @returns {*|void}
   */
  postStyleToMap = (node, filter, geo_filter, from_to) => {
    // console.log('postStyleToMap:', node, filter, JSON.stringify(geo_filter), from_to)
    let { object_type, geometry_type, source, packageId } = node;
    let body = this._prepareStyle(node, filter, geo_filter, from_to);
    if (!body) return;
    let params = {};
    if (source == source_customer) {
      params = { geo_type: geometry_type };
    }
    return this._postStyleToMap(node, params, body); // 拿到fetch
  };
  // 设置地图阻塞状态
  setMapBlocking = (blocking) => {
    blocking !== this.state.blocking &&
    this.setState({ blocking });
  };
  /**
   *
   * @param pss [promise,...]
   * @param pssMap [{cards, filter, items, from_to},...]
   * @param type 是否是静态卡片
   * @param fitView 是否需要重置缩放位置
   * @returns {Promise<void>}
   */
  fetchDataCom = async (pss, pssMap, type, fitView = true) => {
    if (!size(pss)) {
      this.setState({ loading: false });
      return;
    }
    // console.log('fetchDataCom:', pss, pssMap, type, fitView)
    let mapIns = this;//this.getMapPanelInstance(); // 获取MapPanel实例
    mapIns && mapIns.setMapBlocking(true); // 设置地图阻塞状态 开启阻塞

    let resp;
    try {
      resp = await Promise.all(pss);
      console.log(pss, "pss");
      console.log(resp, "fetchDataCom");
    } catch (err) {
      console.error(err);
      mapIns && mapIns.setMapBlocking(false); // 设置地图阻塞状态 关闭阻塞
      this.setState({ loading: false });
      alertUtil.alertMsg("网络错误");
    }
    let respValid = filter(resp, t => !!(t && t.box2d));
    if (!size(respValid)) {
      mapIns && mapIns.setMapBlocking(false); // 设置地图阻塞状态 关闭阻塞
      this.setState({ loading: false });
      return;
    }
    let maxBox2d = [];
    maxBox2d[0] = minBy(respValid, t => t.box2d[0]).box2d[0];
    maxBox2d[1] = minBy(respValid, t => t.box2d[1]).box2d[1];
    maxBox2d[2] = maxBy(respValid, t => t.box2d[2]).box2d[2];
    maxBox2d[3] = maxBy(respValid, t => t.box2d[3]).box2d[3];
    // console.log('maxBox2d: ', maxBox2d)
    /** maxBox2d 返回缩放位置的对角线两个点位坐标
     * 静态卡片或者设置fitview为false的不需要缩放位置
     */
    type !== "static" && fitView && this.map && this.map.fitExtent(new maptalks.Extent(...maxBox2d));

    let layers = [];
    forEach(resp, (r, idx) => {
      if (r && r.box2d) {
        let { card: { uid: card_id }, item: { geometry_type }, filter: card_filter, from_to } = pssMap[idx];
        let layer = this._getMapTile({
          style_id: r.style,
          layer_id: card_filter.uid + (from_to || ""),
          zIndex: this.lastZIndex
        });
        //删除图层
        this.removeDataOnMapFilter(card_id, card_filter.uid);
        this.addToLayers({ card_id: card_id, filter_id: card_filter.uid, geometry_type, layer, type, from_to });
        layers.push(layer);
        card_filter._count_ = r.count;
      }
    });
    // console.log(cloneDeep(layers),'layers------100101-1-01-10-1023--1-1-2-1-1--1-11-')
    // console.log(cloneDeep(this.poiToPoiLayers),'poiToPoiLayers')
    // this.map && console.log(this.map.getLayers())
    this.map && this.map.addLayer(layers);
    mapIns && mapIns.setMapBlocking(false); // 设置地图阻塞状态 关闭阻塞
    this.setState({ loading: false });
  };

  /**
   * cards查询 开始分析按钮触发
   * @returns {Promise<void>}
   */
  fetchData = async () => {
    // console.log('获取数据')
    const { cards, screening_method, edit_cols } = this.state;
    const pss = []; // Promise.all处理的数组
    let pssMap = {}, geo_filter;
    forEach(cards, card => {
      let { geo_filter: geo_filter_in, selectPolygons } = this.computeGeoFilter(card);
      geo_filter = geo_filter_in;
      forEach(card.items, item => {
        item = item || {};
        let { object_type, geometry_type, source, packageId } = item;
        forEach(item.filters, filter => {
          let node = { object_type, geometry_type, source, packageId };
          // 多地理
          if (geometry_type === geo_types.point_to_point) {
            // console.log(filter, 'p2p-filter')
            const { hidden_to, hidden_from, cur_visual_to } = filter;
            if (!hidden_from && ((cur_visual_to && cur_visual_to.type !== 6) || !cur_visual_to)) {
              const obj = this.postStyleToMap(node, filter, geo_filter, "from");
              pss.push(obj);
              // 对应card.items中的项目，card.items实际上为数据源筛选条件 1个数据数据只有一个筛选条件（条件本身聚合）
              pssMap[pss.length - 1] = { card, item, filter, from_to: "from" };
            } // postgis请求

            if (!hidden_to && ((cur_visual_to && cur_visual_to.type !== 6) || !cur_visual_to)) {
              const obj = this.postStyleToMap(node, filter, geo_filter, "to");
              pss.push(obj);
              // 对应card.items中的项目，card.items实际上为数据源筛选条件 1个数据数据只有一个筛选条件（条件本身聚合）
              pssMap[pss.length - 1] = { card, item, filter, from_to: "to" };
            } // postgis请求

            if (cur_visual_to && cur_visual_to.type === 6) {
              const obj = this.postStyleToMap(node, filter, geo_filter, "flow");
              pss.push(obj);
              // 对应card.items中的项目，card.items实际上为数据源筛选条件 1个数据数据只有一个筛选条件（条件本身聚合）
              pssMap[pss.length - 1] = { card, item, filter, from_to: "flow" };
            } // postgis请求

          } else {
            pss.push(this.postStyleToMap(node, filter, geo_filter)); // postgis请求
            // 对应card.items中的项目，card.items实际上为数据源筛选条件 1个数据数据只有一个筛选条件（条件本身聚合）
            pssMap[pss.length - 1] = { card, item, filter };
          }
        });
      });
      let { startCalc, data, pIndex } = this.props;
      const { name } = data || {};
      startCalc && startCalc({
        ...{ ...geo_filter, spatial_relation: screening_method },
        _polygons: selectPolygons
      }, edit_cols, name, pIndex);
    });
    // console.log(cloneDeep(pss),'pss')
    // console.log(cloneDeep(pssMap),'pssMap')
    this.fetchDataCom(pss, pssMap, "", !geo_filter);
  };

  /**
   *
   * @param {*} card 单个静态卡片引用
   * @param {*} index
   */
  fetchDataForStaticCards = async () => {
    let {
      active_layer_ids_for_static_cards: act_ids_st,
      bgPolygonDataByStaticCards: bgdtbsc, static_cards
    } = this.state;
    let pss = [], pssMap = {}; //
    forEach(static_cards, card => {
      let { geo_filter, selectPolygons } = this.computeGeoFilter(card, act_ids_st[card.uid], bgdtbsc);
      forEach(card.items, item => {
        item = item || {};
        let { object_type, geometry_type, source, packageId } = item;
        forEach(item.filters, filter => {
          let node = { object_type, geometry_type, source, packageId };
          pss.push(this.postStyleToMap(node, filter, geo_filter));
          // 对应card.items中的项目，card.items实际上为数据源筛选条件 1个数据数据只有一个筛选条件（条件本身聚合）
          pssMap[pss.length - 1] = { card, item, filter };
        });
      });
    });
    this.fetchDataCom(pss, pssMap, "static");
  };

  deleteFilter = (args) => {
    let { cards } = this.state;
    let removeItems = [];
    forEach(cards, c => {
      let items = [];
      forEach(c.items, t => {
        if (this.isEqualGeoFilter(t, args)) {
          forEach(t.filters, f => {
            removeItems.push([c.uid, f.uid]);
          });
        } else {
          items.push(t);
        }
      });
      c.items = items;
    });
    setTimeout(() => {
      forEach(removeItems, t => {
        this.removeDataOnMapFilter(t[0], t[1]);
        this.deleteVoronoi(t[0], t[1]);
      });
    });
    this.setState({ cards });
  };

  deleteFilterCol = (args, colkey) => {
    let { cards } = this.state;
    forEach(cards, c => {
      forEach(c.items, t => {
        if (this.isEqualGeoFilter(t, args)) {
          forEach(t.filters, f => {
            f.filters = filter(f.filters, ff => ff.key != colkey);
          });
        }
      });
    });
    this.setState({ cards });
  };

  /**
   * 改变地图状态
   * @param mapState 状态码 4-自定义围栏选择 1-自定义区域选择 2-自定义距离选择 6-buffer选择
   * @param fence 选中的数据
   */
  changeMapState = (mapState, fence) => {
    let { mapState: lastMapState, active_layer_ids, current_geo_filter: geo_filter, bgPolygonData } = this.state;
    if (lastMapState !== mapState) {
      this.setState({ mapState }, () => {
        this.clearMap(mapState !== buffer_select);
        if (mapState == fence_select) {//如果是自定义围栏筛选
          let { object_type, geometry_type, source, packageId } = geo_filter;
          source = source || source_customer;
          packageId = packageId || "";
          object_type && this.addBgPolygon({ source, packageId, object_type });
        }
        this.startDraw();
      });
      return;
    }
    //如果上次mapstate和这次相同
    if (!fence) {
      if (mapState !== buffer_select) {
        this.startDraw();
      }
      return;
    }
    if (!size(fence)) return;
    let { object_type, [PolygonSourceKey]: source, [PolygonPackageIdKey]: packageId } = fence;
    // console.log('fence:', fence)
    source = source || source_customer;
    packageId = packageId || "";
    let bgData = bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type];
    let fence_data = object_type ? bgData : [];
    if (fence.id == 0) { //全选
      if (active_layer_ids[0]) { //清空
        active_layer_ids = {};
      } else { //全选
        active_layer_ids = { 0: { id: 0, object_type, name: `全部 ( ${object_type} )`, source, packageId } };
      }
    } else {
      if (active_layer_ids[0]) { //取消选中
        delete active_layer_ids[0];
        forEach(bgData, t => {
          active_layer_ids[t.id] = { id: t.id + "", object_type, name: t.name, source, packageId };
        });
        delete active_layer_ids[fence.id];
      } else {
        if (!!size(fence)) {
          if (active_layer_ids[fence.id]) { //取消选中
            delete active_layer_ids[fence.id];
          } else { //选中
            active_layer_ids[fence.id] = fence;
            let allSelect = true;
            forEach(fence_data, t => {
              if (!active_layer_ids[t.id] && t.id) {
                allSelect = false;
                return false;
              }
            });
            if (allSelect) {
              active_layer_ids = {
                0: {
                  id: 0,
                  name: `全部 ( ${object_type} )`,
                  object_type,
                  source,
                  packageId
                }
              };
            }
          }
        } else {
          active_layer_ids = {};
        }
      }
    }

    let { cards } = this.state;
    cards = this.updateCardsGeoFilters(cards, active_layer_ids, object_type, source, packageId);
    this.setState({ cards, active_layer_ids }, () => {
      this.updateActiveBgPolygon(source, packageId, object_type);
    });
  };

  // 原重新绘制按钮 触发
  onRedraw = () => {
    this.resetDraw();
  };

  // 删除自定义绘制
  onClearDraw = () => {
    this.clearOverlays();
  };

  //是否初始化数据
  changeInitType = () => {
    this.setState({ init_type: !this.state.init_type });
  };

  //删除某个围栏
  clearGeoFilterOnlyOne = (obj) => {
    // console.log(obj, '删除某个围栏')
    const geo_filters = this.state.geo_filters.filter((current) => {
      return !this.isEqualGeoFilter(current, obj);
    });
    let { geo_filter } = this.state;
    if (this.isEqualGeoFilter(geo_filter, obj)) {
      geo_filter = {};
    }
    this.setState({
      geo_filter,
      geo_filters,
      active_layer_ids: {},
      mapState: fence_select
    }, () => {
      this.setGeoFilter();
      this.clearMap();
    });
  };
};

export default FetchDataMixin;
