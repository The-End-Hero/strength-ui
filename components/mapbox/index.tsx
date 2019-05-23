import * as React from "react";
import * as maptalks from "maptalks";
import mix from "mix-with";
// import Test from "./mixins/some";
import Controls from "./mixins/controls";
import { dis_select, self_select, source_customer } from "../../constants/constants";
import axios from "axios";
import { isEqual, forEach, cloneDeep } from "lodash";
import * as cls from "classnames";
import {MapboxLayer} from '@deck.gl/mapbox';
import {Deck} from '@deck.gl/core';
import mapboxgl from "mapbox-gl";
import MapboxBaiduLayer from "../../static/lib/mapbox-layers/MapboxBaiduLayer";
import MapboxGaodeLayer from "../../static/lib/mapbox-layers/MapboxGaodeLayer";
import MapboxGoogleLayer from "../../static/lib/mapbox-layers/MapboxGoogleLayer";
import MapboxBaseLayer from "../../static/lib/mapbox-layers/MapboxBaseLayer";
import MapboxTiandituLayer from "../../static/lib/mapbox-layers/MapboxTiandituLayer";
// import MapboxMapNikLayer from "../../static/lib/mapbox-layers/MapboxMapNikLayer";

// import china from "../../static/lib/china_edge";
// import applyMixins from "../utils/mixins";
import Custom_control from "./control/custom_control";
import { CircleMode, DirectMode, SimpleSelectMode } from "mapbox-gl-draw-circle";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DrawStyles from "../../constants/DrawStyle";
import extendDrawBar from "../../static/lib/extentDrawBar";
import { transCoord, loadSvgImage, toggleEvents } from "../../static/lib/mapUtil";
import FreehandMode from "../../static/lib/mapbox-gl-draw-freehand-mode";
import RadiusMode from "../../static/lib/mapbox-gl-draw-radius-mode";
import SnackBar from "../snackbar";
import renderPopup from "../../static/lib/renderPopup";


const MAPBOX_STYLE = "MAPBOX_STYLE";
const BAIDU_STYLE = "BAIDU_STYLE";
const GOOGLE_STYLE = "GOOGLE_STYLE";
const GAODE_STYLE = "GAODE_STYLE";
const TIANDITU_STYLE = "TIANDITU_STYLE";
const MapBaseMap = [// 各种地图底图
  // {
  //   id: MAPBOX_STYLE,
  //   name: "mapbox",
  //   layer: MapboxBaseLayer
  // },
  {
    id: GOOGLE_STYLE,
    name: "google",
    layer: MapboxGoogleLayer
  },
  {
    id: BAIDU_STYLE,
    name: "百度",
    layer: MapboxBaiduLayer
  },
  {
    id: GAODE_STYLE,
    name: "高德",
    layer: MapboxGaodeLayer
  },
  {
    id: TIANDITU_STYLE,
    name: "天地图",
    layer: MapboxTiandituLayer
  }
];

const MAPNIK_ID = "MAPNIK_ID";
// const MapNikLayer = [
//   {
//     id: MAPNIK_ID,
//     name: "mapnik-1",
//     layer: MapboxMapNikLayer
//   }
// ];
const BASE_LAYER_ID = "BASE_LAYER_ID";
const CUSTOM_LAYER_ID = "CUSTOM_LAYER_ID";
const DRAW_LAYER_ID = "DRAW_LAYER_ID";
const MAPNIK_LAYER_ID = "MAPNIK_LAYER_ID";


const uuidv1 = require("uuid/v1");
const modes = MapboxDraw.modes;
modes.draw_polygon = FreehandMode;
modes.draw_circle = RadiusMode;

//坐标类型
const WGS84 = "wgs84";
const BD09 = "bd09";
const GCJ02 = "gcj02";


function updateScale(map, container, options) {
  // A horizontal scale is imagined to be present at center of the map
  // container with maximum length (Default) as 100px.
  // Using spherical law of cosines approximation, the real distance is
  // found between the two coordinates.
  const maxWidth = options && options.maxWidth || 100;
  const y = map._container.clientHeight / 2;
  const maxMeters = getDistance(map.unproject([0, y]), map.unproject([maxWidth, y]));
  console.log(maxMeters, "maxMeters");
}


function getDistance(latlng1, latlng2) {
  // Uses spherical law of cosines approximation.
  const R = 6371000;
  const rad = Math.PI / 180,
    lat1 = latlng1.lat * rad,
    lat2 = latlng2.lat * rad,
    a = Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

  const maxMeters = R * Math.acos(Math.min(a, 1));
  return maxMeters;
}


interface IProps {
  getNearest?: any,
  onMapClick?(one):void,
  mapOnLoad?():void,
}

interface IState {
  map_style: string,
  coordinate_system: string,
}

