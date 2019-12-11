import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, ErrorIcon, CloseIcon } from "../icon";
import { map, size } from "lodash";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Handle from "./components/Handle";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);
// const Handle = Slider.Handle

const sliderTrackStyle = [{ backgroundColor: "#1F89F2", height: 2 }];
const sliderHandleStyle = [{ backgroundColor: "#fff", height: 8, width: 8, border: "none", marginTop: -3 }];
const sliderRailStyle = { backgroundColor: "#465685", height: 2 };

class MCSlider extends PureComponent<any, any> {
  static defaultProps = {
    prefixCls: "mc-slider",
    type: "slider"

  };
  static propTypes = {
    prefixCls: PropTypes.string

  };


  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    let {
      prefixCls,
      type,
      handle,
      trackStyle,
      handleStyle,
      railStyle,
      tooltipPrefixCls,
      leftIcon,
      rightIcon,
      className,
      style,
      ...attr
    } = this.props;
    const {} = this.state;
    // console.log(leftIcon, "leftIcon");
    // console.log(rightIcon, "rightIcon");
    let slider = (
      <div className={`${prefixCls} ${className}`} style={style}>
        {leftIcon}
        {
          type === "slider" &&
          <Slider
            trackStyle={trackStyle || sliderTrackStyle}
            handleStyle={handleStyle || sliderHandleStyle}
            railStyle={railStyle || sliderRailStyle}
            tooltipPrefixCls={tooltipPrefixCls || "slider_tool_overlay"}
            handle={handle || Handle}
            {...attr}
          />
        }
        {
          type === "range" &&
          <Range
            trackStyle={trackStyle || sliderTrackStyle}
            handleStyle={handleStyle || sliderHandleStyle}
            railStyle={railStyle || sliderRailStyle}
            tooltipPrefixCls={tooltipPrefixCls || "slider_tool_overlay"}
            {...attr}
          />
        }
        {rightIcon}
      </div>
    );
    return slider;
  }
}

export default MCSlider;
