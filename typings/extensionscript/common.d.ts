
declare class dollar {
    static fileName:string;
    static line:number;
    static File:any;
    static Folder:any;
}

declare class $ {
    static fileName:string;
    static line:number;
    static File:any;
    static Folder:any;
    static about:any;
    static evalFile:any;
    static writeln:any;
    static write:any;
    static sleep:any;
}

declare class Folder {
    constructor(path:string);
    exists:boolean;
    getFiles(suffix:string):any;
}

declare class File {
    constructor(path:string);
    exists:boolean;
}

declare class DialogModes {
    static NO:number;
}

declare class LayerKind {
    static NORMAL:number;
    static SOLIDFILL:number;
    static TEXT:number;
}

declare class ExportType {
    static SAVEFORWEB:number;
}

declare class SaveDocumentType {
    static PNG:number;
}

declare class ExportOptionsSaveForWeb {
    format:number;
    PNG8:boolean;
    quality:number;
}

declare class preferences {
    static rulerUnits:UnitValue;
    static typeUnits:UnitValue;
}

declare class Units {
    static PIXELS:UnitValue;
}

declare class TypeUnits {
    static PIXELS:UnitValue;
}

declare class Document {
    static add(width:number, height:number);
}

declare function console_error(file:string, line:number, ex:string);
declare function console_debug(msg:string);
declare function charIDToTypeID(key:string):number;
declare function stringIDToTypeID(key:string):number;
declare function executeAction(key:number, desc:ActionDescriptor, dialog:number):any;
declare function executeActionGet(ref:ActionReference):ActionDescriptor;
