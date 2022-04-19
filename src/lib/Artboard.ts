/**
 * Created by xiaoqiang
 * @date 2021/07/30
 * @description 
 */

import { Layer } from "./Layer";
import { Rect } from "./Rect";

export class Artboard extends Layer {

    bounds(): Rect {
        const ref = new ActionReference();
        ref.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const layerDesc = app.executeActionGet(ref);
        if (layerDesc.hasKey(app.stringIDToTypeID("artboard"))) {
            const artBoardRect = layerDesc.getObjectValue(app.stringIDToTypeID("artboard")).getObjectValue(app.stringIDToTypeID("artboardRect"));
            const theName = layerDesc.getString(app.stringIDToTypeID('name'));
            const left = artBoardRect.getUnitDoubleValue(app.stringIDToTypeID("left"));
            const top = artBoardRect.getUnitDoubleValue(app.stringIDToTypeID("top"));
            const right = artBoardRect.getUnitDoubleValue(app.stringIDToTypeID("right"));
            const bottom = artBoardRect.getUnitDoubleValue(app.stringIDToTypeID("bottom"));
            return new Rect(left, top, (right - left), (bottom - top));
        }
        return super.bounds();
    }

    isShapeLayer(): boolean {
        return false;
    }

    isTextLayer(): boolean {
        return false;
    }

    isGroupLayer(): boolean {
        return false;
    }

}
