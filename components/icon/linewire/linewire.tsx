import React from "react";


const LINE_ICON = require("../../../static/images/map_visual/line_wireframe.svg");
const LINE = "LINE";

function LineWireIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={LINE_ICON} className={`${className ? className : ""}`} alt={LINE}
         style={style}/>
  );
}

export default LineWireIcon;
