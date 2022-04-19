/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description
 */


export class Application {
    version(): string {
        return app.version;
    }

    open(path: string): void {
        const desc437 = new ActionDescriptor();
        // @ts-ignore
        desc437.putPath( app.charIDToTypeID( "null" ), new File(path) );
        app.executeAction( app.charIDToTypeID( "Opn " ), desc437, DialogModes.NO );
    }
}
