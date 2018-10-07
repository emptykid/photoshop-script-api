/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Rectangle {
    X:number;
    Y:number;
    width:number;
    height:number;
    radius:number;
    descriptorType:number = charIDToTypeID( "Rctn");
    constructor(x:number, y:number, w:number, h:number, rad?:number) {
        this.X = x;
        this.Y = y;
        this.width = w;
        this.height = h;
        this.radius = (rad)? rad : 0;
    }

    public createDescriptor():ActionDescriptor {
        var rectangleDescriptor = new Rect(this.X, this.Y, this.width, this.height).toDescriptor();
        if(this.radius > 0) {
            rectangleDescriptor.putUnitDouble( charIDToTypeID( "Rds " ), charIDToTypeID( "#Pxl" ), this.radius);
        }
        return rectangleDescriptor;
    }
}


class Ellipse {
    descriptorType:number = charIDToTypeID("Elps");
    createDescriptor:Function = Rectangle.prototype.createDescriptor;
    constructor(x:number, y:number, width:number, height:number) {
        Rectangle.apply(this, arguments);
    }
}
