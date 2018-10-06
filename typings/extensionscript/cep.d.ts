
declare class CSInterface {
    public getSystemPath(key:string):string;
    public evalScript(script:string, callback:Function):void;
    public getHostEnvironment():any;
}

declare class CSEvent {
    constructor(event:string, name:string);
    extensionId:string;
}

declare class SystemPath {
    static EXTENSION:string;
    static USER_DATA:string;
    static COMMON_FILES:string;
    static HOST_APPLICATION:string;
    static APPLICATION:string;
}

declare class UIColor {
    color:any;
}

declare class svg {
    public static start(a:any, b:any);
}

