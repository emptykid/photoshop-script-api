

export class History {
    static back() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("historyState"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("previous"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("select"), desc1, DialogModes.NO);
    }

    static last() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("historyState"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("last"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("select"), desc1, DialogModes.NO);
    }
}
