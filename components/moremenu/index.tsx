import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, WarningIcon, CloseIcon } from "../icon";
import { map, size } from "lodash";

/** Input component description */
class MoreMenu extends PureComponent<any, any> {
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

  timeId: any = null;
  countDownTimeId: any;
  selectInputRefs: any;

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


  // changeInput = async (e) => {
  //   const value = e.currentTarget.value;
  //   console.log(value);
  //   this.clearTimeId();
  //   await this.setState({ value });
  //   const { onChange } = this.props;
  //   this.timeId = setTimeout(() => {
  //     onChange && onChange(value);
  //   }, 300);
  // };

  clearTimeId = () => {
    this.timeId && clearTimeout(this.timeId);
  };
  focusInput = () => {
    const { onFocus } = this.props;
    this.setState({ isFocus: true });
    onFocus && onFocus();
  };
  blurInput = () => {
    const { onBlur } = this.props;
    this.setState({ isFocus: false });
    onBlur && onBlur();
  };
  getVcode = () => {
    // console.log("getvcode");
  };
  focusSelectInput = () => {
    this.selectInputRefs.focus();
  };
  clearClick = () => {
    const { clearClick } = this.props;
    clearClick && clearClick();
  };

  render() {
    const {
      type,
      placeholder,
      kind,
      isError,
      errorText,
      unitText,
      style,
      value,
      onFocus,
      onBlur,
      selectLabel,
      allowClear,
      ...attr
    } = this.props;
    const { isFocus, countDownNum } = this.state;
    const baseProps = {
      type,
      placeholder,
      value,
      className: cls("mc_input", {
        // mc_input_search: kind === "search",
      }),
      onFocus: this.focusInput,
      onBlur: this.blurInput,
      ...attr
    };
    let input;
    input = (
      <div className={cls("mc_input_comp", {
        isFocus,
        mc_inpit_error: isError

      })} style={style}>
        {
          kind === "search" && // 搜索ICON
          <div className="mc_input_left_icon_wrap">
            <SearchIcon/>
          </div>
        }
        {
          size(selectLabel) > 0 &&
          <div className="mc_input_select_label">
            {
              map(selectLabel, (t) => {
                return (
                  <div>{t}</div>
                );
              })
            }
          </div>
        }

        <input {...baseProps} />
        {
          allowClear &&
          <div className="mc_input_right_icon_wrap" onClick={this.clearClick} style={{ cursor: "pointer" }}>
            <CloseIcon style={{ width: 12 }}/>
          </div>
        }

        {
          kind === "vcode" && // 发送后，切换到 vcode_countdown
          <div className="mc_input_vcode" onClick={this.getVcode}>发送验证码</div>
        }
        {
          kind === "select" &&
          <div>
            搜索
          </div>
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
          <div className={`mc_input_unit`}>{unitText}</div>
        }
      </div>
    );
    return input;
  }
}

export default MoreMenu;
