import React from "react";


const ICON_SRC = require("../../../static/images/other/info_icon.svg");
const ALT = "INFO";

function InfoIcon(props: any) {
  const { style, className, ...attr } = props;
  return (
    <img src={ICON_SRC} 
         className={`${className ? className : ""}`} 
         alt={ALT}
         style={style}
         {...attr}
    />
  );
}

export default InfoIcon;
