/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description Document represent a document file object
 */

import { Rect } from "./Rect";
import { Selection } from "./Selection";
import {Size} from "./Size";
import {Layer} from "./Layer";

export class Document {

    id: number;

    constructor() {
        try {
            const documentReference = new ActionReference();
            documentReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("DocI"));
            documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
            const documentDescriptor = app.executeActionGet(documentReference);
            this.id = documentDescriptor.getInteger(app.charIDToTypeID("DocI"));
        } catch (e) {
            this.id = 0;
        }
    }

    /**
     * get current active document
     * @return Document | null
     */
    static activeDocument(): Document | null {
        const doc = new Document();
        if (doc.id === 0) {
            return null;
        }
        return doc;
    }

    /**
     * select to active by document id
     * @param docId
     * @return Document
     */
    static select(docId: number): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID( "Dcmn" ), docId);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return new Document();
    }

    /**
     * create a new document from current selected layers
     * @return Document
     */
    static fromSelectedLayers(): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass(app.stringIDToTypeID("document"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        const ref2 = new ActionReference();
        ref2.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("using"), ref2);
        desc1.putInteger(app.stringIDToTypeID("version"), 5);
        app.executeAction(app.stringIDToTypeID("make"), desc1, DialogModes.NO);
        return new Document();
    }


    /**
     * get current document name
     * @return name;
     */
    public name(): string {
        try {
            const documentReference = new ActionReference();
            documentReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Ttl "));
            documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
            const documentDescriptor = app.executeActionGet(documentReference);
            return documentDescriptor.getString(app.charIDToTypeID("Ttl "));
        } catch (e) {
            return "";
        }
    }

    /**
     * get current document file path
     * @return File | null
     */
    public path(): File | null {
        const a = new ActionReference();
        a.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("fileReference"));
        a.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        if (documentDescriptor.hasKey(app.stringIDToTypeID("fileReference"))) {
            return documentDescriptor.getPath(app.stringIDToTypeID("fileReference"));
        }
        return null;
    }

    /**
     * get current document size
     * @return Size
     */
    public size(): Size {
        const docRef = app.activeDocument;
        return new Size(Math.round(docRef.width.as('px')), Math.round(docRef.height.as('px')));
    }

    /**
     * get current document format
     * @return format:string
     */
    public format(): string {
        const ref = new ActionReference();
        ref.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("format"));
        ref.putEnumerated(app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        const descriptor = app.executeActionGet(ref);
        return descriptor.getString(app.stringIDToTypeID("format"));
    }

    /**
     * resize current document image, equal to action: menu -> Image -> Image Size
     * @param size
     */
    public resizeImage(size: Size): Document {
        const action = new ActionDescriptor();
        if (size.width > 0) {
            action.putUnitDouble(app.charIDToTypeID("Wdth"), app.charIDToTypeID("#Pxl"), size.width);
        }
        if (size.height > 0) {
            action.putUnitDouble(app.charIDToTypeID("Hght"), app.charIDToTypeID("#Pxl"), size.height);
        }
        if (size.width == 0 || size.height == 0) {
            action.putBoolean(app.stringIDToTypeID("scaleStyles"), true);
            action.putBoolean(app.charIDToTypeID("CnsP"), true);
        }
        action.putEnumerated(app.charIDToTypeID("Intr"), app.charIDToTypeID("Intp"), app.charIDToTypeID('Blnr'));
        app.executeAction(app.charIDToTypeID("ImgS"), action, DialogModes.NO);
        return this;
    }

    /**
     * resize document canvas, equal to menu -> Image -> Canvas Size
     * @param size
     * @return Document
     */
    public resizeCanvas(size: Size): Document {
        const idCnvS = app.charIDToTypeID( "CnvS" );
        const desc12 = new ActionDescriptor();
        desc12.putUnitDouble( app.charIDToTypeID( "Wdth" ), app.charIDToTypeID( "#Pxl" ), size.width);
        desc12.putUnitDouble( app.charIDToTypeID( "Hght" ), app.charIDToTypeID( "#Pxl" ), size.height);
        desc12.putEnumerated( app.charIDToTypeID( "Hrzn" ), app.charIDToTypeID( "HrzL" ), app.charIDToTypeID( "Cntr" ));
        desc12.putEnumerated( app.charIDToTypeID( "Vrtc" ), app.charIDToTypeID( "VrtL" ), app.charIDToTypeID( "Cntr" ));
        app.executeAction( idCnvS, desc12, DialogModes.NO );
        return this;
    }

    /**
     * check if current document is saved
     * @return boolean
     */
    public saved(): boolean {
        const a = new ActionReference();
        a.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        return documentDescriptor.hasKey(app.stringIDToTypeID("fileReference"));
    }

    /**
     * force save current document
     * @return Document
     */
    public forceSave(): Document {
        const desc1 = new ActionDescriptor();
        desc1.putPath( app.stringIDToTypeID( "in" ), this.path() );
        desc1.putInteger( app.stringIDToTypeID( "documentID" ), this.id);
        desc1.putEnumerated( app.stringIDToTypeID( "saveStage" ), app.stringIDToTypeID( "saveStageType" ), app.stringIDToTypeID( "saveSucceeded" ) );
        app.executeAction( app.stringIDToTypeID( "save" ), desc1, DialogModes.NO );
        return this;
    }


    /**
     * return current document info in json format
     * @return json:string
     */
    public jsonString(): string {
        const af = new ActionReference();
        const ad = new ActionDescriptor();
        af.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("json"));
        af.putEnumerated(app.stringIDToTypeID("document"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        ad.putReference(app.charIDToTypeID("null"), af);
        return app.executeAction(app.charIDToTypeID("getd"), ad, DialogModes.NO).getString(app.stringIDToTypeID("json"))
    }

    /**
     * set curent document active
     * @return Document
     */
    public active(): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID( "Dcmn" ), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return this;
    }


    /**
     * close current document
     * @param save
     * @return Document
     */
    public close(save: boolean): Document {
        const desc904 = new ActionDescriptor();
        const value = (save)? app.charIDToTypeID("Ys  ") : app.charIDToTypeID("N   ");
        desc904.putEnumerated( app.charIDToTypeID( "Svng" ), app.charIDToTypeID( "YsN " ), value);
        app.executeAction( app.charIDToTypeID( "Cls " ), desc904, DialogModes.NO );
        return this;
    }

    /**
     * get current document action descriptor
     * @return ActionDescriptor
     */
    public getDescriptor(): ActionDescriptor {
        const documentReference = new ActionReference();
        documentReference.putEnumerated(app.stringIDToTypeID("document"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        return app.executeActionGet(documentReference);
    }

    /**
     * trim transparent area of current document
     * equal to Menu -> Image -> Trim
     * @return Document
     */
    public trim(): Document {
        const desc1 = new ActionDescriptor();
        desc1.putEnumerated(app.stringIDToTypeID("trimBasedOn"), app.stringIDToTypeID("trimBasedOn"), app.stringIDToTypeID("transparency"));
        desc1.putBoolean(app.stringIDToTypeID("top"), true);
        desc1.putBoolean(app.stringIDToTypeID("bottom"), true);
        desc1.putBoolean(app.stringIDToTypeID("left"), true);
        desc1.putBoolean(app.stringIDToTypeID("right"), true);
        app.executeAction(app.stringIDToTypeID("trim"), desc1, DialogModes.NO);
        return this;
    }

    /**
     * export current file to local file with ExportOptionsSaveForWeb (png/jpg/gif...)
     * @param path
     * @param filename
     * @param options
     * @return Document
     */
    public exportToWeb(path: string, filename: string, options: ExportOptionsSaveForWeb): Document {
        // @ts-ignore
        let file: any = new File(path + "/" + filename);
        app.activeDocument.exportDocument(file, ExportType.SAVEFORWEB, options);
        return this;
    }

    /**
     * export current document to pdf file
     * @param path
     * @param filename
     * @return Document
     */
    public exportToPdf(path: string, filename: string): Document {
        var desc1 = new ActionDescriptor();
        var desc2 = new ActionDescriptor();
//desc2.putString( stringIDToTypeID( "pdfPresetFilename" ), "High Quality Print" );
        desc2.putEnumerated( app.stringIDToTypeID( "pdfCompatibilityLevel" ), app.stringIDToTypeID( "pdfCompatibilityLevel" ), app.stringIDToTypeID( "pdf15" ));
        desc2.putBoolean( app.stringIDToTypeID( "pdfPreserveEditing" ), false );
//desc2.putBoolean( stringIDToTypeID( "pdfEmbedThumbnails" ), true );
        desc2.putInteger( app.stringIDToTypeID( "pdfCompressionType" ), 7 );
        desc2.putBoolean( app.stringIDToTypeID( "pdfIncludeProfile" ), false );
        desc1.putObject( app.charIDToTypeID( "As  " ), app.charIDToTypeID( "PhtP" ), desc2 );
        //@ts-ignore
        desc1.putPath( app.charIDToTypeID( "In  " ), new File( path + '/' + filename ) );
        desc1.putInteger( app.charIDToTypeID( "DocI" ), this.id );
        desc1.putBoolean( app.charIDToTypeID( "Cpy " ), true );
        desc1.putBoolean( app.charIDToTypeID( "Lyrs" ), false );
        desc1.putEnumerated( app.stringIDToTypeID( "saveStage" ), app.stringIDToTypeID( "saveStageType" ), app.stringIDToTypeID( "saveSucceeded" ) );
        app.executeAction( app.charIDToTypeID( "save" ), desc1, DialogModes.NO );
        return this;
    }

    /**
     * get current file size in bytes
     * @return number
     */
    public length(): number {
        const doc = app.activeDocument
        try {
            // @ts-ignore
            const file = new File(doc.fullName)
            // @ts-ignore
            return file.length;
        } catch (e) {
            return 0;
        }
    }
}
