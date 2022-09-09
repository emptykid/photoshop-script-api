/**
 * Created by xiaoqiang
 * @date
 * @description
 */
import {SolidColor} from "../base/SolidColor";

export type ColorStop = {
    color: SolidColor;
    type: string;
    location: number;
    midpoint: number;
}

export type TransferSpec = {
    opacity: number;
    location: number;
    midpoint: number;
}

export class FXGradientFill {
    public enabled: boolean = true;
    public present: boolean = true;
    public opacity: number = 100;
    public mode: string = "normal";
    public angle: number = 90;
    public type: string = "linear";
    public reverse: boolean = false;
    public dither: boolean = false;
    public align: boolean = true;
    public scale: number = 100;
    public colors: ColorStop[] = [];
    public transparency: TransferSpec[] = [];

    static fromDescriptor(desc: ActionDescriptor): FXGradientFill {
        const ins = new FXGradientFill();
        ins.enabled = desc.getBoolean(app.stringIDToTypeID("enabled"));
        ins.present = desc.getBoolean(app.stringIDToTypeID("present"));
        ins.mode = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("mode")));
        ins.opacity = desc.getDouble(app.stringIDToTypeID("opacity"));
        ins.reverse = desc.getBoolean(app.stringIDToTypeID("reverse"));
        ins.dither = desc.getBoolean(app.stringIDToTypeID("dither"));
        ins.align = desc.getBoolean(app.stringIDToTypeID("align"));
        ins.scale = desc.getInteger(app.stringIDToTypeID("scale"));
        ins.type = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("type")));
        ins.angle = desc.getInteger(app.stringIDToTypeID("angle"));

        const gradient = desc.getObjectValue(app.stringIDToTypeID("gradient"));
        const colors = gradient.getList(app.stringIDToTypeID("colors"));
        for (let i=0; i<colors.count; i++) {
            const colorStop = colors.getObjectValue(i);
            const color = SolidColor.fromDescriptor(colorStop.getObjectValue(app.stringIDToTypeID("color")));
            const type = app.typeIDToStringID(colorStop.getEnumerationValue(app.stringIDToTypeID("type")));
            const location = colorStop.getInteger(app.stringIDToTypeID("location"));
            const midpoint = colorStop.getInteger(app.stringIDToTypeID("midpoint"));
            ins.colors.push({color, type, location, midpoint});
        }

        const transparencys = gradient.getList(app.stringIDToTypeID("transparency"));
        for (let i=0; i<transparencys.count; i++) {
            const transferSpec = transparencys.getObjectValue(i);
            const opacity = transferSpec.getDouble(app.stringIDToTypeID("opacity"));
            const location = transferSpec.getInteger(app.stringIDToTypeID("location"));
            const midpoint = transferSpec.getInteger(app.stringIDToTypeID("midpoint"));
            ins.transparency.push({opacity, location, midpoint});
        }
        return ins;
    }

    public toString(): string {
        let colorStringArr: string[] = [];
        this.colors.map((colorStop) => {
            colorStringArr.push(colorStop.color.toHex());
        });
        return `${colorStringArr.join('-')} (${this.angle}') ${this.opacity}%`;
    }

}
