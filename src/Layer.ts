/**
 * Created by xiaoqiang on 2018/10/6.
 */

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

}
