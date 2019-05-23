import map from 'lodash/map'

export const source_customer = 'customer';
export const source_market = 'market';
export const marker_id_feedback = "marker_id_feedback";

export const okLabel = "确定";
export const cancelLabel = "取消";
export const alertTime = 2500;

export const toolOffset = [-3, 125];
export const scaleOffset = [12, 5];
export let lastLeftWidth = 0;
export const staticType = "static";

export let normalOptIdx = 10;
export let activeOptIdx = 9;
export let staticOptIndx = 5;
export let bgNormalOptIndx = 8;
export const lightColor = {
  base: "#669DCB",
  active: "#2170E7"
};
export const street_select = 0; // 街镇区域选择
export const self_select = 1; // 自定义区域选择
export const dis_select = 2; // 自定义距离选择
export const plate_select = 3; // 版块距离选择
export const fence_select = 4; // 自定义围栏选择
export const packet_select = 5; // 从数据包选择
export const buffer_select = 6; //buffer选择
export const search_select = "7"; //数据搜索范围
export const PolygonSourceKey = 'source';
export const PolygonPackageIdKey = 'packageId';
export const normalColor = {
  base: "#00968E",
  active: "#41D9FF"
};

export const normalOpt = {
  bubble: true,
  strokeColor: normalColor.base, strokeOpacity: 1, strokeWeight: 1,
  fillColor: normalColor.base, fillOpacity: 0, zIndex: normalOptIdx
};
export const activeOpt = {
  bubble: true,
  strokeColor: normalColor.active, strokeOpacity: 1, strokeWeight: 3,
  fillColor: normalColor.active, fillOpacity: 0, zIndex: activeOptIdx
};
export const staticOpt = {
  bubble: true,
  strokeColor: "#5780FF", strokeOpacity: 1, strokeWeight: 3,
  fillColor: "#5780FF", fillOpacity: 0, zIndex: staticOptIndx
};
export const bgNormalOpt = { ...normalOpt, zIndex: bgNormalOptIndx };
export const lineOpt = {
  ...normalOpt, strokeOpacity: 0.6, strokeWeight: 6
};
export const lineOptToFlow = { // 流向图线性样式
  ...normalOpt,
  strokeOpacity: 0.6, // 透明度
  strokeWeight: 6 // 宽度
};
export const sizes = {
  small: "small",
  default: "default",
  large: "large"
};

export const types = {
  primary: "primary",
  default: "default",
  warning: "warning",
  success: "success",
  error: "error",
  info: "info",
  disabled: "disabled"
};
export const geo_types = {
  point: 'point',
  polygon: 'polygon',
  line: 'line',
  plain: 'plain',
  point_to_point: 'point_to_point',
  point_to_line: 'point_to_line',
  point_to_polygon: 'point_to_polygon',
  line_to_point: 'line_to_point',
  line_to_line: 'line_to_line',
  line_to_polygon: 'line_to_polygon',
  polygon_to_point: 'polygon_to_point',
  polygon_to_line: 'polygon_to_line',
  polygon_to_polygon: 'polygon_to_polygon'
}

export const link_symbol = '+%+'

export const h_type_text = 'text';
export const h_type_number = 'number';
export const h_type_lnglat = 'lnglat';
export const h_type_date = 'datetime';
export const h_type_formula = 'formula';
export const visualization_colors = ['#FF4F4F','#FFA74F','#FFFF4F','#A7FF4F','#4FFF4F','#4FFFA7','#4FFFFF','#4FA7FF','#4F4FFF','#A74FFF','#FF4FFF','#FF4FA7']
export const workspace_menu_name = '数据工作台'
export const poi_icons = map(new Array(28), (_, i) => {
  let hexStr = i.toString(16);
  if (hexStr.length === 1) {
    hexStr = `0${hexStr}`;
  }
  return { icon: `icon-location_${i + 1}`, content: `\\ue9${hexStr}`};
});


export const editPolygonCfg = {
  visible: true,
  editable: true,
  cursor: "pointer",
  shadowBlur: 0,
  shadowColor: "black",
  draggable: false,
  dragShadow: false, // display a shadow during dragging
  drawOnAxis: null,  // force dragging stick on a axis, can be: x, y
  symbol: {
    "lineColor": "#41D9FF",
    "lineWidth": 2,
    "polygonFill": "rgb(135,196,240)",
    "polygonOpacity": 0.2,
  },
}

export const editLinestringCfg = {
  arrowStyle: null, // arrow-style : now we only have classic
  arrowPlacement: "vertex-last", // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
  visible: true,
  editable: true,
  cursor: null,
  shadowBlur: 0,
  shadowColor: "black",
  draggable: false,
  dragShadow: false, // display a shadow during dragging
  drawOnAxis: null,  // force dragging stick on a axis, can be: x, y
  symbol: {
    "lineColor": "#41D9FF",
    "lineWidth": 3,
  },
}
export const baseTextMarkerCfg = {
  'textFaceName': 'sans-serif',
  'textWeight': 'normal', //'bold', 'bolder'
  'textStyle': 'normal', //'italic', 'oblique'
  'textSize': 12,
  'textFill': '#34495e',
  'textOpacity': 1,
  'textHaloFill': '#fff',
  'textHaloRadius': 1,
  'textWrapWidth': null,
  'textWrapCharacter': '\n',
  'textLineSpacing': 0,
}
export const buffer_types = {
  buffer: "buffer",
  voronoi: "voronoi",
}

//请求地图服务器参数配置 point
export const mapServerPointConfig = {
  "marker": {
    "file": "marker-15.svg",
    "fill": "#5181E4",
    "opacity": 0.75,
    "stroke_opacity":0,
    "allow_overlap": true,
    "transform": {"scale": [1]},
  },
  // "buffer_size": 30
}
//请求地图服务器参数配置 line
export const mapServerLineConfig = {
  "line": {
    "stroke": "#1465f7",
    "stroke_width": 6,
    "stroke_opacity": 0.6
  }
}
//请求地图服务器参数配置 polygon
export const mapServerPolygonConfig = {
  "polygon": {
    "fill": "#73C3FF",
    "fill_opacity": 0.35,
  },
  "line": {
    "stroke": "#73C3FF",
    "stroke_opacity": 1,
    "stroke_width": 1,
  }
}
// 请求地图服务器参数配置 point_to_point
export const mapServerPointToPointConfig = {
  "marker": {
    "file": "marker-15.svg",
    "fill": "#5181E4",
    "opacity": 0.75,
    "stroke_opacity":0,
    "allow_overlap": true,
    "transform": {"scale": [1]},
  },
  // "buffer_size": 30
}
// 请求地图服务器参数配置 point_to_polygon
export const mapServerPointToPolygonConfig = {
  "marker": {
    "file": "marker-15.svg",
    "fill": "#5181E4",
    "opacity": 0.75,
    "stroke_opacity":0,
    "allow_overlap": true,
    "transform": {"scale": [1]},
  },
  // "buffer_size": 30
}


export const iconMap = {
  'text': 'text_fields',
  'number': 'filter_1',
  'datetime': 'today',
  'lnglat': 'language',
};
