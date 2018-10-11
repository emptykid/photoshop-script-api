/**
 * Created by xiaoqiang on 2018/10/11.
 */

class Brush {
    constructor() {

    }

    /**
     * get diameter of current brush
     * 获取当前笔刷的直径
     * @returns {number}
     */
    getDiameter():number {
        let ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
        let appDesc = executeActionGet(ref);
        let toolDesc = appDesc.getObjectValue(stringIDToTypeID('currentToolOptions'));
        let brushDesc = toolDesc.getObjectValue(stringIDToTypeID('brush'));
        let diameter = brushDesc.getDouble(stringIDToTypeID('diameter'));
        return diameter;
    }
}
