import * as React from "react";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
interface IProps {
    getNearest?: any;
    onMapClick?(one: any): void;
    mapOnLoad?(): void;
}
interface IState {
    map_style: string;
    coordinate_system: string;
}
declare class MapBox extends React.Component<IProps, IState> {
    static defaultProps: {
        map_info: {
            location: string;
            scale: number;
            size: string;
            zoom: number;
        };
    };
    map: any;
    mapId: string;
    drawBar: any;
    draw: any;
    showDraw: any;
    mapLayers: any;
    mapNikLayer: any;
    hehehe: any;
    toggleEvents: any;
    addControls: any;
    renderPopup: any;
    popup: any;
    resolution: any;
    addMeasure: any;
    deck: any;
    constructor(props: any);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): Promise<void>;
    updateScale: () => void;
    /**
     * 查询接口
     */
    onSearch: () => void;
    /**
     * 地图loaded
     */
    onMapLoad: () => void;
    initDeckGl: () => void;
    onMapClick: () => void;
    /**
     *
     * @param coord
     * @param oriType 表示地图坐标系，百度底图时用百度坐标系
     * @returns {string}
     */
    getPopDesc: (coord: any, oriType: any) => string;
    /**
     * 地图出错
     * @param e
     */
    onMapError: (e: any) => void;
    getMapInfo: () => {
        center: any[];
        zoom: any;
        bearing: any;
        pitch: any;
    };
    render(): JSX.Element;
}
declare const MixMapBox: import("mix-with/lib").Ctor<MapBox & {
    [x: string]: any;
    addControls: () => void;
    addDrawControl: () => void;
    onClickToggleDraw: () => void;
    onClickDrawCircle: () => void;
    onClickDrawOutput: () => void;
    appendOutputDiv: () => void;
    hideDrawButton: () => void;
    showDrawButton: () => void;
    noDrag: () => void;
    addMeasure: () => void;
}>;
export default MixMapBox;
