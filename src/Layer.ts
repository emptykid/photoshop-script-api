/**
 * Created by xiaoqiang on 2018/10/6.
 */

const enum Kind {NORMAL = 1, TEXT = 3, VECTOR = 4};

class Layer {
    id:number;

    constructor(id:number) {
        this.id = id;
    }

    /**
     * get layer name
     * 获取图层的名称
     * @returns {string}
     */
    public getName():string {
        var layerReference = new ActionReference();
        layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Nm  "));
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        return descriptor.getString(charIDToTypeID("Nm  "));
    }

    /**
     * set layer name
     * 设置图层的名称
     * @param name
     */
    public setName(name:string):void {
        var desc26 = new ActionDescriptor();
        var ref13 = new ActionReference();
        ref13.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ));
        desc26.putReference( charIDToTypeID( "null" ), ref13 );
        var desc27 = new ActionDescriptor();
        desc27.putString( charIDToTypeID( "Nm  " ), name );
        desc26.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Lyr " ), desc27 );
        executeAction( charIDToTypeID( "setd" ), desc26, DialogModes.NO );
    }

    /**
     * get layer index
     * 获取图层的索引
     * @returns {number}
     */
    public getIndex():number {
        try {
            var layerReference = new ActionReference();
            layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
            layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
            var descriptor = executeActionGet(layerReference);
            return descriptor.getInteger(charIDToTypeID("ItmI"));
        } catch(e) {
            return 0;
        }
    }

    /**
     * get layer bounds
     * 获取图层的尺寸位置
     * @returns {Rect}
     */
    public getBounds():Rect {
        var getSelectedLayerBounds = function() {
            var selectedLayerReference = new ActionReference();
            selectedLayerReference.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("bounds"));
            selectedLayerReference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var selectedLayerDescriptor = executeActionGet(selectedLayerReference);
            return Rect.fromDescriptor(selectedLayerDescriptor);
        };
        if (this.isGroup()) {
            executeAction(stringIDToTypeID("newPlacedLayer"), undefined, DialogModes.NO);
            let ret = getSelectedLayerBounds();
            History.undo();
            return ret;
        } else {
            return getSelectedLayerBounds();
        }
    }


    /**
     * get size
     * 获取图层的尺寸
     * @returns {Size}
     */
    public getSize():Size {
        return this.getBounds().size();
    }

    /**
     * hide layer
     * 隐藏图层
     */
    public hide():void {
        var current = new ActionReference();
        current.putIdentifier(charIDToTypeID("Lyr "), this.id);;
        var desc242 = new ActionDescriptor();
        var list10 = new ActionList();
        list10.putReference( current );
        desc242.putList( charIDToTypeID( "null" ), list10 );
        executeAction( charIDToTypeID( "Hd  " ), desc242, DialogModes.NO );
    }

    /**
     * show the layer
     * 显示图层
     */
    public show():void {
        var desc403 = new ActionDescriptor();
        var list78 = new ActionList();
        var ref142 = new ActionReference();
        ref142.putIdentifier(charIDToTypeID("Lyr "), this.id);;
        list78.putReference( ref142 );
        desc403.putList( charIDToTypeID( "null" ), list78 );
        executeAction( charIDToTypeID( "Shw " ), desc403, DialogModes.NO );
    }

    /**
     * set selected the layer
     * 设置此图层为选中状态
     */
    public select():void {
        var current = new ActionReference();
        current.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var desc  = new ActionDescriptor();
        desc.putReference (charIDToTypeID("null"), current);
        executeAction( charIDToTypeID( "slct" ), desc , DialogModes.NO );
    }

    /**
     * is layer visible
     * 图册是否可见
     * @returns {boolean}
     */
    public isVisible():boolean {
        var layerReference = new ActionReference();
        layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Vsbl"));
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        if(descriptor.hasKey(charIDToTypeID("Vsbl")) == false) return false;
        return descriptor.getBoolean (charIDToTypeID("Vsbl"));
    }

    /**
     * check if current layer is a text layer
     * 判断当前图层是否是文字图层
     * @returns {boolean}
     */
    public isTextLayer():boolean {
        var layerReference = new ActionReference();
        layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Txt "));
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        return descriptor.hasKey(charIDToTypeID("Txt "));
    }

    /**
     * check layer is a vector layer
     * 判断当前图层是否是形状图层
     * @returns {boolean}
     */
    public isShapeLayer():boolean {
        var layerReference = new ActionReference();
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        var kind:number = descriptor.getInteger(stringIDToTypeID('layerKind'));
        return kind == Kind.VECTOR;
    }

    /**
     * check layer is a group
     * 判断当前图层是一个图层组
     * @returns {boolean}
     */
    public isGroup():boolean {
        try {
            let layerReference = new ActionReference();
            layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
            let descriptor = executeActionGet(layerReference);
            if (descriptor.hasKey(stringIDToTypeID("layerSection"))) {
                if (descriptor.getEnumerationValue(stringIDToTypeID("layerSection")) == stringIDToTypeID("layerSectionStart")) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * create a selection with current layer
     * 从当前图层创建选区
     * @returns {Selection}
     */
    public toSelection():Selection {
        var desc3 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putProperty( charIDToTypeID( "Chnl" ), charIDToTypeID( "fsel" ));
        desc3.putReference( charIDToTypeID( "null" ), ref1 );
        var ref2 = new ActionReference();
        ref2.putEnumerated( charIDToTypeID( "Path" ), charIDToTypeID( "Path" ), stringIDToTypeID( "vectorMask" ));
        ref2.putIdentifier(charIDToTypeID("Lyr "), this.id);
        desc3.putReference( charIDToTypeID( "T   " ), ref2 );
        desc3.putInteger( charIDToTypeID( "Vrsn" ), 1 );
        desc3.putBoolean( stringIDToTypeID( "vectorMaskParams" ), true );
        executeAction( charIDToTypeID( "setd" ), desc3, DialogModes.NO );

        let selection = activeDocument.selection.bounds;
        let rect = new Rect(selection[0].value, selection[1].value, selection[2].value - selection[0].value, selection[3].value - selection[1].value);
        let sel = new Selection(rect);
        sel.create();
        return sel;
    }

    /**
     * rasterize the layer
     * 栅格化图层
     */
    public rasterize():void {
        var desc7 = new ActionDescriptor();
        var ref4 = new ActionReference();
        ref4.putIdentifier(charIDToTypeID("Lyr "), this.id);
        desc7.putReference( charIDToTypeID( "null" ), ref4 );
        executeAction( stringIDToTypeID( "rasterizeLayer" ), desc7, DialogModes.NO );
    }

    /**
     * transform the layer with percent value
     * 自由变化图层大小
     * @example  tranform(200, 200)
     *
     * @param width  percent
     * @param height percent
     */
    public transform(width:number, height:number):void {
        this.select();
        var desc11 = new ActionDescriptor();
        var ref5 = new ActionReference();
        ref5.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ));
        desc11.putReference( charIDToTypeID( "null" ), ref5 );
        desc11.putEnumerated( charIDToTypeID( "FTcs" ), charIDToTypeID( "QCSt" ), charIDToTypeID( "Qcsa" ));
        var desc12 = new ActionDescriptor();
        desc12.putUnitDouble( charIDToTypeID( "Hrzn" ), charIDToTypeID( "#Pxl" ), 0.000000 );
        desc12.putUnitDouble( charIDToTypeID( "Vrtc" ), charIDToTypeID( "#Pxl" ), 0.000000 );
        desc11.putObject( charIDToTypeID( "Ofst" ), charIDToTypeID( "Ofst" ), desc12 );
        desc11.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Prc" ), width );
        desc11.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Prc" ), height );
        desc11.putEnumerated( charIDToTypeID( "Intr" ), charIDToTypeID( "Intp" ), charIDToTypeID( "Bcbc" ));
        executeAction( charIDToTypeID( "Trnf" ), desc11, DialogModes.NO );
    }


}
