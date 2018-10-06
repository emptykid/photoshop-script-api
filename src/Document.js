/**
 * Created by xiaoqiang on 2018/10/6.
 * Document
 * @desc 一个PSD文档对象
 * @desc_en A PSD Document Object
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
     * @returns {string}
     */
    Document.prototype.getResolution = function () {
        return this.getProperty('Rslt');
    };
    // TODO
    Document.prototype.getSize = function () {
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