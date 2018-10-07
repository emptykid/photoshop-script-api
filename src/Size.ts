/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Size {
    width:number;
    height:number;
    constructor(w:number, h:number) {
        this.width = w;
        this.height = h;
    }

    public toString():string {
        return this.width + "," + this.height;
    }

    public isEmpty():boolean {
        return this.width == 0 && this.height == 0;
    }

    public static fromDescriptor(descriptor:ActionDescriptor, ratio:number) {
        if (ratio == null) ratio = 1;
        var width = descriptor.getUnitDoubleValue(charIDToTypeID("Wdth")) * ratio;
        var height = descriptor.getUnitDoubleValue(charIDToTypeID("Hght")) * ratio;
        return new Size(width, height);
    }

}
