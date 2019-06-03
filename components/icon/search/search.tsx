import React from "react";


const SEARCH_ICON = require("../../../static/images/other/search.svg");
const SEARCH = "SEARCH";

function SearchIcon(props: any) {
  const { style, className } = props;
  return (
    <img src={SEARCH_ICON} className={`${className ? className : ""}`} alt={SEARCH}
         style={style}/>
  );
}

export default SearchIcon;
