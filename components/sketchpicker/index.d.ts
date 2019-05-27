import { Component } from "react";
declare class Sketchpicker extends Component<any, any> {
  static defaultProps: {
    preventClose: boolean;
    noDrag: boolean;
    noOverlay: boolean;
    className: string;
  };
  refPopover: any;
  startMove: any;
  offLeft: any;
  offTop: any;
  constructor(props: any);
  changeColor: (
    {
      rgb
    }: {
      rgb: any;
    },
    e: any
  ) => void;
  closePicker: (e: any) => void;
  close: (e: any) => any;
  finish: (e: any) => any;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: (e: any) => void;
  stopDp: (e: any) => void;
  selectColor: (e: any, c: any, idx: any) => void;
  handleKeydown: (e: any) => void;
  onDragLeave: (e: any, idx: any) => void;
  onAddCollect: (e: any) => void;
  postCollectColors: (collect_colors: any) => void;
  render(): JSX.Element;
}
declare const MixMapCards: typeof Sketchpicker;
export default MixMapCards;
