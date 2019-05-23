import Custom_control from "../control/custom_control";
import { CircleMode, DirectMode, SimpleSelectMode } from "mapbox-gl-draw-circle";
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import DrawStyles from "../../../constants/DrawStyle";
import extendDrawBar from "../../../static/lib/extentDrawBar";
import { in_china, transCoord, loadSvgImage, toggleEvents } from "../../../static/lib/mapUtil";
import FreehandMode from "../../../static/lib/mapbox-gl-draw-freehand-mode";
import RadiusMode from "../../../static/lib/mapbox-gl-draw-radius-mode";
import mapboxgl from "mapbox-gl";
import { isEqual, forEach, cloneDeep } from "lodash";
import MeasureControl from "../../../static/lib/mapboxgl-measure-control/measure_control";
import cheapRuler from "cheap-ruler";
import numeral from "numeral";
import * as turf from "@turf/turf";

const BASE_LAYER_ID = "BASE_LAYER_ID";
const CUSTOM_LAYER_ID = "CUSTOM_LAYER_ID";
const DRAW_LAYER_ID = "DRAW_LAYER_ID";
const DECK_LAYER_ID = "DECK_LAYER_ID";
const modes = MapboxDraw.modes;
modes.draw_polygon = FreehandMode;
modes.draw_circle = RadiusMode;
const Controls = superclass => class Controls extends superclass {

  /**
   * 添加control
   */
  addControls = () => {
    const map = this.map;
    // 缩放比例尺
    map.addControl(new mapboxgl.ScaleControl());
    // 自定义zoom reset
    map.addControl(new Custom_control(), "bottom-left");
    // 百度街景
    // map.addControl(new MeasureControl(), "top-left");
    // 绘制控件
    this.addDrawControl();
    // 测距
    map.addControl(new MeasureControl(), "top-left");
    
  };

  /**
   * 添加绘制的control
   */
  addDrawControl = () => {
    let _this = this;
    const draw = new MapboxDraw({
      modes: modes,
      controls: {
        point: false,
        line_string: false,
        polygon: true,
        trash: true,
        combine_features: false,
        uncombine_features: false
      },
      styles: DrawStyles
    });
    this.draw = draw;

    let drawBar = new extendDrawBar({
      draw: draw,
      buttons: [{
        title: "Toggle draw",
        on: "click",
        action: _this.onClickToggleDraw,
        before: "mapbox-gl-draw_polygon",
        classes: ["mapbox-gl-draw_draw"]
      }, {
        title: "Circle tool(c)",
        on: "click",
        action: _this.onClickDrawCircle,
        before: "mapbox-gl-draw_trash",
        classes: ["mapbox-gl-draw_circle"]
      }, {
        title: "Output last",
        on: "click",
        action: _this.onClickDrawOutput,
        classes: ["mapbox-gl-draw_output"]
      }]
    });
    this.drawBar = drawBar;
    this.map.addControl(drawBar, "top-left");
    this.appendOutputDiv();

    // 禁止拖动
    // this.map.on('draw.selectionchange', (e) => {
    //   const { features, points } = e;
    //   const hasLine = (features && (features.length > 0));
    //   const hasPoints = (points && (points.length > 0));
    //   if (hasLine && ! hasPoints) {
    //     // line clicked
    //     if (draw.getMode() !== 'direct_select') {
    //       draw.changeMode('direct_select', { featureId: features[0].id });
    //     }
    //   } else if (hasLine && hasPoints) {
    //     // line vertex clicked
    //   } else if (! hasLine && ! hasPoints) {
    //     // deselected
    //   }
    // });
  };


  onClickToggleDraw = () => {
    if (this.showDraw) {
      let drawCtrl = this.draw;
      // drawCtrl.deleteAll();
      drawCtrl.trash();
      this.hideDrawButton();
      this.showDraw = false;
      this.toggleEvents(this.map, "add", "click", this);
    } else {
      this.showDrawButton();
      this.showDraw = true;
      this.toggleEvents(this.map, "remove", "click", this);
    }
  };
  onClickDrawCircle = () => {
    this.draw.changeMode("draw_circle");
  };
  onClickDrawOutput = () => {
    let elem: any = document.getElementById("map_draw_output");
    let display = elem.style.display;
    display = display === "none" ? "block" : "none";
    elem.style.display = display;
  };
  appendOutputDiv = () => {
    let elem = document.createElement("div");
    elem.id = "map_draw_output";
    elem.classList.add("map_draw_output");
    elem.style.display = "none";
    (document.getElementById(this.mapId) as any).parentNode.append(elem);
  };

  hideDrawButton = () => {
    let el = this.drawBar.elContainer;
    forEach(el.children, (child, index) => {
      if (index === 0) { //
        child.classList.add("mapbox-gl-draw_draw_disable");
      } else {
        child.style.display = "none";
      }
    });
  };

  showDrawButton = () => {
    let el = this.drawBar.elContainer;
    forEach(el.children, (child, index) => {
      if (index === 0) { //
        child.classList.remove("mapbox-gl-draw_draw_disable");
      } else {
        child.style.display = "block";
      }
    });
  };
  
  noDrag = ()=>{
    const map = this.map;
    const draw = this.draw;
    map.on('draw.selectionchange', (e) => {
      const { features, points } = e;
      const hasLine = (features && (features.length > 0));
      const hasPoints = (points && (points.length > 0));
      if (hasLine && ! hasPoints) {
        // line clicked
        if (draw.getMode() !== 'direct_select') {
          draw.changeMode('direct_select', { featureId: features[0].id });
        }
      } else if (hasLine && hasPoints) {
        // line vertex clicked
      } else if (! hasLine && ! hasPoints) {
        // deselected
      }
    });
  }

  // 添加面积
  addMeasure = () => {
    const map = this.map;
    const draw = this.draw;
    let ruler = cheapRuler(map.getCenter().lat, "meters");
    // measurements source
    map.addSource("_measurements", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    // measurements layer
    map.addLayer({
      id: "_measurements",
      source: "_measurements",
      type: "symbol",
      paint: {
        "text-color": "hsl(234, 100%, 32%)",
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 2
      },
      layout: {
        "text-field": "{label}",
        "text-size": 12
      }
    }, DRAW_LAYER_ID);
    // on draw.render update the measurments
    map.on("draw.render", function(e) {
      let labelFeatures:any = [], label;
      let all = draw.getAll();
      if (all && all.features) {
        all.features.forEach(function(feature) {
          switch (turf.getType(feature)) {
            case "Point":
              // label Points
              if (feature.geometry.coordinates.length > 1) {
                labelFeatures.push(turf.point(feature.geometry.coordinates, {
                  type: "point",
                  label: feature.geometry.coordinates[1].toFixed(6) + ", " + feature.geometry.coordinates[0].toFixed(6)
                }));
              }
              break;
            case "LineString":
              // label Lines
              if (feature.geometry.coordinates.length > 1) {
                let length = ruler.lineDistance(feature.geometry.coordinates);
                label = numeral(length).format("0,0.0a") + "m";
                let midpoint = ruler.along(feature.geometry.coordinates, length / 2);
                labelFeatures.push(turf.point(midpoint, {
                  type: "line",
                  label: label
                }));
              }
              break;
            case "Polygon":
              // label Polygons
              if (feature.geometry.coordinates.length > 0 && feature.geometry.coordinates[0].length > 3) {
                let area = ruler.area(feature.geometry.coordinates);
                let length = ruler.lineDistance(feature.geometry.coordinates);
                // console.log(area)
                // area = Math.floor(area)
                area = area / 1000;
                if (area > 1000) {
                  label = (area / 1000).toFixed(2) + "km²";
                } else {
                  label = area + "m²";
                }
                labelFeatures.push(turf.centroid(feature, {
                  type: "area",
                  label: label
                }));
                // let radius = numeral(length).format("0,0.0a") + "m";              
                // let midpoint = ruler.along(feature.geometry.coordinates, length / 2);
              }
              break;
            default:
              break;
          }
        });
      }
      map.getSource("_measurements").setData({
        type: "FeatureCollection",
        features: labelFeatures
      });
    });
  };
};


export default Controls;
