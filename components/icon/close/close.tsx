import React from "react";

const CLOSE = "CLOSE";
const CLOSE_ICON = require("../../../static/images/checkbox/checkbox_checked.svg");

function CloseIcon(props: any) {
  const { type, style, className } = props;
  return <span className={`mc_close_icon ${className ? className : ""}`} style={style}></span>;
}

export default CloseIcon;
