import loadMap from "../../../utils/loadMap";
import { lastLeftWidth, scaleOffset, toolOffset } from "../../../constants/constants";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";

const LoadMixin = superclass =>
  class LoadMixin extends superclass {
    initAMap = () => {
      const { map_info, is_static_map } = this.props;
      const { map_style } = this.state;
      if (!window.AMap || !window.AMap.Map || is_static_map) {
        return;
      }
      console.log("initAMap");

      // console.log(map_info.location.split(","), "map_info.location.split(\",\")");
      let map = new window.AMap.Map(this.mapId, {
        resizeEnable: true,
        center: map_info.location ? map_info.location.split(",") : undefined, // 中心点坐标
        zoom: map_info.zoom ? map_info.zoom : undefined, // 缩放级别
        // labelzIndex: 0,
        zooms: [4, 18], //缩放级别范围
        scrollWheel: true
      });
      this.map = map;
      // const amapProxy = amap_proxy.getAMapProxy()
      if (window.map_instance) window.map_instance[this.state.mapUId] = this.map;
      // console.log(window.map_instance, "window.map_instance");
      if (map)
        map.on("zoomend", () => {
          this.markerData = [];
          this.generateMarkCols();
        });
      this.initSatellite(this.map);
      this.loadAMapPlugin(window.AMap).then(() => {
        this.initRangingTool(this.map);
      });
      this.setAMapStyle(map_style);
      this.initMapHelper(); // 加载HelpToolTip
      this.addBgPolygon();
      setTimeout(() => {
        this.addCardsDataToMap();
      }, 2000);
      return map;
    };

    /**
     * 初始化卫星图层
     * @param map
     */
    initSatellite = map => {
      let satellite = new window.AMap.TileLayer.Satellite(); // 卫星图层
      map.add(satellite);
      satellite.hide();
      this.satellite = satellite;
    };

    /**
     * 初始化测距 插件
     * @param map
     */
    initRangingTool=(map)=> {
      let ruler = new window.AMap.RangingTool(map); // 距离测量 插件
      this.ruler = ruler;
      window.AMap.event.addListener(ruler, "end", e => {
        ruler.turnOff();
      });
    }

    turnOnRangingTool =()=> {
      this.ruler.turnOn();
    }

    /**
     * 加载AMapSDK函数
     * 1.是否已经加载过
     * 2.静态地图不加载. 使用图片作为背景
     */
    loadAMap = () => {
      const { is_static_map } = this.props;
      if (is_static_map) {
        const mapdiv = document.getElementById(this.mapId);
        mapdiv.style.backgroundImage = `url(http://mdt-staging-public.oss-cn-hangzhou.aliyuncs.com/preview/164744/interactive_map/geo_da4ada70-9150-11e8-a225-997b717b6943_thumb.png)`;
        return;
      }
      if (!window.AMap) {
        const mapdiv = document.getElementById(this.mapId);
        mapdiv.style.backgroundImage = null;
        console.log("AMap找不到");
        loadMap().then(AMap => {
          window.AMap = AMap;
          console.log("AMap加载完成");
          this.initAMap();
        });
      } else {
        this.initAMap();
      }
    };
    loadAMapPlugin = AMap => {
      // 异步加载插件
      /**
       * AMap.Scale,比例尺，显示当前地图中心的比例尺
       * AMap.MouseTool, 鼠标工具插件
       * AMap.ToolBar, 工具条，控制地图的缩放、平移等
       * AMap.Heatmap, 热力图插件
       * AMap.PolyEditor, 折线、多边形编辑插件
       * AMap.RangingTool, 测距插件，可以用距离或面积测量
       * AMap.Geocoder  地理编码与逆地理编码服务，提供地址与坐标间的相互转换
       */
      return new Promise((resolve, reject) => {
        AMap.plugin(
          [
            "AMap.Scale",
            "AMap.MouseTool",
            "AMap.ToolBar",
            "AMap.Heatmap",
            "AMap.PolyEditor",
            "AMap.RangingTool",
            "AMap.Geocoder"
          ],
          () => {
            //异步同时加载多个插件
            console.log("插件加载完成");
            // let toolbar = new AMap.ToolBar();
            // map.addControl(toolbar);
            let toff = new AMap.Pixel(
              ...[toolOffset[0] + lastLeftWidth, toolOffset[1]]
            );
            this.toolBar = new AMap.ToolBar({
              offset: toff,
              position: "LB",
              liteStyle: true
            });
            this.map.addControl(this.toolBar);

            this.scale = new AMap.Scale({
              offset: new AMap.Pixel(...scaleOffset),
              position: "LB"
            });
            this.map.addControl(this.scale);
            resolve("success");
          }
        );
      });
    };

    // setLeftOffset(width) {
    //   if (this.props.needOffset) {
    //     lastLeftWidth = width;
    //     setTimeout(() => {
    //       // this.showToolBar();
    //       if (this.toolBar && this.toolBar.setOffset) {
    //         this.toolBar.setOffset(new AMap.Pixel(...[toolOffset[0]+width, toolOffset[1]]))
    //       }
    //       if (this.scale) {
    //         $(".amap-scalecontrol").css({left: scaleOffset[0]+width, bottom: scaleOffset[1]})
    //       }
    //     })
    //   }
    // }
  };
export default LoadMixin;
