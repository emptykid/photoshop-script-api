/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description Document represent a document file object
 */

import {Rect} from "./Rect";
import {Size} from "./Size";
import {UnitType} from "./Shape";
import {ColorSampler} from "./ColorSampler";

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

    static create(name: string, width: number, height: number, density: number = 72, artboard: boolean = false, background: boolean = false): Document {
        const desc1 = new ActionDescriptor();
        const desc2 = new ActionDescriptor();
        desc2.putBoolean( app.stringIDToTypeID( "artboard" ), artboard);
        desc2.putBoolean( app.stringIDToTypeID( "autoPromoteBackgroundLayer" ), background);
        desc2.putClass( app.stringIDToTypeID( "mode" ), app.stringIDToTypeID( "RGBColorMode" ) );
        desc2.putUnitDouble( app.stringIDToTypeID( "width" ), app.stringIDToTypeID( "distanceUnit" ), width );
        desc2.putUnitDouble( app.stringIDToTypeID( "height" ), app.stringIDToTypeID( "distanceUnit" ), height );
        desc2.putUnitDouble( app.stringIDToTypeID( "resolution" ), app.stringIDToTypeID( "densityUnit" ), density );
        desc2.putDouble( app.stringIDToTypeID( "pixelScaleFactor" ), 1.000000 );
        desc2.putEnumerated( app.stringIDToTypeID( "fill" ), app.stringIDToTypeID( "fill" ), app.stringIDToTypeID( "transparency" ) );
        desc2.putInteger( app.stringIDToTypeID( "depth" ), 8 );
        desc2.putString(app.stringIDToTypeID("name"), name);
        desc2.putString( app.stringIDToTypeID( "profile" ), "sRGB IEC61966-2.1" );
        var list1 = new ActionList();
        desc2.putList( app.stringIDToTypeID( "guides" ), list1 );
        desc1.putObject( app.stringIDToTypeID( "new" ), app.stringIDToTypeID( "document" ), desc2 );
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
        return Document.activeDocument();
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
     * get current document resolution
     * @return number
     */
    public resolution(): number {
        const ref = new ActionReference();
        ref.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("resolution"));
        ref.putEnumerated(app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        const descriptor = app.executeActionGet(ref);
        return descriptor.getInteger(app.stringIDToTypeID("resolution"));
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
        action.putBoolean( app.stringIDToTypeID( "constrainProportions" ), true );
        //action.putEnumerated(app.charIDToTypeID("Intr"), app.charIDToTypeID("Intp"), app.charIDToTypeID('Blnr'));
        action.putEnumerated( app.stringIDToTypeID( "interfaceIconFrameDimmed" ), app.stringIDToTypeID( "interpolationType" ), app.stringIDToTypeID( "bicubicSharper" ) );

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
    public toDescriptor(): ActionDescriptor {
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
     * crop current document with provided rect
     * @param rect
     * @return Document
     */
    public crop(rect: Rect): Document {
        app.activeDocument.crop([UnitValue(rect.x, 'px'), UnitValue(rect.y, 'px'), UnitValue(rect.right(), 'px'), UnitValue(rect.bottom(), 'px')]);
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
     * get current user selection， return null if none
     * @param unit
     * @return Rect | null
     */
    public selection(unit: _ScaleUnit = 'px'): Rect | null {
        try {
            const selection = app.activeDocument.selection.bounds;
            return new Rect(selection[0].as(unit), selection[1].as(unit), selection[2].as(unit) - selection[0].as(unit), selection[3].as(unit) - selection[1].as(unit));
        } catch (ex) {
            return null;
        }
    }

    /**
     * create a selection with provided rect
     * @param rect
     */
    public setSelection(rect: Rect): void {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "selection" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        desc1.putObject( app.stringIDToTypeID( "to" ), app.stringIDToTypeID( "rectangle" ), rect.toDescriptor(UnitType.Pixel) );
        app.executeAction( app.stringIDToTypeID( "set" ), desc1, DialogModes.NO );
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

    /**
     * get current color sampler list in document
     * @return ColorSampler[]
     */
    public colorSamplerList(): ColorSampler[] {
        const documentReference = new ActionReference();
        documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(documentReference);
        const ret: ColorSampler[] = [];
        if (documentDescriptor.hasKey(app.stringIDToTypeID("colorSamplerList"))) {
            const colorSamplerList = documentDescriptor.getList(app.stringIDToTypeID("colorSamplerList"));
            for (let i=0; i<colorSamplerList.count; i++) {
                const colorSamplerDesc = colorSamplerList.getObjectValue(i);
                ret.push(ColorSampler.fromDescriptor(colorSamplerDesc));
            }
        }

        return ret;
    }

}
