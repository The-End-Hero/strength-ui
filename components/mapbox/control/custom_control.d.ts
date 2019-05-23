declare class Custom_control {
    _map: any;
    _container: any;
    _resetDom: any;
    _upZoomDom: any;
    _downZoomDom: any;
    _zoomDisplayDom: any;
    onAdd: (map: any) => any;
    easing: (t: any) => number;
    onRemove: () => void;
}
export default Custom_control;
