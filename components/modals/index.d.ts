import { PureComponent } from "react";
import PropTypes from "prop-types";
/**
 * const modal = Modal.confirm()  // 得到当前 Modal 引用
 * modal.destroy()   // 手动关闭
 * @export
 * @class Modal
 * @extends {PureComponent}
 */
export default class Modal extends PureComponent<any, any> {
    state: {
        init: boolean;
        visible: any;
        promptValue: {};
    };
    _containerRef: any;
    _currentNodeRef: any;
    animationTime: number;
    wrapperRef: any;
    modal: any;
    static defaultProps: {
        prefixCls: string;
        visible: boolean;
        isStaticMethod: boolean;
        getPopupContainer: () => HTMLElement;
        width: number;
        title: string;
        onOk: () => void;
        onCancel: () => void;
        okText: string;
        cancelText: string;
        footer: never[];
        content: string;
        confirmLoading: boolean;
        maskClosable: boolean;
        centered: boolean;
        closable: boolean;
        showMask: boolean;
        zIndex: number;
        okButtonProps: {};
        cancelButtonProps: {};
        escClose: boolean;
    };
    static propTypes: {
        onCancel: PropTypes.Requireable<(...args: any[]) => any>;
        onOk: PropTypes.Requireable<(...args: any[]) => any>;
        title: PropTypes.Requireable<string | object>;
        okText: PropTypes.Requireable<string | object>;
        cancelText: PropTypes.Requireable<string | object>;
        content: PropTypes.Requireable<string | object>;
        iconType: PropTypes.Requireable<string>;
        confirmLoading: PropTypes.Requireable<boolean>;
        visible: PropTypes.Requireable<boolean>;
        centered: PropTypes.Requireable<boolean>;
        closable: PropTypes.Requireable<boolean>;
        maskClosable: PropTypes.Requireable<boolean>;
        showMask: PropTypes.Requireable<boolean>;
        getPopupContainer: PropTypes.Requireable<(...args: any[]) => any>;
        zIndex: PropTypes.Requireable<number>;
        width: PropTypes.Requireable<number>;
        footer: PropTypes.Requireable<boolean | object>;
        okProps: PropTypes.Requireable<object>;
        cancelProps: PropTypes.Requireable<object>;
        wrapperClassName: PropTypes.Requireable<string>;
        escClose: PropTypes.Requireable<boolean>;
    };
    constructor(props: any);
    destroy: () => void;
    static renderElement: (type: any, options?: any) => {
        destroy: any;
    };
    static confirm(options: any): {
        destroy: any;
    };
    static success(options: any): {
        destroy: any;
    };
    static info(options: any): {
        destroy: any;
    };
    static error(options: any): {
        destroy: any;
    };
    static warning(options: any): {
        destroy: any;
    };
    static loading(options: any): {
        destroy: any;
    };
    static prompt(options: any): {
        destroy: any;
    };
    static renderStaticMethodIcon(type: any): JSX.Element | null;
    _onOk: () => void;
    _onCancel: () => void;
    disableScroll: () => void;
    enableScroll: () => void;
    onPromptChange: (e: any) => void;
    static getDerivedStateFromProps({ visible, isStaticMethod }: {
        visible: any;
        isStaticMethod: any;
    }, state: any): {
        init: boolean;
        visible: any;
    } | null;
    componentDidUpdate(): void;
    onKeyDown: (e: any) => void;
    render(): any;
}
