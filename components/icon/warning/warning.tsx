import React from "react";


const WARNING_ICON = require("../../../static/images/other/warning.svg");
const WARNING = "SEARCH";

function WarningIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={WARNING_ICON} className={`${className ? className : ""}`} alt={WARNING}
         style={style}/>
  );
}

export default WarningIcon;
