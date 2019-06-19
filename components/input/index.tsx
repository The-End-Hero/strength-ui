import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, ErrorIcon, CloseIcon } from "../icon";
import { map, size } from "lodash";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

let zIndex = 1000;

/** Input component description */
class Input extends PureComponent<any, any> {
  static defaultProps = {
    prefixCls: "mc-input",
    infoPlacement: "bottom",
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
  static propTypes = {
    prefixCls: PropTypes.string,
    /** 占位符*/
    placeholder: PropTypes.string,
    /** 单位名称*/
    unitText: PropTypes.string,
    errorText: PropTypes.string,
    value: PropTypes.string,
    kind: PropTypes.string,
    type: PropTypes.string,
    isError: PropTypes.bool,
    allowClear: PropTypes.bool,
    clearClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    countDownNum: PropTypes.number
  };


  timeId: any = null;
  countDownTimeId: any;
  selectInputRefs: any;

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isFocus: false,
      showSelectList: false,
      countDownNum: props.countDownNum
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.kind === "mc_input_vcode" && nextProps.kind !== this.props.kind) {
  //     this.setState({ countDownNum: nextProps.countDownNum || 60 }, () => {
  //       this.countDown();
  //     });
  //   }
  // }
  componentDidUpdate(prevProps){
    const {kind} = this.props
    if (kind === "mc_input_vcode" && kind !== prevProps.kind) {
      this.setState({ countDownNum: prevProps.countDownNum || 60 }, () => {
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

  clearTimeId = () => {
    this.timeId && clearTimeout(this.timeId);
  };
  focusInput = () => {
    const { onFocus } = this.props;
    this.setState({
      isFocus: true,
      showSelectList: true
    });
    onFocus && onFocus();
  };
  blurInput = () => {
    const { onBlur } = this.props;
    this.setState({ isFocus: false });
    onBlur && onBlur();
  };
  getVcode = () => {
    console.log("getvcode");
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
      prefixCls,
      type,
      placeholder,
      kind,
      isError,
      errorText,
      unitText,
      style,
      value,
      infoPlacement,
      onFocus,
      onBlur,
      selectLabel,
      allowClear,
      selectList,
      ...attr
    } = this.props;
    const { isFocus, countDownNum, showSelectList } = this.state;
    const baseProps = {
      type,
      placeholder,
      value,
      className: cls(prefixCls, {
        // mc_input_search: kind === "search",
      }),
      onFocus: this.focusInput,
      onBlur: this.blurInput,
      ...attr
    };
    let input;
    input = (
      <ClickAwayListener onClickAway={() => {
        this.setState({ showSelectList: false });
      }}>
        <div className={cls(`${prefixCls}-comp`, {
          isFocus,
          [`${prefixCls}-error`]: isError
        })} style={{
          zIndex: isFocus ? zIndex : "unset",
          ...style
        }}>
          {
            kind === "search" && // 搜索ICON
            <div className={`${prefixCls}-left-icon-wrap`}>
              <SearchIcon/>
            </div>
          }
          {
            size(selectLabel) > 0 &&
            <div className={`${prefixCls}-select-label`}>
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
            <div className={`${prefixCls}-right-icon-wrap`} onClick={this.clearClick} style={{ cursor: "pointer" }}>
              <CloseIcon style={{ width: 12 }}/>
            </div>
          }

          {
            kind === "vcode" && // 发送后，切换到 vcode_countdown
            <div className={`${prefixCls}-vcode`} onClick={this.getVcode}>发送验证码</div>
          }
          {
            showSelectList && kind === "select" && size(selectList) > 0 && 
            <div className={cls(`${prefixCls}-select-list`, {
              show: kind === "select",
              hide: kind !== "select"
            })}>
              {
                map(selectList, (t) => {
                  return t;
                })
              }
            </div>
          }
          {
            kind === "vcode_countdown" &&
            <div className={`${prefixCls}-vcode disable`}>{`${countDownNum} s`}</div>
          }
          {
            isError &&
            <div className={cls(`${prefixCls}-error`, {
              [`text-right`]: infoPlacement === "right",
              [`text-bottom`]: infoPlacement === "bottom"
            })}>
              <ErrorIcon/>
              <span>{errorText}</span>
            </div>
          }
          {
            unitText &&
            <div className={`${prefixCls}-unit`}>{unitText}</div>
          }
        </div>
      </ClickAwayListener>
    );
    return input;
  }
}

export default Input;
