/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description Document represent a document file object
 */

import {Rect} from "./Rect";
import {Size} from "./Size";
import {UnitType} from "./Shape";
import {ColorSampler} from "./ColorSampler";
import {PSColorMode} from "./base/Includes";

export enum DocumentFormat {
    JPG = "JPEG",
    PNG = "PNGFormat",
    PSD = "photoshop35Format",
    BMP = "bMPFormat"
}


export class Document {

    id: number;

    constructor() {
        try {
            const documentReference = new ActionReference();
            documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("DocI"));
            documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            const documentDescriptor = app.executeActionGet(documentReference);
            this.id = documentDescriptor.getInteger(charIDToTypeID("DocI"));
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
        ref1.putIdentifier(charIDToTypeID( "Dcmn" ), docId);
        desc1.putReference( stringIDToTypeID( "null" ), ref1 );
        app.executeAction( stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return new Document();
    }

    /**
     * create a new document from current selected layers
     * @return Document
     */
    static fromSelectedLayers(): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass(stringIDToTypeID("document"));
        desc1.putReference(stringIDToTypeID("null"), ref1);
        const ref2 = new ActionReference();
        ref2.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        desc1.putReference(stringIDToTypeID("using"), ref2);
        desc1.putInteger(stringIDToTypeID("version"), 5);
        app.executeAction(stringIDToTypeID("make"), desc1, DialogModes.NO);
        return new Document();
    }

    static create(name: string, width: number, height: number, density: number = 72, artboard: boolean = false, background: boolean = false): Document {
        const desc1 = new ActionDescriptor();
        const desc2 = new ActionDescriptor();
        desc2.putBoolean( stringIDToTypeID( "artboard" ), artboard);
        desc2.putBoolean( stringIDToTypeID( "autoPromoteBackgroundLayer" ), background);
        desc2.putClass( stringIDToTypeID( "mode" ), stringIDToTypeID( "RGBColorMode" ) );
        desc2.putUnitDouble( stringIDToTypeID( "width" ), stringIDToTypeID( "distanceUnit" ), width );
        desc2.putUnitDouble( stringIDToTypeID( "height" ), stringIDToTypeID( "distanceUnit" ), height );
        desc2.putUnitDouble( stringIDToTypeID( "resolution" ), stringIDToTypeID( "densityUnit" ), density );
        desc2.putDouble( stringIDToTypeID( "pixelScaleFactor" ), 1.000000 );
        desc2.putEnumerated( stringIDToTypeID( "fill" ), stringIDToTypeID( "fill" ), stringIDToTypeID( "transparency" ) );
        desc2.putInteger( stringIDToTypeID( "depth" ), 8 );
        desc2.putString(stringIDToTypeID("name"), name);
        desc2.putString( stringIDToTypeID( "profile" ), "sRGB IEC61966-2.1" );
        var list1 = new ActionList();
        desc2.putList( stringIDToTypeID( "guides" ), list1 );
        desc1.putObject( stringIDToTypeID( "new" ), stringIDToTypeID( "document" ), desc2 );
        app.executeAction( stringIDToTypeID( "make" ), desc1, DialogModes.NO );
        return Document.activeDocument();
    }


    /**
     * get current document name
     * @return name;
     */
    public name(): string {
        try {
            const documentReference = new ActionReference();
            documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Ttl "));
            documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            const documentDescriptor = app.executeActionGet(documentReference);
            return documentDescriptor.getString(charIDToTypeID("Ttl "));
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
        a.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("fileReference"));
        a.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        if (documentDescriptor.hasKey(stringIDToTypeID("fileReference"))) {
            return documentDescriptor.getPath(stringIDToTypeID("fileReference"));
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
        ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("format"));
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        const descriptor = app.executeActionGet(ref);
        return descriptor.getString(stringIDToTypeID("format"));
    }

