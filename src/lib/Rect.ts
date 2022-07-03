/**
 * Created by xiaoqiang
 * @date 2021/07/30
 * @description rect class for photoshop
 */
import {Size} from "./Size";

export type RectItem = {x: number; y: number; width: number; height: number}

export class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static fromLTRBBounds(bounds: any) {
        return new Rect(bounds.left, bounds.top, (bounds.right - bounds.left), (bounds.bottom - bounds.top));
    }

    right(): number {
        return this.x + this.width;
    }

    bottom(): number {
        return this.y + this.height;
    }

    isEmpty(): boolean {
        if (this.width > 0) {
            return (this.height <= 0);
        }
        return true;
    }

    size(): Size {
        return new Size(this.width, this.height);
    }

    toString(): string {
        return `${this.x},${this.y} ${this.width}x${this.height}`;
    }

    toJSON(): RectItem {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }

    intersectsWith(rect: Rect): boolean {
        return ((((rect.x < (this.x + this.width)) && (this.x < (rect.x + rect.width))) && (rect.y < (this.y + this.height))) && (this.y < (rect.y + rect.height)));
    }
    contains(rect: Rect): boolean {
        return ((((this.x <= rect.x) && ((rect.x + rect.width) <= (this.x + this.width))) && (this.y <= rect.y)) && ((rect.y + rect.height) <= (this.y + this.height)));
    }

    toDescriptor(): ActionDescriptor {
        var result = new ActionDescriptor();
        result.putUnitDouble(app.charIDToTypeID("Left"), app.charIDToTypeID("#Pxl"), this.x);
        result.putUnitDouble(app.charIDToTypeID("Top "), app.charIDToTypeID("#Pxl"), this.y);
        result.putUnitDouble(app.charIDToTypeID("Rght"), app.charIDToTypeID("#Pxl"), this.right());
        result.putUnitDouble(app.charIDToTypeID("Btom"), app.charIDToTypeID("#Pxl"), this.bottom());
        return result;
    }
}
