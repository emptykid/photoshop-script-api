/**
 * Created by xiaoqiang
 * @date
 * @description represent the tools in photoshop
 */

export class Tool {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * return tool name in stringID format
     * @return string
     */
    public getName(): string {
        return this.name;
    }

    /**
     * select current tool
     */
    public select() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( this.name ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
    }

    /**
     * get current selected tool
     * @return Tool
     */
    public static getActive(): Tool {
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty(app.charIDToTypeID('Prpr'), app.stringIDToTypeID("tool"));
        ref.putEnumerated(app.charIDToTypeID('capp'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        desc.putReference(app.charIDToTypeID('null'), ref);
        const result = app.executeAction(app.charIDToTypeID('getd'), desc, DialogModes.NO);
        const toolName = result.getEnumerationType(app.stringIDToTypeID("tool"));
        return new Tool(app.typeIDToStringID(toolName));
    }


}
