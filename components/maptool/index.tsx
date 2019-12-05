import React, { Component } from "react";
import PropTypes from "prop-types";
import * as maptalks from "maptalks";
import mix from "mix-with";
import cls from "classnames";
import flashChecker from "../../utils/flashChecker";
import coordtrans from "../../utils/coordtrans";
import MoreMenu from "./components/MoreMenu";
import { some, map, filter, size } from "lodash";
import { self_select, dis_select, geo_types } from "../../constants/constants";
import Modal from "../modal";
import $ from "jquery";
import { Tooltip } from "antd";
import MapStyle from "./components/MapStyle";

const { gcj02tobd09, bd09togcj02 } = coordtrans;
const STREET_COVERAGE_LAYER = "STREET_COVERAGE_LAYER";
// const BMap = (window as any).BMap;
// const AMap = (window as any).AMap;

class MapTool extends Component<any, any> {
  static defaultProps = {
    is_default_collapse_tool: false, // 工具栏是否收起 is_default_collapse_tool
    is_server_render: false,
    fullscreencenter: false,
    getMap: () => {},
    // TODO 配置化渲染顺序
    maptools: [
      { key: "search_map", label: "搜索", checked: true, fold: false },
      { key: "line-1" },
      { key: "cursor_select", label: "点选", checked: true, fold: false },
      { key: "self_select", label: "画多边形", checked: true, fold: false },
      { key: "dis_select", label: "画圆", checked: true, fold: false },
      {
        key: "clear_custom_drow",
        label: "清空围栏",
        checked: true,
        fold: false
      },
      { key: "line-2" },
      { key: "map_style", label: "地图样式", checked: true, fold: false },
      { key: "full_screen", label: "地图全屏", checked: true, fold: false },
      { key: "save_as_jpeg", label: "地图截屏", checked: true, fold: true },
      { key: "street_view", label: "街景", checked: true, fold: true },
      { key: "ranging", label: "测距", checked: true, fold: true },
      { key: "reset_map", label: "还原地图", checked: true, fold: true }
    ]
  };
  static propTypes = {
    is_server_render: PropTypes.bool.isRequired,
    onFullScreenCenter: PropTypes.func.isRequired,
    fullscreencenter: PropTypes.bool.isRequired, //是否全屏
    hasCustomDraw: PropTypes.bool.isRequired, //是否有自定义围栏
    selectMapStyle: PropTypes.func.isRequired,
    saveAsJpeg: PropTypes.func.isRequired,
    turnOnRangingTool: PropTypes.func.isRequired,
    pauseState: PropTypes.func.isRequired, // 点选状态回调
    selfSelect: PropTypes.func.isRequired, // 画圆回调
    disSelect: PropTypes.func.isRequired, // 画多边形回调
    emptySelect: PropTypes.func.isRequired, // 清空
    getMap: PropTypes.func.isRequired // 返回地图实例
  };
  map: any;
  poiMarker: any;
  panorama: any;
  layer: any;
  vectorLayer: any;

  constructor(props) {
    super(props);
    this.state = {
      show: false, // 地图样式
      map_style: props.map_style || "base",
      moreMenu: false,
      pauseStyle: true,
      is_collapse_tool: props.is_default_collapse_tool || false,
      noTool: false, // 没有工具栏
      is_point_select_status: false // 是否是画点状态
    };
    this.map = props.getMap(); // 当前maptool所在地图实例
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
    this.setOption();
  }

  setOption = () => {
    const { maptools } = this.props;
    let noTool;
    noTool = !some(maptools, ["checked", true]);
    this.setState({ noTool });
  };

