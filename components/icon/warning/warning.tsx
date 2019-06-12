import React from "react";


const ICON_SRC = require("../../../static/images/other/warning_icon.svg");
const ALT = "WARNING";

function WarningIcon(props: any) {
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

export default WarningIcon;