class MapBox extends React.Component <IProps, IState> {
  static defaultProps = {
    map_info: {
      location: "119.829116,31.731509",
      scale: 1,
      size: "400*400",
      zoom: 10
    }
  };
  map: any;
  mapId: string;
  drawBar: any;
  draw: any;
  showDraw: any;
  mapLayers: any;
  mapNikLayer: any;
  hehehe: any;
  toggleEvents: any;
  addControls: any;
  renderPopup: any;
  popup: any;
  resolution: any; //地图比例尺
  addMeasure: any; //地图比例尺
  deck: any; //地图比例尺

  constructor(props) {
    super(props);
    // const data = this.setNewState(props);
    this.state = {
      map_style: "base",
      coordinate_system: BD09
      // ...data
    };
    this.map = null;
    this.mapId = `mc-map-mapbox-${uuidv1()}`;
    this.mapLayers = {};
    this.mapNikLayer = {};
    this.showDraw = false // 默认不展开
    this.toggleEvents = toggleEvents.bind(this);
  }

  componentDidMount() {
    this.popup = new mapboxgl.Popup({
      // closeButton: false,
      // closeOnClick: false
    });
    this.renderPopup = renderPopup;
    mapboxgl.accessToken = "pk.eyJ1Ijoid3hwIiwiYSI6ImNqdGY4NTZxMzA0NTI0NG9jcGVrZjZlc3oifQ.RGMhTbjPWsjua3pz5AvtRw";
    const map = new mapboxgl.Map({
      container: this.mapId,
      style: {
        version: 8,
        name: "Mapbox Streets",
        sprite: "mapbox://sprites/mapbox/streets-v8",
        // sprite: "https://wangxiping.top/sprite/sprite", // 私有化 
        // glyphs: "https://wangxiping.top/fonts/{fontstack}/{range}.pbf",// 私有化 
        glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        sources: {},
        layers: []
      },
      maxTileCacheSize: 0,
      minZoom: 4,
      maxZoom: 18,
      zoom: 10,
      center: [121.5065669346, 31.2453045690]
    });
    this.map = map;
    // 加载地图控件
    this.addControls();
    map.on("load", this.onMapLoad);
    map.on("move", this.updateScale);
    map.on("error", this.onMapError);
  }

  async componentWillReceiveProps(nextProps) {

  }

  updateScale = () => {
    const map = this.map;
    // A horizontal scale is imagined to be present at center of the map
    // container with maximum length (Default) as 100px.
    // Using spherical law of cosines approximation, the real distance is
    // found between the two coordinates.
    const maxWidth = 100;
    const y = map._container.clientHeight / 2;
    const maxMeters = getDistance(map.unproject([0, y]), map.unproject([maxWidth, y]));
    const maxMetersToFixed = (Math.round(maxMeters * 100) / 10000).toFixed(1);
    this.resolution = Number(maxMetersToFixed);
    console.log(this.resolution, "地图比例尺 km");
  };

  /**
   * 查询接口
   */
  onSearch = () => {
    console.log("maicedata-ui- search");
  };

  /**
   * 地图loaded
   */
  onMapLoad = () => {
    const map = this.map;
    console.log("mc_map加载完成");
    map.addLayer({
      id: DRAW_LAYER_ID, type: "custom", render: () => {
      }
    });
    map.addLayer({
      id: CUSTOM_LAYER_ID, type: "custom", render: () => {
      }
    }, DRAW_LAYER_ID);
    map.addLayer({
      id: BASE_LAYER_ID, type: "custom", render: () => {
      }
    }, CUSTOM_LAYER_ID);

    let layers = map.getStyle().layers;
    forEach(layers, layer => {
      if (new RegExp(/gl-draw-/).test(layer.id)) {
        map.moveLayer(layer.id, DRAW_LAYER_ID);
      }
    });
    // map底图添加
    MapBaseMap.forEach(r => {
      this.mapLayers[r.id] = new (r.layer)(map);
    });
    // console.log(this.mapLayers, "mapLayers");
    this.mapLayers[BAIDU_STYLE].add(BASE_LAYER_ID);
    this.addMeasure();
    this.initDeckGl();
    const {mapOnLoad} = this.props
    if (mapOnLoad) mapOnLoad();
    
    
    // mapNik 底图添加
    // map.addLayer({
    //   id: MAPNIK_LAYER_ID, type: "custom", render: () => {
    //   }
    // },BASE_LAYER_ID);
    // MapNikLayer.forEach(r => {
    //   this.mapNikLayer[r.id] = new (r.layer)(map);
    // });
    // console.log(this.mapNikLayer,'mapNikLayer');
    // this.mapNikLayer[MAPNIK_ID].add(MAPNIK_LAYER_ID);
    // let map = this.map;


    // oms
    // const sourceId = uuidv1()
    // const tile = [
    //   "http://dev.idatatlas.com/map/9004401e60df11e9b37b0242ac110220/{x}/{y}/{z}.png?srs=bd09&fake_app_id=63"
    // ]
    // const coord_sys = undefined
    // map.addSource(sourceId, {
    //   "type": "raster",
    //   tiles: tile,
    // });
    // let layer = {
    //   "id": sourceId,
    //   "type": "raster",
    //   "source": sourceId,
    //   metadata: {coord_sys},
    // }
    // map.addLayer(layer, CUSTOM_LAYER_ID);
    // let source = {
    //   id: sourceId,
    //   type: 'raster',
    //   layers: [layer],
    //   len: {
    //     raster:  0,
    //   }
    // };


    // 绑定地图点击
    this.onMapClick();
  };


