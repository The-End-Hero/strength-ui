import { Component } from "react";
interface IProps {
    supper_filters?: [];
    supper_filter: {
        geometry_type?: string;
        object_type?: string;
        source?: string;
        packageId?: number;
    };
    deleteSupperFilter(): void;
}
declare class TopFilterDataSelect extends Component<IProps, any> {
    constructor(props: any);
    changeShowMore: (bool: any) => () => void;
    selectOption: (option: any) => () => void;
    render(): JSX.Element;
}
declare const MixTopFilterDataSelect: typeof TopFilterDataSelect;
export default MixTopFilterDataSelect;
