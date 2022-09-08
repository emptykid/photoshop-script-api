import {SolidColor} from "../base/SolidColor";

/**
 * Created by xiaoqiang
 * @date
 * @description
 */

export class FXDropShadow {
    public enabled: boolean = true;
    public present: boolean = true;
    public mode: string = "normal";
    public color: SolidColor = SolidColor.blackColor();
    public opacity: number = 100;
    public useGlobalAngle: boolean = true;
    public localLightingAngle: number = 120;
    public distance: number = 0;
    public chokeMatte: number = 0;
    public blur: number = 0;
    public noise: number = 0;
    public antiAlias: boolean = false;

    /**
     * create a FXDropShadow object from action descriptor
     * @param desc
     * @return FXDropShadow
     */
    static fromDescriptor(desc: ActionDescriptor): FXDropShadow {
        const ins = new FXDropShadow();
        ins.enabled = desc.getBoolean(app.stringIDToTypeID("enabled"));
        ins.present = desc.getBoolean(app.stringIDToTypeID("present"));
        ins.mode = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("mode")));
        const colorDesc = desc.getObjectValue(app.stringIDToTypeID("color"));
        ins.color = SolidColor.fromDescriptor(colorDesc);
        ins.opacity = desc.getDouble(app.stringIDToTypeID("opacity"));

        ins.useGlobalAngle = desc.getBoolean(app.stringIDToTypeID("useGlobalAngle"));
        ins.localLightingAngle = desc.getDouble(app.stringIDToTypeID("localLightingAngle"));
        ins.chokeMatte = desc.getDouble(app.stringIDToTypeID("chokeMatte"));
        ins.blur = desc.getDouble(app.stringIDToTypeID("blur"));
        ins.noise = desc.getDouble(app.stringIDToTypeID("noise"));
        ins.antiAlias  = desc.getBoolean(app.stringIDToTypeID("antiAlias"));

        return ins;
    }


}
