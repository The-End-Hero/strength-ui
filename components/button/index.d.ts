import { PureComponent } from "react";
import PropTypes from "prop-types";
export default class Button extends PureComponent<any, any> {
    static defaultProps: {
        prefixCls: string;
        href: string;
        type: string;
        htmlType: string;
        size: string;
        loading: boolean;
        block: boolean;
        disabled: boolean;
        hollow: boolean;
        dashed: boolean;
        circle: boolean;
        plain: boolean;
    };
    static propTypes: {
        prefixCls: PropTypes.Validator<string>;
        block: PropTypes.Requireable<boolean>;
        hollow: PropTypes.Requireable<boolean>;
        loading: PropTypes.Requireable<boolean>;
        disabled: PropTypes.Requireable<boolean>;
        dashed: PropTypes.Requireable<boolean>;
        circle: PropTypes.Requireable<boolean>;
        plain: PropTypes.Requireable<boolean>;
        htmlType: PropTypes.Requireable<string>;
        href: PropTypes.Requireable<string>;
        type: PropTypes.Requireable<string>;
        size: PropTypes.Requireable<string>;
    };
    render(): any;
}
