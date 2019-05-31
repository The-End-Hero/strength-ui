import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { map, size } from "lodash";

export default class Button extends PureComponent<any, any> {

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  changeMapStyle = (style) => {
    const { changeMapStyle } = this.props;
    changeMapStyle && changeMapStyle(style);
  };

  render() {
    const { map_style } = this.props;
    return (
      <div className="mc_map_tool_style">
        <div className="mc_map_tool_style_title">地图样式</div>
        <div className="mc_map_tool_style_select">
          <div className="mc_map_tool_style_select_li" onClick={() => {
            this.changeMapStyle("base");
          }}>
            <div className={cls("mc_map_tool_style_img base", { selected: map_style === "base" })}></div>
            <div>默认地图</div>
          </div>
          <div className="mc_map_tool_style_select_li" onClick={() => {
            this.changeMapStyle("dark");
          }}>
            <div className={cls("mc_map_tool_style_img dark", { selected: map_style === "dark" })}></div>
            <div>深色地图</div>
          </div>
          <div className="mc_map_tool_style_select_li" onClick={() => {
            this.changeMapStyle("light");
          }}>
            <div className={cls("mc_map_tool_style_img light", { selected: map_style === "light" })}></div>
            <div>浅色地图</div>
          </div>
          <div className="mc_map_tool_style_select_li" style={{ marginRight: 0 }} onClick={() => {
            this.changeMapStyle("wxt");
          }}>
            <div className={cls("mc_map_tool_style_img wxt", { selected: map_style === "wxt" })}></div>
            <div>卫星地图</div>
          </div>
        </div>
        <div>确定</div>
      </div>
    );
  }
}
