/**
 * Created by xiaoqiang
 * @date 2022/07/26
 * @description this is the class that you can draw shapes with
 */
import {Shape} from "./Shape";
import {Stroke} from "./Stroke";
import {SolidColor} from "./base/SolidColor";

export class Canvas {
    private shapeList: Shape[];
    private fill: SolidColor;
    private stroke: Stroke;
    private opacity: number;

    constructor() {
        this.shapeList = [];
        this.fill = SolidColor.blackColor();
        this.stroke = null;
        this.opacity = 100;
    }

    public setFillColor(color: SolidColor): void {
        this.fill = color;
    }

    public setStroke(stroke: Stroke): void {
        this.stroke = stroke;
    }

    public setOpacity(opacity: number): void {
        this.opacity = opacity;
    }

    public addShape(shape: Shape): void {
        this.shapeList.push(shape);
    }

    public addShapes(shapes: Shape[]): void {
        for (let i=0; i<shapes.length; i++) {
            this.shapeList.push(shapes[i]);
        }
    }

    public clear(): void {
        this.shapeList = [];
    }

    public paint(): void {
        if (this.shapeList.length === 0) { return; }
        const desc448 = new ActionDescriptor();
        const ref321 = new ActionReference();
        ref321.putClass(app.stringIDToTypeID("contentLayer"));
        desc448.putReference(app.charIDToTypeID("null"), ref321);

        const layerDescriptor = new ActionDescriptor();

        // fill
        const solidColorLayerDescriptor = new ActionDescriptor();
        solidColorLayerDescriptor.putObject(app.charIDToTypeID("Clr "), app.charIDToTypeID("RGBC"), this.fill.toDescriptor());
        layerDescriptor.putUnitDouble(app.charIDToTypeID("Opct"), app.charIDToTypeID("#Prc"), this.opacity);
        layerDescriptor.putObject(app.charIDToTypeID("Type"), app.stringIDToTypeID("solidColorLayer"), solidColorLayerDescriptor);

        // stroke
        if (this.stroke != null) {
            layerDescriptor.putObject(app.stringIDToTypeID("strokeStyle"), app.stringIDToTypeID("strokeStyle"), this.stroke.toDescriptor());
        }

        const first = this.shapeList[0];
        layerDescriptor.putObject(app.charIDToTypeID("Shp "), first.descriptorType, first.toDescriptor());

        desc448.putObject(app.charIDToTypeID("Usng"), app.stringIDToTypeID("contentLayer"), layerDescriptor);
        app.executeAction(app.charIDToTypeID("Mk  "), desc448, DialogModes.NO);

        for(let i = 1; i < this.shapeList.length; i++) {
            const desc453 = new ActionDescriptor();
            const ref322 = new ActionReference();
            ref322.putEnumerated( app.charIDToTypeID( "Path" ), app.charIDToTypeID( "Ordn" ), app.charIDToTypeID( "Trgt" ) );
            desc453.putReference( app.charIDToTypeID( "null" ), ref322 );
            desc453.putObject( app.charIDToTypeID( "T   " ), this.shapeList[i].descriptorType, this.shapeList[i].toDescriptor() );
            app.executeAction( app.charIDToTypeID( "AddT" ), desc453, DialogModes.NO );
        }

    }

}
