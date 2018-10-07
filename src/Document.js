/**
 * Created by xiaoqiang on 2018/10/6.
 * Document
 * @desc 一个PSD文档对象
 *       A PSD Document Object
 */
var Document = (function () {
    function Document() {
        this.id = this.getID();
    }
    /**
     * get name of current document
     * @returns {string}
     */
    Document.prototype.getName = function () {
        var ad = this.getDescriptor();
        return ad.getString(charIDToTypeID('Ttl '));
    };
    /**
     * get resolution of current document
     * 获取当前文档的分辨率
     * @returns {string}
     */
    Document.prototype.getResolution = function () {
        return this.getProperty('Rslt');
    };
    /**
     * get size of current doc
     * 获取当前文档的尺寸
     * @returns {Size}
     */
    Document.prototype.getSize = function () {
        var docRef = activeDocument;
        return new Size(docRef.width.value, docRef.height.value);
    };
    /**
     * resize current doc
     * 调整当前文档的尺寸
     * @param size
     */
    Document.prototype.resize = function (size) {
        var action = new ActionDescriptor();
        if (size.width > 0) {
            action.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Pxl"), size.width);
        }
        if (size.height > 0) {
            action.putUnitDouble(charIDToTypeID("Hght"), charIDToTypeID("#Pxl"), size.height);
        }
        if (size.width == 0 || size.height == 0) {
            action.putBoolean(stringIDToTypeID("scaleStyles"), true);
            action.putBoolean(charIDToTypeID("CnsP"), true);
        }
        action.putEnumerated(charIDToTypeID("Intr"), charIDToTypeID("Intp"), charIDToTypeID('Blnr'));
        executeAction(charIDToTypeID("ImgS"), action, DialogModes.NO);
    };
    /**
     * resize document canvas with center point
     * 以文档中心点调整文档的画布
     * @param size
     */
    Document.prototype.resizeCanvas = function (size) {
        var idCnvS = charIDToTypeID("CnvS");
        var desc12 = new ActionDescriptor();
        desc12.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Pxl"), size.width);
        desc12.putUnitDouble(charIDToTypeID("Hght"), charIDToTypeID("#Pxl"), size.height);
        desc12.putEnumerated(charIDToTypeID("Hrzn"), charIDToTypeID("HrzL"), charIDToTypeID("Cntr"));
        desc12.putEnumerated(charIDToTypeID("Vrtc"), charIDToTypeID("VrtL"), charIDToTypeID("Cntr"));
        executeAction(idCnvS, desc12, DialogModes.NO);
    };
    /**
     * duplicate current document, return a new doc
     * 复制当前文档,返回一个新的文档
     * @returns {Document}
     */
    Document.prototype.duplicate = function () {
        var documentDescriptor = new ActionDescriptor();
        var documentReference = new ActionReference();
        documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Frst"));
        documentDescriptor.putReference(charIDToTypeID("null"), documentReference);
        executeAction(charIDToTypeID("Dplc"), documentDescriptor, DialogModes.NO);
        return new Document();
    };
    /**
     * trim current document transparent area
     * 裁剪当前文档的透明区域
     */
    Document.prototype.trim = function () {
        var idtrim = stringIDToTypeID("trim");
        var desc83 = new ActionDescriptor();
        desc83.putEnumerated(stringIDToTypeID("trimBasedOn"), stringIDToTypeID("trimBasedOn"), charIDToTypeID("Trns"));
        desc83.putBoolean(charIDToTypeID("Top "), true);
        desc83.putBoolean(charIDToTypeID("Btom"), true);
        desc83.putBoolean(charIDToTypeID("Left"), true);
        desc83.putBoolean(charIDToTypeID("Rght"), true);
        executeAction(idtrim, desc83, DialogModes.NO);
    };
    /**
     * check current document is saved
     * 检查当前文档是否已保存
     * @returns {boolean}
     */
    Document.prototype.isSaved = function () {
        var a = new ActionReference;
        a.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        return executeActionGet(a).hasKey(stringIDToTypeID("fileReference")) ? true : false;
    };
    /**
     * get current file path
     * 获取当前文档的路径
     * @returns {null}
     */
    Document.prototype.getPath = function () {
        var path = null;
        if (this.isSaved()) {
            try {
                path = activeDocument.path;
            }
            catch (ex) {
                path = null;
            }
        }
        return path;
    };
    /**
     * get all artboards index in document
     * 获取当前文档中所有画板的索引
     * @returns {Array}
     */
    Document.prototype.getArtboardsIndex = function () {
        try {
            var ab = [], abCount = 0;
            var theRef = new ActionReference();
            theRef.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID("artboards"));
            theRef.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
            var getDescriptor = new ActionDescriptor();
            getDescriptor.putReference(stringIDToTypeID("null"), theRef);
            var abDesc = executeAction(charIDToTypeID("getd"), getDescriptor, DialogModes.NO).getObjectValue(stringIDToTypeID("artboards"));
            abCount = abDesc.getList(stringIDToTypeID('list')).count;
            if (abCount > 0) {
                for (var i = 0; i < abCount; ++i) {
                    var abObj = abDesc.getList(stringIDToTypeID('list')).getObjectValue(i);
                    var abTopIndex = abObj.getInteger(stringIDToTypeID("top"));
                    ab.push(abTopIndex);
                }
            }
            return ab;
        }
        catch (ex) {
            alert('getArtboardsIndex error[' + ex + ']');
        }
        return [];
    };
    /**
     * check if current doc has artboards
     * 检查当前文档是否含有画板
     * @returns {boolean}
     */
    Document.prototype.hasArtboards = function () {
        return (this.getArtboardsIndex().length > 0);
    };
    /**
     * get all artboards from current doc
     * 获取当前文档的所有画板对象列表
     * @returns {Array}
     */
    Document.prototype.getArtboardList = function () {
        var result = [];
        var indexArr = this.getArtboardsIndex();
        for (var i = 0; i < indexArr.length; i++) {
            var index = indexArr[i];
            try {
                var ref = new ActionReference();
                ref.putIndex(charIDToTypeID("Lyr "), index + 1);
                var layerDesc = executeActionGet(ref);
                if (layerDesc.getBoolean(stringIDToTypeID("artboardEnabled")) == true) {
                    var artBoardRect = layerDesc.getObjectValue(stringIDToTypeID("artboard")).getObjectValue(stringIDToTypeID("artboardRect"));
                    var theName = layerDesc.getString(stringIDToTypeID('name'));
                    var theID = layerDesc.getInteger(stringIDToTypeID('layerID'));
                    var left = artBoardRect.getUnitDoubleValue(stringIDToTypeID("left"));
                    var top = artBoardRect.getUnitDoubleValue(stringIDToTypeID("top"));
                    var right = artBoardRect.getUnitDoubleValue(stringIDToTypeID("right"));
                    var bottom = artBoardRect.getUnitDoubleValue(stringIDToTypeID("bottom"));
                    var layerReference = new ActionReference();
                    layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
                    layerReference.putIdentifier(charIDToTypeID("Lyr "), theID);
                    var descriptor = executeActionGet(layerReference);
                    var idx = descriptor.getInteger(charIDToTypeID("ItmI"));
                    result.push(new Artboard(theName, theID, idx, new Rect(left, top, right - left, bottom - top)));
                }
            }
            catch (ex) {
                alert("get artboards error[" + ex + "]");
            }
        }
        return result;
    };
    /**
     * get selected layers
     * 获取当前选中的图层列表
     * @returns {Array}
     */
    Document.prototype.getSelectedLayers = function () {
        var selectedLayers = [];
        try {
            var targetLayersTypeId = stringIDToTypeID("targetLayers");
            var selectedLayersReference = new ActionReference();
            selectedLayersReference.putProperty(charIDToTypeID("Prpr"), targetLayersTypeId);
            selectedLayersReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var descriptor = executeActionGet(selectedLayersReference);
            if (descriptor.hasKey(targetLayersTypeId) == false) {
                selectedLayersReference = new ActionReference();
                selectedLayersReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("LyrI"));
                selectedLayersReference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
                descriptor = executeActionGet(selectedLayersReference);
                var id = descriptor.getInteger(charIDToTypeID("LyrI"));
                var layer = new Layer(id);
                if (layer.isVisible()) {
                    selectedLayers.push(new Layer(id));
                }
            }
            else {
                var hasBackground = this.hasBackgroundLayer() ? 0 : 1;
                var list = descriptor.getList(targetLayersTypeId);
                for (var i = 0; i < list.count; i++) {
                    var selectedLayerIndex = list.getReference(i).getIndex() + hasBackground;
                    var selectedLayersReference = new ActionReference();
                    selectedLayersReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("LyrI"));
                    selectedLayersReference.putIndex(charIDToTypeID("Lyr "), selectedLayerIndex);
                    descriptor = executeActionGet(selectedLayersReference);
                    var id = descriptor.getInteger(charIDToTypeID("LyrI"));
                    var layer = new Layer(id);
                    if (layer.isVisible()) {
                        selectedLayers.push(new Layer(id));
                    }
                }
            }
        }
        catch (ex) {
            alert("get select layer error[" + ex + "]");
        }
        return selectedLayers;
    };
    ;
    /**
     * select layers
     * 设定选中某些图层
     * @param layers
     */
    Document.prototype.setSelectedLayers = function (layers) {
        if (layers.length == 0)
            return;
        var current = new ActionReference();
        for (var i = 0; i < layers.length; i++) {
            current.putIdentifier(charIDToTypeID("Lyr "), layers[i].id);
        }
        var desc = new ActionDescriptor();
        desc.putReference(charIDToTypeID("null"), current);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    };
    /**
     * get some layer by there names
     * 根据图层的名称获取图层列表
     * @param name
     * @returns {Array}
     */
    Document.prototype.getLayersByName = function (name) {
        var info = this.getJSONInfo(false);
        var obj = JSON.parse(info);
        var layers = obj['layers'];
        function walkLayers(layers, target) {
            var ret = [];
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer['name'] == target) {
                    ret.push(new Layer(layer['id']));
                }
                else {
                    if (layer['layers']) {
                        ret = ret.concat(walkLayers(layer['layers'], target));
                    }
                }
            }
            return ret;
        }
        return walkLayers(layers, name);
    };
    /**
     * get layer by layer id
     * 根据图层ID获取图层
     * @param theID
     * @returns {Layer|null}
     */
    Document.prototype.getLayerByID = function (theID) {
        var info = this.getJSONInfo(false);
        var obj = JSON.parse(info);
        var layers = obj['layers'];
        function walkLayers(layers, target) {
            var ret = null;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer['id'] == target) {
                    return new Layer(layer['id']);
                }
                else {
                    if (layer['layers']) {
                        return walkLayers(layer['layers'], target);
                    }
                }
            }
            return ret;
        }
        return walkLayers(layers, theID);
    };
    /**
     * get layer by index
     * 根据图层的顺序获取图层
     * @param index
     * @returns {Layer|null}
     */
    Document.prototype.getLayerByIndex = function (index) {
        var info = this.getJSONInfo(false);
        var obj = JSON.parse(info);
        var layers = obj['layers'];
        function walkLayers(layers, target) {
            var ret = null;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer['index'] == target) {
                    return new Layer(layer['id']);
                }
                else {
                    if (layer['layers']) {
                        return walkLayers(layer['layers'], target);
                    }
                }
            }
            return ret;
        }
        return walkLayers(layers, index);
    };
    /**
     * get json format info of current document
     * 获取当前文档的JSON数据结构
     * @param notes
     * @returns {string}
     */
    Document.prototype.getJSONInfo = function (notes) {
        if (notes === void 0) { notes = false; }
        var af = new ActionReference();
        var ad = new ActionDescriptor();
        af.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("json"));
        af.putEnumerated(stringIDToTypeID("document"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        ad.putReference(charIDToTypeID("null"), af);
        if (notes == true) {
            ad.putBoolean(stringIDToTypeID("getNotes"), true);
        }
        return executeAction(charIDToTypeID("getd"), ad, DialogModes.NO).getString(stringIDToTypeID("json"));
    };
    /**
     * check if background layer exists
     * 检查当前文档是否有背景图层
     * @returns {any}
     */
    Document.prototype.hasBackgroundLayer = function () {
        var backgroundReference = new ActionReference();
        backgroundReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Bckg"));
        backgroundReference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Back"));
        var backgroundDescriptor = executeActionGet(backgroundReference);
        var hasBackground = backgroundDescriptor.getBoolean(charIDToTypeID("Bckg"));
        return hasBackground;
    };
    /**
     * crop document with provided rect
     * 根据给定的区域裁剪当前文档
     * @param rect
     */
    Document.prototype.crop = function (rect) {
        activeDocument.crop([rect.X, rect.Y, rect.right(), rect.bottom()]);
    };
    /**
     * get current selection, may be zero
     * 获取当前的选区,可能是0
     * @returns {Rect}
     */
    Document.prototype.getSelection = function () {
        try {
            var selection = activeDocument.selection.bounds;
            return new Rect(selection[0].value, selection[1].value, selection[2].value - selection[0].value, selection[3].value - selection[1].value);
        }
        catch (ex) {
            return new Rect(0, 0, 0, 0);
        }
    };
    /**
     * select a selection with bounds
     * 根据给定的尺寸生成一个选区
     * @param bounds
     * @returns {Rect}
     */
    Document.prototype.setSelection = function (bounds) {
        var size = this.getSize();
        var documentBounds = new Rect(0, 0, size.width, size.height);
        var bounds = documentBounds.intersect(bounds);
        if (bounds == null)
            return null;
        var selectionMode = charIDToTypeID("setd");
        var selectionDescriptor = new ActionDescriptor();
        var selectionReference = new ActionReference();
        selectionReference.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        selectionDescriptor.putReference(charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putObject(charIDToTypeID("T   "), charIDToTypeID("Rctn"), bounds.toDescriptor());
        executeAction(selectionMode, selectionDescriptor, DialogModes.NO);
        return bounds;
    };
    /**
     * delsect selection
     * 取消选区
     */
    Document.prototype.deselectSelection = function () {
        var selectionDescriptor = new ActionDescriptor();
        var selectionReference = new ActionReference();
        selectionReference.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        selectionDescriptor.putReference(charIDToTypeID("null"), selectionReference);
        selectionDescriptor.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("Ordn"), charIDToTypeID("None"));
        executeAction(charIDToTypeID("setd"), selectionDescriptor, DialogModes.NO);
    };
    /**
     * invert selection
     * 反转当前选区
     */
    Document.prototype.invertSelection = function () {
        var idInvs = charIDToTypeID("Invs");
        executeAction(idInvs, undefined, DialogModes.NO);
    };
    /**
     * get current open document ID
     * @returns {any}
     */
    Document.prototype.getID = function () {
        try {
            var documentReference = new ActionReference();
            documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("DocI"));
            documentReference.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var documentDescriptor = executeActionGet(documentReference);
            return documentDescriptor.getInteger(charIDToTypeID("DocI"));
        }
        catch (e) {
            return -1;
        }
    };
    /**
     * 获取文档的描述符
     * @returns {any}
     */
    Document.prototype.getDescriptor = function () {
        var documentReference = new ActionReference();
        documentReference.putIdentifier(charIDToTypeID("Dcmn"), this.id);
        var documentDescriptor = executeActionGet(documentReference);
        return documentDescriptor;
    };
    /**
     * get property of current document
     * @param name
     * @returns {any}
     */
    Document.prototype.getProperty = function (name) {
        var documentReference = new ActionReference();
        documentReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID(name));
        documentReference.putIdentifier(charIDToTypeID("Dcmn"), this.id);
        var documentDescriptor = executeActionGet(documentReference);
        return documentDescriptor.getInteger(charIDToTypeID(name));
    };
    /**
     * 关闭当前文档，不保存
     * close current doc with save
     */
    Document.prototype.close = function () {
        var desc904 = new ActionDescriptor();
        desc904.putEnumerated(charIDToTypeID("Svng"), charIDToTypeID("YsN "), charIDToTypeID("N   "));
        executeAction(charIDToTypeID("Cls "), desc904, DialogModes.NO);
    };
    /**
     * 保存并关闭当前文档
     * save and close current document
     */
    Document.prototype.saveAndClose = function () {
        var desc904 = new ActionDescriptor();
        desc904.putEnumerated(charIDToTypeID("Svng"), charIDToTypeID("YsN "), charIDToTypeID("Ys  "));
        executeAction(charIDToTypeID("Cls "), desc904, DialogModes.NO);
    };
    /**
     * 添加一个文档 (Add a document)
     * @param width
     * @param height
     * @param title
     * @returns {Document}
     */
    Document.add = function (width, height, title) {
        var desc299 = new ActionDescriptor();
        var desc300 = new ActionDescriptor();
        desc300.putString(charIDToTypeID("Nm  "), title);
        desc300.putBoolean(stringIDToTypeID("artboard"), false);
        desc300.putClass(charIDToTypeID("Md  "), charIDToTypeID("RGBM"));
        desc300.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Rlt"), width);
        desc300.putUnitDouble(charIDToTypeID("Hght"), charIDToTypeID("#Rlt"), height);
        desc300.putUnitDouble(charIDToTypeID("Rslt"), charIDToTypeID("#Rsl"), 72.000000);
        desc300.putDouble(stringIDToTypeID("pixelScaleFactor"), 1.000000);
        desc300.putEnumerated(charIDToTypeID("Fl  "), charIDToTypeID("Fl  "), charIDToTypeID("Wht "));
        desc300.putInteger(charIDToTypeID("Dpth"), 8);
        desc300.putString(stringIDToTypeID("profile"), "none");
        desc300.putList(charIDToTypeID("Gdes"), new ActionList());
        desc299.putObject(charIDToTypeID("Nw  "), charIDToTypeID("Dcmn"), desc300);
        executeAction(charIDToTypeID("Mk  "), desc299, DialogModes.NO);
        return new Document();
    };
    return Document;
}());
//# sourceMappingURL=Document.js.map