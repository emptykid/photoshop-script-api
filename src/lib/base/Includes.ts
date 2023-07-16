/**
 * Created by xiaoqiang
 * @date
 * @description
 */

export type FontFormat = {
    name: string;
    style: string;
    scriptName: string;
}
export enum PSLayerColor {
    none = 'none',
    red = 'red',
    orange = 'orange',
    yellowColor = 'yellowColor',
    grain = 'grain',
    blue = 'blue',
    violet = 'violet',
    gray = 'gray'
}

export enum PSColorMode {
    RGB = 'RGBColorMode',
    CMYK = 'CMYKColorMode',
    LAB = 'labColorMode',
    GRAYSCALE = 'grayscaleMode',
    INDEXED = 'indexedColorMode',
    MULTICHANNEL = 'multichannelMode',
}