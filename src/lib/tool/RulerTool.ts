/**
 * Created by xiaoqiang
 * @date
 * @description represent the ruler tool of photoshop
 */
import {Point} from "../Shape";
import {Tool} from "./Tool";

export class RulerTool extends Tool {

    constructor() {
        super("rulerTool");
    }

    /**
     * get current active ruler info
     * return start & end points
     * @return Point[]
     */
    public static get(): Point[] {
        const result: Point[] = [];
        const desc1 = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty( app.charIDToTypeID('Prpr'), app.charIDToTypeID('RrPt') );
        ref.putEnumerated( app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt') );
        desc1.putReference( app.charIDToTypeID('null'), ref );
        const desc = app.executeAction( app.charIDToTypeID('getd'), desc1, DialogModes.NO );
        if( desc.hasKey( app.charIDToTypeID('Pts ') ) ) {
            const pointList = desc.getList(app.charIDToTypeID('Pts '));
            const startPointDesc = pointList.getObjectValue(0);
            const x1 = startPointDesc.getUnitDoubleValue(app.charIDToTypeID('X   '));
            const y1 = startPointDesc.getUnitDoubleValue(app.charIDToTypeID('Y   '));
            const start = new Point(x1, y1);
            const endPointDesc = pointList.getObjectValue(2);
            const x2 = endPointDesc.getUnitDoubleValue(app.charIDToTypeID('X   '));
            const y2 = endPointDesc.getUnitDoubleValue(app.charIDToTypeID('Y   '));
            const end = new Point(x2, y2);
            result.push(start);
            result.push(end);
        }

        return result;
    }
}
