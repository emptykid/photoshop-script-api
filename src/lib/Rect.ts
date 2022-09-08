/**
 * Created by xiaoqiang
 * @date 2021/07/30
 * @description rect class for photoshop
 */
import {Size} from "./Size";
import {Point, UnitType} from "./Shape";

export type RectItem = {x: number; y: number; width: number; height: number}

export enum ExpandBasePoint {
    LeftTop,
    RightTop,
    RightBottom,
    LeftBottom,
    Center
}

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

    static fromDescriptor(desc: ActionDescriptor): Rect {
        const left = desc.getDouble(app.stringIDToTypeID("left"));
        const top = desc.getDouble(app.stringIDToTypeID("top"));
        const right = desc.getDouble(app.stringIDToTypeID("right"));
        const bottom = desc.getDouble(app.stringIDToTypeID("bottom"));
        return new Rect(left, top, right - left, bottom - top);
    }

    right(): number {
        return this.x + this.width;
    }

    bottom(): number {
        return this.y + this.height;
    }

    center(): Point {
        return new Point(this.x + this.width/2, this.y + this.height/2);
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

    public expand(size: number, point: ExpandBasePoint) {
        if (point === ExpandBasePoint.LeftTop) {
            this.width += size;
            this.height += size;
        } else if (point === ExpandBasePoint.RightTop) {
            this.x -= size;
            this.width += size;
            this.height += size;
        } else if (point === ExpandBasePoint.RightBottom) {
            this.x -= size;
            this.y -= size;
            this.width += size;
            this.height += size;
        } else if (point === ExpandBasePoint.LeftBottom) {
            this.y -= size;
            this.width += size;
            this.height += size;
        } else {
            this.x -= size/2;
            this.y -= size/2;
            this.width += size;
            this.height += size;
        }
    }


    toDescriptor(unitType: UnitType = UnitType.Pixel): ActionDescriptor {
        const result = new ActionDescriptor();
        result.putUnitDouble(app.charIDToTypeID("Left"), app.stringIDToTypeID(unitType), this.x);
        result.putUnitDouble(app.charIDToTypeID("Top "), app.stringIDToTypeID(unitType), this.y);
        result.putUnitDouble(app.charIDToTypeID("Rght"), app.stringIDToTypeID(unitType), this.right());
        result.putUnitDouble(app.charIDToTypeID("Btom"), app.stringIDToTypeID(unitType), this.bottom());
        return result;
    }
}
