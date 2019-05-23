import { Component } from "react";
interface IProps {
    type?: string;
    style?: object;
}
interface IState {
    showMore: boolean;
}
declare class GeoTypesIcon extends Component<IProps, IState> {
    constructor(props: any);
    switchType: (type: any) => any;
    render(): JSX.Element;
}
declare const MixGeoTypesIcon: typeof GeoTypesIcon;
export default MixGeoTypesIcon;
