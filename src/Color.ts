/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Color {
    R:number;
    G:number;
    B:number;
    A:number = 255.0;
    constructor(r:number, g:number, b:number) {
        this.R = r;
        this.G = g;
        this.B = b;
    }

    public Hex():string {
        return ("#" + this.componentToHex(this.R) + this.componentToHex(this.G) + this.componentToHex(this.B)).toUpperCase();
    }

    public RGB():string {
        return ("(" + Math.round(this.R) + "," + Math.round(this.G) + "," + Math.round(this.B) + ")");
    }

    public toString(ColorType:string):string {
        if(typeof ColorType == "undefined") ColorType = "";
        if(ColorType == "RGB") return this.RGB();
        else if(ColorType == "HEX") return this.Hex();
        else return (this.Hex() + " / " + this.RGB());
    }

    public toSolidColor():any {
        let rgb = new RGBColor();
        rgb.blue = this.B;
        rgb.green = this.G;
        rgb.red = this.R;
        let s = new SolidColor();
        s.rgb = rgb;
        return s;
    }

    public componentToHex(c:number):string {
        c = Math.round(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    public toDescriptor():ActionDescriptor {
        var result = new ActionDescriptor();
        result.putDouble(charIDToTypeID("Rd  "), this.R);
        result.putDouble(charIDToTypeID("Grn "), this.G);
        result.putDouble(charIDToTypeID("Bl  "), this.B);
        return result;
    }

    public static fromDescriptor = function (descriptor):Color {
        var r = descriptor.getDouble(charIDToTypeID("Rd  "));
        var g = descriptor.getDouble(charIDToTypeID("Grn "));
        var b = descriptor.getDouble(charIDToTypeID("Bl  "));
        return new Color(r, g, b);
    };

    public static fromHex = function(hexString):Color {
        var a = hexString.substring(0, 2);
        var b = hexString.substring(2, 4);
        var c = hexString.substring(4, 6);
        return new Color(parseInt('0x' + a), parseInt('0x' + b), parseInt('0x' + c));
    }
}
