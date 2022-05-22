/**
 * History for photoshop history control
 */
export class History {

    private state: number = -1;

    /**
     * history move to previous state
     * @return History
     */
    public previous(): History {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("historyState"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("previous"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("select"), desc1, DialogModes.NO);
        return this;
    }

    /**
     * switch to last item of history list
     * @return History
     */
    public last(): History {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("historyState"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("last"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("select"), desc1, DialogModes.NO);
        return this;
    }

    /**
     * save current history state
     * @return History
     */
    public saveState(): History {
        this.state = app.activeDocument.historyStates.length ;
        $.writeln(`save state[${this.state}] name[${this.current().name}]`);
        return this;
    }

    /**
     * restore the state saved before
     * @return History
     */
    public restoreState(): History {
        if (this.state !== -1) {
            this.go(this.state);
        }
        return this;
    }

    /**
     * clear saved state
     * @return History
     */
    public clearState(): History {
        this.state = -1;
        return this;
    }

    public list(): string {
        const arr = [];
        const states = app.activeDocument.historyStates;
        for (let i=0; i<states.length; i++) {
            const s = states[i];
            arr.push(i + ":" + s.name);
        }
        return arr.join(",");
    }

    /**
     * go to history by index (index 0 -> N from top to bottom)
     * @param index
     * @return History
     */
    public go(index: number): History {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIndex(app.stringIDToTypeID( "historyState" ), index);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return this;
    }

    private debug(): string {
        var states = app.activeDocument.historyStates;
        var result = [];
        for (var i=0; i<states.length; i++) {
            var s = states[i];
            result.push(s.name);
        }
        return result.join(",");
    }

    /**
     * get current history state
     * @return HistoryState
     */
    public current(): HistoryState {
        //@ts-ignore
        return app.activeDocument.activeHistoryState;
    }

    /**
     * go to history with the name specified
     * notice! only the first one (from top to bottom) would be selected
     * @param name
     * @return History
     */
    public goByName(name: string): History {
        try {
            const state = app.activeDocument.historyStates.getByName(name);
            app.activeDocument.activeHistoryState = state;
        } catch (e) {
            // not found
        }
        return this;
    }

    /**
     * suspend history to run some scripts
     * @param name
     * @param script
     * @return History
     */
    public suspend(name: string, script: string): History {
        app.activeDocument.suspendHistory(name, script);
        return this;
    }

    /**
     * undo current operation
     * @return History
     */
    public undo(): History {
        app.executeAction( app.charIDToTypeID( "undo" ), undefined, DialogModes.NO );
        return this;
    }

}
