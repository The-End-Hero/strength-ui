import { Component } from "react";
declare class SketchpickerPoi extends Component<any, any> {
    static defaultProps: {
        className: string;
    };
    startMove: any;
    sketchRef: any;
    popover: any;
    offLeft: any;
    offTop: any;
    constructor(props: any);
    changeColor: (color: any) => void;
    onSelectIcon: (e: any, selectIcon: any) => void;
    closePicker: (e: any) => void;
    openColorPicker: (...args: any[]) => void;
    close: (...args: any[]) => void;
    finish: (...args: any[]) => void;
    onMouseDown: (e: any) => void;
    onMouseMove: (e: any) => void;
    onMouseUp: (e: any) => void;
    render(): JSX.Element;
}
declare const MixMapCards: typeof SketchpickerPoi;
export default MixMapCards;
