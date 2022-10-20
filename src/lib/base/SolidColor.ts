/**
 * Created by xiaoqiang
 * @date 2021/08/02
 * @description  SolidColor class
 * represent a solid color objective, easily retrieve color information from photoshop
 */

export enum ColorSpace {
    RGB = "RGB",
    HEX = "HEX",
    CMYK = "CMYK",
    HSB = "HSB"
}

export type ColorRGB = {red: number, green: number, blue: number};
export type ColorCMYK = {cyan: number, magenta: number, yellowColor: number, black: number};
export type ColorHSB = {hue: number, saturation: number, brightness: number};


export class SolidColor {
    private readonly r: number;
    private readonly g: number;
    private readonly b: number;
    private readonly a: number;

    /**
     * construct a SolidColor object with rgba color
     * @param red
     * @param green
     * @param blue
     * @param alpha
     */
    constructor(red: number, green: number, blue: number, alpha: number = 255.0) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }

    /**
     * quick create a black color object
     * @return SolidColor
     */
    public static blackColor(): SolidColor {
        return new SolidColor(0, 0, 0);
    }

    /**
     * quick create a white color object
     * @return SolidColor
     */
    public static whiteColor(): SolidColor {
        return new SolidColor(255.0, 255.0, 255.0);
    }

    /**
     * create a SolidColor object from a Descriptor
     * @param desc
     * @return SolidColor
     */
    public static fromDescriptor(desc: ActionDescriptor): SolidColor {
        const red = desc.getDouble(app.stringIDToTypeID("red"));
        const green = desc.getDouble(app.stringIDToTypeID("grain"));
        const blue = desc.getDouble(app.stringIDToTypeID("blue"));
        return new SolidColor(red, green, blue);
    }

    /**
     * create a SolidColor object from a hex color string
     * hex color string should be #aabbcc like
     * return null if hex color string invalid
     * @param hexColor
     * @return SolidColor | null
     */
    public static fromHexString(hexColor: string): SolidColor | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
        return result ? new SolidColor(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ) : null;
    }

    /**
     * create a SolidColor object with red/green/blue value
     * @param red
     * @param green
     * @param blue
     * @return SolidColor
     */
    public static fromRGB(red: number, green: number, blue: number): SolidColor {
        return new SolidColor(red, green, blue);
    }


    /**
     * convert color to hex string format
     * @param alpha where to show alpha value
     * @return string
     */
    public toHex(alpha: boolean = false): string {
        const arr = [
            SolidColor.componentToHex(this.r),
            SolidColor.componentToHex(this.g),
            SolidColor.componentToHex(this.b)
        ];
        if (alpha) {
            arr.push(SolidColor.componentToHex(this.a));
        }
        return ("#" + arr.join("")).toUpperCase();
    }

    /**
     * convert color to rgb format
     * @return ColorRGB
     */
    public toRGB(): ColorRGB {
        return {red: Math.round(this.r), green: Math.round(this.g), blue: Math.round(this.b)}
    }

    /**
     * convert color to cmyk format
     * @return ColorCMYK
     */
    public toCMYK(): ColorCMYK {
        const desc = this.changeColorSpace(ColorSpace.CMYK);
        const color = desc.getObjectValue(app.stringIDToTypeID("color"));
        return {
            cyan: Math.round(color.getDouble(app.stringIDToTypeID("cyan"))),
            magenta: Math.round(color.getDouble(app.stringIDToTypeID("magenta"))),
            yellowColor: Math.round(color.getDouble(app.stringIDToTypeID("yellowColor"))),
            black: Math.round(color.getDouble(app.stringIDToTypeID("black")))
        };
    }

    /**
     * convert color to hsb format
     * @return ColorHSB
     */
    public toHSB(): ColorHSB {
        const desc = this.changeColorSpace(ColorSpace.HSB);
        const color = desc.getObjectValue(app.stringIDToTypeID("color"));
        return {
            hue: Math.round(color.getDouble(app.stringIDToTypeID("hue"))),
            saturation: Math.round(color.getDouble(app.stringIDToTypeID("saturation"))),
            brightness: Math.round(color.getDouble(app.stringIDToTypeID("brightness")))
        };
    }

    /**
     * convert SolidColor object to ActionDescriptor
     * @return ActionDescriptor
     */
    public toDescriptor(): ActionDescriptor {
        const result = new ActionDescriptor();
        result.putDouble(app.charIDToTypeID("Rd  "), this.r);
        result.putDouble(app.charIDToTypeID("Grn "), this.g);
        result.putDouble(app.charIDToTypeID("Bl  "), this.b);
        return result;
    }

    private static componentToHex(c:number):string {
        c = Math.round(c);
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }


    private changeColorSpace(colorSpace: ColorSpace): ActionDescriptor {
        const ref1 = new ActionReference();
        ref1.putClass(app.stringIDToTypeID('application'));

        const desc = new ActionDescriptor();
        desc.putReference(app.stringIDToTypeID('null'), ref1);
        desc.putObject( app.charIDToTypeID( "Clr " ), app.charIDToTypeID( "RGBC" ), this.toDescriptor() );
        desc.putEnumerated(app.stringIDToTypeID("colorSpace"), app.stringIDToTypeID("colorSpace"), app.stringIDToTypeID(colorSpace));

        return app.executeAction(app.stringIDToTypeID('convertColorToSpace'), desc, DialogModes.NO);
    }
}
