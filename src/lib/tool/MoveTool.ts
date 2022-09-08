/**
 * Created by xiaoqiang
 * @date
 * @description
 */
import {Layer} from "../Layer";
import {Tool} from "./Tool";

export enum LayerAlignType {
    Left = "ADSLefts",
    CenterH = "ADSCentersH",
    Right = "ADSRights",
    Top = "ADSTops",
    CenterV = "ADSCentersV",
    Bottom = "ADSBottoms",
}

export class MoveTool extends Tool{

    constructor() {
        super("moveTool");
    }

    public static alignLayers(layers: Layer[], align: LayerAlignType): void {
        Layer.setSelectedLayers(layers);
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated( app.stringIDToTypeID( "layer" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "targetEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        desc1.putEnumerated( app.stringIDToTypeID( "using" ), app.stringIDToTypeID( "alignDistributeSelector" ), app.stringIDToTypeID( align ) );
        desc1.putBoolean( app.stringIDToTypeID( "alignToCanvas" ), false );
        app.executeAction( app.stringIDToTypeID( "align" ), desc1, DialogModes.NO );
    }
}
