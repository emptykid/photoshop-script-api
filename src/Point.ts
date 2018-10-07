/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Point {
    X:number;
    Y:number;
    constructor(x:number, y:number) {
        this.X = x;
        this.Y = y;
    }
    public toString():string {
        return this.X + "," + this.Y;
    }
    public toDescriptor(pointType?:number):ActionDescriptor {
        if(pointType == null) pointType = charIDToTypeID("#Pxl");
        var result = new ActionDescriptor();
        result.putUnitDouble(charIDToTypeID("Hrzn"), pointType, this.X);
        result.putUnitDouble(charIDToTypeID("Vrtc"), pointType, this.Y);
        return result;
    }

}
