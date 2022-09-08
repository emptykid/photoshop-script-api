import { Rect } from "./Rect";
import {Stroke} from "./Stroke";
import {SolidColor} from "./base/SolidColor";
import {Layer} from "./Layer";

export enum UnitType {
    Pixel = "pixelsUnit",
    Percent = "percentUnit",
    Point = "pointsUnit",
    Distance = "distanceUnit"
}

export class Shape {
    descriptorType: number;

    constructor(descriptorType: number) {
        this.descriptorType = descriptorType;
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }

    toDescriptor(): ActionDescriptor {
        throw new Error("Method not implemented.");
    }

    draw(fillColor: SolidColor, stroke: Stroke = null, opacity: number = 100, toLayer: number = 0): Layer {
        const desc448 = new ActionDescriptor();
        const ref321 = new ActionReference();
        ref321.putClass(app.stringIDToTypeID("contentLayer"));
        desc448.putReference(app.charIDToTypeID("null"), ref321);

        const layerDescriptor = new ActionDescriptor();

        const solidColorLayerDescriptor = new ActionDescriptor();
        solidColorLayerDescriptor.putObject(app.charIDToTypeID("Clr "), app.charIDToTypeID("RGBC"), fillColor.toDescriptor());
        layerDescriptor.putObject(app.charIDToTypeID("Type"), app.stringIDToTypeID("solidColorLayer"), solidColorLayerDescriptor);
        layerDescriptor.putUnitDouble(app.charIDToTypeID("Opct"), app.charIDToTypeID("#Prc"), opacity);

        // stroke
        if (stroke != null) {
            layerDescriptor.putObject(app.stringIDToTypeID("strokeStyle"), app.stringIDToTypeID("strokeStyle"), stroke.toDescriptor());
        }

        layerDescriptor.putObject(app.charIDToTypeID("Shp "), this.descriptorType, this.toDescriptor());

        desc448.putObject(app.charIDToTypeID("Usng"), app.stringIDToTypeID("contentLayer"), layerDescriptor);
        if (toLayer != 0) {
            desc448.putInteger(app.stringIDToTypeID( "layerID" ), toLayer);
        }
        app.executeAction(app.charIDToTypeID("Mk  "), desc448, DialogModes.NO);

        return new Layer(app.activeDocument.activeLayer.id);
    }

}

export class Point extends Shape {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        super(app.stringIDToTypeID("point"));
        this.x = x;
        this.y = y;
    }

    static fromDescriptor(desc: ActionDescriptor): Point {
        const x = desc.getDouble(app.stringIDToTypeID("horizontal"));
        const y = desc.getDouble(app.stringIDToTypeID("vertical"));
        return new Point(x, y);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    toDescriptor(unitType: UnitType = UnitType.Pixel): ActionDescriptor {
        const result = new ActionDescriptor();
        result.putUnitDouble(app.charIDToTypeID("Hrzn"), app.stringIDToTypeID(unitType), this.x);
        result.putUnitDouble(app.charIDToTypeID("Vrtc"), app.stringIDToTypeID(unitType), this.y);
        return result;
    }

}

export class Line extends Shape {
    private start: Point;
    private end: Point;
    private readonly width: number;
    private enableArrowStart: boolean;
    private enableArrowEnd: boolean;
    private arrowWidth: number = 10;
    private arrowLength: number = 10;
    private arrowConcavity: number = 0;

    constructor(start: Point, end: Point, width: number = 2) {
        super(app.charIDToTypeID("Ln  "));
        this.start = start;
        this.end = end;
        this.width = width;
        this.enableArrowStart = false;
        this.enableArrowEnd = false;
    }

    public enableArrow(start: boolean, end: boolean, width: number = 10, length: number = 10, concavity: number = 0) {
        this.enableArrowStart = start;
        this.enableArrowEnd = end;
        if (start || end) {
            this.arrowConcavity = concavity;
            this.arrowWidth = width;
            this.arrowLength = length;
        }
    }

    public toString(): string {
        return `[${this.start.toString()}] [${this.end.toString()}]`;
    }

    public toDescriptor(): ActionDescriptor {
        const desc5 = new ActionDescriptor();
        const desc6 = new ActionDescriptor();
        desc6.putUnitDouble(app.stringIDToTypeID("horizontal"), app.stringIDToTypeID("distanceUnit"), this.start.x);
        desc6.putUnitDouble(app.stringIDToTypeID("vertical"), app.stringIDToTypeID("distanceUnit"), this.start.y);
        desc5.putObject(app.stringIDToTypeID("saturation"), app.stringIDToTypeID("paint"), desc6);
        const desc7 = new ActionDescriptor();
        desc7.putUnitDouble(app.stringIDToTypeID("horizontal"), app.stringIDToTypeID("distanceUnit"), this.end.x);
        desc7.putUnitDouble(app.stringIDToTypeID("vertical"), app.stringIDToTypeID("distanceUnit"), this.end.y);
        desc5.putObject(app.stringIDToTypeID("end"), app.stringIDToTypeID("paint"), desc7);
        desc5.putUnitDouble(app.stringIDToTypeID("width"), app.stringIDToTypeID("pixelsUnit"), this.width);

        if (this.enableArrowStart) {
            const desc1462 = new ActionDescriptor();
            desc1462.putDouble(app.stringIDToTypeID( "width" ) , this.arrowWidth );
            desc1462.putDouble( app.stringIDToTypeID( "length" ), this.arrowLength );
            desc1462.putUnitDouble( app.stringIDToTypeID( "concavity" ), app.stringIDToTypeID( "percentUnit" ), this.arrowConcavity );
            desc1462.putBoolean( app.stringIDToTypeID( "on" ), true );
            desc5.putObject( app.stringIDToTypeID( "startArrowhead" ), app.stringIDToTypeID( "arrowhead" ), desc1462 );
        }
        if (this.enableArrowEnd) {
            const desc1462 = new ActionDescriptor();
            desc1462.putDouble(app.stringIDToTypeID( "width" ) , this.arrowWidth );
            desc1462.putDouble( app.stringIDToTypeID( "length" ), this.arrowLength );
            desc1462.putUnitDouble( app.stringIDToTypeID( "concavity" ), app.stringIDToTypeID( "percentUnit" ), this.arrowConcavity );
            desc1462.putBoolean( app.stringIDToTypeID( "on" ), true );
            desc5.putObject( app.stringIDToTypeID( "endArrowhead" ), app.stringIDToTypeID( "arrowhead" ), desc1462 );
        }

        return desc5;
    }
    
}

