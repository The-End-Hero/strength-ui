"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {
  cloneDeep, map, find, forEach, indexOf, get, size, filter,
  isNumber, startsWith, minBy, maxBy, orderBy
} from "lodash";
import { polyOptA2S, getCenterLngLat } from "../../../utils/bmapUtil";
import amapUtil from "../../../utils/amapUtil";
// import fetchUtil from "../../../utils/fetchUtil";
import alertUtil from "../../../utils/alertUtil";
import queryUrl from "../../../utils/queryUrl";
// import { model_api_url, map_api_url, headers, oss_hosts, oss_buckets } from "constants/ApiConfig";
import coordtrans from "../../../utils/coordtrans";
// import InfoWindow from "../../../UploadNew/components/InfoWindow";
import {
  searchDataSelectRef, geo_types,
  dis_select, self_select, fence_select, buffer_select,
  h_type_date, h_type_number, h_type_text, map_poi_icons as poi_icons, visualization_colors,
  mapHeaderKey, tableIcons, MapVisualTypes, source_customer,
  source_market, PolygonSourceKey, PolygonPackageIdKey, custom_card_menu,
  mapServerPointConfig, mapServerLineConfig, mapServerPolygonConfig, market_label_tip
} from "../../../constants/Constants";
import * as maptalks from "maptalks";

const nameType = { h_value: "名称", h_type: h_type_text, key: "name", db: "str" };
const addressType = { h_value: "地址", h_type: h_type_text, key: "address", db: "str" };

const BG_LAYER_ZINDEX = 5;

