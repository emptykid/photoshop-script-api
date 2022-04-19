/**
 * Created by xiaoqiang
 * @date 2021/08/02
 * @description  Color class
 */

export class Color  {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number = 255.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static blackColor(): Color {
        return new Color(0, 0, 0);
    }

    static whiteColor(): Color {
        return new Color(255.0, 255.0, 255.0);
    }

    toHex(): string {
        return ("#" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b)).toUpperCase();
    }

    toRgb(): string {
        return ("(" + Math.round(this.r) + "," + Math.round(this.g) + "," + Math.round(this.b) + ")");
    }

     toDescriptor(): ActionDescriptor {
        const result = new ActionDescriptor();
        result.putDouble(app.charIDToTypeID("Rd  "), this.r);
        result.putDouble(app.charIDToTypeID("Grn "), this.g);
        result.putDouble(app.charIDToTypeID("Bl  "), this.b);
        return result;
    }   

    private componentToHex(c:number):string {
        c = Math.round(c);
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}
