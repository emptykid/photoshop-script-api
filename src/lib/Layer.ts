/**
 * Created by xiaoqiang
 * @date 2021/07/31
 * @description Layer implement for photoshop
 */

import { Document } from "./Document";
import { Rect } from "./Rect";
import { DescriptorInfo } from "./DescriptorInfo";
import { Color } from "./Color";
import {Size} from "./Size";

const enum Kind {NORMAL = 1, TEXT = 3, VECTOR = 4};

export class Layer {
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    /**
     * get selected layers in current document
     * 
     * @returns Layers[]
     */
    static getSelectedLayers(): Layer[] {
        const targetLayersTypeId = app.stringIDToTypeID("targetLayersIDs");
        let selectedLayersReference = new ActionReference();
        selectedLayersReference.putProperty(app.charIDToTypeID("Prpr"), targetLayersTypeId);
        selectedLayersReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const desc = app.executeActionGet(selectedLayersReference);
        let layers = [];
        if (desc.hasKey(targetLayersTypeId)) {
            // have selected layers
            const list: ActionList = desc.getList(targetLayersTypeId);
            for (let i=0; i<list.count; i++) {
                const ar: ActionReference = list.getReference(i);
                const layerId: number = ar.getIdentifier();
                layers.push(new Layer(layerId));
            }
        }
        // WIN CC2019的情况下，默认一个背景图层，会获取到ID是0
        if (layers.length === 1 && layers[0].id === 0) {
            layers = [];
            selectedLayersReference = new ActionReference();
            selectedLayersReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("LyrI"));
            selectedLayersReference.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
            const descriptor = app.executeActionGet(selectedLayersReference);
            const id = descriptor.getInteger(app.charIDToTypeID("LyrI"));
            layers.push(new Layer(id));
        }

