/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Rect {
    X:number;
    Y:number;
    width:number;
    height:number;

    constructor(x:number, y:number, w:number, h:number) {
        this.X = x;
        this.Y = y;
        this.width = w;
        this.height = h;
    }

    public right():number {
        return this.X + this.width;
    }

    public bottom():number {
        return this.Y + this.height;
    }

    public isEmpty():boolean {
        if (this.width > 0) {
            return (this.height <= 0);
        }
        return true;
    }

    public size():Size {
        return new Size(this.width, this.height);
    }

    public intersectsWith(rect:Rect):boolean {
        return ((((rect.X < (this.X + this.width)) && (this.X < (rect.X + rect.width))) && (rect.Y < (this.Y + this.height))) && (this.Y < (rect.Y + rect.height)));
    }

    public contains(rect:Rect):boolean {
        return ((((this.X <= rect.X) && ((rect.X + rect.width) <= (this.X + this.width))) && (this.Y <= rect.Y)) && ((rect.Y + rect.height) <= (this.Y + this.height)));
    }

    public toString():string {
        return this.X + "," + this.Y + "," + this.width + "," + this.height;
    }

    // todo
    public fixDocumentEdge():void {

    }

    public toDescriptor():ActionDescriptor {
        var result = new ActionDescriptor();
        result.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), this.X);
        result.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), this.Y);
        result.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), this.right());
        result.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), this.bottom());
        return result;
    }

    public intersect(b:Rect):Rect {
        var a = this;
        var x = Math.max(a.X, b.X);
        var num2 = Math.min((a.X + a.width), (b.X + b.width));
        var y = Math.max(a.Y, b.Y);
        var num4 = Math.min((a.Y + a.height), (b.Y + b.height));
        if ((num2 >= x) && (num4 >= y)) {
            return new Rect(x, y, num2 - x, num4 - y);
        }
        return null;
    }

    public static fromDescriptor(descriptor:ActionDescriptor):Rect {
        var boundsStringId = stringIDToTypeID("bounds");
        var rectangle = descriptor.getObjectValue(boundsStringId);
        var left = rectangle.getUnitDoubleValue(charIDToTypeID("Left"));
        var top = rectangle.getUnitDoubleValue(charIDToTypeID("Top "));
        var right = rectangle.getUnitDoubleValue(charIDToTypeID("Rght"));
        var bottom = rectangle.getUnitDoubleValue(charIDToTypeID("Btom"));
        return new Rect(left, top, (right - left), (bottom - top));
    }

    public static arrange(r1:Rect, r2:Rect, direction:string):[Rect, Rect, boolean] {
        if (direction == 'HORIZONTAL') {
            var left, right, isIntersect;
            left = (r1.X <= r2.X)? r1 : r2;
            right = (r1.X <= r2.X)? r2 : r1;
            isIntersect = (left.right() < right.X)? false : true;
            return [left, right, isIntersect];
        }
        if (direction == 'VERTICAL') {
            var top, bottom, isIntersect;
            top = (r1.Y <= r2.Y)? r1 : r2;
            bottom = (r1.Y < r2.Y)? r2 : r1;
            isIntersect = (top.bottom() < bottom.Y)? false : true;
            return [top, bottom, isIntersect];
        }
    }

    public static fromBounds(bounds):Rect {
        return new Rect(bounds[0].value, bounds[1].value, bounds[2].value - bounds[0].value, bounds[3].value - bounds[1].value);
    }
}
