import { Component } from "react";
import PropTypes from "prop-types";
import "rc-tooltip/assets/bootstrap.css";
declare class MapTool extends Component<any, any> {
    static defaultProps: {
        is_server_render: boolean;
        fullscreencenter: boolean;
        getMap: () => void;
        renderOrder: {
            key: any;
        }[];
    };
    static propTypes: {
        is_server_render: PropTypes.Validator<boolean>;
        onFullScreenCenter: PropTypes.Validator<(...args: any[]) => any>;
        fullscreencenter: PropTypes.Validator<boolean>;
        hasCustomDraw: PropTypes.Validator<boolean>;
        selectMapStyle: PropTypes.Validator<(...args: any[]) => any>;
        saveAsJpeg: PropTypes.Validator<(...args: any[]) => any>;
        turnOnRangingTool: PropTypes.Validator<(...args: any[]) => any>;
        pauseState: PropTypes.Validator<(...args: any[]) => any>;
        selfSelect: PropTypes.Validator<(...args: any[]) => any>;
        disSelect: PropTypes.Validator<(...args: any[]) => any>;
        emptySelect: PropTypes.Validator<(...args: any[]) => any>;
        getMap: PropTypes.Validator<(...args: any[]) => any>;
    };
    map: any;
    poiMarker: any;
    panorama: any;
    layer: any;
    vectorLayer: any;
    constructor(props: any);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    escFunction: (event: any) => void;
    removeStreetscapeView: () => void;
    moreMenu: (bool: any) => void;
    selectMapStyle: (style: any) => void;
    getMapPanelInstance: () => any;
    toggleStreetView: () => void;
    setStreetViewCoord: (e: any) => void;
    showStreetscapeView: () => void;
    addSecondMap: () => void;
    hideStreetscapeView: () => void;
    showPop: () => void;
    turnOnRangingTool: () => void;
    saveAsJpeg: () => void;
    onFullScreenCenter: () => void;
    pauseStyle: (bool: any) => void;
    pauseState: () => void;
    selfSelect: () => void;
    disSelect: () => void;
    emptySelect: () => void;
    render(): JSX.Element;
}
declare const MixMapTool: typeof MapTool;
export default MixMapTool;
