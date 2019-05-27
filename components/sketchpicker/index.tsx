import React, { Component } from "react";
import mix from "mix-with";
// import PointMixin from "./mixins/pointMixin";
import { source_customer } from "../../constants/constants";
import axios from "axios";
import isEqual from "lodash/isEqual";
import cls from "classnames";

import { self_select, dis_select, geo_types } from "../../constants/constants";
// import cardsUtil from "./utils/cardsUtil";

const uuidv1 = require("uuid/v1");

import ReactDOM from "react-dom";
import $ from "jquery";
import map from "lodash/map";
import { SketchPicker as ReactSketchPicker } from "react-color";
import {
  visualization_colors,
  workspace_menu_name
} from "../../constants/constants";
// import { headers, model_api_url } from "../../constants/ApiConfig";
// import userUtil from "../../utils/userUtil";
// import fetchUtil from "../../utils/fetchUtil";
// import queryUrl from "../../utils/queryUrl";
// import message from "../Snackbar/SnackBar";

const presetColors = [
  "#FF4F4F",
  "#FFA74F",
  "#FFFF4F",
  "#4FFF4F",
  "#4FFFFF",
  "#4FA7FF",
  "#A74FFF",
  "#FF4FA7",
  "#3B66E9",
  "#9296E9",
  "#CCC9E4",
  "#FFFFDD",
  "#FFC1A2",
  "#FF806D",
  "#E4434E"
];

class Sketchpicker extends Component<any, any> {
  static defaultProps = {
    preventClose: true,
    noDrag: false,
    noOverlay: false,
    className: "poi_color_picker_inner_inner"
  };
  refPopover: any;
  startMove: any;
  offLeft: any;
  offTop: any;

  constructor(props) {
    super(props);
    this.state = {
      activeIdx: null,
      collect_colors: [], //userUtil.getUserColors(),
      color: props.color || visualization_colors[0],
      pickerIndex: props.pickerIndex
    };
    this.refPopover = null;
  }

  changeColor = ({ rgb }, e) => {
    let color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
    this.setState({ color, activeIdx: null });
    let { changeColor } = this.props;
    if (changeColor) changeColor(color);
  };

  closePicker = e => {
    this.stopDp(e);
    let { color, pickerIndex } = this.state;
    let { openColorPicker, preventClose } = this.props;
    if (preventClose) return;
    if (openColorPicker) openColorPicker(e, -1, pickerIndex, color);
  };

  close = e => {
    let { close, openColorPicker, pickerIndex, color } = this.props;
    if (close) {
      return close(e, -1, pickerIndex, color);
    }
    if (openColorPicker) openColorPicker(e, -1, pickerIndex, color);
  };

  finish = e => {
    let { color, pickerIndex } = this.state;
    let { finish, openColorPicker } = this.props;
    if (finish) {
      return finish(e, -1, pickerIndex, color);
    }
    if (openColorPicker) openColorPicker(e, -1, pickerIndex, color);
  };

  onMouseDown = e => {
    this.stopDp(e);
    this.startMove = true;
    let { clientX, clientY } = e;
    const $center = $(ReactDOM.findDOMNode(this.refPopover));
    let { left, top } = $center.offset();
    this.offLeft = clientX - left;
    this.offTop = clientY - top;
    $("body").on("mousemove", this.onMouseMove);
    $("body").on("mouseup", this.onMouseUp);
  };

  onMouseMove = e => {
    if (!this.startMove) return;
    document.body.style.cursor = "col-resize";
    let { clientX, clientY } = e;
    const $center = $(ReactDOM.findDOMNode(this.refPopover));
    let left = clientX - this.offLeft;
    let top = clientY - this.offTop;
    $center.css({ left, top });
  };

  onMouseUp = e => {
    this.startMove = false;
    $("body").off("mousemove", this.onMouseMove);
    $("body").off("mouseup", this.onMouseUp);
  };

  stopDp = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  selectColor = (e, c, idx) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ color: c, activeIdx: idx });
    let { changeColor } = this.props;
    if (changeColor) changeColor(c);
  };

  handleKeydown = e => {
    e.preventDefault();
    e.stopPropagation();
    let { activeIdx } = this.state;
    if (e.which === 8 && activeIdx != null) {
      this.onDragLeave(e, activeIdx);
    }
  };

  onDragLeave = (e, idx) => {
    let { collect_colors } = this.state;
    collect_colors.splice(idx, 1);
    this.setState({ activeIdx: null });
    this.postCollectColors(collect_colors);
  };

  onAddCollect = e => {
    e.preventDefault();
    e.stopPropagation();
    let { collect_colors, color } = this.state;
    collect_colors = [...collect_colors, color];
    this.postCollectColors(collect_colors);
  };

  postCollectColors = collect_colors => {
    // const params = {};
    // const userInfo = userUtil.get();
    //
    // let postData = { ...userUtil.userSettings, collect_colors };
    // fetchUtil(queryUrl(`${model_api_url}vault/user_settings/user_settings_${userInfo.id}`, { force: !!userUtil.isInitUserSetting }, params), {
    //   method: "POST", body: JSON.stringify(postData), headers
    // })
    //   .then((resp) => {
    //     if (resp && resp.rc == 0) {
    //       userUtil.setUserColors(collect_colors);
    //       this.setState({ collect_colors });
    //     }
    //   })
    //   .catch(() => {
    //   });
  };

  render() {
    const { color, collect_colors, activeIdx } = this.state;
    const { className, style, noDrag, noOverlay } = this.props;
    return (
      <div
        ref={ref => (this.refPopover = ref)}
        className={className}
        style={{ ...style, position: "fixed", backgroundColor: "#324067" }}
        onClick={this.stopDp}
      >
        {!noOverlay && (
          <div className="full_fixed" onClick={this.closePicker} />
        )}
        <ReactSketchPicker
          color={color}
          onChange={this.changeColor}
          presetColors={presetColors}
        />
        {/*<div className="color_collected_tit">-收藏的颜色</div>*/}
        {/*<div className="color_collected_wrap dis_flex_wrap">*/}
        {/*<div className="color_collected_list"*/}
        {/*onKeyDown={this.handleKeydown}*/}
        {/*tabIndex={0}*/}
        {/*>*/}
        {/*{*/}
        {/*map(collect_colors, (c, idx) => {*/}
        {/*let style = { backgroundColor: c };*/}
        {/*active: idx === activeIdx && (style.boxShadow = `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c}`);*/}
        {/*return (*/}
        {/*<div key={idx}*/}
        {/*style={style}*/}
        {/*draggable={true}*/}
        {/*className="color_collected_item"*/}
        {/*onClick={(e) => this.selectColor(e, c, idx)}*/}
        {/*onDragLeave={(e) => this.onDragLeave(e, idx)}*/}
        {/*>*/}
        {/*</div>*/}
        {/*);*/}
        {/*})*/}
        {/*}*/}
        {/*<div className="color_collected_add">*/}
        {/*<i className="material-icons" onClick={e => this.onAddCollect(e)}>add</i>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*</div>*/}
        <div className="sketch_panel_btns">
          <div className="btn cancel" onClick={this.close}>
            取消
          </div>
          <div className="btn" onClick={this.finish}>
            确定
          </div>
        </div>
        {!noDrag && (
          <div
            className="sketch_draggable_top"
            onMouseDown={this.onMouseDown}
          />
        )}
      </div>
    );
  }
}

const MixMapCards = Sketchpicker; // mix(Sketchpicker).with();
export default MixMapCards;
