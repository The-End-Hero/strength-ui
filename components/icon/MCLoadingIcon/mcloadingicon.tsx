import React from "react";


const LOADING_ICON = require("../../../static/images/other/button_loading.svg");
const LOADING = "LOADING";

function MCLoadingIcon(props: any) {
  const { type, style, classname } = props;
  return (
    <img src={LOADING_ICON} className={`mc_loading_icon ${classname}`} alt={LOADING} style={style}/>
  );
}

export default MCLoadingIcon;
