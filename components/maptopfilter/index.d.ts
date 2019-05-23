import React, { Component } from "react";
import PropTypes from "prop-types";
interface IProps {
    supper_filters?: [];
    supper_filter: {};
    geo_filters?: [];
    geo_filter: {};
    loading?: boolean;
    settingRender?(): React.ElementType;
    onSearch?(): void;
    has_global_filter?: boolean;
    deleteSupperFilter(): void;
    selectSupperFilter(): void;
    deleteGeoFilter(): void;
    selectGeoFilter(): void;
    columnTypes: any;
    addFilterCol(): void;
    replaceAli(): void;
    reset(): void;
}
declare class MapTopFilter extends Component<IProps, any> {
    static propTypes: {
        supper_filters: PropTypes.Validator<any[]>;
        supper_filter: PropTypes.Validator<object>;
        geo_filters: PropTypes.Validator<any[]>;
        geo_filter: PropTypes.Validator<object>;
        changeInitType: PropTypes.Validator<(...args: any[]) => any>;
        init_type: PropTypes.Validator<boolean>;
        changeCardDefault: PropTypes.Validator<(...args: any[]) => any>;
        is_card_default_open: PropTypes.Validator<boolean>;
        changeScreeningMethod: PropTypes.Validator<(...args: any[]) => any>;
        screening_method: PropTypes.Validator<string>;
        changeRefreshTime: PropTypes.Validator<(...args: any[]) => any>;
        refresh_time: PropTypes.Validator<number>;
    };
    static defaultProps: {
        supper_filters: ({
            "cols": null;
            "source": string;
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
        } | {
            "source": string;
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
            "cols"?: undefined;
        })[];
        supper_filter: {
            "source": string;
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
        };
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
        geo_filter: {
            "source": string;
            "filters": null;
            "packageId": number;
            "object_type": string;
            "geometry_type": string;
        };
        changeInitType: () => void;
        init_type: boolean;
        changeCardDefault: () => void;
        is_card_default_open: boolean;
        changeScreeningMethod: () => void;
        screening_method: string;
        changeRefreshTime: () => void;
        refresh_time: number;
        has_global_filter: boolean;
    };
    topFilterMoreFilter: any;
    constructor(props: any);
    changeMoreFilter: () => void;
    closeTopFilterMoreFilter: () => void;
    selectData: (value: any) => void;
    render(): JSX.Element;
}
declare const MixMapTopFilter: typeof MapTopFilter;
export default MixMapTopFilter;
