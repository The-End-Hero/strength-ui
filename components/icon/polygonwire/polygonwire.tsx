import React from "react";


const POLYGON_ICON = require("../../../static/images/map_visual/polygon_wireframe.svg");
const POLYGON = "POLYGON";

function PolygonWireIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={POLYGON_ICON} className={`${className ? className : ""}`} alt={POLYGON}
         style={style}/>
  );
}

export default PolygonWireIcon;
