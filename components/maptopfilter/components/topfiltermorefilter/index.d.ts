import React, { Component } from "react";
interface IProps {
    supper_filters?: [];
    supper_filter?: any | {};
    geo_filters?: [];
    geo_filter?: {};
    loading?: boolean;
    changeMoreFilter: any;
    onSearch?(): void;
    settingRender?(): React.ElementType;
    deleteGeoFilter(one: any): void;
    deleteSupperFilter(one: any): void;
    selectSupperFilter(one: any): void;
    selectGeoFilter(one: any): void;
    columnTypes: any;
    reset(): void;
}
declare class TopFilterMoreFilter extends Component<IProps, any> {
    menu: any;
    draw: any;
    constructor(props: any);
    toggleDrawer: (bool: any) => () => void;
    onAddFilterCol: (one: any, two: any) => void;
    resetTemp: () => void;
    setDragData: (one: any, two: any) => void;
    render(): JSX.Element;
}
declare const MixTopFilterMoreFilter: typeof TopFilterMoreFilter;
export default MixTopFilterMoreFilter;
