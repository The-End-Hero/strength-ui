import { Component } from "react";
interface IProps {
    geo_filters?: [];
    geo_filter?: {};
    polygonDataAll?: any;
    deleteGeoFilter(): void;
}
declare class TopFilterGeoSelect extends Component<IProps, any> {
    static defaultProps: {
        geo_filters: ({
            "source": string;
            "current": boolean;
            "filters": {
                "uid": string;
                "style": {
                    "color": string;
                    "fillOpacity": number;
                };
            }[];
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
        } | {
            "source": string;
            "filters": null;
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
            "current"?: undefined;
        })[];
    };
    timeoutId: any;
    timeoutId2: any;
    constructor(props: any);
    changeShowMore: (bool: any) => () => void;
    selectOption: (option: any) => () => void;
    showMenu: () => void;
    showMenu2: () => void;
    onMouseLeave: () => void;
    onMouseLeave2: () => void;
    onCurrentGeoValue: (e: any) => void;
    onChange: () => void;
    render(): JSX.Element;
}
declare const MixTopFilterGeoSelect: typeof TopFilterGeoSelect;
export default MixTopFilterGeoSelect;
