/**
 * Created by xiaoqiang
 * @date 2021/07/30
 * @description selection class for photoshop
 */
import {Rect} from "./Rect";

export class Selection  {
    bounds: Rect;

    constructor(rect: Rect) {
        this.bounds = rect;
    }

    static get(): Selection | null {
        try {
            const selection = app.activeDocument.selection.bounds;
            const rect = new Rect(selection[0].value, selection[1].value, selection[2].value - selection[0].value, selection[3].value - selection[1].value);
            return new Selection(rect);
        } catch (ex) {
            return null;
        }
    }

    create(): Selection {
        const selectionMode = app.charIDToTypeID("setd");
        const selectionDescriptor = new ActionDescriptor();
        const selectionReference = new ActionReference();
        selectionReference.putProperty(app.charIDToTypeID("Chnl"), app.charIDToTypeID("fsel"));
        selectionDescriptor.putReference(app.charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putObject(app.charIDToTypeID("T   "), app.charIDToTypeID("Rctn"), this.bounds.toDescriptor());
        app.executeAction(selectionMode, selectionDescriptor, DialogModes.NO);
        return this;
    }

    deselect(): void {
        const selectionDescriptor = new ActionDescriptor();
        const selectionReference = new ActionReference();
        selectionReference.putProperty(app.charIDToTypeID("Chnl"), app.charIDToTypeID("fsel"));
        selectionDescriptor.putReference(app.charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putEnumerated(app.charIDToTypeID("T   "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("None"));
        app.executeAction(app.charIDToTypeID("setd"), selectionDescriptor, DialogModes.NO);
    }

    invert(): void {
        const idInvs = app.charIDToTypeID( "Invs" );
        app.executeAction( idInvs, undefined, DialogModes.NO );
    }

}
