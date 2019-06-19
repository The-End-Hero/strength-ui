import { PureComponent } from "react";
import PropTypes from "prop-types";
import "rc-slider/assets/index.css";
declare class MCSlider extends PureComponent<any, any> {
    static defaultProps: {
        prefixCls: string;
        type: string;
    };
    static propTypes: {
        prefixCls: PropTypes.Requireable<string>;
    };
    constructor(props: any);
    render(): JSX.Element;
}
export default MCSlider;
