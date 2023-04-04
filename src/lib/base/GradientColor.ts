/**
 * Created by xiaoqiang
 * @date 2022/08/01
 * @description this class represent a gradient color of photoshop
 */

import {SolidColor} from "./SolidColor";

export enum GradientType {
    Linear = "linear",
}

type ColorStop = {
    color: SolidColor;
    position: number;
    point: number;
}

type OpacityStop = {
    opacity: number;
    location: number;
    point: number;
}

export class GradientColor {
    // TODO current only support linear type
    private type: GradientType = GradientType.Linear;
    private angle: number = 90;
    private colorStopList: ColorStop[] = [];
    private opacityStopList: OpacityStop[] = [];

    /**
     * add a color stop to the gradient line
     * @param color
     * @param position
     * @param point
     */
    public addColorStop(color: SolidColor, position: number = 0, point: number = 50) {
        this.colorStopList.push({
            color,
            point,
            position
        });
    }

    /**
     * add a opacity stop to gradient line
     * @param opacity
     * @param location
     * @param point
     */
    public addOpacityStop(opacity: number = 100, location: number = 0, point: number = 50) {
        this.opacityStopList.push({
            opacity,
            location,
            point
        });
    }

    public static fromDescriptor(desc: ActionDescriptor): GradientColor {
        const gradient = new GradientColor();
        gradient.angle = desc.getDouble(app.stringIDToTypeID("angle"));
        gradient.type = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("type"))) as GradientType;

        const gradientDesc = desc.getObjectValue(app.stringIDToTypeID("gradient"));

        const colorStopList = gradientDesc.getList(app.stringIDToTypeID("colors"));
        for (let i = 0; i < colorStopList.count; i++) {
            const stop = colorStopList.getObjectValue(i);
            const color = SolidColor.fromDescriptor(stop.getObjectValue(app.stringIDToTypeID("color")));
            const position = stop.getInteger(app.stringIDToTypeID("location"));
            const point = stop.getInteger(app.stringIDToTypeID("midpoint"));
            gradient.addColorStop(color, position, point);
        }

        const opacityStopList = gradientDesc.getList(app.stringIDToTypeID("transparency"));
        for (let i = 0; i < opacityStopList.count; i++) {
            const stop = opacityStopList.getObjectValue(i);
            const opacity = stop.getUnitDoubleValue(app.stringIDToTypeID("opacity"));
            const location = stop.getInteger(app.stringIDToTypeID("location"));
            const point = stop.getInteger(app.stringIDToTypeID("midpoint"));
            gradient.addOpacityStop(opacity, location, point);
        }

        return gradient;
    }

    /**
     * covert current object to ActionDescriptor format
     */
    public toDescriptor(): ActionDescriptor {
        const desc1 = new ActionDescriptor();
        desc1.putBoolean( app.stringIDToTypeID( "dither" ), true );
        desc1.putEnumerated( app.stringIDToTypeID( "gradientsInterpolationMethod" ), app.stringIDToTypeID( "gradientInterpolationMethodType" ), app.stringIDToTypeID( "perceptual" ) );
        desc1.putUnitDouble( app.stringIDToTypeID( "angle" ), app.stringIDToTypeID( "angleUnit" ), this.angle );
        desc1.putEnumerated( app.stringIDToTypeID( "type" ), app.stringIDToTypeID( "gradientType" ), app.stringIDToTypeID( this.type ) );

        const desc2 = new ActionDescriptor();
        desc2.putEnumerated( app.stringIDToTypeID( "gradientForm" ), app.stringIDToTypeID( "gradientForm" ), app.stringIDToTypeID( "customStops" ) );
        desc2.putDouble( app.stringIDToTypeID( "interfaceIconFrameDimmed" ), 4096.000000 );

        // color stops
        const list1 = new ActionList();
        for (let i=0; i<this.colorStopList.length; i++) {
            const stop = this.colorStopList[i];
            const desc3 = new ActionDescriptor();
            desc3.putObject( app.stringIDToTypeID( "color" ), app.stringIDToTypeID( "RGBColor" ), stop.color.toDescriptor() );
            desc3.putEnumerated( app.stringIDToTypeID( "type" ), app.stringIDToTypeID( "colorStopType" ), app.stringIDToTypeID( "userStop" ) );
            desc3.putInteger( app.stringIDToTypeID( "location" ), stop.position );
            desc3.putInteger( app.stringIDToTypeID( "midpoint" ), stop.point );
            list1.putObject( app.stringIDToTypeID( "colorStop" ), desc3 );
        }
        desc2.putList( app.stringIDToTypeID( "colors" ), list1 );

        // opacity
        const list2 = new ActionList();
        for (let j=0; j<this.opacityStopList.length; j++) {
            const item = this.opacityStopList[j];
            const desc7 = new ActionDescriptor();
            desc7.putUnitDouble( app.stringIDToTypeID( "opacity" ), app.stringIDToTypeID( "percentUnit" ), item.opacity );
            desc7.putInteger( app.stringIDToTypeID( "location" ), item.point );
            desc7.putInteger( app.stringIDToTypeID( "midpoint" ), item.point );
            list2.putObject( app.stringIDToTypeID( "transferSpec" ), desc7 );
        }
        desc2.putList( app.stringIDToTypeID( "transparency" ), list2 );

        desc1.putObject( app.stringIDToTypeID( "gradient" ), app.stringIDToTypeID( "gradientClassEvent" ), desc2 );

        return desc1;
    }

}
