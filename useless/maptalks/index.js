import React, { Component } from "react";
import * as maptalks from "maptalks";
import mix from "mix-with";
import LoadMixin from "./mixins/loadMixin";
import MapToolMixin from "./mixins/mapToolMixin";
import MapClickMixin from "./mixins/mapClickMixin";
import MapClearMixin from "./mixins/mapClearMixin";
import PreStyleMixin from "./mixins/preStyle";
import MapCardMixin from "./mixins/mapCardMixin";
import FetchDataMixin from "./mixins/fetchDataMixin";
import { dis_select, self_select, source_customer } from "../../constants/constants";
import axios from "axios";
import "maptalks/dist/maptalks.css";
import { isEqual, cloneDeep, forEach } from "lodash";
import cls from "classnames";


const uuidv1 = require("uuid/v1");

class MapTalks extends Component {
  static defaultProps = {
    map_info: {
      location: "119.829116,31.731509",
      scale: 1,
      size: "400*400",
      zoom: 10
    }
  };

  constructor(props) {
    super(props);
    const data = this.setNewState(props);
    this.state = {
      bgPolygonData: {},
      ...data
    };
    this.map = null;
    this.mapId = `mc-map-${uuidv1()}`;


    this.layers = null;
    /**
     * staticLayers = {card_id:{source:{中海地产:[],...}}}
     * @type {{}}
     */
    this.staticLayers = {}; // 静态卡片的layers 分开渲染 清除
    this.poiLayers = {}; //点数据
    this.polygonLayers = {}; // 围栏数据
    this.lineLayers = {}; // 线数据
    this.markValue = {};
    // this.buffers = {}; //buffers geos
    // this.buffersData = cloneDeep(buffer_filters && buffer_filters.filters) || {}; //
    this.buffer_filters = cloneDeep(props.buffer_filters && props.buffer_filters.filters) || []; //buffer筛选条件记录
    this.buffer_layers = {}; //buffer显示图层
    this.voronoi_filters = [];
    this.voronoi_layers = {}; //泰森多边形

    this.existStaticCards = {}; // 已经存在静态展示卡片
    this.init = false; // 是否第一次进入

    this.layerIndex = {}; //记录图层顺序
    this.lastZIndex = 100;//MIN_LAYER_ZINDEX; //记录最后一次层级

    this.poiToPoiLayers = {};
  }

  componentDidMount() {
    this.loadMap();
  }

  
  async componentWillReceiveProps(nextProps) {
    const {
      map_style
    } = nextProps;
    if (!isEqual(nextProps, this.props)) {
      // props变化
      console.log("props变化");
      // this.clearMap();
    }


    if (!isEqual(map_style, this.state.map_style)) {
      console.log(map_style, "next. map_style");
      this.setMapStyle(map_style);
    }

  }

  setNewState = (props) => {
    const { cards } = props;
    let active_layer_ids = {};
    
    if (cards && cards[0] && cards[0].geo_filters) {
      forEach(cards[0].geo_filters.filters, t => {
        active_layer_ids[t.oid] = {
          id: t.oid + "",
          object_type: t.pid,
          name: t.name,
          source: t.source || source_customer,
          packageId: t.packageId || ""
        };
      });
    }
    return {
      loading: props.loading || false,
      cards: props.cards,
      static_cards: props.static_cards,
      current_geo_filter: props.current_geo_filter,
      map_style: props.map_style||'base',
      map_state: props.map_state,
      active_layer_ids,
      active_layer_ids_for_static_cards: props.active_layer_ids_for_static_cards,
      data: props.data,
      data_style: props.data_style,
      data_show_col: props.data_show_col,


      is_static_map: props.is_static_map
    };
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
    //   headers,
    // })
    const { Authorization } = this.props;
    return axios({
      method: "post",
      url: "",
      data: body,
      headers: {
        "content-type": "application/json",
        Authorization,
        "Mdt-User": ""
      }
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  getMapTool = () => {
    let MapTool = null;
    const { renderMapTool } = this.props;
    if (renderMapTool) MapTool = renderMapTool({
      getMap: () => {
        console.log(this.map, "map-talks");
        return this.map;
      },
      disableMapClick: this.disableMapClick,
      is_server_render: true,
      onFullScreenCenter: this.onFullScreenCenter,
      fullscreencenter: this.state.fullscreencenter,
      selectMapStyle: this.setMapStyle,
      saveAsJpeg: this.saveAsJpeg,
      turnOnRangingTool: this.turnOnRangingTool,
      mapStyle: this.state.map_style,
      hasCustomDraw: this.state.hasCustomDraw,
      mapState: this.state.mapState,
      pauseState: () => {
        console.log(123);
        // this.offDrawAct();
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
    const { fullscreencenter, map_style } = this.state;
    console.log(map_style,'map_style')
    return (
      <div className={cls('mc_map_maptalks',{ base: map_style === "base", wxt: map_style === "wxt", normal: map_style === "normal" })}>
        {this.getMapTool()}
        <div style={{
          width: "auto",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
          pointerEvents: "none",
          height: "100%"
        }}>
          {this.getMapCards()}
          <button onClick={() => {
            this.onSearch();
          }} style={{ pointerEvents: "auto" }}>Search
          </button>
        </div>
        <div id={this.mapId} className={cls("", { fullscreencenter })} style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
}

const MixMapTalks = mix(MapTalks).with(
  LoadMixin,
  MapToolMixin,
  MapClickMixin,
  MapClearMixin,
  PreStyleMixin,
  MapCardMixin,
  FetchDataMixin
);
export default MixMapTalks;
