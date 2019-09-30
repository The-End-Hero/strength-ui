import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, ErrorIcon, CloseIcon } from "../icon";
import { map, size, isString } from "lodash";
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
  inputRef: any;

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
  componentDidUpdate(prevProps) {
    const { kind } = this.props;
    if (kind === "mc_input_vcode" && kind !== prevProps.kind) {
      this.setState({ countDownNum: prevProps.countDownNum || 60 }, () => {
        this.countDown();
      });
    }
    // console.log(prevProps.value, "prevProps.value");
    // console.log(this.props.value, "this.props.value");
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value
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
    this.inputRef && this.inputRef.focus();
  };
  blurInput = () => {
    // console.log("blur");
    // setTimeout(()=>{
    //   this.setState({
    //     isFocus: false,
    //     showSelectList: false
    //   });
    // },300)
    const { onBlur } = this.props;
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

  _onChange = (e) => {
    const v = e.currentTarget.value;
    this.setState({
      value: v
    });
    const { onChange } = this.props;
    onChange && onChange(e);
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
      className,
      // value,
      infoPlacement,
      onFocus,
      onBlur,
      selectLabel,
      allowClear,
      selectList,
      ...attr
    } = this.props;
    const {
      isFocus,
      countDownNum,
      showSelectList,
      value
    } = this.state;
    const baseProps = {
      type,
      placeholder,
      // value,
      className: cls(prefixCls, {
        // mc_input_search: kind === "search",
      }),
      onFocus: this.focusInput,
      onBlur: this.blurInput,
      onChange: this._onChange,
      ...attr
    };
    let input;
    // console.log(showSelectList, "showSelectList");
    // console.log(selectList, "selectList");
    // console.log("Input render");

    input = (
      <ClickAwayListener onClickAway={() => {
        this.setState({
          isFocus: false,
          showSelectList: false
        });
      }}>
        <div className={cls(`${prefixCls}-comp ${className}`, {
          isFocus,
          [`${prefixCls}-error`]: isError
        })} style={{
          zIndex: isFocus ? zIndex : "",
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
                map(selectLabel, (t, index) => {
                  return (
                    <div key={index}>{t}</div>
                  );
                })
              }
            </div>
          }
          <input ref={ref => this.inputRef = ref}{...baseProps} value={value} onChange={this._onChange}/>
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
              show: kind === "select"
              // hide: kind !== "select" || showSelectList
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
