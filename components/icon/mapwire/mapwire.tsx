import React from "react";


const MAP_ICON = require("../../../static/images/map_visual/map_wireframe.svg");
const MAP = "MAP";

function MapWireIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={MAP_ICON} className={`${className ? className : ""}`} alt={MAP}
         style={style}/>
  );
}

export default MapWireIcon;