export class Rectangle extends Shape {
    radius: number;
    rect: Rect;

    constructor (rect: Rect, radius: number = 0) {
        super(app.charIDToTypeID( "Rctn"));
        this.rect = rect;
        this.radius = radius;
    }

    toString(): string {
        return `${this.rect.toString()} radius[${this.radius}]`;
    }

    toDescriptor(): ActionDescriptor {
        const rectangleDescriptor = this.rect.toDescriptor();
        if(this.radius > 0) {
            rectangleDescriptor.putUnitDouble( app.charIDToTypeID( "Rds " ), app.charIDToTypeID( "#Pxl" ), this.radius);
        }
        return rectangleDescriptor
    }

}


export class Ellipse extends Shape {
    rect: Rect;

    constructor(rect: Rect) {
        super(app.stringIDToTypeID( "ellipse" ));
        this.rect = rect;
    }

    toString(): string {
        return '';
    }

    toDescriptor(): ActionDescriptor {
        return this.rect.toDescriptor();
    }

}

export class Circle extends Shape {
    private rect: Rect;
    constructor(center: Point, radius: number) {
        super(app.stringIDToTypeID( "ellipse" ));
        this.rect = new Rect(center.x - radius, center.y - radius, 2*radius, 2*radius);
    }

    toString(): string {
        return super.toString();
    }

    toDescriptor(): ActionDescriptor {
        return this.rect.toDescriptor();
    }
}


export class Triangle extends Shape {
    private rect: Rect;
    private readonly radius: number;
    constructor(bounds: Rect, radius: number = 0) {
        super(app.stringIDToTypeID( "triangle" ));
        this.rect = bounds;
        this.radius = radius;
    }

    toString(): string {
        return this.rect.toString();
    }

    toDescriptor(): ActionDescriptor {
        const desc262 = new ActionDescriptor();
        desc262.putInteger( app.stringIDToTypeID( "keyOriginType" ), 7 );
        desc262.putInteger( app.stringIDToTypeID( "keyOriginPolySides" ), 3 );
        desc262.putDouble( app.stringIDToTypeID( "keyOriginPolyPixelHSF" ), 1.000000 );
        desc262.putInteger(app.stringIDToTypeID( "sides" ) , 3 );
        desc262.putUnitDouble(app.stringIDToTypeID( "polygonCornerRadius" ) ,app.stringIDToTypeID( "distanceUnit" ) , this.radius );
        desc262.putObject( app.stringIDToTypeID( "keyOriginShapeBBox" ), app.stringIDToTypeID( "classFloatRect" ), this.rect.toDescriptor());

        const desc279 = new ActionDescriptor();
            desc279.putDouble(app.stringIDToTypeID( "xx" ) , 1 );
            desc279.putDouble(app.stringIDToTypeID( "xy" ) , 0 );
            desc279.putDouble(app.stringIDToTypeID( "yx" ) , 0 );
            desc279.putDouble(app.stringIDToTypeID( "yy" ) , 1 );
            desc279.putDouble(app.stringIDToTypeID( "tx" ) , 0 );
            desc279.putDouble(app.stringIDToTypeID( "ty" ) , 0 );
        desc262.putObject( app.stringIDToTypeID( "transform" ), app.stringIDToTypeID( "transform" ), desc279 );

        const corners = [
            {key: "rectangleCornerA", point: new Point(this.rect.x, this.rect.y)},
            {key: "rectangleCornerB", point: new Point(this.rect.right(), this.rect.y)},
            {key: "rectangleCornerC", point: new Point(this.rect.right(), this.rect.bottom())},
            {key: "rectangleCornerD", point: new Point(this.rect.x, this.rect.bottom())},
        ]
        const targetKeys = ["keyOriginBoxCorners", "keyOriginPolyPreviousTightBoxCorners", "keyOriginPolyTrueRectCorners"];
        for (let j=0; j<targetKeys.length; j++) {
            const target = targetKeys[j];

            const desc263 = new ActionDescriptor();
            for (let i=0; i<corners.length; i++) {
                const corner = corners[i];
                const desc264 = new ActionDescriptor();
                desc264.putDouble( app.stringIDToTypeID( "horizontal" ), corner.point.x );
                desc264.putDouble( app.stringIDToTypeID( "vertical" ), corner.point.y );
                desc263.putObject( app.stringIDToTypeID( corner.key ), app.stringIDToTypeID( "paint" ), desc264 );
            }

            desc262.putObject( app.stringIDToTypeID(target), app.stringIDToTypeID( "null" ), desc263 );
        }

        return desc262;
    }

}
