/// <reference types="react" />
declare const PointMixin: (superclass: any) => {
    new (): {
        [x: string]: any;
        getPointVisual: (filter: any) => JSX.Element;
        getPointVisualDetail: (obj: any) => any;
    };
    [x: string]: any;
};
export default PointMixin;
