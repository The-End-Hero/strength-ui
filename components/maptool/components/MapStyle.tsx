import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { map, size } from "lodash";
import Button from "../../button";

export default class MapStyle extends PureComponent<any, any> {

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
    const { map_style, goBack, is_server_render } = this.props;
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
          {
            is_server_render &&
            <div className="mc_map_tool_style_select_li" onClick={() => {
              this.changeMapStyle("darklabel");
            }}>
              <div className={cls("mc_map_tool_style_img dark", { selected: map_style === "darklabel" })}></div>
              <div>深色(label)</div>
            </div>
          }
          <div className="mc_map_tool_style_select_li" onClick={() => {
            this.changeMapStyle("normal");
          }}>
            <div className={cls("mc_map_tool_style_img light", { selected: map_style === "normal" })}></div>
            <div>浅色地图</div>
          </div>
          {
            is_server_render &&
            <div className="mc_map_tool_style_select_li" onClick={() => {
              this.changeMapStyle("whitelabel");
            }}>
              <div className={cls("mc_map_tool_style_img light", { selected: map_style === "whitelabel" })}></div>
              <div>浅色(label)</div>
            </div>
          }
          <div className="mc_map_tool_style_select_li" style={{ marginRight: 0 }} onClick={() => {
            this.changeMapStyle("wxt");
          }}>
            <div className={cls("mc_map_tool_style_img wxt", { selected: map_style === "wxt" })}></div>
            <div>卫星地图</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <Button onClick={goBack} style={{ float: "right" }}>确定</Button>
        </div>
      </div>
    );
  }
}
