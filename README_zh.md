# photoshop-script-api

## 关于此项目

Photoshop支持通过Javascript进行DOM接口交互，同时也提供了Action Descriptor的方式进行操作访问。
DOM的接口清晰易于理解使用，但是功能很少很弱，相比较AD的方式更丰富，但是学习成本非常高。

此项目针对Photoshop重新封装了Javascript的脚本API，旨在提供一种更加易用更加完整的底层接口，便于上层开发。

## 安装

这个项目是用[TypeScript](http://www.typescriptlang.org)写的，如果你了解TS并也正在使用它，你可以直接克隆此项目到你的工程中，然后直接引入对应的文件即可。

### Typescript

在你的工程中导入 index.ts 

```typescript
import { Document } from "./photoshop-script-api/src/index";

const doc = new Document();
$.writeln(doc.name());
```


### Javascript

如果你使用的原生的javascript做开发，可以使用已经发布的npm包，它已经被编译成了es3代码，可以直接使用

```shell
npm install photoshop-script-api
```

在你的ExtendScript代码中，直接引入对应的文件即可

```javascript
#include "./node_modules/photoshop-script-api/dist/main.js"

var a = new $.Application();
alert(a.version());
```


## 使用方法

### 模块

本项目封装了如下一些模块，用于提供Photoshop的底层接口

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

每个模块提供了许多的Api方便使用，绝大多数的Api封装的是Action Manager代码，性能更优。更多的功能在持续添加当中。

为了避免命名空间冲突，所有的模块都是以"$"开头，所以你可以直接使用

```javascript
var app = new $.Application();
```

每个模块都提供了许多常用的api，你可以查看源码来了解更多的细节。

下面的代码片段向你展示如何来使用这些模块

### Application

Application 表示当前Photoshop宿主对象，你可以通过它获取到当前宿主的一些信息。

```javascript
var theApp = new $.Application();

// 打开一个文件
theApp.open("/path/to/a/file");

// 获取当前宿主的版本
theApp.getHostVersion();    // CC2022

// 获取当前素宿主的安装路径
theApp.getApplicationPath();       // /Applications/Adobe Photoshop 2022/Adobe Photoshop 2022.app

```

### Documents

Document 表示当前打开的PSD文档，你可以通过它来获取当前文档的信息，以及操作它。

```javascript
// 获取当前打开的文档
var doc = $.Document.activeDocument();
if (doc == null) {
    alert("no doucment opened");
    return;
}
alert(doc.name());  // 输出文档的名称
$.writeln(doc.length());    // 文档的体积
doc.trim(); // 裁切文档编译透明像素
```

### Layer

Layer 代表了图层对象，是一个非常常用和重要的目标对象，里头封装了非常多图层操作相关的方法。

```javascript

// 获取当前选中的图层
var layers = $.Layer.getSelectedLayers();
for (var i=0; i<layers.length; i++) {
    var layer = layers[i];
    $.writeln(layer.name());    // layer name
    $.writeln(layer.index());    // layer index
}

var layer = $.Layer.getLayerByIndex(10);
layer.setName('an awesome name');   // 设置图层名称
var bounds = layer.getBounds();   // 获取图层的位置和大小
var size = bounds.size();
$.writeln(size.toString());  // 200 x 100  ( output layer size)

layer.hide();   // hide the layer
layer.show();   // show the layer
layer.select(); // set select the layer
layer.toSelection();    // create a selection with the layer bounds
layer.rasterize();    // rasterize the layer

// 你还可以像使用jQuery一样的链式调用来使用他们
layer.selct().toSelection().hide();

```

### Selection

Selection 表示当前的选区对象，你可以通过它来创建一个选区，获取当前选区的一些信息

```javascript
// create a selection
var bounds = new $.Rect(100, 100, 100, 100);
var selection = new $.Selection(bounds);
selection.create();
```

### Canvas

Canvas 画布对象，你可以通过它来很方便的在Ps中进行画图。

```javascript
// 创建一个空的画布
var canvas = new $.Canvas();

// 创建一个圆形
var circle = new $.Circle(new Point(100, 100), 50);
// 创建一个矩形
var rect = new $.Rect(100, 100, 100, 100);
// 一条线
var line = new $.Line(new Point(100, 100), new Point(200, 200));
// 把这些图形添加到画布上
canvas.add(circle);
canvas.add(rect);
canvas.add(line);

// 设置画布的填充颜色
canvas.setFillColor($.SolidColor.fromHexString("#ff5c5c"));
// 开始绘制
canvas.paint();
```

### Guide

Guide 是参考线对象，可以很方便的去操控Ps中的参考线

```javascript
// 添加一条参考线
$.Guide.add({position: 10, direction: 'horizontal'});
// 获取当前所有的参考线
var guides = $.Guide.all();
for (var i=0; i<guides.length; i++) {
    var guide = guides[i];
    $.writeln(guide.position());
    $.writeln(guide.direction());
}
```

### History

History 表示Ps中的历史面板，提供了一些好用的方法来操控历史对象

```javascript
// 回退一步
History.previous();
// 跳到指定的历史步骤
History.go(3);

// 你可以很方便的保存当前的状态，再进行一些复杂的操作之后，恢复回来
History.saveState();
// do your stuff here...
History.restoreState();

```

### Text

可以通过此对象，非常方便的在Ps中读取和创建文字图层，设置图层的样式等操作

```javascript
// 用简单的代码来创建一个文字图层
var text = new $.Text("Hello World");
text.setTextClickPoint(new $.Point(100, 100));
text.setSize(30);
text.setAlignment(TextAlignment.Right);
text.paint();
```

其它的模块的用法类似，请参考代码进行使用。

如有遇到问题，请提issue，或者加入微信群交流：

![微信群](https://blog.cutterman.cn/assets/img/wx-group.jpg)

## 更新日志

**2022-09-14**
> photoshop-script-api@1.0.4

1. 添加Canvas, Guide, Text模块
2. 添加图层效果 ColorOverlay, DropShadow, GradientFill and Stroke
3. 添加了两个工具 (Move, Ruler)
4. 修改 Color 为 SolidColor
5. 添加了 GradientColor 支持

## 关于作者
业余独立开发者，前百度资深高级工程师，熟悉软件工程，熟悉web、移动端、多媒体开发技术，热爱设计。业余开发过多款设计相关的产品，产品拥有几十万的设计师用户。下面是对应产品的网站：

[Design Mirror - 最好用的设计稿实时预览工具](http://www.psmirror.cn)

[Cutterman - 自动化切图工具](http://www.cutterman.cn)
