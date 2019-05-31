import React from "react";

const CHECKED = "CHECKED";
const CHECKED_RADIUS = "CHECKED_RADIUS";
const UNCHECKED = "UNCHECKED";
const UNCHECKED_RADIUS = "UNCHECKED_RADIUS";
const CHECKED_SOME = "CHECKED_SOME";

const CHECKED_ICON = require("../../../static/images/checkbox/checkbox_checked.svg");
const UNCHECKED_ICON = require("../../../static/images/checkbox/checkbox_unchecked.svg");
const CHECKED_RADIUS_ICON = require("../../../static/images/checkbox/checkbox_checked_radius.svg");
const UNCHECKED_RADIUS_ICON = require("../../../static/images/checkbox/checkbox_unchecked_radius.svg");
const CHECKED_SOME_ICON = require("../../../static/images/checkbox/checkbox_checksome.svg");

function CheckBoxIcon(props: any) {
  const { type, style, classname } = props;
  if (type == CHECKED) {
    return (
      <img src={CHECKED_ICON} className={`mc_checkbox_icon ${classname}`} alt={CHECKED} style={style}/>
    );
  } else if (type == UNCHECKED) {
    return (
      <img src={UNCHECKED_ICON} className={`mc_checkbox_icon ${classname}`} alt={UNCHECKED} style={style}/>
    );
  } else if (type == CHECKED_RADIUS) {
    return (
      <img src={CHECKED_RADIUS_ICON} className={`mc_checkbox_icon ${classname}`} alt={CHECKED_RADIUS} style={style}/>
    );
  } else if (type == UNCHECKED_RADIUS) {
    return (
      <img src={UNCHECKED_RADIUS_ICON} className={`mc_checkbox_icon ${classname}`} alt={UNCHECKED_RADIUS}
           style={style}/>
    );
  } else if (type == CHECKED_SOME) {
    return (
      <img src={CHECKED_SOME_ICON} className={`mc_checkbox_icon ${classname}`} alt={CHECKED_SOME} style={style}/>
    );
  }
  return null;
}

export default CheckBoxIcon;
