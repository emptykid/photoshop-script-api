/**
 * Created by xiaoqiang
 * @date
 * @description
 */
import {SolidColor} from "../base/SolidColor";

export class FXColorOverlay {
    public enabled: boolean = true;
    public present: boolean = true;
    public mode: string = "normal";
    public color: SolidColor = SolidColor.blackColor();
    public opacity: number = 100;

    /**
     * create a FXColorOverlay object with a descriptor
     * @param desc
     * @return FXColorOverlay
     */
    static fromDescriptor(desc: ActionDescriptor): FXColorOverlay {
        const ins = new FXColorOverlay();
        ins.enabled = desc.getBoolean(app.stringIDToTypeID("enabled"));
        ins.present = desc.getBoolean(app.stringIDToTypeID("present"));
        ins.mode = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("mode")));
        const colorDesc = desc.getObjectValue(app.stringIDToTypeID("color"));
        ins.color = SolidColor.fromDescriptor(colorDesc);
        ins.opacity = desc.getDouble(app.stringIDToTypeID("opacity"));
        return ins;
    }

    public toString(): string {
        return `${this.color.toHex()} ${this.opacity}% ${this.mode}`;
    }

}
