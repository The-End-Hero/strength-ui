import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { map, size } from "lodash";

export default class Button extends PureComponent<any, any> {

  static defaultProps = {
    
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    
    return (
      <div className="mc_map_tool_style">
        <div className="mc_map_tool_style_title">地图样式</div>
        <div className="mc_map_tool_style_select">
          <div className="mc_map_tool_style_select_li">
            <div className="mc_map_tool_style_img selected"></div>
            <div>默认地图</div>
          </div>
          <div className="mc_map_tool_style_select_li">
            <div className="mc_map_tool_style_img"></div>
            <div>深色地图</div>
          </div>
          <div className="mc_map_tool_style_select_li">
            <div className="mc_map_tool_style_img"></div>
            <div>浅色地图</div>
          </div>
          <div className="mc_map_tool_style_select_li">
            <div className="mc_map_tool_style_img"></div>
            <div>卫星地图</div>
          </div>
        </div>
        <div>确定</div>
      </div>
    );
  }
}
