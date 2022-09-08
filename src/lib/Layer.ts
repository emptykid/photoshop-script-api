/**
 * Created by xiaoqiang
 * @date 2021/07/31
 * @description Layer implement for photoshop
 */

import {Document} from "./Document";
import {Rect} from "./Rect";
import {DescriptorInfo} from "./DescriptorInfo";
import {Size} from "./Size";
import {Point} from "./Shape";
import {SolidColor} from "./base/SolidColor";
import {FXColorOverlay} from "./fx/FXColorOverlay";
import {FXStroke} from "./fx/FXStroke";
import {FXDropShadow} from "./fx/FXDropShadow";
import {Text} from "./Text";

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
     * create a blank new layer
     * @return Layer
     */
    static create(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( "layer" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
        return Layer.getSelectedLayer();
    }


    /**
     * create a group layer
     * by default the created group is just above the top selected layer
     * after created, the new group layer is selected, you can retrieve it by Layer.getSelectedLayers()
     */
    static createGroup() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass(app.stringIDToTypeID("layerSection"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        app.executeAction(app.stringIDToTypeID("make"), desc1, DialogModes.NO);
    }

    /**
     * group selected layer
     */
    static groupSelected() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass(app.stringIDToTypeID("layerSection"));
        desc1.putReference(app.stringIDToTypeID("null"), ref1);
        const ref2 = new ActionReference();
        ref2.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        desc1.putReference(app.stringIDToTypeID("from"), ref2);
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
     * hide multiple layers by id list provided
     * @param idList
     */
    static hideLayersByIDs(idList: number[]): void {
        if (idList.length === 0) { return; }
        const desc242 = new ActionDescriptor();
        const list10 = new ActionList();
        idList.forEach((layerId) => {
            const current = new ActionReference();
            current.putIdentifier(app.charIDToTypeID("Lyr "), layerId);
            list10.putReference( current );
        });
        desc242.putList( app.charIDToTypeID( "null" ), list10 );
        app.executeAction( app.charIDToTypeID( "Hd  " ), desc242, DialogModes.NO );
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

    static hasArtboard(): boolean {
        const theRef = new ActionReference();
        theRef.putProperty(app.charIDToTypeID('Prpr'), app.stringIDToTypeID("artboards"));
        theRef.putEnumerated(app.charIDToTypeID('Dcmn'), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        const getDescriptor = new ActionDescriptor();
        getDescriptor.putReference(app.stringIDToTypeID("null"), theRef);
        const abDesc = app.executeAction(app.charIDToTypeID("getd"), getDescriptor, DialogModes.NO).getObjectValue(app.stringIDToTypeID("artboards"));
        return abDesc.getList(app.stringIDToTypeID('list')).count > 0;
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

    /**
     * group selected layers and return the selected new group layer
     * @return Layer
     */
    static groupSelectedLayers(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( "layerSection" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putEnumerated( app.stringIDToTypeID( "layer" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "targetEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "from" ), ref2 );
        desc1.putString( app.stringIDToTypeID( "name" ), "New Group" ); // no effect
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
        return Layer.getSelectedLayer();
    }

    /**
     * link target layers
     * @param layers
     */
    public static linkLayers(layers: Layer[]): void {
        Layer.setSelectedLayers(layers);
        const desc11 = new ActionDescriptor();
        const ref7 = new ActionReference();
        ref7.putEnumerated( app.charIDToTypeID( "Lyr " ), app.charIDToTypeID( "Ordn" ), app.charIDToTypeID( "Trgt" ) );
        desc11.putReference( app.charIDToTypeID( "null" ), ref7 );
        app.executeAction( app.stringIDToTypeID( "linkSelectedLayers" ), desc11, DialogModes.NO );
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

    /**
     * get parent layer of current
     * @warning this layer only available on version upper than CC2018
     * @return Layer
     */
    public parentLayer(): Layer | null {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("parentLayerID"));
        layerReference.putEnumerated(app.charIDToTypeID("Lyr "), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"))
        const descriptor = app.executeActionGet(layerReference);
        if (descriptor.hasKey(app.stringIDToTypeID("parentLayerID"))) {
            const parentId = descriptor.getInteger(app.stringIDToTypeID("parentLayerID"));
            if (parentId != -1) {
                return new Layer(parentId);
            }
        }
        return null;
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
        const left = bounds[0].value;
        const top = bounds[1].value;
        const right = bounds[2].value;
        const bottom = bounds[3].value;
        return new Rect(left, top, right - left, bottom - top);
    }


    size(): Size {
        return this.bounds().size();
    }

    radius(): number[] {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("keyOriginType"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const layerDescriptor = app.executeActionGet(layerReference);
        if (layerDescriptor.hasKey(app.stringIDToTypeID("keyOriginType"))) {
            const list = layerDescriptor.getList(app.stringIDToTypeID("keyOriginType"));
            const target = list.getObjectValue(0);
            if (target.hasKey(app.stringIDToTypeID("keyOriginRRectRadii"))) {
                const keyOriginRRectRadii = target.getObjectValue(app.stringIDToTypeID("keyOriginRRectRadii"));
                const topRight = keyOriginRRectRadii.getInteger(app.stringIDToTypeID("topRight"));
                const topLeft = keyOriginRRectRadii.getInteger(app.stringIDToTypeID("topLeft"));
                const bottomLeft  = keyOriginRRectRadii.getInteger(app.stringIDToTypeID("bottomLeft"));
                const bottomRight = keyOriginRRectRadii.getInteger(app.stringIDToTypeID("bottomRight"));
                return [topLeft, topRight, bottomRight, bottomLeft];
            }
        }
        return [];
    }

    opacity(): number {
        const layerReference = new ActionReference();
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("opacity"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const layerDescriptor = app.executeActionGet(layerReference);
        return layerDescriptor.getInteger(app.stringIDToTypeID("opacity"));
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

    rotate(angle: number, state: string = "QCSAverage", centerPoint: Point = null): Layer {
        const descriptor = new ActionDescriptor();
        const reference = new ActionReference();
        reference.putEnumerated( app.stringIDToTypeID( "layer" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "targetEnum" ));
        descriptor.putReference( app.stringIDToTypeID( "null" ), reference );
        descriptor.putEnumerated( app.stringIDToTypeID( "freeTransformCenterState" ), app.stringIDToTypeID( "quadCenterState" ), app.stringIDToTypeID( state )); // upper left
        descriptor.putUnitDouble( app.stringIDToTypeID( "angle" ), app.stringIDToTypeID( "angleUnit" ), angle);
        if (state === "QCSIndependent" && centerPoint != null) {
            const desc2 = new ActionDescriptor();
            desc2.putUnitDouble( app.charIDToTypeID( "Hrzn" ), app.charIDToTypeID( "#Rlt" ), centerPoint.x);
            desc2.putUnitDouble( app.charIDToTypeID( "Vrtc" ), app.charIDToTypeID( "#Rlt" ), centerPoint.y);
            descriptor.putObject( app.charIDToTypeID( "Pstn" ), app.charIDToTypeID( "Pnt " ), desc2 );
        }
        descriptor.putEnumerated( app.stringIDToTypeID( "interfaceIconFrameDimmed" ), app.stringIDToTypeID( "interpolationType" ), app.stringIDToTypeID( "bicubicSmoother" ));
        app.executeAction( app.stringIDToTypeID( "transform" ), descriptor, DialogModes.NO );
        return this;
    }

    toString(): string {
        return `name[${this.name()}] id[${this.id}] index[${this.index()}]`;
    }

    text(): Text | null {
        const layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const layerDescriptor = app.executeActionGet(layerReference);
        if (!layerDescriptor.hasKey(app.stringIDToTypeID("textKey"))) {
            return null;
        }
        const textKey = layerDescriptor.getObjectValue(app.stringIDToTypeID("textKey"));
        return Text.fromDescriptor(textKey);
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

    toDescriptor(): ActionDescriptor {
        const layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        return app.executeActionGet(layerReference);
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

    hasLayerEffects(): boolean {
        let layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        let descriptor = app.executeActionGet(layerReference);
        const layerFXVisible = descriptor.getBoolean(app.stringIDToTypeID("layerFXVisible"));
        return descriptor.hasKey(app.stringIDToTypeID("layerEffects")) && layerFXVisible;
    }

    layerFXVisible(): boolean {
        let layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        let descriptor = app.executeActionGet(layerReference);
        if (descriptor.hasKey(app.stringIDToTypeID("layerFXVisible"))) {
            if (descriptor.getBoolean(app.stringIDToTypeID("layerFXVisible")) == true) {
                return true;
            }
        }
        return false;
    }

    getFXEffect(name: string): ActionDescriptor | null {
        let layerReference = new ActionReference();
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        let descriptor = app.executeActionGet(layerReference);
        const layerFXVisible = descriptor.getBoolean(app.stringIDToTypeID("layerFXVisible"));
        if (layerFXVisible === false) {
            return null;
        }
        if (!descriptor.hasKey(app.stringIDToTypeID("layerEffects"))) {
            return null;
        }
        const layerEffects = descriptor.getObjectValue(app.stringIDToTypeID("layerEffects"));
        if (!layerEffects.hasKey(app.stringIDToTypeID(name))) {
            return null;
        }
        return layerEffects.getObjectValue(app.stringIDToTypeID(name));
    }

    getFxColorOverlay(): FXColorOverlay | null {
        const solidFill = this.getFXEffect("solidFill");
        return solidFill == null? null : FXColorOverlay.fromDescriptor(solidFill);
    }

    getFXStroke(): FXStroke | null {
        const frameFX = this.getFXEffect("frameFX")
        return frameFX === null? null : FXStroke.fromDescriptor(frameFX);
    }

    getFXDropShadow(): FXDropShadow | null {
        const dropShadow = this.getFXEffect("dropShadow")
        return dropShadow === null? null : FXDropShadow.fromDescriptor(dropShadow);
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

    rasterizeStyle(): Layer {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        desc1.putEnumerated( app.stringIDToTypeID( "what" ), app.stringIDToTypeID( "rasterizeItem" ), app.stringIDToTypeID( "layerStyle" ) );
        app.executeAction( app.stringIDToTypeID( "rasterizeLayer" ), desc1, DialogModes.NO );
        return this;
    }

    mergeGroup(): Layer {
        const idmergeLayersNew = app.stringIDToTypeID( "mergeLayersNew" );
        app.executeAction( idmergeLayersNew, undefined, DialogModes.NO );
        return new Layer(app.activeDocument.activeLayer.id);
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

            }
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

    getFillColor(): SolidColor | null {
        if (!this.isShapeLayer()) {
            return null;
        }
        const layerReference = new ActionReference();
        //layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("fillEnabled"));
        layerReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("adjustment"));
        layerReference.putIdentifier(app.charIDToTypeID("Lyr "), this.id);
        const descriptor = app.executeActionGet(layerReference);
        if (descriptor.hasKey(app.stringIDToTypeID("adjustment"))) {
            const list =  descriptor.getList( app.stringIDToTypeID( "adjustment" ) ) ;
            const solidColorLayer = list.getObjectValue(0);
            const rgbColor = solidColorLayer.getObjectValue(app.charIDToTypeID("Clr "));
            return SolidColor.fromDescriptor(rgbColor);
        }
        return null;
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

    duplicateToDocument(name: string) {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putEnumerated( app.stringIDToTypeID( "layer" ), app.stringIDToTypeID( "ordinal" ), app.stringIDToTypeID( "targetEnum" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
        const ref2 = new ActionReference();
        ref2.putName( app.stringIDToTypeID( "document" ), name );
        desc1.putReference( app.stringIDToTypeID( "to" ), ref2 );
        desc1.putInteger( app.stringIDToTypeID( "version" ), 5 );
        app.executeAction( app.stringIDToTypeID( "duplicate" ), desc1, DialogModes.NO );
    }
}
