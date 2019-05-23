import React, { Component } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import _map from "lodash/map";
import forEach from "lodash/forEach";
import size from "lodash/size";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import amapUtil from "../../utils/amapUtil";
import mix from "mix-with";
import RemoveMixin from "./mixins/removeMixin";
import LoadMixin from "./mixins/loadMixin";
import BgMixin from "./mixins/bgMixin";
import WindowInfoMixin from "./mixins/windowInfoMixin";
import RenderDataMixin from "./mixins/renderDataMixin";
import MapActMixin from "./mixins/mapActMixin";

import coordtransform from "coordtransform";

const uuidv1 = require("uuid/v1");
import {
  sizes,
  types,
  fence_select,
  link_symbol,
  self_select,
  buffer_select,
  dis_select,
  source_customer,
  activeOpt
} from "../../constants/constants";

class Amap extends Component {
  static defaultProps = {
    prefixCls: "mc-amap",
    href: "",
    type: types.default,
    size: sizes.default,
    loading: false,
    block: false,
    disabled: false,
    hollow: false,
    dashed: false,
    circle: false,
    plain: false,

    cards: [
      {
        items: [
          {
            filters: [
              {
                uid: "",
                info_cfg: "",
                show_col: ""
              }
            ],
            source: ""

          }
        ],
        uid: "card_f57ad610-f2e9-11e8-b796-fdf5baa4a33b"
      }
    ], // 卡片数据
    static_cards: [], // 静态卡片数据
    current_geo_filter: {}, // 当前围栏数据
    name: "", // UUID
    map_info: {
      location: "119.829116,31.731509",
      scale: 1,
      size: "400*400",
      zoom: 10
    }, // 地图信息
    data_alias: {}, // 数据别名
    init_type: true, // 是否初始化数据
    map_style: "base", //地图样式
    is_static_map: false, // 是否是静态地图


    data: {},
    data_style: {},
    data_show_col: {}

  };
  static propTypes = {
    prefixCls: PropTypes.string.isRequired,
    block: PropTypes.bool,
    hollow: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    dashed: PropTypes.bool,
    circle: PropTypes.bool,
    plain: PropTypes.bool,
    htmlType: PropTypes.string,
    href: PropTypes.string,
    type: PropTypes.oneOf(Object.values(types)),
    size: PropTypes.oneOf(Object.values(sizes)),

    name: PropTypes.string.isRequired,
    current_geo_filter: PropTypes.object,
    map_info: PropTypes.object,
    data_alias: PropTypes.object,
    init_type: PropTypes.bool.isRequired,
    map_style: PropTypes.string.isRequired,
    is_static_map: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    const data = this.setNewState(props);
    this.state = {
      fullscreencenter: false,
      map_style_light: false, // 浅色地图class
      map_style_wxt: false, // 卫星图class
      mapUId: props.UId || `geo_${uuidv1()}`,
      ...data
    };
    this.mapId = `mc-map-${uuidv1()}`;
    this.map = null;
    this.layers = {};
    this.massMarkers = {}; // 单地理下,文字
    this.multMassMarkers = {}; // 多地理下,文字
    this.heatMaps = {}; // 单地理热力
    this.multHeatMaps = {}; // 多地理热力
    this.polygonLayers = {}; // 数据面
    this.lineLayers = {}; // 数据线
  }

  componentDidMount() {
    this.loadAMap();
  }

  componentWillUnmount() {
    this.map = null;
    this.layers = {};
    // 卸载map暴露接口
    if (window.map_instance) delete window.map_instance[this.state.mapUId];
  }

