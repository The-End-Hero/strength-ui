import React from "react";


const LOADING_ICON = require("../../../static/images/other/button_loading.svg");
const LOADING = "LOADING";

function MCLoadingIcon(props: any) {
    const {type, style, className} = props;
    return (
        <img src={LOADING_ICON} className={`mc_loading_icon ${className ? className : ''}`} alt={LOADING}
             style={style}/>
    );
}

export default MCLoadingIcon;
