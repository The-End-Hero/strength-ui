import React, { Component } from "react";
import mix from "mix-with";
// import PointMixin from "./mixins/pointMixin";
import { source_customer } from "../../constants/constants";
import axios from "axios";
import isEqual from "lodash/isEqual";
import cls from "classnames";
import SketchPicker from "../sketchpicker";
import {
  self_select,
  dis_select,
  geo_types,
  poi_icons
} from "../../constants/constants";

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

class SketchpickerPoi extends Component<any, any> {
  static defaultProps = {
    className: "poi_color_picker_wrap"
  };
  startMove: any;
  sketchRef: any;
  popover: any;
  offLeft: any;
  offTop: any;
  constructor(props) {
    super(props);
    this.state = {
      color: props.color || visualization_colors[0],
      selectIcon: props.selectIcon || poi_icons[0]
    };
    this.sketchRef = null;
    this.popover = null;
  }

  changeColor = color => {
    this.setState({ color });
  };

  onSelectIcon = (e, selectIcon) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({ selectIcon });
  };

  closePicker = e => {
    let ref = this.sketchRef;
    if (ref) ref.closePicker(e);
  };

  openColorPicker = (...args) => {
    const { openColorPicker, from_to } = this.props;
    if (openColorPicker) {
      if (from_to) {
        openColorPicker(...args, this.state.selectIcon, from_to);
      } else {
        openColorPicker(...args, this.state.selectIcon);
      }
    }
  };

  close = (...args) => {
    console.log("close");
    const { openColorPicker, from_to } = this.props;
    if (openColorPicker) {
      if (from_to) {
        openColorPicker(...args, this.state.selectIcon, from_to);
      } else {
        openColorPicker(...args, this.state.selectIcon);
      }
    }
  };

  finish = (...args) => {
    console.log("finish");
    const { openColorPicker, from_to } = this.props;
    if (openColorPicker) {
      if (from_to) {
        openColorPicker(...args, this.state.selectIcon, from_to);
      } else {
        openColorPicker(...args, this.state.selectIcon);
      }
    }
  };

  onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.startMove = true;
    let { clientX, clientY } = e;
    const ref = this.popover;
    console.log(ref, "ref");
    const $center = $(ReactDOM.findDOMNode(ref));
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
    const ref = this.popover;
    const $center = $(ReactDOM.findDOMNode(ref));
    let left = clientX - this.offLeft;
    let top = clientY - this.offTop;
    $center.css({ left, top });
  };

  onMouseUp = e => {
    this.startMove = false;
    $("body").off("mousemove", this.onMouseMove);
    $("body").off("mouseup", this.onMouseUp);
  };

  render() {
    let { color, selectIcon } = this.state;
    let { className, style, ...props } = this.props;
    console.log(poi_icons, "poi_icons");
    return (
      <div
        ref={ref => (this.popover = ref)}
        className={className}
        style={{ ...style, width: 416, height: 449, position: "fixed" }}
      >
        <div className="poi_icon_wrap" style={{ width: 148, zIndex: 100 }}>
          <div className="poi_icon_tit mt8">图标样式</div>
          <div
            className="poi_icon_list scroll_bar_poi"
            style={{
              overflow: "auto",
              display: "flex",
              flexWrap: "wrap",
              height: 400
            }}
          >
            {map(poi_icons, (t, index) => {
              let selected = selectIcon.icon === t.icon;
              return (
                <div
                  className={cls("poi_icon_item", { selected })}
                  key={index}
                  onClick={e => {
                    this.onSelectIcon(e, t);
                  }}
                >
                  <i className={`icomoon ${t.icon}`} style={{ color }} />
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="poi_color_picker_inner"
          style={{ backgroundColor: "#455A94" }}
        >
          {/*<div className="poi_color_tit" onClick={()=>{alert(12)}}>图标色彩</div> */}
          <SketchPicker
            ref={ref => (this.sketchRef = ref)}
            {...props}
            className="poi_color_picker_inner_inner"
            changeColor={this.changeColor}
            close={this.close}
            finish={this.finish}
            preventClose={true}
            noDrag={true}
          />
        </div>
        <div className="sketch_draggable_top" onMouseDown={this.onMouseDown} />
      </div>
    );
  }
}

const MixMapCards = SketchpickerPoi; //mix(SketchpickerPoi).with();
export default MixMapCards;
