import { Component } from "react";
import "maptalks/dist/maptalks.css";
declare class MapCards extends Component<any, any> {
    static defaultProps: {};
    getPointVisual: any;
    constructor(props: any);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: any): Promise<void>;
    getGeoText: (card: any) => any;
    getVisualItem: (item: any) => any;
    getPolygonVisual: () => void;
    getLineVisual: () => void;
    getPointToPointVisual: () => void;
    becomeSimple: () => void;
    render(): JSX.Element[];
}
declare const MixMapCards: import("mix-with/lib").Ctor<MapCards & {
    [x: string]: any;
    getPointVisual: (filter: any) => JSX.Element;
    getPointVisualDetail: (obj: any) => any;
}>;
export default MixMapCards;
