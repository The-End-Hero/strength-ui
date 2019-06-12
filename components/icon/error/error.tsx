import React from "react";


const ICON_SRC = require("../../../static/images/other/error_icon.svg");
const ALT = "ERROR";

function ErrorIcon(props: any) {
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

export default ErrorIcon;
