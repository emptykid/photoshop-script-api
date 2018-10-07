/**
 * Created by xiaoqiang on 2018/10/6.
 * Application
 * @desc  全局App对象, 对应整个PS应用程序
 * @desc_en  Global App object, map to photoshop Application
 */
var App = (function () {
    function App() {
    }
    /**
     * get photoshop version number
     * 获取PS的版本号
     * @returns {number|string}
     */
    App.getVersion = function () {
        return app.version;
    };
    /**
     * check current ps version is above cc2015
     * 判断当前的PS版本高于cc2015
     * @returns {boolean}
     */
    App.isAboveCC2015 = function () {
        var v = parseFloat(this.getVersion());
        return (v >= 16.0);
    };
    /**
     * open a file
     * 打开一个本地文档
     * @param path
     * @returns {Document}
     */
    App.open = function (path) {
        var desc437 = new ActionDescriptor();
        desc437.putPath(charIDToTypeID("null"), new File(path));
        executeAction(charIDToTypeID("Opn "), desc437, DialogModes.NO);
        return new Document();
    };
    return App;
}());
//# sourceMappingURL=Application.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Artboard = (function () {
    function Artboard(name, id, index, bounds) {
        this.name = name;
        this.id = id;
        this.index = index;
        this.bounds = bounds;
    }
    return Artboard;
}());
//# sourceMappingURL=Artboard.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Color = (function () {
    function Color(r, g, b) {
        this.A = 255.0;
        this.R = r;
        this.G = g;
        this.B = b;
    }
    Color.prototype.Hex = function () {
        return ("#" + this.componentToHex(this.R) + this.componentToHex(this.G) + this.componentToHex(this.B)).toUpperCase();
    };
    Color.prototype.RGB = function () {
        return ("(" + Math.round(this.R) + "," + Math.round(this.G) + "," + Math.round(this.B) + ")");
    };
    Color.prototype.toString = function (ColorType) {
        if (typeof ColorType == "undefined")
            ColorType = "";
        if (ColorType == "RGB")
            return this.RGB();
        else if (ColorType == "HEX")
            return this.Hex();
        else
            return (this.Hex() + " / " + this.RGB());
    };
    Color.prototype.componentToHex = function (c) {
        c = Math.round(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    Color.prototype.toDescriptor = function () {
        var result = new ActionDescriptor();
        result.putDouble(charIDToTypeID("Rd  "), this.R);
        result.putDouble(charIDToTypeID("Grn "), this.G);
        result.putDouble(charIDToTypeID("Bl  "), this.B);
        return result;
    };
    Color.fromDescriptor = function (descriptor) {
        var r = descriptor.getDouble(charIDToTypeID("Rd  "));
        var g = descriptor.getDouble(charIDToTypeID("Grn "));
        var b = descriptor.getDouble(charIDToTypeID("Bl  "));
        return new Color(r, g, b);
    };
    Color.fromHex = function (hexString) {
        var a = hexString.substring(0, 2);
        var b = hexString.substring(2, 4);
        var c = hexString.substring(4, 6);
        return new Color(parseInt('0x' + a), parseInt('0x' + b), parseInt('0x' + c));
    };
    return Color;
}());
//# sourceMappingURL=Color.js.map
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
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var History = (function () {
    function History() {
    }
    History.suspend = function (historyString, javaScriptString) {
        activeDocument.suspendHistory(historyString, javaScriptString);
    };
    History.undo = function () {
        executeAction(charIDToTypeID("undo"), undefined, DialogModes.NO);
    };
    ;
    History.back = function (step) {
        step = (step == undefined) ? 1 : step;
        var doc = activeDocument;
        doc.activeHistoryState = doc.historyStates[doc.historyStates.length - step];
    };
    return History;
}());
//# sourceMappingURL=History.js.map
/*
    json2.js
    2015-02-25
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html
    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
    This file creates a global JSON object containing two methods: stringify
    and parse.
        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.
            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.
            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            This method produces a JSON text from a JavaScript value.
            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value
            For example, this would serialize Dates as ISO strings.
                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 
                        ? '0' + n 
                        : n;
                    }
                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };
            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.
            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.
            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.
            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.
            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.
            Example:
            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'
            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'
        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.
            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.
            Example:
            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.
            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });
            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint 
    eval, for, this 
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 
        ? '0' + n 
        : n;
    }
    
    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
            ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
            : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) 
        ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
            ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' 
        : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) 
            ? String(value) 
            : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                ? '[]'
                : gap
                ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                ? ': ' 
                                : ':'
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                ? ': ' 
                                : ':'
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
            ? '{}'
            : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                /^[\],:{}\s]*$/.test(
                    text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                ? walk({'': j}, '')
                : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Layer = (function () {
    function Layer(id) {
        this.id = id;
    }
    /**
     * get layer name
     * 获取图层的名称
     * @returns {string}
     */
    Layer.prototype.getName = function () {
        var layerReference = new ActionReference();
        layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Nm  "));
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        return descriptor.getString(charIDToTypeID("Nm  "));
    };
    /**
     * set layer name
     * 设置图层的名称
     * @param name
     */
    Layer.prototype.setName = function (name) {
        var desc26 = new ActionDescriptor();
        var ref13 = new ActionReference();
        ref13.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc26.putReference(charIDToTypeID("null"), ref13);
        var desc27 = new ActionDescriptor();
        desc27.putString(charIDToTypeID("Nm  "), name);
        desc26.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), desc27);
        executeAction(charIDToTypeID("setd"), desc26, DialogModes.NO);
    };
    /**
     * get layer index
     * 获取图层的索引
     * @returns {number}
     */
    Layer.prototype.getIndex = function () {
        try {
            var layerReference = new ActionReference();
            layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
            layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
            var descriptor = executeActionGet(layerReference);
            return descriptor.getInteger(charIDToTypeID("ItmI"));
        }
        catch (e) {
            return 0;
        }
    };
    /**
     * get layer bounds
     * 获取图层的尺寸位置
     * @returns {Rect}
     */
    Layer.prototype.getBounds = function () {
        var getSelectedLayerBounds = function () {
            var selectedLayerReference = new ActionReference();
            selectedLayerReference.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("bounds"));
            selectedLayerReference.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var selectedLayerDescriptor = executeActionGet(selectedLayerReference);
            return Rect.fromDescriptor(selectedLayerDescriptor);
        };
        if (this.isGroup()) {
            executeAction(stringIDToTypeID("newPlacedLayer"), undefined, DialogModes.NO);
            var ret = getSelectedLayerBounds();
            History.undo();
            return ret;
        }
        else {
            return getSelectedLayerBounds();
        }
    };
    /**
     * is layer visible
     * 图册是否可见
     * @returns {boolean}
     */
    Layer.prototype.isVisible = function () {
        var layerReference = new ActionReference();
        layerReference.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Vsbl"));
        layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
        var descriptor = executeActionGet(layerReference);
        if (descriptor.hasKey(charIDToTypeID("Vsbl")) == false)
            return false;
        return descriptor.getBoolean(charIDToTypeID("Vsbl"));
    };
    /**
     * check layer is a group
     * 判断当前图层是一个图层组
     * @returns {boolean}
     */
    Layer.prototype.isGroup = function () {
        try {
            var layerReference = new ActionReference();
            layerReference.putIdentifier(charIDToTypeID("Lyr "), this.id);
            var descriptor = executeActionGet(layerReference);
            if (descriptor.hasKey(stringIDToTypeID("layerSection"))) {
                if (descriptor.getEnumerationValue(stringIDToTypeID("layerSection")) == stringIDToTypeID("layerSectionStart")) {
                    return true;
                }
            }
            return false;
        }
        catch (e) {
            return false;
        }
    };
    return Layer;
}());
//# sourceMappingURL=Layer.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Line = (function () {
    function Line(x, y, len, horiz) {
        this.descriptorType = charIDToTypeID("Ln  ");
        this.X = x;
        this.Y = y;
        this.length = len;
        this.horizontal = horiz;
    }
    Line.prototype.createDescriptor = function () {
        var lineDescriptor = new ActionDescriptor();
        var x1 = this.X + (this.horizontal == false ? 0.5 : 0);
        var y1 = this.Y + (this.horizontal ? 0.5 : 0);
        var x2 = x1 + (this.horizontal ? this.length : 0);
        var y2 = y1 + (this.horizontal == false ? this.length : 0);
        var p1 = new Point(x1, y1);
        var p2 = new Point(x2, y2);
        lineDescriptor.putObject(charIDToTypeID("Strt"), charIDToTypeID("Pnt "), p1.toDescriptor());
        lineDescriptor.putObject(charIDToTypeID("End "), charIDToTypeID("Pnt "), p2.toDescriptor());
        lineDescriptor.putUnitDouble(charIDToTypeID("Wdth"), charIDToTypeID("#Pxl"), 1.000000);
        return lineDescriptor;
    };
    return Line;
}());
//# sourceMappingURL=Line.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Point = (function () {
    function Point(x, y) {
        this.X = x;
        this.Y = y;
    }
    Point.prototype.toString = function () {
        return this.X + "," + this.Y;
    };
    Point.prototype.toDescriptor = function (pointType) {
        if (pointType == null)
            pointType = charIDToTypeID("#Pxl");
        var result = new ActionDescriptor();
        result.putUnitDouble(charIDToTypeID("Hrzn"), pointType, this.X);
        result.putUnitDouble(charIDToTypeID("Vrtc"), pointType, this.Y);
        return result;
    };
    return Point;
}());
//# sourceMappingURL=Point.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Rect = (function () {
    function Rect(x, y, w, h) {
        this.X = x;
        this.Y = y;
        this.width = w;
        this.height = h;
    }
    Rect.prototype.right = function () {
        return this.X + this.width;
    };
    Rect.prototype.bottom = function () {
        return this.Y + this.height;
    };
    Rect.prototype.isEmpty = function () {
        if (this.width > 0) {
            return (this.height <= 0);
        }
        return true;
    };
    Rect.prototype.size = function () {
        return new Size(this.width, this.height);
    };
    Rect.prototype.intersectsWith = function (rect) {
        return ((((rect.X < (this.X + this.width)) && (this.X < (rect.X + rect.width))) && (rect.Y < (this.Y + this.height))) && (this.Y < (rect.Y + rect.height)));
    };
    Rect.prototype.contains = function (rect) {
        return ((((this.X <= rect.X) && ((rect.X + rect.width) <= (this.X + this.width))) && (this.Y <= rect.Y)) && ((rect.Y + rect.height) <= (this.Y + this.height)));
    };
    Rect.prototype.toString = function () {
        return this.X + "," + this.Y + "," + this.width + "," + this.height;
    };
    // todo
    Rect.prototype.fixDocumentEdge = function () {
    };
    Rect.prototype.toDescriptor = function () {
        var result = new ActionDescriptor();
        result.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), this.X);
        result.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), this.Y);
        result.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), this.right());
        result.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), this.bottom());
        return result;
    };
    Rect.prototype.intersect = function (b) {
        var a = this;
        var x = Math.max(a.X, b.X);
        var num2 = Math.min((a.X + a.width), (b.X + b.width));
        var y = Math.max(a.Y, b.Y);
        var num4 = Math.min((a.Y + a.height), (b.Y + b.height));
        if ((num2 >= x) && (num4 >= y)) {
            return new Rect(x, y, num2 - x, num4 - y);
        }
        return null;
    };
    Rect.fromDescriptor = function (descriptor) {
        var boundsStringId = stringIDToTypeID("bounds");
        var rectangle = descriptor.getObjectValue(boundsStringId);
        var left = rectangle.getUnitDoubleValue(charIDToTypeID("Left"));
        var top = rectangle.getUnitDoubleValue(charIDToTypeID("Top "));
        var right = rectangle.getUnitDoubleValue(charIDToTypeID("Rght"));
        var bottom = rectangle.getUnitDoubleValue(charIDToTypeID("Btom"));
        return new Rect(left, top, (right - left), (bottom - top));
    };
    Rect.arrange = function (r1, r2, direction) {
        if (direction == 'HORIZONTAL') {
            var left, right, isIntersect;
            left = (r1.X <= r2.X) ? r1 : r2;
            right = (r1.X <= r2.X) ? r2 : r1;
            isIntersect = (left.right() < right.X) ? false : true;
            return [left, right, isIntersect];
        }
        if (direction == 'VERTICAL') {
            var top, bottom, isIntersect;
            top = (r1.Y <= r2.Y) ? r1 : r2;
            bottom = (r1.Y < r2.Y) ? r2 : r1;
            isIntersect = (top.bottom() < bottom.Y) ? false : true;
            return [top, bottom, isIntersect];
        }
    };
    Rect.fromBounds = function (bounds) {
        return new Rect(bounds[0].value, bounds[1].value, bounds[2].value - bounds[0].value, bounds[3].value - bounds[1].value);
    };
    return Rect;
}());
//# sourceMappingURL=Rect.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Rectangle = (function () {
    function Rectangle(x, y, w, h, rad) {
        this.descriptorType = charIDToTypeID("Rctn");
        this.X = x;
        this.Y = y;
        this.width = w;
        this.height = h;
        this.radius = (rad) ? rad : 0;
    }
    Rectangle.prototype.createDescriptor = function () {
        var rectangleDescriptor = new Rect(this.X, this.Y, this.width, this.height).toDescriptor();
        if (this.radius > 0) {
            rectangleDescriptor.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), this.radius);
        }
        return rectangleDescriptor;
    };
    return Rectangle;
}());
var Ellipse = (function () {
    function Ellipse(x, y, width, height) {
        this.descriptorType = charIDToTypeID("Elps");
        this.createDescriptor = Rectangle.prototype.createDescriptor;
        Rectangle.apply(this, arguments);
    }
    return Ellipse;
}());
//# sourceMappingURL=Rectangle.js.map
/**
 * Created by xiaoqiang on 2018/10/6.
 */
var Size = (function () {
    function Size(w, h) {
        this.width = w;
        this.height = h;
    }
    Size.prototype.toString = function () {
        return this.width + "," + this.height;
    };
    Size.prototype.isEmpty = function () {
        return this.width == 0 && this.height == 0;
    };
    Size.fromDescriptor = function (descriptor, ratio) {
        if (ratio == null)
            ratio = 1;
        var width = descriptor.getUnitDoubleValue(charIDToTypeID("Wdth")) * ratio;
        var height = descriptor.getUnitDoubleValue(charIDToTypeID("Hght")) * ratio;
        return new Size(width, height);
    };
    return Size;
}());
//# sourceMappingURL=Size.js.map