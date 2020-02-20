import { Component } from "react";
import PropTypes from "prop-types";
declare class MapTool extends Component<any, any> {
    static defaultProps: {
        is_default_collapse_tool: boolean;
        is_server_render: boolean;
        fullscreencenter: boolean;
        getMap: () => void;
        maptools: ({
            key: string;
            label: string;
            checked: boolean;
            fold: boolean;
        } | {
            key: string;
            label?: undefined;
            checked?: undefined;
            fold?: undefined;
        })[];
    };
    static propTypes: {
        is_server_render: PropTypes.Requireable<boolean>;
        onFullScreenCenter: PropTypes.Requireable<(...args: any[]) => any>;
        fullscreencenter: PropTypes.Requireable<boolean>;
        hasCustomDraw: PropTypes.Requireable<boolean>;
        selectMapStyle: PropTypes.Requireable<(...args: any[]) => any>;
        saveAsJpeg: PropTypes.Requireable<(...args: any[]) => any>;
        turnOnRangingTool: PropTypes.Requireable<(...args: any[]) => any>;
        pauseState: PropTypes.Requireable<(...args: any[]) => any>;
        selfSelect: PropTypes.Requireable<(...args: any[]) => any>;
        disSelect: PropTypes.Requireable<(...args: any[]) => any>;
        emptySelect: PropTypes.Requireable<(...args: any[]) => any>;
        getMap: PropTypes.Requireable<(...args: any[]) => any>;
    };
    map: any;
    poiMarker: any;
    panorama: any;
    layer: any;
    vectorLayer: any;
    constructor(props: any);
    componentDidMount(): void;
    setOption: () => void;
    componentDidUpdate(prevProps: any): void;
    componentWillReceiveProps(nextProps: any): void;
    componentWillUnmount(): void;
    escFunction: (event: any) => void;
    removeStreetscapeView: () => void;
    changeMoreMenu: (bool: any) => void;
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
    /**
     * 点选
     */
    pauseState: () => void;
    /**
     * 画点
     */
    pointSelect: () => Promise<void>;
    /**
     * 画圆
     */
    selfSelect: () => void;
    /**
     * 画多边形
     */
    disSelect: () => void;
    /**
     * 等时圈
     */
    timeLoop: () => void;
    /**
     * 清空自绘制围栏
     */
    emptySelect: () => void;
    reSetMap: () => void;
    searchMap: () => void;
    changeIsPointSelectStatus: (bool: any) => Promise<void>;
    menuClick: (key: any) => void;
    changeCollapse: (is_collapse_tool: any) => void;
    moreSelectClick: (e: any) => void;
    render(): JSX.Element | null;
}
declare const MixMapTool: typeof MapTool;
export default MixMapTool;
