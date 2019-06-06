import { PureComponent } from "react";
/** Input component description */
declare class Input extends PureComponent<any, any> {
    static defaultProps: {
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
    static propTypes: {};
    timeId: any;
    countDownTimeId: any;
    selectInputRefs: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
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
