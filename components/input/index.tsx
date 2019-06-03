import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, WarningIcon } from "../icon";
import { async } from "q";

export default class Input extends PureComponent<any, any> {
  static defaultProps = {
    type: "text",
    kind: "",
    placeholder: "",
    value: "",
    isError: false,
    errorText: "",
    unitText: "",
    allowClear: false  // 显示清除图标，并且可以删除内容
  };
  static propTypes = {};


  timeId: any = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isFocus: false
    };
  }

  changeInput = async (e) => {
    const value = e.currentTarget.value;
    console.log(value);
    this.clearTimeId();
    await this.setState({ value });
    const { onChange } = this.props;
    this.timeId = setTimeout(() => {
      onChange && onChange(value);
    }, 300);
  };

  clearTimeId = () => {
    this.timeId && clearTimeout(this.timeId);
  };
  focusInput = () => {
    this.setState({ isFocus: true });
  };
  blurInput = () => {
    this.setState({ isFocus: false });
  };

  render() {
    const { type, placeholder, kind, isError, errorText, unitText } = this.props;
    const { value,isFocus } = this.state;
    console.log(type, "type");
    const baseProps = {
      type,
      placeholder,
      value,
      className: cls("mc_input", {
        mc_input_search: kind === "search",
        mc_inpit_error: isError
      }),
      onChange: this.changeInput,
      onFocus: this.focusInput,
      onBlur: this.blurInput
    };
    let input = (
      <div className="mc_input_comp">
        <input {...baseProps} />
        {
          kind === "search" && // 搜索ICON
          <SearchIcon className="mc_input_search_icon"/>
        }
        {
          isError &&
          <div className="mc_input_error">
            <WarningIcon/>
            <span>{errorText}</span>
          </div>
        }
        {
          unitText &&
          <div className={`mc_input_unit ${isFocus?'focus':''}`}>{unitText}</div>
        }
      </div>
    );
    return input;
  }
}
