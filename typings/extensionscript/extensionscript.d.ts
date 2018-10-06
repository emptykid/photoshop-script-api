

declare class UnitValue {
    value:number;
}

declare class ArtLayer {
    bounds: UnitValue[];
    kind:LayerKind;
    name:string;
    textItem:any;
}

declare class Selections {
    bounds: UnitValue[];
}

declare class ColorSampler {
    color:any;
    position:number[];
}


declare class activeDocument {
    static width:UnitValue;
    static height:UnitValue;
    static path:string;
    static activeHistoryState:number;
    static activeLayer:any;
    static historyStates:number[];
    static selection:Selections;
    static colorSamplers:ColorSampler[];
    public static suspendHistory(key:string, val:string);
    public static exportDocument(file:any, type:number, options:any):void;
}


/**
 * ActionDescriptor
 */
declare class ActionDescriptor {
    count:number;
    putReference(key:number, ref:ActionReference);
    putEnumerated(a:number, b:number, c:number);
    putObject(a:number, b:number, desc:ActionDescriptor):void;
    getInteger(key:number):any;
    putUnitDouble(key:number, key1:number, val:any):void;
    putInteger(key:number, valu:number):void;
    getObjectValue(key:number):any;
    getBoolean(key:number):any;
    getDouble(key:number):any;
    hasKey(key:number):boolean;
    putDouble(key:number, value:number):void;
    putBoolean(key:number, value:boolean):void;
    getString(key:number):string;
    getUnitDoubleValue(key:number):any;
    getList(key:number):ActionDescriptor;
    putList(key:number, list:ActionList):void;
    getReference(num:number):ActionReference;
    putPath(key:number, file:File);
    putString(key:number, name:string);
    putClass(key:number, name:number);
}


/**
 * ActionReference
 */
declare class ActionReference {
    putProperty(key:number, value:number):void;
    putEnumerated(a:number, b:number, c:number):void;
    putName(key:number, value:string):void;
    putIdentifier(key:number, val:number):void;
    putClass(key:number):void;
    putIndex(key:number, val:number):void;
    getIndex():number;
}


/**
 * ActionList
 */
declare class ActionList {
    putReference(ref:ActionReference);
    putInteger(num:number);
}

