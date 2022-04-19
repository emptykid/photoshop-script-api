# photoshop-script-api

## 关于此项目

Photoshop支持通过Javascript进行DOM接口交互，同时也提供了Action Descriptor的方式进行操作访问。
DOM的接口清晰易于理解使用，但是功能很少很弱，相比较AD的方式更丰富，但是学习成本非常高。

此项目针对Photoshop重新封装了Javascript的脚本API，旨在提供一种更加易用更加完整的底层接口，便于上层开发。

## 安装

这个项目是用[TypeScript](http://www.typescriptlang.org)写的，如果你了解TS并也正在使用它，你可以直接克隆此项目到你的工程中，然后直接引入对应的文件即可。

如果你使用的原生的javascript做开发，可以使用已经发布的npm包，它已经被编译成了es3代码，可以直接使用

```shell
npm install photoshop-script-api
```

在你的ExtendScript代码中，直接引入对应的文件即可

```javascript
#include "./node_modules/photoshop-script-api/dist/index.jsx"

var a = new Application();
alert(a.version());
```

## 使用介绍

### 模块

本项目封装了如下一些模块

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


### 文档相关操作 

```javascript
// 打开一个本地文件
var theApp = new Application();
theApp.open("/path/to/a/file");

// 获取当前打开的文档
var doc = Document.activeDocument();
if (doc == null) {
    alert("no doucment opened");
    return;
}
alert(doc.name());  // 文档名称
$.writeln(doc.length());    // 文档的体积
doc.trim(); // 删除透明元素
doc.close();   // 关闭文档 

// 打开一个本地的文档 (open a local document)
let doc1 = App.open(test + '/assets/document_trim.psd');
doc1.trim();  // 裁剪文档中的透明区域 (trim the transparent area)

```


### 图层相关操作

```javascript
// 获取当前选中的图层列表
var layers = Layer.getSelectedLayers();
for (var i=0; i<layers.length; i++) {
    var layer = layers[i];
    $.writeln(layer.name());    // layer name
    $.writeln(layer.index());    // layer index
}

var layer = Layer.getLayerByIndex(10);
layer.setName('an awesome name');   // 修改图层名称
var bounds = layer.getBounds();   // 获取图层尺寸
var size = bounds.size();
$.writeln(size.toString());  // 200 x 100  ( output layer size)

layer.hide();   // 隐藏图层
layer.show();   // 显示图层
layer.select(); // 选中图层
layer.toSelection();    // 根据图层创建选区
layer.rasterize();    // 栅格化图层

// 你还可以像JQuery一样进行链式调用
layer.selct().toSelection().hide();

```

### 选区操作 

```javascript
// 创建一个选区
var bounds = new Rect(100, 100, 100, 100);
var selection = new Selection(bounds);
selection.create();
```

### 画布操作 (Canvas)

// TODO
画布可以通过简单的api在文档中绘制图形 


## 关于作者
业余独立开发者，前百度资深高级工程师，熟悉软件工程，熟悉web、移动端、多媒体开发技术，热爱设计。业余开发过多款设计相关的产品，产品拥有几十万的设计师用户。下面是对应产品的网站：

[Design Mirror - 最好用的设计稿实时预览工具](http://www.psmirror.cn)

[Cutterman - 自动化切图工具](http://www.cutterman.cn)
