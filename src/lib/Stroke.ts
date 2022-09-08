/**
 * Created by xiaoqiang
 * @date 2021/08/02
 * @description stroke object for photoshop
 */

import {SolidColor} from "./base/SolidColor";

export enum StrokeLineType {
    Solid = 0,
    Dash = 1,
    Dot = 2
}

export enum StrokeStyleLineCapType {
    ButtCap = "strokeStyleButtCap",
    RoundCap = 'strokeStyleRoundCap',
    SquareCap = 'strokeStyleSquareCap'
}

export enum StrokeStyleLineJoinType {
    MiterJoin = 'strokeStyleMiterJoin',
    RoundJoin = 'strokeStyleRoundJoin',
    BevelJoin = 'strokeStyleBevelJoin'
}

export enum StrokeStyleLineAlignment {
    AlignInside = 'strokeStyleAlignInside',
    AlignCenter = 'strokeStyleAlignCenter',
    AlignOutside = 'strokeStyleAlignOutside',
}

export class Stroke {
    width: number;
    lineType: StrokeLineType;
    resolution: number;
    opacity: number;
    strokeEnabled: boolean;
    fillEnabled: boolean;
    color: SolidColor;
    lineCapType: StrokeStyleLineCapType;
    lineJoinType: StrokeStyleLineJoinType;
    lineAlignment: StrokeStyleLineAlignment;

    constructor(width: number, lineType: StrokeLineType = StrokeLineType.Solid, color: SolidColor = SolidColor.blackColor()) {
        this.width = width;
        this.lineType = lineType;
        this.color = color;
        this.resolution = 72;
        this.fillEnabled = true;
        this.strokeEnabled = true;
        this.opacity = 100;
        this.lineCapType = StrokeStyleLineCapType.ButtCap;
        this.lineJoinType = StrokeStyleLineJoinType.MiterJoin;
        this.lineAlignment = StrokeStyleLineAlignment.AlignInside;
    }

    public static fromDescriptor(desc: ActionDescriptor): Stroke {
        const lineWidth = desc.getInteger(app.stringIDToTypeID("strokeStyleLineWidth"));
        const strokeStyleLineCapType = app.typeIDToStringID(desc.getEnumerationType(app.stringIDToTypeID("strokeStyleLineCapType")));
        const strokeStyleLineJoinType = app.typeIDToStringID(desc.getEnumerationType(app.stringIDToTypeID("strokeStyleLineJoinType")));
        const strokeStyleLineAlignment = app.typeIDToStringID( desc.getEnumerationType(app.stringIDToTypeID("strokeStyleLineAlignment")));
        const strokeStyleContent = desc.getObjectValue(app.stringIDToTypeID("strokeStyleContent"));
        const colorDesc =strokeStyleContent.getObjectValue(app.stringIDToTypeID("color"));

        const strokeStyleLineDashSet = desc.getList(app.stringIDToTypeID("strokeStyleLineDashSet"));
        let lineType = StrokeLineType.Solid;
        if (strokeStyleLineDashSet.count > 0) {
            lineType = (strokeStyleLineCapType === StrokeStyleLineCapType.RoundCap)? StrokeLineType.Dot : StrokeLineType.Dash;
        }
        const ins = new Stroke(lineWidth, lineType, SolidColor.fromDescriptor(colorDesc));
        ins.strokeEnabled = desc.getBoolean(app.stringIDToTypeID("strokeEnabled"));
        ins.fillEnabled = desc.getBoolean(app.stringIDToTypeID("fillEnabled"));
        ins.resolution = desc.getDouble(app.stringIDToTypeID("strokeStyleResolution"));
        ins.lineCapType = strokeStyleLineCapType as StrokeStyleLineCapType;
        ins.lineAlignment = strokeStyleLineAlignment as StrokeStyleLineAlignment;
        ins.lineJoinType = strokeStyleLineJoinType as StrokeStyleLineJoinType;
        return ins;
    }

    toString(): string {
        return `${this.width} ${this.color.toHex()}`;
    }

    toDescriptor(): ActionDescriptor {
        const desc6 = new ActionDescriptor();
        desc6.putInteger(app.stringIDToTypeID("strokeStyleVersion"), 2);
        desc6.putBoolean(app.stringIDToTypeID("strokeEnabled"), this.strokeEnabled);
        desc6.putBoolean(app.stringIDToTypeID("fillEnabled"), this.fillEnabled);
        desc6.putUnitDouble(app.stringIDToTypeID("strokeStyleLineWidth"), app.stringIDToTypeID("pixelsUnit"), this.width);
        desc6.putUnitDouble(app.stringIDToTypeID("strokeStyleLineDashOffset"), app.stringIDToTypeID("pointsUnit"), 0);
        desc6.putDouble(app.stringIDToTypeID("strokeStyleMiterLimit"), 100);
        if (this.lineType === StrokeLineType.Dot) {
            desc6.putEnumerated(app.stringIDToTypeID("strokeStyleLineCapType"), app.stringIDToTypeID("strokeStyleLineCapType"), app.stringIDToTypeID(StrokeStyleLineCapType.RoundCap));
        } else {
            desc6.putEnumerated(app.stringIDToTypeID("strokeStyleLineCapType"), app.stringIDToTypeID("strokeStyleLineCapType"), app.stringIDToTypeID(this.lineCapType));
        }
        desc6.putEnumerated(app.stringIDToTypeID("strokeStyleLineJoinType"), app.stringIDToTypeID("strokeStyleLineJoinType"), app.stringIDToTypeID(this.lineJoinType));
        desc6.putEnumerated(app.stringIDToTypeID("strokeStyleLineAlignment"), app.stringIDToTypeID("strokeStyleLineAlignment"), app.stringIDToTypeID(this.lineAlignment));
        desc6.putBoolean(app.stringIDToTypeID("strokeStyleScaleLock"), false);
        desc6.putBoolean(app.stringIDToTypeID("strokeStyleStrokeAdjust"), false);
        const list1 = new ActionList();
        if (this.lineType === StrokeLineType.Dash) {
            list1.putUnitDouble(app.stringIDToTypeID("noneUnit"), 4);
            list1.putUnitDouble(app.stringIDToTypeID("noneUnit"), 4);
        } else if (this.lineType === StrokeLineType.Dot) {
            list1.putUnitDouble(app.stringIDToTypeID("noneUnit"), 0);
            list1.putUnitDouble(app.stringIDToTypeID("noneUnit"), 2);
        }
        desc6.putList(app.stringIDToTypeID("strokeStyleLineDashSet"), list1);
        desc6.putEnumerated(app.stringIDToTypeID("strokeStyleBlendMode"), app.stringIDToTypeID("blendMode"), app.stringIDToTypeID("normal"));
        desc6.putUnitDouble(app.stringIDToTypeID("strokeStyleOpacity"), app.stringIDToTypeID("percentUnit"), this.opacity);
        const desc7 = new ActionDescriptor();
        desc7.putObject(app.stringIDToTypeID("color"), app.stringIDToTypeID("RGBColor"), this.color.toDescriptor());
        desc6.putObject(app.stringIDToTypeID("strokeStyleContent"), app.stringIDToTypeID("solidColorLayer"), desc7);
        desc6.putDouble(app.stringIDToTypeID("strokeStyleResolution"), this.resolution);

        return desc6;
    }

}