  initDeckGl = () => {
    const map = this.map;
    if (!map) return;
    const deck = new Deck({
      gl: map.painter.context.gl,
      layers: []
    });
    this.deck = deck;
  }
  
  
  
  
  onMapClick = () => {
    const map = this.map;
    map.on("click", (e) => {
      // if (this.showDraw) return;
      let coord = e.lngLat.toArray();
      let description = this.getPopDesc(coord, this.state.coordinate_system);
      let selectThreshold = 5;
      const queryBox = [
        [
          e.point.x - selectThreshold,
          e.point.y + selectThreshold
        ], // bottom left (SW)
        [
          e.point.x + selectThreshold,
          e.point.y - selectThreshold
        ] // top right (NE)
      ];

      let features = map.queryRenderedFeatures(queryBox, { filter: ["all"] }) || [];
      map.getCanvas().style.cursor = (features.length) ? "pointer" : "";

      let popContent: any = "";
      if (features.length) {

        popContent = this.renderPopup(features);

        let type = typeof popContent;

        if (type === "string") {
        } else {
          popContent = popContent.outerHTML;
        }
      }
      this.popup.setLngLat(e.lngLat);
      this.popup.addTo(map);
      this.popup.setHTML(`<div class="map_popup_overflow">${description}${popContent}</div>`);

      // 调用外部click
      const { onMapClick } = this.props; 
      if (onMapClick) onMapClick({ coordinate: coord });
    });
  };
  /**
   *
   * @param coord
   * @param oriType 表示地图坐标系，百度底图时用百度坐标系
   * @returns {string}
   */
  getPopDesc = (coord, oriType) => {
    console.log(coord, "coord");
    console.log(oriType, "oriType");
    let bd, gcj, wgs;
    if (oriType === BD09) {
      bd = coord;
      gcj = transCoord(bd, BD09, GCJ02);
      wgs = transCoord(gcj, GCJ02, WGS84);
    } else if (oriType === WGS84) {
      wgs = coord;
      gcj = transCoord(wgs, WGS84, GCJ02);
      bd = transCoord(gcj, GCJ02, BD09);
    } else if (oriType === GCJ02) {
      gcj = coord;
      wgs = transCoord(gcj, GCJ02, WGS84);
      bd = transCoord(gcj, GCJ02, BD09);
    }
    let color_str = "color:green;";
    return `
        <div class="mapbox-gl-inspect_feature">
            <div>谷歌地图: <span style="${oriType === WGS84 ? color_str : ""}">${wgs[0]},${wgs[1]}</span></div>
            <div>百度地图: <span style="${oriType === BD09 ? color_str : ""}">${bd[0]},${bd[1]}</span></div>
            <div>腾讯高德: <span style="${oriType === GCJ02 ? color_str : ""}">${gcj[0]},${gcj[1]}</span></div>
        </div>
        `;
  };
  /**
   * 地图出错
   * @param e
   */
  onMapError = (e) => {
    console.error(e.error);
    if (e.error.message !== "Failed to fetch") {
      SnackBar.info("error", e.error.message);
    }
  };

  // 获取地图信息
  getMapInfo = () => {
    const map = this.map;
    let center = map.getCenter();
    const { lat, lng } = center;
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();
    const mapInfo = {
      center: [lng, lat],
      zoom,
      bearing,
      pitch
    };
    console.log(mapInfo);
    return mapInfo;
  };


  render() {
    const { map_style } = this.state;
    console.log(map_style, "map_style");
    return (
      <div className={cls("mc_map_mapbox", {
        base: map_style === "base",
        wxt: map_style === "wxt",
        normal: map_style === "normal"
      })}>
        <div style={{
          width: "auto",
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
          pointerEvents: "none",
          height: "100%"
        }}>
          <button onClick={() => {
            console.log(this);
            this.getMapInfo();
            this.onSearch();
          }} style={{ pointerEvents: "auto" }}>Search
          </button>
        </div>
        <div id={this.mapId} className={cls("")} style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  }
}

const MixMapBox = mix(MapBox).with(
  Controls
);
export default MixMapBox;
