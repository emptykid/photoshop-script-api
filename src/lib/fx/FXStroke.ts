/**
 * Created by xiaoqiang
 * @date
 * @description
 */

import {SolidColor} from "../base/SolidColor";

export enum StrokeFrameStyle {
    Outside = "outsetFrame",
    Inside = "insetFrame",
    Center = "centeredFrame"
}

export enum StrokeFillType {
    SolidColor = "solidColor",
    Gradient = "gradientFill",  // TODO to be implemented
    Pattern = "pattern"  // TODO to be implemented
}

export class FXStroke {
    public scale: number = 100;
    public enabled: boolean = true;
    public present: boolean = true;
    public showInDialog: boolean = true;
    public position: StrokeFrameStyle = StrokeFrameStyle.Outside;
    public fillType: StrokeFillType = StrokeFillType.SolidColor;
    public mode: string = "normal";    // TODO to be apply in enum
    public size: number = 1;
    public opacity: number = 100;
    public color: SolidColor = SolidColor.blackColor();

    /**
     * create a FXStroke object from descriptor
     * @param desc
     * @return FXStroke
     */
    static fromDescriptor(desc: ActionDescriptor): FXStroke {
        const ins = new FXStroke();
        ins.enabled = desc.getBoolean(app.stringIDToTypeID("enabled"));
        ins.present = desc.getBoolean(app.stringIDToTypeID("present"));
        ins.mode = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("mode")));
        ins.position = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("style"))) as StrokeFrameStyle;
        ins.fillType = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("paintType"))) as StrokeFillType;
        ins.size = desc.getDouble(app.stringIDToTypeID("size"));
        ins.opacity = desc.getDouble(app.stringIDToTypeID("opacity"));
        ins.color = SolidColor.fromDescriptor(desc.getObjectValue(app.stringIDToTypeID("color")));
        return ins;
    }

    /**
     * apply current stroke effect to target layer
     */
    public apply() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.stringIDToTypeID( "property" ), app.stringIDToTypeID( "layerEffects" ) );
        ref1.putEnumerated( app.stringIDToTypeID( "layer" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "targetEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const desc2 = new ActionDescriptor();
        desc2.putUnitDouble( app.stringIDToTypeID( "scale" ), app.stringIDToTypeID( "percentUnit" ), this.scale );
        const desc3 = new ActionDescriptor();
        desc3.putBoolean( app.stringIDToTypeID( "enabled" ), this.enabled );
        desc3.putBoolean( app.stringIDToTypeID( "present" ), this.present );
        desc3.putBoolean( app.stringIDToTypeID( "showInDialog" ), this.showInDialog );
        desc3.putEnumerated( app.stringIDToTypeID( "style" ), app.stringIDToTypeID( "frameStyle" ), app.stringIDToTypeID( this.position ) );
        desc3.putEnumerated( app.stringIDToTypeID( "paintType" ), app.stringIDToTypeID( "frameFill" ), app.stringIDToTypeID( this.fillType ) );
        desc3.putEnumerated( app.stringIDToTypeID( "mode" ), app.stringIDToTypeID( "blendMode" ), app.stringIDToTypeID( this.mode ) );
        desc3.putUnitDouble( app.stringIDToTypeID( "opacity" ), app.stringIDToTypeID( "percentUnit" ), this.opacity );
        desc3.putUnitDouble( app.stringIDToTypeID( "size" ), app.stringIDToTypeID( "pixelsUnit" ), this.size );
        desc3.putObject( app.stringIDToTypeID( "color" ), app.stringIDToTypeID( "RGBColor" ), this.color.toDescriptor() );
        desc3.putBoolean( app.stringIDToTypeID( "overprint" ), false );
        desc2.putObject( app.stringIDToTypeID( "frameFX" ), app.stringIDToTypeID( "frameFX" ), desc3 );
        desc1.putObject( app.stringIDToTypeID( "to" ), app.stringIDToTypeID( "layerEffects" ), desc2 );
        app.executeAction( app.stringIDToTypeID( "set" ), desc1, DialogModes.NO );
    }
}