  async componentWillReceiveProps(nextProps) {
    const {
      current_geo_filter,
      active_layer_ids,
      cards,
      map_style
    } = nextProps;
    if (!isEqual(nextProps, this.props)) {
      // props变化
      console.log("props变化");
      // this.clearMap();
    }

    // 是否更新背景围栏,默认false
    let updateBg = false;

    if (!isEqual(map_style, this.state.map_style)) {
      this.setAMapStyle(map_style);
    }
    /**
     * cards变化
     * 1.整个cards变化,换新数据 走移除重新渲染
     * 2.cards内部变化,如颜色,热力大小,等,不牵扯数据集变化 走update
     */
    if (!isEqual(cards, this.state.cards)) {
      this.state.cards.map(current => {
        // 仅对cards内部进行清除
        this.clearLayerJustByCards(current.uid);
      });
      // const data = this.setNewState(nextProps);
      await this.setState({
        cards
      });
      this.addCardsDataToMap();
    }
    /**
     * 围栏变化
     * 1.换新围栏 移除重新渲染
     * 2.围栏点选变化 走update
     */
    if (
      !isEqual(current_geo_filter, this.state.current_geo_filter) ||
      !isEqual(active_layer_ids, this.state.active_layer_ids)
    ) {
      const {
        geometry_type: gt1,
        object_type: ot1,
        source: s1,
        packageId: pi1
      } = this.state.current_geo_filter;
      const {
        geometry_type: gt2,
        object_type: ot2,
        source: s2,
        packageId: pi2
      } = current_geo_filter;
      if (gt1 === gt2 && ot1 === ot2 && s1 === s2 && pi1 === pi2) {
        alert("bg数据包未变化");
        updateBg = true;
      }
    }

    // 统一设置state
    const data = this.setNewState(nextProps);
    await this.setState({
      ...data
    });
    // 根据各自情况,选择走重新绘制还是更新视图
    if (updateBg) {
      this.updateBgPolygon();
    } else {
      this.addBgPolygon();
    }
  }

  setNewState = props => {
    return {
      loading: props.loading || false,
      cards: props.cards,
      static_cards: props.static_cards,
      current_geo_filter: props.current_geo_filter,
      map_style: props.map_style,
      map_state: props.map_state,
      active_layer_ids: props.active_layer_ids,
      active_layer_ids_for_static_cards: props.active_layer_ids_for_static_cards,
      data: props.data,
      data_style: props.data_style,
      data_show_col: props.data_show_col

    };
  };

  /**
   * 返回card_id的card, 返回对应filter_id的item, 返回对应filter_id的item里面的filter
   * @param cards
   * @param card_id
   * @param filter_id
   * @returns {*[]} [返回card_id的card, 返回对应filter_id的item, 返回对应filter_id的item里面的filter]
   */
  findCardAndFilter=(cards, card_id, filter_id) =>{
    let card = find(cards, c => c.uid === card_id) || {};
    let fdFilter = {};
    let fdItem =
      find(card.items, t => {
        let tmp = t && find(t.filters, f => f.uid === filter_id);
        if (tmp) {
          fdFilter = tmp;
          return true;
        } else {
          return false;
        }
      }) || {};
    return [card, fdItem, fdFilter];
  }

