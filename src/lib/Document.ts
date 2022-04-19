/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description Document represent a document file object
 */
import { Artboard } from "./Artboard";
import { Rect } from "./Rect";
import { Selection } from "./Selection";
import {Size} from "./Size";

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

    static activeDocument(): Document | null {
        const doc = new Document();
        if (doc.id === 0) {
            return null;
        }
        return doc;
    }

    static select(docId: number): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID( "Dcmn" ), docId);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
    }

    name(): string {
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

    path(): File | null {
        const a = new ActionReference();
        a.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("fileReference"));
        a.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        if (documentDescriptor.hasKey(app.stringIDToTypeID("fileReference"))) {
            return documentDescriptor.getPath(app.stringIDToTypeID("fileReference"));
        }
        return null;
    }

    size(): Size {
        const docRef = app.activeDocument;
        return new Size(Math.round(docRef.width.as('px')), Math.round(docRef.height.as('px')));
    }

    format(): string {
        const ref = new ActionReference();
        ref.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("format"));
        ref.putEnumerated(app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        const descriptor = app.executeActionGet(ref);
        return descriptor.getString(app.stringIDToTypeID("format"));
    }

    resize(size: Size): void {
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
    }

    saved(): boolean {
        const a = new ActionReference();
        a.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        return documentDescriptor.hasKey(app.stringIDToTypeID("fileReference"));
    }

    forceSave(): void {
        const desc1 = new ActionDescriptor();
        desc1.putPath( app.stringIDToTypeID( "in" ), this.path() );
        desc1.putInteger( app.stringIDToTypeID( "documentID" ), this.id);
        desc1.putEnumerated( app.stringIDToTypeID( "saveStage" ), app.stringIDToTypeID( "saveStageType" ), app.stringIDToTypeID( "saveSucceeded" ) );
        app.executeAction( app.stringIDToTypeID( "save" ), desc1, DialogModes.NO );
    }


    jsonString(): string {
        const af = new ActionReference();
        const ad = new ActionDescriptor();
        af.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("json"));
        af.putEnumerated(app.stringIDToTypeID("document"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        ad.putReference(app.charIDToTypeID("null"), af);
        return app.executeAction(app.charIDToTypeID("getd"), ad, DialogModes.NO).getString(app.stringIDToTypeID("json"))
    }

    active(): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID( "Dcmn" ), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
    }


    close(save: boolean): void {
        const desc904 = new ActionDescriptor();
        const value = (save)? app.charIDToTypeID("Ys  ") : app.charIDToTypeID("N   ");
        desc904.putEnumerated( app.charIDToTypeID( "Svng" ), app.charIDToTypeID( "YsN " ), value);
        app.executeAction( app.charIDToTypeID( "Cls " ), desc904, DialogModes.NO );
    }


    hasBackgroundLayer(): boolean {
        const backgroundReference = new ActionReference();
        backgroundReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Bckg"));
        backgroundReference.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Back"));
        const backgroundDescriptor = app.executeActionGet(backgroundReference);
        return backgroundDescriptor.getBoolean(app.charIDToTypeID("Bckg"));
    }

    getDescriptor(): ActionDescriptor {
        const documentReference = new ActionReference();
        documentReference.putEnumerated(app.stringIDToTypeID("document"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        return app.executeActionGet(documentReference);
    }

    getSelection(): Selection | null {
        try {
            const selection = app.activeDocument.selection.bounds;
            const rect = new Rect(selection[0].value, selection[1].value, selection[2].value - selection[0].value, selection[3].value - selection[1].value);
            return new Selection(rect);
        } catch (ex) {
            return null;
        }
    }

    getArtboardList(): Artboard[] {
        let result = [];
        const theRef = new ActionReference();
        theRef.putProperty(app.charIDToTypeID('Prpr'), app.stringIDToTypeID("artboards"));
        theRef.putEnumerated(app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        const getDescriptor = new ActionDescriptor();
        getDescriptor.putReference(app.stringIDToTypeID("null"), theRef);
        const abDesc = app.executeAction(app.charIDToTypeID("getd"), getDescriptor, DialogModes.NO).getObjectValue(app.stringIDToTypeID("artboards"));
        const abCount = abDesc.getList(app.stringIDToTypeID('list')).count;
        if (abCount > 0) {
            for (let i = 0; i < abCount; ++i) {
                const abObj = abDesc.getList(app.stringIDToTypeID('list')).getObjectValue(i);
                const abTopIndex = abObj.getInteger(app.stringIDToTypeID("top"));
                const ref = new ActionReference();
                ref.putIndex(app.charIDToTypeID("Lyr "), abTopIndex + 1);
                const layerDesc = app.executeActionGet(ref);
                if (layerDesc.getBoolean(app.stringIDToTypeID("artboardEnabled")) == true) {    // is artboard
                    const theID = layerDesc.getInteger(app.stringIDToTypeID('layerID'));
                    const art: Artboard = new Artboard(theID);
                    result.push(art);
                }
            }
        }

        return result;
    }

    hasArtboards(): boolean {
        return this.getArtboardList().length > 0;
    }

    trim(): void {
        const desc1 = new ActionDescriptor();
        desc1.putEnumerated(app.stringIDToTypeID("trimBasedOn"), app.stringIDToTypeID("trimBasedOn"), app.stringIDToTypeID("transparency"));
        desc1.putBoolean(app.stringIDToTypeID("top"), true);
        desc1.putBoolean(app.stringIDToTypeID("bottom"), true);
        desc1.putBoolean(app.stringIDToTypeID("left"), true);
        desc1.putBoolean(app.stringIDToTypeID("right"), true);
        app.executeAction(app.stringIDToTypeID("trim"), desc1, DialogModes.NO);
    }

    export(path: string, filename: string, options: ExportOptionsSaveForWeb) {
        /*
        let options = new ExportOptionsSaveForWeb();
        let suffix = "";
        if (format == SaveDocumentType.PNG) {
            options.format = SaveDocumentType.PNG;
            options.PNG8 = false;
            options.quality = 100;
            suffix = ".png";
        } else if (format == SaveDocumentType.JPEG) {
            options.format = SaveDocumentType.JPEG;
            options.optimized = true;
            options.quality = this.config.jpegValue;
            suffix = ".jpg";
        } else if (format == SaveDocumentType.COMPUSERVEGIF) {
            options.format = SaveDocumentType.COMPUSERVEGIF;
            options.colors = this.config.gifValue;
            options.PNG8 = true;
            options.colorReduction = ColorReductionType.SELECTIVE;	// 可选择
            options.quality = 0;			// 这里设置0是为了解决lossy设置不生效的bug
            options.dither = Dither.NONE;	// 无仿色
            suffix = ".gif";
        }
        */
        // @ts-ignore
        let file: any = new File(path + "/" + filename);
        app.activeDocument.exportDocument(file, ExportType.SAVEFORWEB, options);
        return file.absoluteURI;
    }

    length(): number {
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