const MapClickMixin = (superclass) => class MapClickMixin extends superclass {
  // 地图是否可以点击
  disableMapClick = (disabled) => {
    this.mapClickDisabled = disabled;
  };

  // 请求最近点位
  getNearest = (postBody) => {
    return //fetchUtil(`${model_api_url}query/nearest`, { method: "POST", headers, body: postBody });
  };

  // 更新点选围栏
  updateActiveBgPolygon = async (source, packageId, object_type) => {
    source = source || source_customer;
    packageId = packageId || "";
    let { active_layer_ids, current_geo_filter: { filters } } = this.state;
    //删除图层
    this.removeBgActiveLayer();
    let filter = filters && filters[0] || {};
    let { cur_visual, hidden, style: robj } = filter;
    if (hidden || !this.map) return; //如果隐藏则不请求

    let node = { source, packageId, object_type, geometry_type: geo_types.polygon };
    let resp;
    try {
      resp = await this.postActiveBgStyleToMap(node, active_layer_ids);
      if (!resp) return;
      if (resp.rc) {
        !'录屏' && alertUtil.alertMsg(resp.Msg || "暂无数据");
        return;
      }
    } catch (err) {
      console.error(err);
      alertUtil.alertMsg("网络错误");
      return;
    }
    let layer = this._getMapTile({
      style_id: resp.style,
      layer_id: null, zIndex: BG_LAYER_ZINDEX + 1
    });
    if (layer && this.map) layer.addTo(this.map);
    this.activeLayer = layer;
  };

  // 获取选中的背景围栏style
  postActiveBgStyleToMap = (node, active_layer_ids) => {
    let { source, packageId, object_type, geometry_type } = node;
    let body = this._prepareBgActiveStyle(active_layer_ids, source);
    if (!body) return;
    let params = {};
    if (source == source_customer) {
      params = { geo_type: geometry_type };
    }
    return this._postStyleToMap(node, params, body);
  };

  // 多地理部分
  selectMultBgLayer = (clickPolygon) => {
    let { id, name, source, packageId, geometry_type, object_type } = clickPolygon;
    let { active_layer_ids, bgPolygonData } = this.state;
    source = source || source_customer;
    var bgData = bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type];
    if (active_layer_ids[0]) { //全选；
      delete active_layer_ids[0];
      forEach(bgData, t => {
        active_layer_ids[t.id] = {
          id: t.id + "",
          object_type,
          name: t.name,
          source: t[PolygonSourceKey],
          packageId: t[PolygonPackageIdKey]
        };
      });
      delete active_layer_ids[id];
    } else if (active_layer_ids[id]) {
      delete active_layer_ids[id];
    } else {
      active_layer_ids[id] = { id: id + "", object_type, name: name, source, packageId };
      var allSelect = true;
      var fence_data = bgData;
      forEach(fence_data, t => {
        if (!active_layer_ids[t.id] && t.id) {
          allSelect = false;
          return false;
        }
      });
      if (allSelect) {
        active_layer_ids = { 0: { id: 0, name: `全部 ( ${object_type} )`, object_type, source, packageId } };
      }
    }
    var { cards } = this.state;
    cards = this.updateCardsGeoFilters(cards, active_layer_ids, object_type, source, packageId);
    // console.log("onclick: ",cards, active_layer_ids);
    this.setState({ cards, active_layer_ids }, () => {
      this.updateActiveBgPolygon(source, packageId, object_type);
    });
  };

  /**
   * 设置点选图层
   * @param clickPolygon {围栏信息等}
   */
  selectBgLayer = (clickPolygon) => {
    let { id, name, source, packageId, geometry_type, object_type } = clickPolygon;
    let { active_layer_ids, bgPolygonData } = this.state;
    source = source || source_customer;
    var bgData = bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type];
    if (active_layer_ids[0]) { //全选；
      delete active_layer_ids[0];
      forEach(bgData, t => {
        active_layer_ids[t.id] = {
          id: t.id + "",
          object_type,
          name: t.name,
          source: t[PolygonSourceKey],
          packageId: t[PolygonPackageIdKey]
        };
      });
      delete active_layer_ids[id];
    } else if (active_layer_ids[id]) {
      delete active_layer_ids[id];
    } else {
      active_layer_ids[id] = { id: id + "", object_type, name: name, source, packageId };
      var allSelect = true;
      var fence_data = bgData;
      forEach(fence_data, t => {
        if (!active_layer_ids[t.id] && t.id) {
          allSelect = false;
          return false;
        }
      });
      if (allSelect) {
        active_layer_ids = { 0: { id: 0, name: `全部 ( ${object_type} )`, object_type, source, packageId } };
      }
    }
    var { cards } = this.state;
    cards = this.updateCardsGeoFilters(cards, active_layer_ids, object_type, source, packageId);
    // console.log("onclick: ",cards, active_layer_ids);
    this.setState({ cards, active_layer_ids }, () => {
      this.updateActiveBgPolygon(source, packageId, object_type);
    });
  };

  // 获取单个数据的 数据源信息
  getSingleDataSource = (item) => {
    let source = item.source || source_customer;
    if (source == source_customer) {
      return {
        source: source_customer,
        object_type: item.object_type,
        geometry_type: item.geometry_type
      };
    } else {
      return {
        source: item.source,
        package_id: item.packageId
      };
    }
  };

  //get search data source
  getSearchDataSource = () => {
    let data_source:any = [], card_filter_map:any = [];
    let { geo_filter, cards, static_cards, mapState, current_geo_filter } = this.state;
    // console.log('current_geo_filter:', current_geo_filter, geo_filter)
    if (size(current_geo_filter) >= 2 && mapState == fence_select) {
      data_source.push(this.getSingleDataSource(current_geo_filter));
      card_filter_map.push({ is_geo_filter: true }); //
    }

    forEach(cards, c => {
      forEach(c.items, t => {
        let allHidden = true;
        forEach(t.filters, f => {
          if (!f.hidden && size(f.info_cfg)) {
            allHidden = false;
          }
        });
        if (!allHidden) {
          data_source.push(this.getSingleDataSource(t as any));
          card_filter_map.push({ 
            card_id: c.uid,
            filter_id: t.filters[0].uid 
          });
        }
      });
    });

    forEach(static_cards, c => {
      forEach(c.items, t => {
        let allHidden = true;
        forEach(t.filters, f => {
          if (!f.hidden && size(f.info_cfg)) {
            allHidden = false;
          }
        });
        if (!allHidden) {
          data_source.push(this.getSingleDataSource(t));
          card_filter_map.push({ card_id: c.uid, filter_id: t.filters[0].uid, is_static: true });
        }
      });
    });

    return [data_source, card_filter_map];
  };

  // 处理地理点击事件
  onMapClick = async (param) => {
    if (this.mapClickDisabled) return;
    let { current_geo_filter, geo_filters } = this.state;
    let map = this.map;
    let [lng, lat] = param.coordinate.toArray();
    let lnglat = coordtrans.bd09towgs84(lng, lat);
    // 获取地图比例尺
    let resolution = map.getResolution(map.getZoom());
    resolution = resolution * 6;
    // 需要查询的内容
    let [data_source, card_filter_map] = this.getSearchDataSource();

    if (!data_source.length) return;
    let postBody = JSON.stringify({
      "lng": lnglat.lng,
      "lat": lnglat.lat,
      "max_distance": resolution,
      "top": 1,
      "data_source": data_source
    });
    // 发送最近地理记录请求
    let resp;
    try {
      resp = await this.getNearest(postBody);
    } catch (err) {
      console.error(err);
    }
    if (!resp || !resp.result) return;

    // 拆分结果
    let poiRecords:any = [], lineRecords:any = [], polygonRecords:any = [], pointToPolygonRecords:any = [];
    forEach(resp.result, (t, idx) => {
      let card_filter = card_filter_map[idx];
      const package_id = t.package_id;
      forEach(t.records, r => {
        r.card_filter = card_filter;
        if (!r.geometry) return;
        r.packageId = t.package_id;
        r.source = t.source;
        let geoType = r.geometry.type;
        // TODO: 查询源数据.进行类别识别
        // source
        // 数据源 数据市场(多地理目前只有数据市场)且id相等 且 为点到面
        const geo_mult = find(geo_filters, { packageId: package_id });
        // console.log(geo_mult,'geo_mult')
        if (geoType === "Point") {
          r.geometry_type = geo_types.point;
          poiRecords.push(r);
        } else if (geoType === "LineString" || geoType === "MultiLineString") {
          r.geometry_type = geo_types.line;
          lineRecords.push(r);
        } else if (geoType === "Polygon" || geoType === "MultiPolygon") {
          r.geometry_type = geo_types.polygon;
          !r.distance && polygonRecords.push(r);
        } else if (geo_mult) {
          r.geometry_type = geo_mult.geo_type;
          pointToPolygonRecords.push(r);
        }
      });
    });
    // console.log(poiRecords, lineRecords, polygonRecords);
    // 优先点击顺序 点>线>面>交互围栏
    let zIndexOrder:any = [];
    forEach(this.layerIndex, t => {
      forEach(t, y => {
        zIndexOrder.push(y);
      });
    });
    zIndexOrder = orderBy(zIndexOrder, ["zIndex"]);
    // point
    if (this.dealClickOrder(poiRecords, zIndexOrder, undefined)) {
      return;
    }
    // polyline
    let point = { lng, lat };
    if (this.dealClickOrder(lineRecords, zIndexOrder, point)) {
      return;
    }
    // polygon
    if (this.dealClickOrder(polygonRecords, zIndexOrder, point)) {
      return;
    }

    // 如果是选中交互围栏
    let clickPolygon: any = polygonRecords[0];
    if (size(current_geo_filter) && this.isEqualGeoFilter(current_geo_filter, clickPolygon)) {
      clickPolygon.object_type = current_geo_filter.object_type;
      this.selectBgLayer(clickPolygon);
    }
    let clickPoi2Pol: any = pointToPolygonRecords[0];
    if (size(current_geo_filter) && this.isEqualGeoFilter(current_geo_filter, clickPoi2Pol)) {
      clickPoi2Pol.object_type = current_geo_filter.object_type;
      this.selectMultBgLayer(clickPoi2Pol);
    }
  };

  // 处理点击顺序
  dealClickOrder = (records, orders, point) => {
    let findPoi;
    forEach(orders, p => {
      let tmp = find(records, t => this.isEqualGeoFilter(p, t));
      if (tmp) {
        findPoi = tmp;
        return false;
      }
    });
    if (findPoi) {
      this.openInfoWindow(findPoi, point);
      return true;
    }
    return false;
  };

  /**
   * 展示地理信息框
   * @param info
   * @param lnglat
   */
  // openInfoWindow = (info, lnglat) => {
  //     let mapIns = this.getMapInstance()
  //     if (!mapIns) return
  //     var { columnTypes, cards, static_cards } = this.state
  //     let { object_type, geometry_type, source, packageId, card_filter } = info || {}
  //     let { card_id, filter_id, is_geo_filter, is_static } = card_filter
  //     if(source===source_market) object_type=`${object_type}${market_label_tip}`
  //     if (is_geo_filter) return //todo:: 底层围栏是否需要信息弹出层
  //     let fromCards = !is_static ? cards : static_cards
  //     let [card, fdItem, fdFilter] = this.findCardAndFilter(fromCards, card_id, filter_id)
  //     let tableHeader = map(get(columnTypes, `${source}.${packageId}.${geometry_type}.${object_type}`), t => {
  //         return {
  //             id: `extra.${t.key}`, title: t.h_value, type: t.h_type,
  //             ct: t
  //         }
  //     })
  //     tableHeader.unshift({ id: 'address', title: '地址', ct: addressType })
  //     tableHeader.unshift({ id: 'name', title: '名称', ct: nameType })
  //     // console.log('fdFilter::::', card, fdFilter, tableHeader);
  //
  //     let content = document.createElement('div')
  //     content.className = 'tooltip tooltip-static-trans map_mark_info_window'
  //
  //     let selectedIds = []
  //     map(fdFilter.info_cfg, t => {
  //         if (t.key === 'name' || t.key === 'address') {
  //             selectedIds.push(t.key)
  //         } else {
  //             selectedIds.push(`extra.${t.key}`)
  //         }
  //     })
  //     if (!size(selectedIds)) return
  //     ReactDOM.render(
  //         <InfoWindow tableHeader={tableHeader}
  //                     data={info}
  //                     canDelete={false}
  //                     editing={false}
  //                     selectedIds={selectedIds}
  //                     onClose={this.closeInfoWindow}
  //                     onFinish={(ids) => this.onSelectShowHeaders(ids, info, lnglat, fdFilter, tableHeader)}
  //                     getMapIns={this.getMapInstance}
  //                     robj={fdFilter.style}
  //         />, content)
  //
  //     let { lng, lat } = lnglat || info
  //     if (!lnglat && (geometry_type === geo_types.polygon || geometry_type === geo_types.line)) {
  //         let center = getCenterLngLat(info) || []
  //         lng = center[0]
  //         lat = center[1]
  //     }
  //     if (!lng || !lat) {
  //         return
  //     }
  //     lnglat = lnglat || coordtrans.wgs84tobd09(lng, lat)
  //     this.infoWindow.info = info
  //     this.infoWindow.lnglat = lnglat
  //     this.infoWindow.setContent(content)
  //     this.infoWindow.show(new maptalks.Coordinate(lnglat.lng, lnglat.lat))
  // }

  /**
   * 地理信息设置可展示字段
   * @param ids
   * @param info
   * @param lnglat
   */
  // onSelectShowHeaders = (ids, info, lnglat, filterCfg, tableHeader) => {
  //     // console.log(ids)
  //     let info_cfg = []
  //     forEach(ids, id => {
  //         let f = find(tableHeader, t => t.id == id)
  //         info_cfg.push(f.ct)
  //     })
  //     filterCfg.info_cfg = info_cfg
  //     this.forceUpdate()
  //     this.openInfoWindow(info, lnglat)
  // }

  /**
   * 关闭地理信息框
   */
  // closeInfoWindow = () => {
  //     this.infoWindow && this.infoWindow.hide()
  // }

};
export default MapClickMixin;
