/**
 * Created by xiaoqiang
 * @date
 * @description
 */
import {Point} from "./Shape";
import {SolidColor} from "./base/SolidColor";

export class ColorSampler {
    public position: Point;
    public color: SolidColor;

    constructor(position: Point, color: SolidColor = null) {
        this.position = position;
        this.color = color;
    }

    static fromDescriptor(desc: ActionDescriptor): ColorSampler {
        const position = desc.getObjectValue(app.stringIDToTypeID("position"));
        const color = desc.getObjectValue(app.stringIDToTypeID("color"));
        return new ColorSampler(Point.fromDescriptor(position), SolidColor.fromDescriptor(color));
    }

    static clearAll(): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated( app.stringIDToTypeID( "colorSampler" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "allEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "delete" ), desc1, DialogModes.NO );
    }

    public apply() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( "colorSampler" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const desc2 = new ActionDescriptor();
        desc2.putUnitDouble( app.stringIDToTypeID( "horizontal" ), app.stringIDToTypeID( "pixelsUnit" ), this.position.x );
        desc2.putUnitDouble( app.stringIDToTypeID( "vertical" ), app.stringIDToTypeID( "pixelsUnit" ), this.position.y );
        desc1.putObject( app.stringIDToTypeID( "position" ), app.stringIDToTypeID( "paint" ), desc2 );
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
    }
}
