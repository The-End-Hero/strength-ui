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
    countDownNum: 60,
    allowClear: false  // 显示清除图标，并且可以删除内容
  };
  static propTypes = {};


  timeId: any = null;
  countDownTimeId: any;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isFocus: false,
      countDownNum: props.countDownNum
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.kind === "mc_input_vcode" && nextProps.kind !== this.props.kind) {
      this.setState({ countDownNum: nextProps.countDownNum || 60 }, () => {
        this.countDown();
      });
    }
  }

  countDown = () => {
    this.countDownTimeId = setTimeout(() => {
      this.setState({
        countDownNum: this.state.countDownNum - 1
      }, () => {
        if (this.state.countDownNum > 0) {
          this.countDown();
        }
      });
    }, 1000);
  };


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
  getVcode = () => {
    console.log("getvcode");
  };


  render() {
    const { type, placeholder, kind, isError, errorText, unitText, style } = this.props;
    const { value, isFocus, countDownNum } = this.state;
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
      <div className="mc_input_comp" style={style}>
        <input {...baseProps} />
        {
          kind === "search" && // 搜索ICON
          <SearchIcon className="mc_input_search_icon"/>
        }
        {
          kind === "vcode" && // 发送后，切换到 vcode_countdown
          <div className="mc_input_vcode" onClick={this.getVcode}>发送验证码</div>
        }
        {
          kind === "vcode_countdown" &&
          <div className="mc_input_vcode disable">{`${countDownNum} s`}</div>
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
          <div className={`mc_input_unit ${isFocus ? "focus" : ""}`}>{unitText}</div>
        }
      </div>
    );
    return input;
  }
}
