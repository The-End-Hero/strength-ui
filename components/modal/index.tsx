import React, { PureComponent, cloneElement, isValidElement, createRef } from "react";
import PropTypes from "prop-types";
import { createPortal, render, unmountComponentAtNode } from "react-dom";
import cls from "classnames";
import Button from "../button";
import Input from "../input";
import {
  InfoIcon,
  LoadingIcon,
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  CloseIcon
} from "../icon";

const typeConfig = {
  info: "info",
  success: "success",
  error: "error",
  warning: "warning",
  loading: "loading",
  confirm: "confirm",
  prompt: "prompt"
};

const ESC_KEY_CODE = 27;

/**
 * const modal = Modal.confirm()  // 得到当前 Modal 引用
 * modal.destroy()   // 手动关闭
 * @export
 * @class Modal
 * @extends {PureComponent}
 */
export default class Modal extends PureComponent <any, any> {
  state = {
    init: false,
    visible: this.props.isStaticMethod || false,
    promptValue: {}
  };
  _containerRef: any = null;
  _currentNodeRef: any = null;
  animationTime = 500;
  wrapperRef: any;
  modal: any;

  static defaultProps = {
    prefixCls: "mc-modal",
    visible: false,
    isStaticMethod: false, // 用来区分 是 Modal.xx() 还是 <Modal/>
    getPopupContainer: () => document.body,
    width: 520, //默认宽度
    title: "", // header 显示
    onOk: () => {
    }, // 确定默认调用
    onCancel: () => {
    }, // 取消默认调用
    okText: "确定",
    cancelText: "取消",
    footer: [], // 
    content: "", // 
    confirmLoading: false,
    maskClosable: true,
    centered: false,
    closable: true,
    showMask: true,
    zIndex: 999,
    okButtonProps: {},
    cancelButtonProps: {},
    escClose: true
  };
  static propTypes = {
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    title: PropTypes.oneOfType([
      PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.object
      ])
    ]),
    okText: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.object
    ]),
    cancelText: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.object
    ]),
    content: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.object
    ]),
    iconType: PropTypes.oneOf(Object.values(typeConfig)),
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    centered: PropTypes.bool,
    closable: PropTypes.bool,
    maskClosable: PropTypes.bool,
    showMask: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    zIndex: PropTypes.number,
    width: PropTypes.number,
    footer: PropTypes.oneOfType([
      //footer 不需要设置为 footer={null}
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object
    ]),
    okProps: PropTypes.object,
    cancelProps: PropTypes.object,
    wrapperClassName: PropTypes.string,
    escClose: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.wrapperRef = createRef();
    this.modal = createRef();
  }

  destroy = () => {
    unmountComponentAtNode(this._containerRef);
    this._currentNodeRef.remove();
  };
  /**
   * 静态方法渲染 函数调用
   * @param type
   * @param options
   * @returns {{destroy: any}}
   */
  static renderElement = (type, options: any = {}) => {
    const container = document.createElement("div");
    const currentNode = document.body.appendChild(container);
    const defaultProps = Modal.defaultProps;
    const prefixCls = defaultProps.prefixCls;
    const iconType = options.iconType || type;
    const { title, content, ...otherOpts } = options;
    console.log(options,'options')
    const _modal = render(
      <Modal
        className={cls(`${prefixCls}-method`, `${prefixCls}-${iconType}`)}
        closable={false}
        title={title}
        visible
        staticMethodType={type}
        isStaticMethod
        content={
          <>
            {content}
            {/*<div style={{ display: "flex", alignItems: "center" }}>*/}
            {/*<span className={cls(`${prefixCls}-method-icon`)}>*/}
              {/*{Modal.renderStaticMethodIcon(iconType)}*/}
            {/*</span>*/}
              {/*<span style={{ fontSize: 20 }}>{options.title}</span>*/}
            {/*</div>*/}
            {/*<div>{content}</div>*/}
          </>
        }
        {...otherOpts}
      >
      </Modal>,
      container
    );
    _modal._containerRef = container;
    _modal._currentNodeRef = currentNode;

    return {
      destroy: _modal.destroy
    };
  };

  static confirm(options) {
    return this.renderElement(typeConfig.confirm, options);
  }

  static success(options) {
    return this.renderElement(typeConfig.success, options);
  }

  static info(options) {
    return this.renderElement(typeConfig.info, options);
  }

  static error(options) {
    return this.renderElement(typeConfig.error, options);
  }

  static warning(options) {
    return this.renderElement(typeConfig.warning, options);
  }

  static loading(options) {
    return this.renderElement(typeConfig.loading, options);
  }

  static prompt(options) {
    return this.renderElement(typeConfig.prompt, options);
  }

  static renderStaticMethodIcon(type) {
    switch (type) {
      case typeConfig["info"]:
        return <InfoIcon style={{ width: 28 }}/>;
      case typeConfig["success"]:
        return <SuccessIcon style={{ width: 28 }}/>;
      case typeConfig["error"]:
        return <ErrorIcon style={{ width: 28 }}/>;
      case typeConfig["warning"]:
        return <WarningIcon style={{ width: 28 }}/>;
      case typeConfig["confirm"]:
        return <WarningIcon style={{ width: 28 }}/>;
      case typeConfig["loading"]:
        return <LoadingIcon style={{ width: 28 }}/>;
      case typeConfig["prompt"]:
        return <InfoIcon style={{ width: 28 }}/>;
      default:
        return null;
    }
  }

  _onOk = () => {
    // 如果是 Modal.xx() 的方式 调用 直接销毁节点
    if (this.props.isStaticMethod) {
      this.setState({ visible: false }, () => {
        setTimeout(() => {
          this.destroy();
        }, this.animationTime);
      });
    }
    this.props.onOk(this.state.promptValue);
  };
  _onCancel = () => {
    if (this.props.isStaticMethod) {
      this.setState({ visible: false }, () => {
        setTimeout(() => {
          this.destroy();
        }, this.animationTime);
      });
    }
    this.props.onCancel(this.state.promptValue);
  };
  disableScroll = () => {
    document.body.style.overflow = "hidden";
    //滚动条的宽度 防止鬼畜
    document.body.style.paddingRight = "15px";
  };
  enableScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "0";
  };
  onPromptChange = e => {
    this.setState({
      promptValue: {
        value: e.target.value,
        checked: e.target.checked
      }
    });
  };

  static getDerivedStateFromProps({ visible, isStaticMethod }, state) {
    if (visible === true && !state.visible) {
      return {
        init: true,
        visible: isStaticMethod ? false : visible
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (!this.props.isStaticMethod) {
      if (this.props.visible === true) {
        this.disableScroll();
        if (this.wrapperRef.current) {
          this.wrapperRef.current.focus();
        }
      } else {
        this.enableScroll();
      }
    }
  }

  onKeyDown = (e) => {
    if (!this.props.escClose) {
      return;
    }
    if (e.keyCode === ESC_KEY_CODE) {
      e.stopPropagation();
      if (this.props.onCancel) {
        this._onCancel();
      }
    }
  };

  render() {
    const {
      prefixCls,
      children,
      content,
      title,
      visible,
      onCancel, //eslint-disable-line
      onOk, //eslint-disable-line
      className,
      footer,
      okText,
      cancelText,
      confirmLoading,
      getPopupContainer,
      centered,
      closable,
      maskClosable,
      showMask,
      style,
      width,
      zIndex,
      okButtonProps,
      cancelButtonProps,
      wrapperClassName,
      iconType, //eslint-disable-line
      staticMethodType, //eslint-disable-line
      isStaticMethod, //eslint-disable-line
      escClose, // eslint-disable-line
      noTitle,
      ...attr
    } = this.props;

    const { init } = this.state;

    const _visible = isStaticMethod ? this.state.visible : visible;

    const maskClickHandle = maskClosable ? { onClick: this._onCancel } : {};

    const defaultPromptContent = content || <Input placeholder="请输入"/>;

    return createPortal(
      <>
        {showMask && (
          <div
            className={cls(`${prefixCls}-mask`, {
              [`${prefixCls}-mask-show`]: _visible,
              [`${prefixCls}-mask-hide`]: isStaticMethod
                ? !_visible
                : init && !_visible
            })}
            {...maskClickHandle}
          />
        )}
        <div
          role="dialog"
          tabIndex={-1}
          className={cls(`${prefixCls}-wrap`, wrapperClassName, {
            [`${prefixCls}-wrap-visible`]: _visible
          })}
          onKeyDown={this.onKeyDown}
          ref={this.wrapperRef}
        >
          <div
            className={cls(prefixCls, className, {
              [`${prefixCls}-open`]: _visible,
              [`${prefixCls}-close`]: isStaticMethod
                ? !_visible
                : init && !_visible,
              "no-title": !title || noTitle
            })}
            ref={this.modal}
            style={{
              ...style,
              width,
              zIndex
            }}
            {...attr}
          >
            <section className={`${prefixCls}-header`}>
              <h2 className={`${prefixCls}-title`}>{title}</h2>
              {closable && (
                <CloseIcon
                  className={`${prefixCls}-close`}
                  onClick={this._onCancel}
                />
              )}
            </section>
            <section className={`${prefixCls}-content`}>
              {isStaticMethod &&
              staticMethodType === typeConfig.prompt &&
              isValidElement(defaultPromptContent)
                ? cloneElement(defaultPromptContent as any, {
                  onChange: this.onPromptChange
                })
                : content || children}
            </section>
            {footer &&
            (footer.length !== 0 ? (
              <section className={`${prefixCls}-footer`}>{footer}</section>
            ) : (
              footer.length === 0 && (
                <section className={`${prefixCls}-footer`}>
                  <Button {...cancelButtonProps} onClick={this._onCancel}>
                    {cancelText}
                  </Button>
                  <Button
                    type="primary"
                    loading={confirmLoading}
                    {...okButtonProps}
                    onClick={this._onOk}
                  >
                    {okText}
                  </Button>
                </section>
              )
            ))}
          </div>
        </div>
      </>,
      getPopupContainer()
    );
  }
}
