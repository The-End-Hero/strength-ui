import React, { Component } from "react";
import MCSlider from "../../components/slider";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import {
  WarningIcon,
  ErrorIcon
} from "../../components/icon";


export default class SliderPage extends Component {
  state = {};

  render() {
    return (
      <div>
        <h2>基本</h2>
        <MCSlider
          min={0}
          max={20}
          defaultValue={3}
        />

        <h2>左右自定义icon</h2>
        <MCSlider
          min={0}
          max={20}
          defaultValue={3}
          leftIcon={<WarningIcon style={{marginLeft:8}}/>}
          rightIcon={<ErrorIcon style={{marginRight:8}}/>}
        />


        <h2>左右自定义icon range</h2>
        <MCSlider
          type='range'
          min={0}
          max={20}
          defaultValue={3}
          leftIcon={<WarningIcon style={{marginLeft:8}}/>}
          rightIcon={<ErrorIcon style={{marginRight:8}}/>}
          defaultValue={[2,4]}
          value={[2,4]}
          tipFormatter={value => `${value}px`}
          tooltipPrefixCls="slider_tool_overlay"
          onChange={this.changeSize}
        />
      </div>
    );
  }
}
