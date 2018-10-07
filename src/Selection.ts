/**
 * Created by xiaoqiang on 2018/10/7.
 */

class Selection {
    bounds:Rect;

    constructor(bounds:Rect) {
        this.bounds = bounds;
    }

    /**
     * create a selection with bounds
     * 创建一个选区
     */
    public create() {
        var selectionMode = charIDToTypeID("setd");
        var selectionDescriptor = new ActionDescriptor();
        var selectionReference = new ActionReference();
        selectionReference.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        selectionDescriptor.putReference(charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putObject(charIDToTypeID("T   "), charIDToTypeID("Rctn"), this.bounds.toDescriptor());
        executeAction(selectionMode, selectionDescriptor, DialogModes.NO);

    }

    /**
     * de select current selection
     * 取消选择当前选区
     */
    public deselect() {
        var selectionDescriptor = new ActionDescriptor();
        var selectionReference = new ActionReference();
        selectionReference.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        selectionDescriptor.putReference(charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("Ordn"), charIDToTypeID("None"));
        executeAction(charIDToTypeID("setd"), selectionDescriptor, DialogModes.NO);
    }

    /**
     * invert current selection
     * 反转当前选区
     */
    public invert() {
        var idInvs = charIDToTypeID( "Invs" );
        executeAction( idInvs, undefined, DialogModes.NO );
    }

    /**
     * fill current selection with color
     * 用颜色填充当前选区
     * @param color
     */
    public fill(color:Color) {
        activeDocument.selection.fill(color.toSolidColor());
    }

}
