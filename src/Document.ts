/**
 * Created by xiaoqiang on 2018/10/6.
 * Document
 * @desc 一个PSD文档对象
 * @desc_en A PSD Document Object
 */

class Document {
    id:number;

    constructor() {
        this.id = this.getID();
    }

    /**
     * get name of current document
     * @returns {string}
     */
    public getName():string {
        let ad:ActionDescriptor = this.getDescriptor();
        return ad.getString(charIDToTypeID('Ttl '));
    }

    /**
     * get resolution of current document
     * @returns {string}
     */
    public getResolution():string {
        return this.getProperty('Rslt');
    }

    // TODO
    public getSize():any {

    }

    /**
     * check current document is saved
     * 检查当前文档是否已保存
     * @returns {boolean}
     */
    public isSaved():boolean {
        var a = new ActionReference;
        a.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        return executeActionGet(a).hasKey(stringIDToTypeID("fileReference")) ? true: false;
    }

    /**
     * get current file path
     * 获取当前文档的路径
     * @returns {null}
     */
    public getPath():string {
        var path = null;
        if (this.isSaved()) {
            try {
                path = activeDocument.path;
            } catch (ex) {
                path = null;
            }
        }
        return path;
    }

    /**
     * get current open document ID
     * @returns {any}
     */
    public getID():number {
        try {
            var documentReference = new ActionReference();
            documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("DocI"));
            documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var documentDescriptor = executeActionGet(documentReference);
            return documentDescriptor.getInteger(charIDToTypeID("DocI"));
        } catch (e) {
            return -1;
        }
    }

    /**
     * 获取文档的描述符
     * @returns {any}
     */
    public getDescriptor():ActionDescriptor {
        var documentReference = new ActionReference();
        documentReference.putIdentifier(charIDToTypeID("Dcmn"), this.id);
        var documentDescriptor = executeActionGet(documentReference);
        return documentDescriptor;
    }

    /**
     * get property of current document
     * @param name
     * @returns {any}
     */
    public getProperty(name:string):any {
        var documentReference = new ActionReference();
        documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID(name));
        documentReference.putIdentifier(charIDToTypeID("Dcmn"), this.id);
        var documentDescriptor = executeActionGet(documentReference);
        return documentDescriptor.getInteger(charIDToTypeID(name));
    }

    /**
     * 关闭当前文档，不保存
     * close current doc with save
     */
    public close():void {
        var desc904 = new ActionDescriptor();
        desc904.putEnumerated( charIDToTypeID( "Svng" ), charIDToTypeID( "YsN " ), charIDToTypeID( "N   " ) );
        executeAction( charIDToTypeID( "Cls " ), desc904, DialogModes.NO );
    }

    /**
     * 保存并关闭当前文档
     * save and close current document
     */
    public saveAndClose():void {
        var desc904 = new ActionDescriptor();
        desc904.putEnumerated( charIDToTypeID( "Svng" ), charIDToTypeID( "YsN " ), charIDToTypeID( "Ys  " ) );
        executeAction( charIDToTypeID( "Cls " ), desc904, DialogModes.NO );
    }


    /**
     * 添加一个文档 (Add a document)
     * @param width
     * @param height
     * @param title
     * @returns {Document}
     */
    public static add(width:number, height:number, title:string):Document {

        var desc299 = new ActionDescriptor();
        var desc300 = new ActionDescriptor();
        desc300.putString( charIDToTypeID( "Nm  " ), title );
        desc300.putBoolean( stringIDToTypeID( "artboard" ), false );
        desc300.putClass( charIDToTypeID( "Md  " ), charIDToTypeID( "RGBM" ));
        desc300.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Rlt" ), width );
        desc300.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Rlt" ), height );
        desc300.putUnitDouble( charIDToTypeID( "Rslt" ), charIDToTypeID( "#Rsl" ), 72.000000 );
        desc300.putDouble( stringIDToTypeID( "pixelScaleFactor" ), 1.000000 );
        desc300.putEnumerated( charIDToTypeID( "Fl  " ), charIDToTypeID( "Fl  " ), charIDToTypeID( "Wht " ));
        desc300.putInteger( charIDToTypeID( "Dpth" ), 8 );
        desc300.putString( stringIDToTypeID( "profile" ), "none" );
        desc300.putList( charIDToTypeID( "Gdes" ), new ActionList());
        desc299.putObject( charIDToTypeID( "Nw  " ), charIDToTypeID( "Dcmn" ), desc300 );
        executeAction( charIDToTypeID( "Mk  " ), desc299, DialogModes.NO );

        return new Document();
    }

}
