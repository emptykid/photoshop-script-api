/**
 * Created by xiaoqiang
 * @date
 * @description this class represent Guide operation from photoshop
 */

export enum GuideLineDirection {
    Horizontal = "horizontal",
    Vertical = "vertical"
}

export type GuideLine = {
    position: number;
    direction: GuideLineDirection;
}

export class Guide {

    /**
     * retrieve all the guide lines
     * @return GuideLine[]
     */
    public static all(): GuideLine[] {
        const count = this.count();
        const result: GuideLine[] = [];
        for (let i=1; i<=count; i++) {
            const ref = new ActionReference;
            ref.putIndex(app.stringIDToTypeID('guide'), i);
            ref.putEnumerated(app.stringIDToTypeID('document'), app.stringIDToTypeID('ordinal'), app.stringIDToTypeID('targetEnum'));
            const desc = app.executeActionGet(ref);
            const position = desc.getDouble(app.stringIDToTypeID("position"));
            const direction = app.typeIDToStringID(desc.getEnumerationValue(app.stringIDToTypeID("orientation")));
            result.push({position, direction: direction as GuideLineDirection});
        }

        return result;
    }

    /**
     * get the guide line count in current document
     * @return number
     */
    public static count(): number {
        const ref = new ActionReference();
        ref.putProperty(app.stringIDToTypeID('property'), app.stringIDToTypeID('numberOfGuides'));
        ref.putEnumerated(app.stringIDToTypeID('document'), app.stringIDToTypeID('ordinal'), app.stringIDToTypeID('targetEnum'));
        return app.executeActionGet(ref).getInteger(app.stringIDToTypeID('numberOfGuides'));
    }

    /**
     * add a guide line
     * @param line
     */
    public static add(line: GuideLine) {
        const desc1 = new ActionDescriptor();
        const desc2 = new ActionDescriptor();
        desc2.putUnitDouble( app.charIDToTypeID( "Pstn" ) , app.charIDToTypeID( "#Pxl" ) , line.position );
        desc2.putEnumerated( app.charIDToTypeID( "Ornt" ) , app.charIDToTypeID( "Ornt" ) , app.charIDToTypeID( line.direction )  );
        desc1.putObject( app.charIDToTypeID( "Nw  " ) , app.charIDToTypeID( "Gd  " ) , desc2 );
        app.executeAction( app.charIDToTypeID( "Mk  " ) , desc1, DialogModes.NO );
    }

    /**
     * hide/show all guide lines
     */
    public static toggleVisibility() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated( app.charIDToTypeID( "Mn  " ), app.charIDToTypeID( "MnIt" ), app.charIDToTypeID( "Tgld" ) );
        desc1.putReference( app.charIDToTypeID( "null" ), ref1 );
        app.executeAction( app.charIDToTypeID( "slct" ), desc1, DialogModes.NO );
    }

    /**
     * remove all guide lines
     */
    public static clear() {
        app.executeAction( app.stringIDToTypeID( "clearAllGuides" ), undefined, DialogModes.NO );
    }

}
