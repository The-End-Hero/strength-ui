import { PureComponent } from "react";
export default class Button extends PureComponent<any, any> {
    static defaultProps: {
        already_rendered: number;
    };
    timeId: any;
    constructor(props: any);
    enter: () => void;
    leave: () => void;
    render(): JSX.Element;
}
