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