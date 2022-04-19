/**
 * Created by xiaoqiang
 * @date 2021/08/02
 * @description stroke object for photoshop
 */

import { Color } from "./Color";

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
    color: Color;
    lineCapType: StrokeStyleLineCapType;
    lineJoinType: StrokeStyleLineJoinType;
    lineAlignment: StrokeStyleLineAlignment;

    constructor(width: number, lineType: StrokeLineType = StrokeLineType.Solid) {
        this.width = width;
        this.lineType = lineType;
        this.color = Color.blackColor();
        this.resolution = 72;
        this.opacity = 100;
        this.lineCapType = StrokeStyleLineCapType.ButtCap;
        this.lineJoinType = StrokeStyleLineJoinType.MiterJoin;
        this.lineAlignment = StrokeStyleLineAlignment.AlignInside;
    }

    toDescriptor(): ActionDescriptor {
        const desc6 = new ActionDescriptor();
        desc6.putInteger(app.stringIDToTypeID("strokeStyleVersion"), 2);
        desc6.putBoolean(app.stringIDToTypeID("strokeEnabled"), true);
        desc6.putBoolean(app.stringIDToTypeID("fillEnabled"), true);
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
            list1.putUnitDouble(app.stringIDToTypeID("noneUnit"), 2);
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