    /**
     * get current document resolution
     * @return number
     */
    public resolution(): number {
        const ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("resolution"));
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        const descriptor = app.executeActionGet(ref);
        return descriptor.getInteger(stringIDToTypeID("resolution"));
    }

    /**
     * duplicate current document
     * @return Document
     */
    public duplicate(): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc1.putReference(charIDToTypeID("null"), ref1);
        app.executeAction(charIDToTypeID("Dplc"), desc1, DialogModes.NO);
        return new Document();
    }

    /**
     * resize current document image, equal to action: menu -> Image -> Image Size
     * @param size
     */
    public resizeImage(size: Size): Document {
        const action = new ActionDescriptor();
        if (size.width > 0) {
            action.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Pxl"), size.width);
        }
        if (size.height > 0) {
            action.putUnitDouble(charIDToTypeID("Hght"), charIDToTypeID("#Pxl"), size.height);
        }
        if (size.width == 0 || size.height == 0) {
            action.putBoolean(charIDToTypeID("CnsP"), true);
        }
        action.putBoolean(stringIDToTypeID("scaleStyles"), true);
        action.putBoolean( stringIDToTypeID( "constrainProportions" ), true );
        //action.putEnumerated(charIDToTypeID("Intr"), charIDToTypeID("Intp"), charIDToTypeID('Blnr'));
        action.putEnumerated( stringIDToTypeID( "interfaceIconFrameDimmed" ), stringIDToTypeID( "interpolationType" ), stringIDToTypeID( "bicubicSharper" ) );

        app.executeAction(charIDToTypeID("ImgS"), action, DialogModes.NO);
        return this;
    }

    /**
     * resize document canvas, equal to menu -> Image -> Canvas Size
     * @param size
     * @return Document
     */
    public resizeCanvas(size: Size): Document {
        const idCnvS = charIDToTypeID( "CnvS" );
        const desc12 = new ActionDescriptor();
        desc12.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Pxl" ), size.width);
        desc12.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Pxl" ), size.height);
        desc12.putEnumerated( charIDToTypeID( "Hrzn" ), charIDToTypeID( "HrzL" ), charIDToTypeID( "Cntr" ));
        desc12.putEnumerated( charIDToTypeID( "Vrtc" ), charIDToTypeID( "VrtL" ), charIDToTypeID( "Cntr" ));
        app.executeAction( idCnvS, desc12, DialogModes.NO );
        return this;
    }

    /**
     * check if current document is saved
     * @return boolean
     */
    public saved(): boolean {
        const a = new ActionReference();
        a.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(a);
        return documentDescriptor.hasKey(stringIDToTypeID("fileReference"));
    }

    /**
     * force save current document
     * @return Document
     */
    public forceSave(): Document {
        const desc1 = new ActionDescriptor();
        desc1.putPath( stringIDToTypeID( "in" ), this.path() );
        desc1.putInteger( stringIDToTypeID( "documentID" ), this.id);
        desc1.putEnumerated( stringIDToTypeID( "saveStage" ), stringIDToTypeID( "saveStageType" ), stringIDToTypeID( "saveSucceeded" ) );
        app.executeAction( stringIDToTypeID( "save" ), desc1, DialogModes.NO );
        return this;
    }

    /**
     * save a copy of current file
     * @param filePath
     * @param format
     * @param saveAsCopy
     */
    public saveAs(filePath: string, format: DocumentFormat, saveAsCopy: boolean = false) {
        const desc1 = new ActionDescriptor();
        const desc2 = new ActionDescriptor();
        if (format == DocumentFormat.JPG) {
            desc2.putInteger( stringIDToTypeID( "extendedQuality" ), 12 );
            desc2.putEnumerated( stringIDToTypeID( "matteColor" ), stringIDToTypeID( "matteColor" ), stringIDToTypeID( "none" ) );
        } else if (format == DocumentFormat.PNG) {
            desc2.putEnumerated( stringIDToTypeID( "method" ), stringIDToTypeID( "PNGMethod" ), stringIDToTypeID( "quick" ) );
            desc2.putEnumerated( stringIDToTypeID( "PNGInterlaceType" ), stringIDToTypeID( "PNGInterlaceType" ), stringIDToTypeID( "PNGInterlaceNone" ) );
            desc2.putEnumerated( stringIDToTypeID( "PNGFilter" ), stringIDToTypeID( "PNGFilter" ), stringIDToTypeID( "PNGFilterAdaptive" ) );
            desc2.putInteger( stringIDToTypeID( "compression" ), 6 );
            desc2.putEnumerated( stringIDToTypeID( "embedIccProfileLastState" ), stringIDToTypeID( "embedOff" ), stringIDToTypeID( "embedOff" ) );
        } else if (format == DocumentFormat.PSD) {
            desc2.putBoolean( stringIDToTypeID( "maximizeCompatibility" ), true );
        } else if (format == DocumentFormat.BMP) {
            desc2.putEnumerated( stringIDToTypeID( "platform" ), stringIDToTypeID( "platform" ), stringIDToTypeID( "OS2" ) );
            desc2.putEnumerated( stringIDToTypeID( "bitDepth" ), stringIDToTypeID( "bitDepth" ), stringIDToTypeID( "bitDepth24" ) );
        }
        desc1.putObject( stringIDToTypeID( "as" ), stringIDToTypeID( format ), desc2 );
        //@ts-ignore
        desc1.putPath( stringIDToTypeID( "in" ), new File( filePath ) );
        desc1.putInteger( stringIDToTypeID( "documentID" ), this.id);
        desc1.putBoolean( stringIDToTypeID( "copy" ), saveAsCopy );
        desc1.putBoolean( stringIDToTypeID( "lowerCase" ), true );
        app.executeAction( stringIDToTypeID( "save" ), desc1, DialogModes.NO );
    }


    /**
     * return current document info in json format
     * @return json:string
     */
    public jsonString(): string {
        const af = new ActionReference();
        const ad = new ActionDescriptor();
        af.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("json"));
        af.putEnumerated(stringIDToTypeID("document"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        ad.putReference(charIDToTypeID("null"), af);
        return app.executeAction(charIDToTypeID("getd"), ad, DialogModes.NO).getString(stringIDToTypeID("json"))
    }

    /**
     * set curent document active
     * @return Document
     */
    public active(): Document {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(charIDToTypeID( "Dcmn" ), this.id);
        desc1.putReference( stringIDToTypeID( "null" ), ref1 );
        app.executeAction( stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return this;
    }


    /**
     * close current document
     * @param save
     * @return Document
     */
    public close(save: boolean): Document {
        const desc904 = new ActionDescriptor();
        const value = (save)? charIDToTypeID("Ys  ") : charIDToTypeID("N   ");
        desc904.putEnumerated( charIDToTypeID( "Svng" ), charIDToTypeID( "YsN " ), value);
        app.executeAction( charIDToTypeID( "Cls " ), desc904, DialogModes.NO );
        return this;
    }

    /**
     * get current document action descriptor
     * @return ActionDescriptor
     */
    public toDescriptor(): ActionDescriptor {
        const documentReference = new ActionReference();
        documentReference.putEnumerated(stringIDToTypeID("document"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        return app.executeActionGet(documentReference);
    }

    /**
     * trim transparent area of current document
     * equal to Menu -> Image -> Trim
     * @return Document
     */
    public trim(): Document {
        const desc1 = new ActionDescriptor();
        desc1.putEnumerated(stringIDToTypeID("trimBasedOn"), stringIDToTypeID("trimBasedOn"), stringIDToTypeID("transparency"));
        desc1.putBoolean(stringIDToTypeID("top"), true);
        desc1.putBoolean(stringIDToTypeID("bottom"), true);
        desc1.putBoolean(stringIDToTypeID("left"), true);
        desc1.putBoolean(stringIDToTypeID("right"), true);
        app.executeAction(stringIDToTypeID("trim"), desc1, DialogModes.NO);
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
        desc2.putEnumerated( stringIDToTypeID( "pdfCompatibilityLevel" ), stringIDToTypeID( "pdfCompatibilityLevel" ), stringIDToTypeID( "pdf15" ));
        desc2.putBoolean( stringIDToTypeID( "pdfPreserveEditing" ), false );
//desc2.putBoolean( stringIDToTypeID( "pdfEmbedThumbnails" ), true );
        desc2.putInteger( stringIDToTypeID( "pdfCompressionType" ), 7 );
        desc2.putBoolean( stringIDToTypeID( "pdfIncludeProfile" ), false );
        desc1.putObject( charIDToTypeID( "As  " ), charIDToTypeID( "PhtP" ), desc2 );
        //@ts-ignore
        desc1.putPath( charIDToTypeID( "In  " ), new File( path + '/' + filename ) );
        desc1.putInteger( charIDToTypeID( "DocI" ), this.id );
        desc1.putBoolean( charIDToTypeID( "Cpy " ), true );
        desc1.putBoolean( charIDToTypeID( "Lyrs" ), false );
        desc1.putEnumerated( stringIDToTypeID( "saveStage" ), stringIDToTypeID( "saveStageType" ), stringIDToTypeID( "saveSucceeded" ) );
        app.executeAction( charIDToTypeID( "save" ), desc1, DialogModes.NO );
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
        ref1.putProperty( stringIDToTypeID( "channel" ), stringIDToTypeID( "selection" ) );
        desc1.putReference( stringIDToTypeID( "null" ), ref1 );
        desc1.putObject( stringIDToTypeID( "to" ), stringIDToTypeID( "rectangle" ), rect.toDescriptor(UnitType.Pixel) );
        app.executeAction( stringIDToTypeID( "set" ), desc1, DialogModes.NO );
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
        documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        const documentDescriptor = app.executeActionGet(documentReference);
        const ret: ColorSampler[] = [];
        if (documentDescriptor.hasKey(stringIDToTypeID("colorSamplerList"))) {
            const colorSamplerList = documentDescriptor.getList(stringIDToTypeID("colorSamplerList"));
            for (let i=0; i<colorSamplerList.count; i++) {
                const colorSamplerDesc = colorSamplerList.getObjectValue(i);
                ret.push(ColorSampler.fromDescriptor(colorSamplerDesc));
            }
        }

        return ret;
    }

    /**
     * convert current document color mode
     * @param mode
     */
    public convertColorMode(mode: PSColorMode): Document {
        var desc1 = new ActionDescriptor();
        desc1.putClass( stringIDToTypeID( "to" ), stringIDToTypeID( "CMYKColorMode" ) );
        app.executeAction( stringIDToTypeID( "convertMode" ), desc1, DialogModes.NO );
        return this;
    }

}
