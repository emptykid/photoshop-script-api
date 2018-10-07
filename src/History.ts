/**
 * Created by xiaoqiang on 2018/10/6.
 */

class History {
    public static suspend(historyString, javaScriptString) {
        activeDocument.suspendHistory(historyString,  javaScriptString);
    }

    public static undo() {
        executeAction( charIDToTypeID( "undo" ), undefined, DialogModes.NO );
    };

    public static back(step?:number) {
        step = (step == undefined)? 1 : step;
        var doc = activeDocument;
        doc.activeHistoryState = doc.historyStates[doc.historyStates.length - step];
    }
}
