/**
 * Created by xiaoqiang
 * @date 2021/07/30
 * @description selection class for photoshop
 */
import {Rect} from "./Rect";

export class Selection  {
    private bounds: Rect;

    constructor(rect: Rect) {
        this.bounds = rect;
    }

    /**
     * get current selection, return null if there is none
     * @return Selection | null
     */
    public static get(): Selection | null {
        try {
            const selection = app.activeDocument.selection.bounds;
            const rect = new Rect(selection[0].value, selection[1].value, selection[2].value - selection[0].value, selection[3].value - selection[1].value);
            return new Selection(rect);
        } catch (ex) {
            return null;
        }
    }

    /**
     * load selection from saved channel
     * @param selectionName
     * @param documentName
     * @return Selection
     */
    public static load(selectionName: string, documentName: string = null): Selection {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "selection" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putName( app.stringIDToTypeID( "channel" ), selectionName );
        if (documentName) {
            ref2.putName( app.stringIDToTypeID( "document" ), documentName );
        }
        desc1.putReference( app.stringIDToTypeID( "to" ), ref2 );
        app.executeAction( app.stringIDToTypeID( "set" ), desc1, DialogModes.NO );

        return this.get();
    }

    /**
     * make selection from current selected layer
     * @return Selection
     */
    public static fromLayer(): Selection {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "selection" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putEnumerated( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "transparencyEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "to" ), ref2 );
        app.executeAction( app.stringIDToTypeID( "set" ), desc1, DialogModes.NO );
        return this.get();
    }

    /**
     * create a selection area in PS with current rect
     * @return Selection
     */
    public create(): Selection {
        const selectionMode = app.charIDToTypeID("setd");
        const selectionDescriptor = new ActionDescriptor();
        const selectionReference = new ActionReference();
        selectionReference.putProperty(app.charIDToTypeID("Chnl"), app.charIDToTypeID("fsel"));
        selectionDescriptor.putReference(app.charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putObject(app.charIDToTypeID("T   "), app.charIDToTypeID("Rctn"), this.bounds.toDescriptor());
        app.executeAction(selectionMode, selectionDescriptor, DialogModes.NO);
        return this;
    }

    /**
     * deselect current selection
     * @return void
     */
    public deselect(): void {
        const selectionDescriptor = new ActionDescriptor();
        const selectionReference = new ActionReference();
        selectionReference.putProperty(app.charIDToTypeID("Chnl"), app.charIDToTypeID("fsel"));
        selectionDescriptor.putReference(app.charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putEnumerated(app.charIDToTypeID("T   "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("None"));
        app.executeAction(app.charIDToTypeID("setd"), selectionDescriptor, DialogModes.NO);
    }

    /**
     * invert selection area
     * @return void
     */
    public invert(): void {
        app.executeAction( app.charIDToTypeID( "Invs" ), undefined, DialogModes.NO );
    }

    /**
     * convert current selection to path
     * @return void
     */
    public toPath(tolerance: number = 2): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( "path" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putProperty( app.stringIDToTypeID( "selectionClass" ), app.stringIDToTypeID( "selection" ) );
        desc1.putReference( app.stringIDToTypeID( "from" ), ref2 );
        desc1.putUnitDouble( app.stringIDToTypeID( "tolerance" ), app.stringIDToTypeID( "pixelsUnit" ),tolerance);
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
    }

    /**
     * save current selection
     * @param name
     */
    public save(name: string): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "selection" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        desc1.putString( app.stringIDToTypeID( "name" ), name );
        app.executeAction( app.stringIDToTypeID( "duplicate" ), desc1, DialogModes.NO );
    }

}
