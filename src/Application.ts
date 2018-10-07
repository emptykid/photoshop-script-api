/**
 * Created by xiaoqiang on 2018/10/6.
 * Application
 * @desc  全局App对象, 对应整个PS应用程序
 * @desc_en  Global App object, map to photoshop Application
 */

class App {

    /**
     * get photoshop version number
     * 获取PS的版本号
     * @returns {number|string}
     */
    public static getVersion():string {
        return app.version;
    }

    /**
     * check current ps version is above cc2015
     * 判断当前的PS版本高于cc2015
     * @returns {boolean}
     */
    public static isAboveCC2015():boolean {
        let v = parseFloat(this.getVersion());
        return (v >= 16.0);
    }

    /**
     * open a file
     * 打开一个本地文档
     * @param path
     * @returns {Document}
     */
    public static open(path:string):Document {
        var desc437 = new ActionDescriptor();
        desc437.putPath( charIDToTypeID( "null" ), new File(path) );
        executeAction( charIDToTypeID( "Opn " ), desc437, DialogModes.NO );
        return new Document();
    }

}




