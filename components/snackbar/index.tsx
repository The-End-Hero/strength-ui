import React, { Component } from "react";
import ReactDom from "react-dom";
import cls from "classnames";

class SnackBar extends Component<any, any> {
  time1: any;
  time2: any;

  constructor(props) {
    super(props);
    this.state = {
      hide: false
    };
  }

  componentDidMount() {
    this.close();
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
  }

  close = () => {
    const { hasClose, delay, onClose, hasCancle } = this.props;
    const t = this;
    if (!hasClose || hasCancle) {
      t.time1 = setTimeout(() => {
        t.setState({ hide: !t.state.hide });
        t.time2 = setTimeout(() => {
          onClose();
        }, 1000);
      }, delay * 1000);
    }
  };

  enter = () => {
    clearTimeout(this.time1);
    clearTimeout(this.time2);
  };

  leave = () => {
    this.close();
  };

  cancle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { cancle } = this.props;
    if (cancle) cancle();
  };

  render() {
    const { type, msg, hasClose, onClose, hasCancle } = this.props;
    const { hide } = this.state;
    return (
      <div className={cls("mc-message animated dis_flex", {
        "mc-msg-success": type === "success",
        "mc-msg-error": type === "error",
        "mc-msg-info": type === "info",
        "mc-msg-warning": type === "warning",
        slideInDown: !hide,
        fadeOut: hide
      })} onMouseEnter={this.enter} onMouseLeave={this.leave}>
        <div>{msg}</div>
        {
          hasCancle && <span className="ml15 cancel_btn"
                             onClick={this.cancle.bind(this)}>撤销</span>
        }
        {hasClose && <i className="mc-msg-icon material-icons" onClick={() => {
          this.setState({ hide: !hide });
          setTimeout(() => {
            onClose();
          }, 1000);
        }}>close</i>}
      </div>
    );
  }
}

/**
 * 使用说明
 * import snackbar from 'snackbar'
 * snackbar.info(a,v,b,n)
 * @type {{info: _default.info}}
 * @private
 */
const _default = {
  /**
   * 参数
   * @param type 信息类型 success|error|info|warning  string 默认success
   * @param msg  snackbar展示文字  string
   * @param hasClose 是否有关闭按钮，如果有，则不会自动关闭。 bool 默认为false
   * @param delay 自动关闭时间(秒) num 默认为5
   */
  info: (type = "success", msg = "this is alertmsg", hasClose = false, delay = 5, hasCancle?:boolean, cancle?:any, autoClose?:boolean) => {
    const div = document.createElement("div");
    if (document.querySelector("#mc-snackbar")) {
      const sb = document.querySelector("#mc-snackbar");
      sb && sb.appendChild(div);
      const close = () => {
        ReactDom.unmountComponentAtNode(div);
        div.parentNode && div.parentNode.removeChild(div);
      };
      ReactDom.render(<SnackBar type={type} msg={msg} hasClose={hasClose} onClose={close} delay={delay}
                                hasCancle={hasCancle} cancle={cancle}/>, div);
      // !hasClose && setTimeout(close, delay * 1000)
    } else {
      // div.style.display='flex'
      div.id = "mc-snackbar";
      document.body.appendChild(div);
      const rot = document.createElement("div");
      div.appendChild(rot);
      const close = () => {
        ReactDom.unmountComponentAtNode(rot);
        rot.parentNode && rot.parentNode.removeChild(rot);
      };
      ReactDom.render(<SnackBar type={type} msg={msg} hasClose={hasClose} onClose={close} delay={delay}
                                hasCancle={hasCancle} cancle={cancle}/>, rot);
      // !hasClose && setTimeout(close, delay * 1000)
    }
  }
};
export default _default;
