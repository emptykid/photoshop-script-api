/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description represent a width & height
 */


export class Size {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    toString(): string {
        return `${this.width},${this.height}`;
    }

    isEmpty(): boolean {
        return this.width === 0 && this.height === 0;
    }
}
