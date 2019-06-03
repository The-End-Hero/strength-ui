import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";

export default class Input extends PureComponent<any, any> {
  static defaultProps = {};
  static propTypes = {};

  changeInput = (e)=>{
    const value = e.currentTarget.value
    console.log(value)
  }
  render() {
    const baseProps = {
      type: "text",
      className: cls('mc_input',{
        
      }),
      onChange:this.changeInput
    };
    let input = <input {...baseProps} />;
    return input;
  }
}
