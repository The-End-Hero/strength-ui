import * as maptalks from "maptalks";
import { bmapStyles } from "../../../utils/mapstyle";
import $ from "jquery";
import forEach from "lodash/forEach";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import size from "lodash/size";
import map from "lodash/map";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import { buffer_select, self_select, dis_select, fence_select, editPolygonCfg } from "../../../constants/constants";

const resetOffset = [12, 126];
const toolOffset = [12, 40];
const scaleOffset = [12, 5];
let lastLeftWidth = 0;

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
const VECTOR_LAYER_ID = "VECTOR_LAYER_ID";
// const CoordToArray = maptalks.Coordinate.toNumberArrays;
const LoadMixin = superclass => class LoadMixin extends superclass {
  loadMap = async () => {
    const { is_static_map } = this.state;
    if (!is_static_map) {
      if (!this.map) {
        const { map_info, map_style } = this.props;
        this.map = new maptalks.Map(this.mapId, {
          center: map_info.location.split(","),
          zoom: map_info.zoom,
          scrollWheelZoom: true,
          spatialReference: {
            projection: "baidu"
          },
          baseLayer: new maptalks.TileLayer("base", bmapStyles[map_style || "base"])
        });

        const map = this.map;
        // 加载/初始化地图工具
        this.initResetBtn();
        this.initZoomBar(map);
        this.initScaleBar(map);
        this.initRangingTool(map);
        this.initMapOther(map);
      }
    } else if (is_static_map) {
      if (this.map) this.map.remove();
    }
  };
  initMapOther = async (mapView) => {
    const map = mapView;
    this.vector_layer = new maptalks.VectorLayer(VECTOR_LAYER_ID).addTo(map);
    this.renderMap();
    await this.setactive_layer_idsByStaticCards();
    await this.renderStaticCardsToMap();

    let infoWindow = new maptalks.ui.InfoWindow({
      autoPan: false,
      autoOpenOn: false,
      custom: true
    });
    infoWindow.addTo(map);
    this.infoWindow = infoWindow;

    map.on("click", this.onMapClick);
  };
  initResetBtn = () => {
    $(".maptalks-control").append(`
            <div class="mb_reset_control">
                <i class="material-icons">replay</i>
            </div>
        `);
    $(".mb_reset_control").css({ bottom: resetOffset[1] });
    $(".mb_reset_control").on("click", this.onClickReset);
  };
  //设置样式
  setMapStyle = (map_style) => {
    if (map_style === "base") {
      $("body").removeClass("map_style_light");
    } else {
      $("body").addClass("map_style_light");
    }
    if (this.map) this.map.setBaseLayer(new maptalks.TileLayer("base", bmapStyles[map_style]));
    this.setState({
      map_style
    });
  };
  onClickReset = () => {
    this.map.animateTo({
      "pitch": 0,
      "bearing": 0
    });
  };
  initZoomBar = (map) => {
    //add zoom tool
    this.toolBar = new maptalks.control.Zoom({
      "position": "bottom-left",
      "slider": false,
      "zoomLevel": true
    }).addTo(map);
    let $toolBar = $(this.toolBar.getContainer());
    $toolBar.addClass("mb_toolbar_control");
    $toolBar.css({ left: toolOffset[0] + lastLeftWidth, bottom: toolOffset[1] });
  };
  initScaleBar = (map) => {
    //add scale tool
    this.scale = new maptalks.control.Scale({
      position: "bottom-left",
      maxWidth: 160
    }).addTo(map);
    let $scale = $(this.scale.getContainer());
    $scale.addClass("mb_scale_control");
    $scale.css({ left: scaleOffset[0] + lastLeftWidth, bottom: scaleOffset[1] });
  };
  initRangingTool = (map) => {
    this.distanceTool = new maptalks.DistanceTool({
      "once": true,
      "symbol": {
        "lineColor": "#34495e",
        "lineWidth": 2
      },
      "vertexSymbol": {
        "markerType": "ellipse",
        "markerFill": "#1bbc9b",
        "markerLineColor": "#000",
        "markerLineWidth": 3,
        "markerWidth": 10,
        "markerHeight": 10
      }
      //'language' : 'en-US'
    }).addTo(map);
    this.distanceTool.disable();
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

};

export default LoadMixin;