        return layers;
    }


    static getSelectedLayerIds(): number[] {
        const targetLayersTypeId = app.stringIDToTypeID("targetLayersIDs");
        const selectedLayersReference = new ActionReference();
        selectedLayersReference.putProperty(app.charIDToTypeID("Prpr"), targetLayersTypeId);
        selectedLayersReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const desc = app.executeActionGet(selectedLayersReference);
        let layers = [];
        if (desc.hasKey(targetLayersTypeId)) {
            // have selected layers
            const list: ActionList = desc.getList(targetLayersTypeId);
            for (let i=0; i<list.count; i++) {
                const ar: ActionReference = list.getReference(i);
                const layerId: number = ar.getIdentifier();
                layers.push(layerId);
            }
        }

        return layers;
    }


    /**
     * 
     * set target layers to active
     * @param layers 
     */
    static setSelectedLayers(layers: Layer[]): void {
        const current = new ActionReference();
        for (let i = 0; i < layers.length; i++) {
            const l: Layer = layers[i];
            current.putIdentifier(app.charIDToTypeID("Lyr "), l.id);
        }
        const desc = new ActionDescriptor();
        desc.putReference(app.charIDToTypeID("null"), current);
        app.executeAction(app.charIDToTypeID("slct"), desc, DialogModes.NO);
    }

    /**
     * select layer by id
     * @param idList
     */
    static selectLayersById(idList: number[]): void {
        const current = new ActionReference();
        for (let i = 0; i < idList.length; i++) {
            current.putIdentifier(app.charIDToTypeID("Lyr "), idList[i]);
        }
        const desc = new ActionDescriptor();
        desc.putReference(app.charIDToTypeID("null"), current);
        app.executeAction(app.charIDToTypeID("slct"), desc, DialogModes.NO);
    }

    /**
     * show/hide layers by id list provided
     * @param idList
     * @param show
     */
    static toggleLayersById(idList: number[], show: boolean): void {
        if (idList.length == 0){ return;}
        const current = new ActionReference();
        const desc242 = new ActionDescriptor();
        const list10 = new ActionList();
        for(let i=0; i< idList.length; i++) {
            current.putIdentifier(app.charIDToTypeID("Lyr "), idList[i]);
        }
        list10.putReference( current );
        desc242.putList( app.charIDToTypeID( "null" ), list10 );
        const key = (show)? "Shw " : "Hd  ";
        app.executeAction( app.charIDToTypeID( key ), desc242, DialogModes.NO );
    }


    /**
     * quick to get one selected layer
     * @return Layer | null
     */
    static getSelectedLayer(): Layer | null {
        const selectedLayers: Layer[] = Layer.getSelectedLayers();
        if (selectedLayers.length > 0) {
            return selectedLayers[0];
        }
        return null;
    }

    /**
     * get layer by given name
     * notice! there may be multi layers with same name, in this case, only first one will return
     * 
     * @param name 
     * @returns Layer | null
     */
    static getLayerByName(name: string): Layer | null {
        try {
            const ref = new ActionReference();
            ref.putName(app.charIDToTypeID("Lyr "), name);
            const layerDesc = app.executeActionGet(ref)
            const layerId = layerDesc.getInteger(app.charIDToTypeID('LyrI'));
            return new Layer(layerId);
        } catch (e) {
            $.writeln(e.toSting());
            return null;
        }
    }

    /**
     * create a group layer
     * by default the created group is just above the top selected layer
     * after created, the new layer is selected, you can retreive it by Layer.getSelectedLayers()
     */
    static createGroup() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass(app.stringIDToTypeID("layerSection"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("make"), desc1, DialogModes.NO);
    }

    /**
     * get layer by given index
     * @param index 
     */
    static getLayerByIndex(index: number): Layer {
        try {
            const ref = new ActionReference();
            ref.putIndex(app.charIDToTypeID("Lyr "), index);
            const layerDesc = app.executeActionGet(ref)
            const layerId = layerDesc.getInteger(app.charIDToTypeID('LyrI'));
            return new Layer(layerId);
        } catch (e) {
            return null;
        }
    }


    /**
     * fast loop layers
     * @param callback
     * @param direction 1: up->down, 0: down->up
     */
    static loopLayers(callback: Function, direction: number = 0): void {
        const ref = new ActionReference();
        // 当前文档的图层数量属性key
        ref.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID('NmbL'));
        ref.putEnumerated( app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt') );
        const desc = app.executeActionGet(ref);
        const max = desc.getInteger(app.charIDToTypeID('NmbL'));
        // 索引起始值，会受是否有背景图层影响，需要做一下处理
        let min = 0;
        try {
            app.activeDocument.backgroundLayer;
        } catch(e) {
            min=1;
        }
        let idx = (direction === 0)? min : max;
        while (true) {
            if (idx > max || idx < min) {
                break;
            }
            const ref1 = new ActionReference();
            ref1.putIndex( app.charIDToTypeID( 'Lyr ' ), idx );
            const desc1 = app.executeActionGet(ref1);
            const id = desc1.getInteger(app.stringIDToTypeID( 'layerID' ));
            const layer = new Layer(id);
            // 根据需要进行操作
            callback && callback(layer)
            if (direction === 0) {
                idx++;
            } else {
                idx--;
            }
        }
    }

    static hasArtboards(): boolean {
        return this.getArtboardList().length > 0;
    }

    static getArtboardList(): Layer[] {
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
                    const art: Layer = new Layer(theID);
                    result.push(art);
                }
            }
        }

        return result;
    }


    static hasBackgroundLayer(): boolean {
        const backgroundReference = new ActionReference();
        backgroundReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Bckg"));
        backgroundReference.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Back"));
        const backgroundDescriptor = app.executeActionGet(backgroundReference);
        return backgroundDescriptor.getBoolean(app.charIDToTypeID("Bckg"));
    }

    name(): string {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Nm  "));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        return descriptor.getString(app.charIDToTypeID("Nm  "));
    }

    index(): number {
        try {
            const layerReference = new ActionReference();
            layerReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("ItmI"));
            layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
            const descriptor = app.executeActionGet(layerReference);
            return descriptor.getInteger(app.charIDToTypeID("ItmI"));
        } catch(e) {
            return 0;
        }
    }

    getParentId(): number {
        try {
            const layerReference = new ActionReference();
            layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("parentLayerID"));
            layerReference.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"))
            const descriptor = app.executeActionGet(layerReference);
            return descriptor.getInteger(app.stringIDToTypeID("parentLayerID"));
        } catch(e) {
            return 0;
        }
    }


    kind(): number {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("layerKind"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        return descriptor.getInteger(app.stringIDToTypeID("layerKind"));
    }

    getSubLayerIds(): number[] {
        const result = [];
        if (this.isGroupLayer()) {
            this.select();
            const layerSet = app.activeDocument.activeLayer as LayerSet;
            for (let i=0; i<layerSet.layers.length; i++) {
                // @ts-ignore
                const layer = layerSet.layers[i];
                result.push(layer.id);
            }
        }
        return result;
    }

    // 当前只对非图层组有效
    bounds(): Rect {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("bounds"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const layerDescriptor = app.executeActionGet(layerReference);
        const rectangle = layerDescriptor.getObjectValue(app.stringIDToTypeID("bounds"));
        const left = rectangle.getUnitDoubleValue(app.charIDToTypeID("Left"));
        const top = rectangle.getUnitDoubleValue(app.charIDToTypeID("Top "));
        const right = rectangle.getUnitDoubleValue(app.charIDToTypeID("Rght"));
        const bottom = rectangle.getUnitDoubleValue(app.charIDToTypeID("Btom"));
        return new Rect(left, top, (right - left), (bottom - top));
    }

    // 适用于图层组的场景，确保当前图层已经被选中
    boundsActive(): Rect {
        const bounds = app.activeDocument.activeLayer.bounds;
        const left = Math.round(bounds[0].as("px"));
        const top = Math.round(bounds[1].as("px"));
        const right = Math.round(bounds[2].as("px"));
        const bottom = Math.round(bounds[3].as("px"));
        return new Rect(left, top, right - left, bottom - top);
    }


    size(): Size {
        return this.bounds().size();
    }

    show(): Layer {
        const desc1 = new ActionDescriptor();
        const list1 = new ActionList();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        list1.putReference(ref1);
        desc1.putList(app.charIDToTypeID("null"), list1);
        app.executeAction(app.charIDToTypeID("Shw "), desc1, DialogModes.NO);
        return this;
    }

    hide(): Layer {
        const current = new ActionReference();
        const desc242 = new ActionDescriptor();
        const list10 = new ActionList();
        current.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        list10.putReference( current );
        desc242.putList( app.charIDToTypeID( "null" ), list10 );
        app.executeAction( app.charIDToTypeID( "Hd  " ), desc242, DialogModes.NO );
        return this;
    }

    toString(): string {
        return `name[${this.name()}] id[${this.id}] index[${this.index()}]`;
    }

    textInfo(): any {
        if (!this.isTextLayer()) {
            return null;
        }
        this.select();
        const result: any = {};
        const ref = new ActionReference();
        ref.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
        const desc = app.executeActionGet(ref);
        const info: DescriptorInfo = new DescriptorInfo();
        const ret = info.getProperties(desc, {});
        if (ret.textKey) {
            const textKey = ret.textKey;
            result['orientation'] = textKey.orientation;
            result['antiAlias'] = textKey.antiAlias;
            result['bounds'] = Rect.fromLTRBBounds(textKey.bounds).toJSON();
            result['boundingBox'] = Rect.fromLTRBBounds(textKey.boundingBox).toJSON();
            result['content'] = textKey.textKey;
            for (let i=0; i<textKey.textStyleRange.length; i++) {
                const styleRange = textKey.textStyleRange[i];
                if (styleRange.textStyleRange && styleRange.textStyleRange.textStyle) {
                    const textStyle = styleRange.textStyleRange.textStyle;
                    result['fontPostScriptName'] = textStyle.fontPostScriptName;
                    result['fontName'] = textStyle.fontName;
                    result['fontSzie'] = textStyle.size;
                    result['bold'] = textStyle.syntheticBold;
                    result['italic'] = textStyle.syntheticItalic;
                    result['tracking'] = textStyle.tracking;
                    result['baselineShift'] = textStyle.baselineShift;
                    result['strikethrough'] = (textStyle.strikethrough && textStyle.strikethrough != 'strikethroughOff');
                    result['underline'] = (textStyle.underline && textStyle.underline != 'underlineOff');
                    result['color'] = new Color(textStyle.color.red, textStyle.color.grain, textStyle.color.blue).toHex();
                    if (textKey.stroke) {
                        result['stroke'] = {
                            color: new Color(textStyle.strokeColor.red, textStyle.strokeColor.grain, textStyle.strokeColor.blue).toHex(),
                            width: textStyle.lineWidth,
                            lineCap: textStyle.lineCap,
                            lineJoin: textStyle.lineJoin
                        }
                    }
                    result['verticalScale'] = textStyle.verticalScale;
                    result['horizontalScale'] = textStyle.horizontalScale;
                    break;
                }
            }

            if (textKey.paragraphStyleRange) {
                for (let j = 0; j < textKey.paragraphStyleRange.length; j++) {
                    const p = textKey.paragraphStyleRange[j];
                    if (p.paragraphStyleRange && p.paragraphStyleRange.paragraphStyle) {
                        result['align'] = p.paragraphStyleRange.paragraphStyle.align;
                        break;
                    }
                }
            }
        }
        return result;
    }

    select(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        desc1.putBoolean( app.stringIDToTypeID( "makeVisible" ),  this.visible());
        const list1 = new ActionList();
        list1.putInteger( this.id );
        desc1.putList( app.stringIDToTypeID( "layerID" ), list1 );
        app.executeAction( app.stringIDToTypeID( "select" ), desc1, DialogModes.NO );
        return this;
    }

    visible(): boolean {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Vsbl"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        if(descriptor.hasKey(app.charIDToTypeID("Vsbl")) == false) return false;
        return descriptor.getBoolean (app.charIDToTypeID("Vsbl"));
    }

    isTextLayer(): boolean {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.charIDToTypeID("Txt "));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        return descriptor.hasKey(app.charIDToTypeID("Txt "));
    }

    isShapeLayer(): boolean {
        const layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        const kind:number = descriptor.getInteger(app.stringIDToTypeID('layerKind'));
        return kind == Kind.VECTOR;
    }

    isLocked(): boolean {
        this.select();
        const layer = app.activeDocument.activeLayer;
        return layer.allLocked;
    }

    unlock(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const desc2 = new ActionDescriptor();
        desc2.putBoolean( app.stringIDToTypeID( "protectNone" ), true );
        desc1.putObject( app.stringIDToTypeID( "layerLocking" ), app.stringIDToTypeID( "layerLocking" ), desc2 );
        app.executeAction( app.stringIDToTypeID( "applyLocking" ), desc1, DialogModes.NO );
        return this;
    }

    lock(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const desc2 = new ActionDescriptor();
        desc2.putBoolean( app.stringIDToTypeID( "protectAll" ), true );
        desc1.putObject( app.stringIDToTypeID( "layerLocking" ), app.stringIDToTypeID( "layerLocking" ), desc2 );
        app.executeAction( app.stringIDToTypeID( "applyLocking" ), desc1, DialogModes.NO );
        return this;
    }

    isGroupLayer(): boolean {
        try {
            let layerReference = new ActionReference();
            layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
            let descriptor = app.executeActionGet(layerReference);
            if (descriptor.hasKey(app.stringIDToTypeID("layerSection"))) {
                if (descriptor.getEnumerationValue(app.stringIDToTypeID("layerSection")) == app.stringIDToTypeID("layerSectionStart")) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    isArtboardLayer(): boolean {
        try {
            let layerReference = new ActionReference();
            layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
            let descriptor = app.executeActionGet(layerReference);
            if (descriptor.hasKey(app.stringIDToTypeID("artboardEnabled"))) {
                if (descriptor.getBoolean(app.stringIDToTypeID("artboardEnabled")) == true) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    toSelection(): Layer {
        const desc3 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putProperty( app.charIDToTypeID( "Chnl" ), app.charIDToTypeID( "fsel" ));
        desc3.putReference( app.charIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putEnumerated( app.charIDToTypeID( "Path" ), app.charIDToTypeID( "Path" ), app.stringIDToTypeID( "vectorMask" ));
        ref2.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc3.putReference( app.charIDToTypeID( "T   " ), ref2 );
        desc3.putInteger( app.charIDToTypeID( "Vrsn" ), 1 );
        desc3.putBoolean( app.stringIDToTypeID( "vectorMaskParams" ), true );
        app.executeAction( app.charIDToTypeID( "setd" ), desc3, DialogModes.NO );
        return this;
    }

    rasterize(): Layer {
        const desc7 = new ActionDescriptor();
        const ref4 = new ActionReference();
        ref4.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc7.putReference( app.charIDToTypeID( "null" ), ref4 );
        app.executeAction( app.stringIDToTypeID( "rasterizeLayer" ), desc7, DialogModes.NO );
        return this;
    }

    setName(name: string): Layer {
        const desc26 = new ActionDescriptor();
        const ref13 = new ActionReference();
        ref13.putEnumerated( app.charIDToTypeID( "Lyr " ), app.charIDToTypeID( "Ordn" ), app.charIDToTypeID( "Trgt" ));
        desc26.putReference( app.charIDToTypeID( "null" ), ref13 );
        const desc27 = new ActionDescriptor();
        desc27.putString( app.charIDToTypeID( "Nm  " ), name );
        desc26.putObject( app.charIDToTypeID( "T   " ), app.charIDToTypeID( "Lyr " ), desc27 );
        app.executeAction( app.charIDToTypeID( "setd" ), desc26, DialogModes.NO );
        return this;
    }

    // FIXME  这个函数不通用，需要改造
    moveBelowTo(target: Layer): void {
        try {
            if (target.isGroupLayer()) {
                this.select();
                const source = app.activeDocument.activeLayer as ArtLayer;
                const p = source.parent;
                //@ts-ignore
                source.move(p, ElementPlacement.PLACEBEFORE);
                target.select();
                //@ts-ignore
                p.move(source, ElementPlacement.PLACEBEFORE);
                //target.select();
            } else {
                let index = target.index()-1;
                this.select();
                const desc9 = new ActionDescriptor();
                const ref5 = new ActionReference();
                ref5.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
                desc9.putReference(app.charIDToTypeID("null"), ref5);
                const ref6 = new ActionReference();
                ref6.putIndex(app.charIDToTypeID("Lyr "), index);
                desc9.putReference(app.charIDToTypeID("T   "), ref6);
                desc9.putBoolean(app.charIDToTypeID("Adjs"), false);
                desc9.putInteger(app.charIDToTypeID("Vrsn"), 5);
                app.executeAction(app.charIDToTypeID("move"), desc9, DialogModes.NO);
            }
        } catch (ex) {
        }
    }

    moveInsideTo(target: Layer): void {
        if (!target.isGroupLayer()) {
            return;
        }
        try {
            this.select();
            let index = target.index() - 1;
            const desc9 = new ActionDescriptor();
            const ref5 = new ActionReference();
            ref5.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
            desc9.putReference(app.charIDToTypeID("null"), ref5);
            const ref6 = new ActionReference();
            ref6.putIndex(app.charIDToTypeID("Lyr "), index);
            desc9.putReference(app.charIDToTypeID("T   "), ref6);
            desc9.putBoolean(app.charIDToTypeID("Adjs"), false);
            desc9.putInteger(app.charIDToTypeID("Vrsn"), 5);
            app.executeAction(app.charIDToTypeID("move"), desc9, DialogModes.NO);
        } catch (ex) {
        }
    }

    remove(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        const list1 = new ActionList();
        list1.putInteger(this.id);
        desc1.putList(app.stringIDToTypeID("layerID"), list1);
        app.executeAction(app.stringIDToTypeID("delete"), desc1, DialogModes.NO);
        return this;
    }


    setFillOpacity(opacity: number): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        const desc2 = new ActionDescriptor();
        desc2.putUnitDouble(app.stringIDToTypeID("fillOpacity"), app.stringIDToTypeID("percentUnit"), opacity);
        desc1.putObject(app.stringIDToTypeID("to"), app.stringIDToTypeID("layer"), desc2);
        app.executeAction(app.stringIDToTypeID("set"), desc1, DialogModes.NO);
        return this;
    }

    setLayerColor(color: string): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        const desc2 = new ActionDescriptor();
        desc2.putEnumerated(app.stringIDToTypeID("color"), app.stringIDToTypeID("color"), app.stringIDToTypeID(color));
        desc1.putObject(app.stringIDToTypeID("to"), app.stringIDToTypeID("layer"), desc2);
        app.executeAction(app.stringIDToTypeID("set"), desc1, DialogModes.NO);
        return this;
    }


    ungroup(): Layer {
        if (!this.isGroupLayer()) { return; }
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("ungroupLayersEvent"), desc1, DialogModes.NO);
        return this;
    }

    duplicate() {
        const d = Document.activeDocument();
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        desc1.putInteger(app.stringIDToTypeID("version"), 5);
        const list1 = new ActionList();
        list1.putInteger(d.id);
        desc1.putList(app.stringIDToTypeID("ID"), list1);
        app.executeAction(app.stringIDToTypeID("duplicate"), desc1, DialogModes.NO);

    }
}
