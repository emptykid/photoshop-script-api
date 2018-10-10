/**
 * Created by xiaoqiang on 2018/10/10.
 */

class Canvas {
    shapes:any[];
    fill:Color;
    opacity:number;
    constructor() {
        this.shapes = [];
        this.fill = new Color(255, 0, 0);
        this.opacity = 100;
    }

    /**
     * add a Line shape to canvas
     * 给当前画布添加一条线段
     * @param x
     * @param y
     * @param length
     * @param horizontal
     */
    public addLine(x:number, y:number, length:number, horizontal:boolean) {
        this.shapes.push(new Line(Math.round(x), Math.round(y), Math.round(length), horizontal));
    }

    /**
     * add a rectangle to canvas
     * 给当前画布添加一个矩形
     * @param x
     * @param y
     * @param width
     * @param height
     * @param radius
     */
    public addRectangle(x:number, y:number, width:number, height:number, radius:number) {
        this.shapes.push(new Rectangle(x, y, width, height, radius));
    }

    /**
     * add a ellipse to canvas
     * 给当前画布添加一个椭圆
     * @param x
     * @param y
     * @param width
     * @param height
     */
    public addEllipse(x:number, y:number, width:number, height:number) {
        this.shapes.push(new Ellipse(Math.round(x), Math.round(y), Math.round(width), Math.round(height)));
    }


    /**
     * draw the shapes that added
     * 绘制添加的形状
     */
    public drawShapes() {
        if (this.shapes.length == 0) { return; }
        //activeDocument.suspendHistory ("Render Canvas Drawing", "OnRender.apply(this)");
        function OnRender() {
            var desc448 = new ActionDescriptor();
            var ref321 = new ActionReference();
            ref321.putClass( stringIDToTypeID( "contentLayer" ));
            desc448.putReference( charIDToTypeID( "null" ), ref321 );

            var layerDescriptor = new ActionDescriptor();

            var solidColorLayerDescriptor = new ActionDescriptor();
            solidColorLayerDescriptor.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), this.fill.toDescriptor());
            layerDescriptor.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), this.opacity);
            layerDescriptor.putObject(charIDToTypeID("Type"),stringIDToTypeID( "solidColorLayer" ), solidColorLayerDescriptor);
            layerDescriptor.putObject( charIDToTypeID( "Shp " ), this.shapes[0].descriptorType, this.shapes[0].createDescriptor());

            desc448.putObject( charIDToTypeID( "Usng" ), stringIDToTypeID( "contentLayer" ), layerDescriptor );
            executeAction( charIDToTypeID( "Mk  " ), desc448, DialogModes.NO );

            for(var i = 1; i < this.shapes.length ; i++) {
                var desc453 = new ActionDescriptor();
                var ref322 = new ActionReference();
                ref322.putEnumerated( charIDToTypeID( "Path" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );
                desc453.putReference( charIDToTypeID( "null" ), ref322 );
                desc453.putObject( charIDToTypeID( "T   " ), this.shapes[i].descriptorType, this.shapes[i].createDescriptor() );
                executeAction( charIDToTypeID( "AddT" ), desc453, DialogModes.NO );
            }

        }

        OnRender();
        this.shapes.length = 0;
    }


}
