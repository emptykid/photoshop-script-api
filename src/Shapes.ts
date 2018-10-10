/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Line {
    X:number;
    Y:number;
    length:number;
    horizontal:boolean;
    descriptorType:number = charIDToTypeID("Ln  ");
    constructor(x:number, y:number, len:number, horiz:boolean) {
        this.X = x;
        this.Y = y;
        this.length = len;
        this.horizontal = horiz;
    }

    public createDescriptor():ActionDescriptor {
        var lineDescriptor = new ActionDescriptor();

        var x1:number = this.X + (this.horizontal == false ? 0.5 : 0);
        var y1:number = this.Y + (this.horizontal ? 0.5 : 0);

        var x2:number = x1 + (this.horizontal ? this.length : 0);
        var y2:number = y1 + (this.horizontal == false ? this.length : 0);

        let p1:Point = new Point(x1, y1);
        let p2:Point = new Point(x2, y2);
        lineDescriptor.putObject( charIDToTypeID( "Strt" ), charIDToTypeID( "Pnt " ), p1.toDescriptor());
        lineDescriptor.putObject( charIDToTypeID( "End " ), charIDToTypeID( "Pnt " ), p2.toDescriptor());
        lineDescriptor.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Pxl" ), 1.000000 );

        return lineDescriptor;
    }

};

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
