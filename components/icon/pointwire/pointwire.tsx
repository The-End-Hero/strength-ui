import React from "react";


const POINT_ICON = require("../../../static/images/map_visual/point_wireframe.svg");
const POINT = "POINT";

function PointWireIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={POINT_ICON} className={`${className ? className : ""}`} alt={POINT}
         style={style}/>
  );
}

export default PointWireIcon;
