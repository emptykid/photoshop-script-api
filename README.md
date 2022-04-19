# photoshop-script-api

[中文](./README_zh.md)

## About

When develop CEP Panels in Photoshop, we use Javascript DOM API to communicate with the host, It's easily understood and used, but insufficient interfaces offered to accomplish complex works. There is another way call "Action Descriptor" which is more powerful and comprehensive, but extremely confusing to learn and use.

This project wraps the AM codes and build a friendly use js api to offer powerful and sufficient interfaces for Photoshop plugin develop.

## install

This project is written in [TypeScript](http://www.typescriptlang.org). If you use ts in your codes, just clone this project and import the source code as you want.

In plain javascript way, you can install the npm module which has been compiled and published.

install the module from npm 

```shell
npm install photoshop-script-api
```

include the **index.jsx** file in your code

```javascript
#include "./node_modules/photoshop-script-api/dist/index.jsx"

var a = new Application();
alert(a.version());
```


## usages

### Classes

This module includes some Classes as below

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
13. ...

more will be adding in future

each Class offers some useful api to make things happen, you can check out the code to get more detail.

### Application

```javascript
// open a file
var theApp = new Application();
theApp.open("/path/to/a/file");
```

### Documents

```javascript
// get current active document
var doc = Document.activeDocument();
if (doc == null) {
    alert("no doucment opened");
    return;
}
alert(doc.name());  // alert document name
$.writeln(doc.length());    // document size in bytes
doc.trim(); // trim document transparent area
```

### Layers

```javascript

// get selected layers
var layers = Layer.getSelectedLayers();
for (var i=0; i<layers.length; i++) {
    var layer = layers[i];
    $.writeln(layer.name());    // layer name
    $.writeln(layer.index());    // layer index
}

var layer = Layer.getLayerByIndex(10);
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

```javascript
// create a selection
var bounds = new Rect(100, 100, 100, 100);
var selection = new Selection(bounds);
selection.create();
```

### Canvas

// TODO
Canvas makes easy to draw shapes in document

## About Me

Ten years Software Engineer from China, former Senior Engineer of Baidu Inc. Head in web, mobile, media development, in love with design. Have several welcome products for designers in China.

[Design Mirror - The best preview tool](http://www.psmirror.cn)

[Cutterman - Assets expoter](http://www.cutterman.cn)

