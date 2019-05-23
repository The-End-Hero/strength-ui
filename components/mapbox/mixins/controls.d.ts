import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
declare const Controls: (superclass: any) => {
    new (): {
        [x: string]: any;
        /**
         * 添加control
         */
        addControls: () => void;
        /**
         * 添加绘制的control
         */
        addDrawControl: () => void;
        onClickToggleDraw: () => void;
        onClickDrawCircle: () => void;
        onClickDrawOutput: () => void;
        appendOutputDiv: () => void;
        hideDrawButton: () => void;
        showDrawButton: () => void;
        noDrag: () => void;
        addMeasure: () => void;
    };
    [x: string]: any;
};
export default Controls;
