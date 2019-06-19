import { PureComponent } from "react";
import PropTypes from "prop-types";
/** Input component description */
declare class Input extends PureComponent<any, any> {
    static defaultProps: {
        prefixCls: string;
        infoPlacement: string;
        type: string;
        kind: string;
        placeholder: string;
        value: string;
        isError: boolean;
        errorText: string;
        unitText: string;
        countDownNum: number;
        allowClear: boolean;
    };
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
        /** 占位符*/
        placeholder: PropTypes.Requireable<string>;
        /** 单位名称*/
        unitText: PropTypes.Requireable<string>;
        errorText: PropTypes.Requireable<string>;
        value: PropTypes.Requireable<string>;
        kind: PropTypes.Requireable<string>;
        type: PropTypes.Requireable<string>;
        isError: PropTypes.Requireable<boolean>;
        allowClear: PropTypes.Requireable<boolean>;
        clearClick: PropTypes.Requireable<(...args: any[]) => any>;
        onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        countDownNum: PropTypes.Requireable<number>;
    };
    timeId: any;
    countDownTimeId: any;
    selectInputRefs: any;
    constructor(props: any);
    componentDidUpdate(prevProps: any): void;
    countDown: () => void;
    clearTimeId: () => void;
    focusInput: () => void;
    blurInput: () => void;
    getVcode: () => void;
    focusSelectInput: () => void;
    clearClick: () => void;
    render(): any;
}
export default Input;
