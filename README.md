# photoshop-script-api

[中文](./README_zh.md)

## About

When develop CEP Panels in Photoshop, we use Javascript DOM API to communicate with the host, It's easily understood and used, but insufficient interfaces offered to accomplish complex works. There is another way call "Action Descriptor" which is more powerful and comprehensive, while extremely confusing to learn and use.

This project wraps the AM codes and build a friendly use js api to offer powerful and sufficient interfaces for Photoshop plugin development.

## install

This project is written in [TypeScript](http://www.typescriptlang.org). If you use ts in your codes, just clone this project and import the source code as you want.

### Typescript

import the index.ts file in your project

```typescript
import { Document } from "./photoshop-script-api/src/index";

const doc = new Document();
$.writeln(doc.name());
```

### Javascript

In plain javascript way, you can install the npm module which has been compiled and published.

install the module from npm 

```shell
npm install photoshop-script-api
```

include the **main.js** file in your code

```javascript
#include "./node_modules/photoshop-script-api/dist/main.js"

var a = new $.Application();
alert(a.version());
```


## usages

### Classes

This module includes some Classes listed below

1. Application
2. Document
3. Layer
4. Artboard
5. History
6. Rect
7. Selection
8. Shape
9. Size
10. Color
11. Stroke
12. MetaData
13. Text

more will be added in future

in order to avoid namespace conflict, all class names are prefixed with "$", so you can use them like this

```javascript
var app = new $.Application();
```

each Class offers some useful api to make things happen, you can check out the code to get more detail.

below snippets are some simple examples to demonstrate how to use the api

### Application

Application indicates the Photoshop application itself, it offers some useful api to get the application information

```javascript
var theApp = new $.Application();

// open a file
theApp.open("/path/to/a/file");

// get the host version
theApp.getHostVersion();    // CC2022

// get the host installation path
theApp.getApplicationPath();       // /Applications/Adobe Photoshop 2022/Adobe Photoshop 2022.app

```

### Documents

Document indicates the opened document in Photoshop, it offers some useful api to get the document information

```javascript
// get current active document
var doc = $.Document.activeDocument();
if (doc == null) {
    alert("no doucment opened");
    return;
}
alert(doc.name());  // alert document name
$.writeln(doc.length());    // document size in bytes
doc.trim(); // trim document transparent area
```

### Layer

Layer indicates the layer in Photoshop, it helps you to manipulate the layer easily.

```javascript

// get selected layers
var layers = $.Layer.getSelectedLayers();
for (var i=0; i<layers.length; i++) {
    var layer = layers[i];
    $.writeln(layer.name());    // layer name
    $.writeln(layer.index());    // layer index
}

var layer = $.Layer.getLayerByIndex(10);
layer.setName('an awesome name');   // set a new name for layer
var bounds = layer.getBounds();   // get the postion & size of the layer
var size = bounds.size();
$.writeln(size.toString());  // 200 x 100  ( output layer size)

layer.hide();   // hide the layer
layer.show();   // show the layer
layer.select(); // set select the layer
layer.toSelection();    // create a selection with the layer bounds
layer.rasterize();    // rasterize the layer

// you can also use codes like jQuery
layer.selct().toSelection().hide();

```

### Selection

Selection indicates the selection in Photoshop. You can create or get the selection and manipulate it.

```javascript
// create a selection
var bounds = new $.Rect(100, 100, 100, 100);
var selection = new $.Selection(bounds);
selection.create();
```

### Canvas

Canvas makes easy to draw shapes in document

```javascript
// we create a canvas to hold shapes
var canvas = new $.Canvas();

// create a circle
var circle = new $.Circle(new $.Point(100, 100), 50);
// create a rectangle
var rect = new $.Rect(100, 100, 100, 100);
// create a line
var line = new $.Line(new $.Point(100, 100), new $.Point(200, 200));
// add shappe to canvas
canvas.addShape(circle);
canvas.addShape(rect);
canvas.addShape(line);

// we set the color of the shape
canvas.setFillColor($.SolidColor.fromHexString("#ff5c5c"));
// we paint
canvas.paint();
```

### Guide

Guide wraps the guide api in Photoshop, it helps you to create or remove guides easily.

```javascript
// create a guide
$.Guide.add({position: 10, direction: 'horizontal'});
// get all guides
var guides = $.Guide.all();
for (var i=0; i<guides.length; i++) {
    var guide = guides[i];
    $.writeln(guide.position());
    $.writeln(guide.direction());
}
```

### History

History offers some useful api to manipulate the history stack in Photoshop.

```javascript
// step backword
History.previous();
// go to the history state
History.go(3);

// save the current history state
// and do your stuff, then restore the history state
History.saveState();
// do your stuff here...
History.restoreState();

```

### Text

Text wrap a new Class to handle the hard code of ActionDescriptor to create text layer in Photoshop.

```javascript
// create a text layer in canvas
var text = new $.Text("Hello World");
text.setTextClickPoint(new $.Point(100, 100));
text.setSize(30);
text.setAlignment(TextAlignment.Right);
text.paint();
```

other classes are similar to use, you can check out the code to get more detail.

if any questions, please post an issue.

## change logs

**2022-09-14**
> photoshop-script-api@1.0.4

1. add Canvas class
2. add Guide class
3. add Text class
4. add fx modules with ColorOverlay, DropShadow, GradientFill and Stroke
5. add two tools (Move, Ruler)
6. change Color to SolidColor
7. add GradientColor support

## About Me

Ten years Software Engineer from China, former Senior Engineer of Baidu Inc. Head in web, mobile, media development, in love with design. Have several welcome products for designers in China.

[Design Mirror - The best preview tool](http://www.psmirror.cn)

[Cutterman - Assets expoter](http://www.cutterman.cn)