  componentDidUpdate(prevProps) {
    if (this.props.getMap) {
      this.map = this.props.getMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setOption();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
    this.removeStreetscapeView();
    this.map = null;
    this.poiMarker = null;
    this.panorama = null;
    this.layer = null;
    this.vectorLayer = null;
  }

  escFunction = event => {
    const { fullscreencenter, onFullScreenCenter } = this.props;
    if (event.keyCode === 27 && fullscreencenter) {
      onFullScreenCenter();
    }
  };
  removeStreetscapeView = () => {
    const { is_server_render } = this.props;
    // let mapPanelIns = this.getMapPanelInstance();
    let mapIns = this.map;
    // mapPanelIns &&
    // (mapPanelIns.getMapInstance
    //   ? mapPanelIns.getMapInstance()
    //   : mapPanelIns.getMapRef().getMapInstance());
    let dview = document.getElementById("streetscapeView");
    if (dview) dview.remove();
    if (mapIns) mapIns.off("click", this.setStreetViewCoord);
    if (is_server_render && mapIns) mapIns.removeLayer(STREET_COVERAGE_LAYER);
    if (is_server_render && this.vectorLayer) this.vectorLayer.remove();
    this.vectorLayer = null;
    if (this.poiMarker && this.poiMarker.remove) this.poiMarker.remove();
    this.poiMarker = null;
    const { disableMapClick } = this.props;
    if (disableMapClick) disableMapClick(false);
  };
  changeMoreMenu = bool => {
    this.setState({
      moreMenu: bool
    });
  };
  selectMapStyle = style => {
    const { selectMapStyle } = this.props;
    if (selectMapStyle) selectMapStyle(style);
  };

  getMapPanelInstance = (): any => {
    // if(this.props.getMapInstance){
    //   return this.props.getMapInstance()
    // }else if(this.context.getMapPanelInstance){
    //   return this.context.getMapPanelInstance()
    // }
  };

  // 街景按钮 触发
  toggleStreetView = () => {
    let isFlash = flashChecker();
    // console.log(isFlash);
    // snackbar.info('warning','Flash未安装或被禁用')
    if (!isFlash.hasFlash) {
      Modal.prompt({
        centered: true,
        title: "Flash未安装或被禁用",
        noTitle: true,
        content: (
          <>
            点击
            <a href="https://get.adobe.com/cn/flashplayer/" target="_blank">
              https://get.adobe.com/cn/flashplayer/
            </a>
            安装或启用
          </>
        ),
        onOk({ value, checked }) {
          // console.log(value, checked);
        }
      });
      return;
    }

    if (this.map) {
      this.map.on("click", this.setStreetViewCoord);
    }
    // let mapPanelIns = this.getMapPanelInstance();
    // if (!mapPanelIns) return;
    // let mapIns = mapPanelIns.getMapInstance ? mapPanelIns.getMapInstance() : mapPanelIns.getMapRef().getMapInstance();
    // console.log(this.panorama, "this.panorama");
    if (!this.panorama) {
      this.addSecondMap();
    } else {
      this.showStreetscapeView();
    }
    this.map && this.map.on("click", this.setStreetViewCoord);
    //禁止地图点击
    const { disableMapClick } = this.props;
    if (disableMapClick) disableMapClick(true);
  };

  setStreetViewCoord = e => {
    let coordinate = e.coordinate;
    if (!coordinate) {
      //amap
      let { lng, lat } = e.lnglat;
      coordinate = gcj02tobd09(lng, lat);
    } else {
      coordinate = { lng: coordinate.x, lat: coordinate.y };
    }
    if (this.panorama) {
      this.panorama.setPosition(
        new window.BMap.Point(coordinate.lng, coordinate.lat)
      );
    }
  };

  showStreetscapeView = () => {
    let { is_server_render } = this.props;
    // let mapPanelIns = this.getMapPanelInstance();
    // if (!mapPanelIns) return;
    // let mapIns = mapPanelIns.getMapInstance ? mapPanelIns.getMapInstance() : mapPanelIns.getMapRef().getMapInstance();
    if (is_server_render) this.layer.show();
    if (this.poiMarker) this.poiMarker.show();
    $("#streetscapeView").css({ display: "block" });
  };

  addSecondMap = () => {
    let { is_server_render, getMap } = this.props;
    $("body").append(
      '<div id="streetscapeView" style="position:absolute;right:0px;top:0px;border:1px solid #ccc;top: 0px;bottom: 0px;width:50%;overflow: hidden;z-index: 999999;background: #444e61;color:#fff;"><div id="streetscapeMap" style="height:100%;width:100%;overflow: hidden;"></div><div class="pano_close_ex" title="退出全景" style="z-index: 1201;"></div></div>'
    );
    let $close = $(".pano_close_ex");
    $close.on("click", this.hideStreetscapeView);
    // let mapPanelIns = this.getMapPanelInstance();
    // if (!mapPanelIns) return;
    let mapIns = getMap(); //mapPanelIns.getMapInstance ? mapPanelIns.getMapInstance() : mapPanelIns.getMapRef().getMapInstance();
    //console.log(mapIns,'mapIns')
    if (is_server_render)
      this.layer = new maptalks.TileLayer(STREET_COVERAGE_LAYER, {
        urlTemplate:
          "https://mapsv0.bdimg.com/tile/?udt=20180726&qt=tile&styles=pl&x={x}&y={y}&z={z}"
      }).addTo(mapIns);
    let streetscapeMap = new window.BMap.Panorama("streetscapeMap");
    let center = mapIns.getCenter();
    let coordinate = { lng: center.x, lat: center.y };
    if (!center.x) {
      //amap
      coordinate = gcj02tobd09(center.lng, center.lat);
    }
    streetscapeMap.setPosition(
      new window.BMap.Point(coordinate.lng, coordinate.lat)
    );
    streetscapeMap.setPov({
      heading: -40,
      pitch: 6
    });
    streetscapeMap.addEventListener("position_changed", t => {
      let pos = streetscapeMap.getPosition();
      let center = is_server_render
        ? [pos.lng, pos.lat]
        : bd09togcj02(pos.lng, pos.lat);
      // mapIns.setCenter(center);
      // debugger
      // console.log(this.poiMarker,'this.poiMarker')
      if (!this.poiMarker) {
        if (is_server_render) {
          this.vectorLayer = new maptalks.VectorLayer(
            "streetscape_map_vector",
            { zIndex: 999999 }
          ).addTo(mapIns);
          this.poiMarker = new maptalks.Marker(center, {
            symbol: {
              markerFile: require("../../static/images/other/streetimg.png"), //`${window.location.origin}/images/other/streetimg.png`,
              markerWidth: 22,
              markerHeight: 34,
              markerDx: 0,
              markerDy: 0,
              markerOpacity: 1
            }
          }).addTo(this.vectorLayer);
        } else {
          this.poiMarker = new window.AMap.Marker({
            map: mapIns,
            position: [116.405467, 39.907761],
            icon: new window.AMap.Icon({
              size: new window.AMap.Size(22, 34), //图标大小
              image: require("../../static/images/other/streetimg.png"), //`${window.location.origin}/images/other/streetimg.png`,
              imageSize: new window.AMap.Size(22, 34)
            })
          });
        }
      } else {
        if (is_server_render) {
          this.poiMarker.setCoordinates(center);
        } else {
          this.poiMarker.setPosition(
            new window.AMap.LngLat(center.lng, center.lat)
          );
        }
      }
    });
    this.panorama = streetscapeMap;
  };
  hideStreetscapeView = () => {
    let { is_server_render, disableMapClick, getMap } = this.props;

    // let mapPanelIns = this.getMapPanelInstance();
    // if (!mapPanelIns) return;
    let mapIns = getMap(); //mapPanelIns.getMapInstance ? mapPanelIns.getMapInstance() : mapPanelIns.getMapRef().getMapInstance();
    if (is_server_render) this.layer.hide();
    if (this.poiMarker) this.poiMarker.hide();
    $("#streetscapeView").css({ display: "none" });
    mapIns.off("click", this.setStreetViewCoord);
    if (disableMapClick) disableMapClick(false);
  };

  // 展示切换地图样式
  showPop = () => {
    this.setState({ show: !this.state.show });
  };
  // 测距
  turnOnRangingTool = () => {
    const { turnOnRangingTool } = this.props;
    if (turnOnRangingTool) turnOnRangingTool();
  };
  // 截屏
  saveAsJpeg = () => {
    const { saveAsJpeg } = this.props;
    if (saveAsJpeg) saveAsJpeg();
  };
  // 全屏
  onFullScreenCenter = () => {
    const { onFullScreenCenter } = this.props;
    if (onFullScreenCenter) onFullScreenCenter();
  };
  pauseStyle = bool => {
    this.setState({
      pauseStyle: bool
    });
  };
  /**
   * 点选
   */
  pauseState = () => {
    const { pauseState } = this.props;
    if (pauseState) {
      pauseState();
      this.pauseStyle(true);
    }
    this.changeIsPointSelectStatus(false);
  };
  /**
   * 画点
   */
  pointSelect = async () => {
    this.changeIsPointSelectStatus(!this.state.is_point_select_status);
  };
  /**
   * 画圆
   */
  selfSelect = () => {
    const { selfSelect } = this.props;
    if (selfSelect) {
      selfSelect();
      this.pauseStyle(false);
    }
  };
  /**
   * 画多边形
   */
  disSelect = () => {
    const { disSelect } = this.props;
    if (disSelect) {
      disSelect();
      this.pauseStyle(false);
    }
  };
  /**
   * 等时圈
   */
  timeLoop = () => {
    const { timeLoop } = this.props;
    if (timeLoop) {
      timeLoop();
      this.pauseStyle(false);
    }
  };
  /**
   * 清空自绘制围栏
   */
  emptySelect = () => {
    const { onClearDraw } = this.props;
    if (onClearDraw) {
      onClearDraw();
      this.pauseStyle(false);
    }
  };

  reSetMap = () => {
    const { reSetMap } = this.props;
    reSetMap && reSetMap();
  };
  searchMap = () => {
    const { searchMap } = this.props;
    searchMap && searchMap();
  };
  // 改变 is_point_select_status 状态
  changeIsPointSelectStatus = async bool => {
    await this.setState({ is_point_select_status: bool });
    const { pointSelect } = this.props;
    pointSelect && pointSelect(this.state.is_point_select_status);
  };

  menuClick = key => {
    // console.log(key, "key");
    if (key === "save_as_jpeg") {
      // 地图截屏
      this.saveAsJpeg();
    } else if (key === "street_view") {
      // 街景
      this.toggleStreetView();
    } else if (key === "ranging") {
      // 测距
      this.turnOnRangingTool();
    } else if (key === "reset_map") {
      // 重置地图
      this.reSetMap();
    } else if (key === "search_map") {
      // 地图搜索
      this.searchMap();
    } else if (key === "cursor_select") {
      // 点选
      this.pauseState();
    } else if (key === "self_select") {
      // 绘制围栏
      this.selfSelect();
    } else if (key === "dis_select") {
      // 绘制圆
      this.disSelect();
    } else if (key === "clear_custom_drow") {
      // 清除绘制的圆
      this.emptySelect();
    } else if (key === "map_style") {
      // 地图样式
      this.showPop();
    } else if (key === "full_screen") {
      // 全屏
      this.onFullScreenCenter();
    } else if (key === "point_select") {
      // 画点
      console.log("画点");
      this.pointSelect();
    } else if (key === "time_loop") {
      this.timeLoop();
    }
  };
  changeCollapse = is_collapse_tool => {
    this.setState({
      is_collapse_tool
    });
  };

  // trimList = (list)=>{
  //   list = filter(list, (t, index) => {
  //     if (index === 0 || t.key === "line") {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  //   return list
  // }

  moreSelectClick = e => {
    const { moreMenu } = this.state;
    // console.log(e);
    const target = e.currentTarget;
    // console.log(target);
    this.changeMoreMenu(!moreMenu);
  };

  render() {
    const {
      fullscreencenter,
      mapState,
      current_geo_filter,
      addBgPoint,
      changeCurrentGeoFilter,
      hasCustomDraw,
      maptools,
      changeMapStyle,
      map_style,
      is_server_render,
      is_translucent // 半透明
    } = this.props;
    const { is_collapse_tool, noTool } = this.state;
    // console.log(maptools, "maptools");

    let { show, moreMenu, pauseStyle, is_point_select_status } = this.state;

    console.log(maptools, "maptools");
    // 没有选中项，不展示 直接返回null
    let hasChecked = some(maptools, ["checked", true]);
    if (!hasChecked) {
      return null;
    }
    // 获取初始化能显示的list
    let list = filter(maptools, t => {
      return (t.fold === false && t.checked) || t.key.indexOf("line") > -1;
    });
    while (size(list) > 0 && list[0].key.indexOf("line") > -1) {
      list.splice(0, 1);
    }
    if (is_collapse_tool) {
      // 收起状态
      return (
        <div
          className={cls("mc_map_tool_collapse", {
            is_translucent: is_translucent
          })}
          style={{ display: noTool ? "none" : "" }}
          onClick={() => {
            this.changeCollapse(false);
          }}
        >
          <Tooltip placement="right" title={`展开工具栏`}>
            <div className="mc_map_tool_container">
              <div className="mc_map_tool"></div>
            </div>
          </Tooltip>

          {/*<div>工具</div>*/}
        </div>
      );
    }
    // 展示地图样式选择
    if (show) {
      return (
        <MapStyle
          changeMapStyle={changeMapStyle}
          map_style={map_style}
          is_server_render={is_server_render}
          goBack={this.showPop}
        />
      );
    }
    return (
      <div
        className={cls("mc_map_tool_wrap", {
          mc_map_tool_fullscreen: fullscreencenter
        })}
        style={{ display: noTool ? "none" : "" }}
      >
        <div
          className={cls("mc_map_tool_btn_wrap", {
            is_translucent: is_translucent
          })}
        >
          {map(list, (mt, index) => {
            if (mt.key.indexOf("line") > -1) {
              if (mt.checked || mt.checked === undefined) {
                return (
                  <div
                    className="mc_map_tool_dividing_line"
                    key={mt.key + index}
                  ></div>
                );
              } else {
                return null;
              }
            }
            let pS = "";
            if (mt.key === "cursor_select" && !is_point_select_status) {
              pS = pauseStyle ? "pauseStyle" : "";
            }
            if (mt.key === "point_select" && is_point_select_status) {
              pS = pauseStyle ? "pauseStyle" : "";
            }
            const ele = [
              <Tooltip placement="right" title={`${mt.label}`} key={mt.key}>
                <div
                  className={cls(`mc_map_tool_btn_container ${pS}`)}
                  onClick={() => this.menuClick(mt.key)}
                >
                  <div className={cls(`mc_map_left_btn ${mt.key}`, {})} />
                </div>
              </Tooltip>
            ];
            return ele;
          })}
          <div className="mc_map_tool_btn_container" style={{ height: 12 }}>
            <div
              className={cls("mc_map_left_btn more_select")}
              onClick={this.moreSelectClick}
            />
          </div>
          <MoreMenu
            {...this.props}
            style={{
              display: moreMenu ? "" : "none"
            }}
            changeCollapse={this.changeCollapse}
            menuClick={this.menuClick}
            toggleStreetView={this.toggleStreetView}
            changeMoreMenu={this.changeMoreMenu}
          />
        </div>
      </div>
    );
  }
}

const MixMapTool = MapTool; //mix(MapTool).with();
export default MixMapTool;
