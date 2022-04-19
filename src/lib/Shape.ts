import { Rect } from "./Rect";
import {Color} from "./Color";
import {Stroke} from "./Stroke";

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

    draw(fillColor: Color, stroke: Stroke = null, opacity: number = 100): void {
        const desc448 = new ActionDescriptor();
        const ref321 = new ActionReference();
        ref321.putClass(app.stringIDToTypeID("contentLayer"));
        desc448.putReference(app.charIDToTypeID("null"), ref321);

        const layerDescriptor = new ActionDescriptor();

        // fill
        const solidColorLayerDescriptor = new ActionDescriptor();
        solidColorLayerDescriptor.putObject(app.charIDToTypeID("Clr "), app.charIDToTypeID("RGBC"), fillColor.toDescriptor());
        layerDescriptor.putUnitDouble(app.charIDToTypeID("Opct"), app.charIDToTypeID("#Prc"), opacity);
        layerDescriptor.putObject(app.charIDToTypeID("Type"), app.stringIDToTypeID("solidColorLayer"), solidColorLayerDescriptor);

        // stroke
        if (stroke != null) {
            layerDescriptor.putObject(app.stringIDToTypeID("strokeStyle"), app.stringIDToTypeID("strokeStyle"), stroke.toDescriptor());
        }

        layerDescriptor.putObject(app.charIDToTypeID("Shp "), this.descriptorType, this.toDescriptor());

        desc448.putObject(app.charIDToTypeID("Usng"), app.stringIDToTypeID("contentLayer"), layerDescriptor);
        app.executeAction(app.charIDToTypeID("Mk  "), desc448, DialogModes.NO);
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

    toString(): string {
        return `${this.x},${this.y}`;
    }

    toDescriptor(): ActionDescriptor {
        const result = new ActionDescriptor();
        result.putUnitDouble(app.charIDToTypeID("Hrzn"), app.charIDToTypeID("#Pxl"), this.x);
        result.putUnitDouble(app.charIDToTypeID("Vrtc"), app.charIDToTypeID("#Pxl"), this.y);
        return result;
    }

}

export class Line extends Shape {
    start: Point;
    end: Point;
    width: number;

    constructor(start: Point, end: Point, width: number = 1) {
        super(app.charIDToTypeID("Ln  "));
        this.start = start;
        this.end = end;
        this.width = width;
    }

    toString(): string {
        return `[${this.start.toString()}] [${this.end.toString()}]`;
    }

    toDescriptor(): ActionDescriptor {
        const desc5 = new ActionDescriptor();
        const desc6 = new ActionDescriptor();
        desc6.putUnitDouble(app.stringIDToTypeID("horizontal"), app.stringIDToTypeID("pixelsUnit"), this.start.x);
        desc6.putUnitDouble(app.stringIDToTypeID("vertical"), app.stringIDToTypeID("pixelsUnit"), this.start.y);
        desc5.putObject(app.stringIDToTypeID("saturation"), app.stringIDToTypeID("paint"), desc6);
        const desc7 = new ActionDescriptor();
        desc7.putUnitDouble(app.stringIDToTypeID("horizontal"), app.stringIDToTypeID("pixelsUnit"), this.end.x);
        desc7.putUnitDouble(app.stringIDToTypeID("vertical"), app.stringIDToTypeID("pixelsUnit"), this.end.y);
        desc5.putObject(app.stringIDToTypeID("end"), app.stringIDToTypeID("paint"), desc7);
        desc5.putUnitDouble(app.stringIDToTypeID("width"), app.stringIDToTypeID("pixelsUnit"), this.width);
        return desc5;
    }
    
}

export class Rectangle extends Shape {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;

    constructor (x: number, y: number, width: number, height: number, radius: number = 0) {
        super(app.charIDToTypeID( "Rctn"));
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = radius;
    }

    toString(): string {
        return `x[${this.x}] y[${this.y}] width[${this.width}] height[${this.height}] raduis[${this.radius}]`;
    }

    toDescriptor(): ActionDescriptor {
        const rectangleDescriptor = new Rect(this.x, this.y, this.width, this.height).toDescriptor();
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