  setAMapStyle = style => {
    if (!this.map) return;
    console.log(style, "style");
    let sm = "light";
    if (style === "base") {
      if (this.satellite) this.satellite.hide();
      this.map.setMapStyle("amap://styles/d65140aa79f193e1cd49a4142a54fb94");
      this.map.setLabelzIndex(110);
      this.setState({
        map_style: style,
        map_style_light: false,
        map_style_wxt: false
      });
      // $("body").removeClass("map_style_light");
      // $("body").removeClass("map_style_wxt");
    } else if (style === "normal") {
      if (this.satellite) this.satellite.hide();
      this.map.setMapStyle(`amap://styles/${sm}`);
      this.map.setLabelzIndex(110);
      this.setState({
        map_style: style,
        map_style_light: true,
        map_style_wxt: false
      });
      // $("body").addClass("map_style_light");
      // $("body").removeClass("map_style_wxt");
    } else {
      if (this.satellite) this.satellite.show();
      this.map.setMapStyle(`amap://styles/${sm}`);
      this.map.setLabelzIndex(-1);
      this.setState({
        map_style: style,
        map_style_light: false,
        map_style_wxt: true
      });
      // $("body").removeClass("map_style_light");
      // $("body").addClass("map_style_wxt");
    }
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
  updateCardsGeoFilters(
    cards,
    active_layer_ids,
    object_type,
    source,
    packageId
  ) {
    cards[0].geo_filters = {
      type: fence_select,
      object_type,
      source,
      packageId,
      filters: _map(active_layer_ids, t => {
        let sid = `${t.object_type}_${t.id}`;
        const data = {
          id: sid,
          pid: t.object_type,
          oid: t.id,
          name: t.name,
          source: t.source,
          packageId: t.packageId
        };
        return data;
      })
    };
    return cards;
  }

  /**
   * 获取data数据集的 中心点（坐标系）
   * @param data
   * @returns {*}
   */
  getCenterLngLat =(data) =>{
    if (data.geometry.type === "Point") {
      return data.geometry.coordinates;
    }
    if (data.geometry.type === "Polygon") {
      let points = data.geometry.coordinates[0];
      return amapUtil.getPolygonCenter(points);
    }
    if (data.geometry.type === "MultiPolygon") {
      let points = data.geometry.coordinates[0][0];
      return amapUtil.getPolygonCenter(points);
    }
    if (data.geometry.type === "LineString") {
      let len = data.geometry.coordinates.length;
      return data.geometry.coordinates[Math.floor((len - 1) / 2)];
    }
    if (data.geometry.type === "MultiLineString") {
      let len = data.geometry.coordinates[0].length;
      return data.geometry.coordinates[0][Math.floor((len - 1) / 2)];
    }
  }

  onFullScreenCenter = async () => {
    await this.setState({ fullscreencenter: !this.state.fullscreencenter });
  };


  /**
   * 改变地图状态  geoselecttop中选中逻辑
   * @param mapState 状态码 4-自定义围栏选择 1-自定义区域选择 2-自定义距离选择 6-buffer选择
   * @param fence 选中的数据
   */
  changeMapState = (mapState, fence) => {
    // console.log(mapState, fence,'改变地图状态')
    // let {mapState: lastMapState, active_layer_ids, geo_filter, bgPolygonData} = this.state;
    let { mapState: lastMapState, active_layer_ids, current_geo_filter: geo_filter, bgPolygonData } = this.state;
    if (lastMapState !== mapState) {// 状态和上一次不一致
      this.setState({ mapState }, () => {
        this.clearMap(mapState !== buffer_select);
        if (mapState == fence_select) { // 4 自定义围栏选择
          let { object_type, geometry_type, source, packageId } = geo_filter;
          source = source || source_customer;
          packageId = packageId || "";
          let bgData = bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type];
          object_type && this.addBgPolygon(source, packageId, object_type, bgData);
        }
        this.startDraw();
      });
    } else {
      if (fence) {
        let { object_type, [PolygonSourceKey]: source, [PolygonPackageIdKey]: packageId } = fence;
        source = source || source_customer;
        packageId = packageId || "";
        let bgData = bgPolygonData[source] && bgPolygonData[source][packageId] && bgPolygonData[source][packageId][object_type];
        let fence_data = object_type ? bgData : [];
        // console.log(bgData,fence_data,'000000----0000000')
        if (fence.id == 0) { //全选
          if (active_layer_ids[0]) { //清空
            active_layer_ids = {};
          } else { //全选
            active_layer_ids = {
              0: {
                id: 0,
                object_type,
                name: `全部 ( ${object_type} )`,
                source,
                packageId
              }
            };
          }
        } else {
          if (active_layer_ids[0]) { //取消全部选中
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
        // console.log(cards,'cards---changeMapState')
        this.setState({ cards, active_layer_ids }, () => {
          forEach(this.layers && this.layers[source] && this.layers[source][packageId] && this.layers[source][packageId][object_type], (t, id) => {
            forEach(t, l => {
              if (!l) return;
              if (active_layer_ids[id] || active_layer_ids[0]) {
                l.setOptions(activeOpt);
              } else {
                let extData = l.getExtData() || {};
                let { lastOpt } = extData;
                l.setOptions(lastOpt);
              }
            });
          });
          // 点到面 围栏
          if (bgData && bgData[0].geometry && bgData[0].geometry.type == "Point" && bgData[0]._display_geometry_ && bgData[0]._display_geometry_.type.indexOf("Polygon") > -1) {
            let mapIns = this.getMapInstance();

            forEach(active_layer_ids, (t) => {
              const layers = get(this.layers, `[${source}][${packageId}][${object_type}][${t.id}]`);
              mapIns && layers && mapIns.remove(layers);
              this.getPointToPolygon({
                originalData: {
                  rawData: {
                    id: t.id,
                    name: t.name
                  }
                }
              }, source, packageId, object_type, true, bgData);
            });
          }
        });
      } else {
        if (mapState !== buffer_select) {
          this.startDraw();
        }
      }
    }
  };
  changeMapToolState = (pause = true) => {
    // let ref = this.refs[MAP_TOOL_REF];
    // ref && ref.pauseStyle(pause);
    if (pause) {
      this.offDrawAct();
    }
  };
  getGeoFilter = () => { // 获取geofilter 返回值用来给cards[0].geo_filter赋值
    let geo_filter;
    if (size(this.drawpolygon)) { //用户自定义绘制
      let allDp = _map(this.drawpolygon, t => t);
      if (allDp[0].CLASS_NAME === "AMap.Polygon") {
        let cds = [];
        forEach(this.drawpolygon, polygon => {
          let paths = polygon.getPath();
          if (Array.isArray(paths[0])) {
            paths = paths[0];
          }
          paths = cloneDeep(paths);
          paths.push(paths[0]); //首位闭合
          let coords = amapUtil.getTransCoords(paths);
          cds.push([coords]);
        });
        let geoJson = amapUtil.wrapMultiPolygon(cds);
        geo_filter = { type: self_select, geoJson };
      } else if (allDp[0].CLASS_NAME == "AMap.Circle") {
        let circles = [];
        forEach(this.drawpolygon, circle => {
          let center = circle.getCenter();
          let dis = circle.getRadius();
          let ps = coordtransform.gcj02towgs84(center.lng, center.lat);
          circles.push([...ps, dis]);
        });
        geo_filter = { type: dis_select, circles };
      }
    } else if (size(this.active_layer_ids)) { //用户自由围栏选中 active_layer_ids
      let { object_type, source, packageId } = this.state.geo_filter;
      geo_filter = {
        type: fence_select,
        object_type,
        source,
        packageId,
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
  checkCards = (cards, geo_filter) => {
    if (!size(cards)) { // 如果有cards, 即筛选条件等
      geo_filter = geo_filter || this.state.current_geo_filter;//this.state.geo_filter;
      if (!size(geo_filter)) {
        return [{
          uid: `card_${uuidv1()}`,
          geo_filters: null,
          items: []
        }];
      }
      let { object_type, geometry_type, source, packageId } = geo_filter;
      source = source || source_customer;
      if (!size(this.layers && this.layers[source] && this.layers[source][packageId] && this.layers[source][packageId][object_type])) {
        let bgData = this.state.bgPolygonData;
        let addBg = bgData[source] && bgData[source][packageId] && bgData[source][packageId][object_type];
        this.addBgPolygon(source, packageId, object_type, addBg);
      }
      cards.push({
        uid: `card_${uuidv1()}`,
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
  getMapTool = () => {
    let MapTool = null;
    const { renderMapTool } = this.props;
    if (renderMapTool) MapTool = renderMapTool({
      is_server_render: false,
      onFullScreenCenter: this.onFullScreenCenter,
      fullscreencenter: this.state.fullscreencenter,
      selectMapStyle: this.setAMapStyle,
      saveAsJpeg: this.saveAsJpeg,
      turnOnRangingTool: this.turnOnRangingTool,
      mapStyle: this.state.map_style,
      hasCustomDraw: this.state.hasCustomDraw,
      mapState: this.state.mapState,
      pauseState: () => {
        console.log(123);
        this.offDrawAct();
      },
      selfSelect: () => {
        console.log(1112);
        this.changeMapState(self_select);
      },
      disSelect: () => {
        console.log(1113);
        this.changeMapState(dis_select);
      },
      emptySelect: () => {
        console.log(1114);
        this.onClearDraw();
      }
    });
    return MapTool;
  };
  getMapCards = () => {
    const { renderMapCards } = this.props;
    let mapcards = null;
    if (renderMapCards) {
      mapcards = renderMapCards({});
    }
    return mapcards;
  };

  render() {
    const { prefixCls } = this.props;
    const { map_style_light, map_style_wxt, loading, map_style, fullscreencenter } = this.state;
    return (
      <BlockUi
        tag="div"
        blocking={loading}
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          alignItems: "stretch"
        }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          {this.getMapTool()}
          <div style={{ width: "auto", position: "absolute", top: 0, right: 0, zIndex: 1 }}>
            {this.getMapCards()}
          </div>
          <div
            ref={ref => this.mapRef = ref}
            id={this.mapId}
            className={cls(`${prefixCls} ${map_style}`, {
              map_style_light,
              map_style_wxt,
              fullscreencenter
            })}
          />
        </div>
      </BlockUi>
    );
  }
}

const MixAmap = mix(Amap).with(
  RemoveMixin,
  LoadMixin,
  BgMixin,
  WindowInfoMixin,
  RenderDataMixin,
  MapActMixin
);

export default MixAmap;
