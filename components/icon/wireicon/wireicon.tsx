import React from "react";

const POINT = "POINT";
const LINE = "LINE";
const POLYGON = "POLYGON";
const MAP = "MAP";


const POINT_ICON = require("../../../static/images/map_visual/point_wireframe.svg");
const LINE_ICON = require("../../../static/images/map_visual/line_wireframe.svg");
const POLYGON_ICON = require("../../../static/images/map_visual/polygon_wireframe.svg");
const MAP_ICON = require("../../../static/images/map_visual/map_wireframe.svg");

function WireIcon(props: any) {
  const { type, style, classname } = props;
  if (type == POINT) {
    return (
      <img src={POINT_ICON} className={`${classname ? classname : ""}`} alt={POINT} style={style}/>
    );
  } else if (type == LINE) {
    return (
      <img src={LINE_ICON} className={`${classname ? classname : ""}`} alt={LINE}
           style={style}/>
    );
  } else if (type == POLYGON) {
    return (
      <img src={POLYGON_ICON} className={`${classname ? classname : ""}`} alt={POLYGON}
           style={style}/>
    );
  } else if (type == MAP) {
    return (
      <img src={MAP_ICON} className={`${classname ? classname : ""}`} alt={MAP}
           style={style}/>
    );
  }
  return null;
}

export default WireIcon;
