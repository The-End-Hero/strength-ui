declare const some: (superclass: any) => {
    new (): {
        [x: string]: any;
        hehehe: () => void;
        hahaha: () => void;
    };
    [x: string]: any;
};
export default some;
