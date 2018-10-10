# photoshop-script-api

## 关于此项目
Photoshop支持通过Javascript进行DOM接口交互，同时也提供了Action Descriptor的方式进行操作访问。
DOM的接口清晰易于理解使用，但是功能很少很弱，相比较AD的方式更丰富，但是学习成本非常高。
此项目针对Photoshop重新封装了Javascript的脚本API，旨在提供一种更加易用更加完整的底层接口，便于上层开发。

## About
Photoshop offers Javascript DOM API to communicate, It's easy understood and used, but insufficient interfaces offered to accomplish complex works. Also there is another way call "Action Descriptor" which is more powerful and comprehensive, but extreamly confusing.
This project aims to build a friendly use JS API to offer powerful and sufficient interfaces for Photoshop plugin develop.

## 例子介绍 (examples)

本API是用[TypeScript](https://www.tslang.cn)写的，为了更好的进行接口定义和模块化。最后通过编译发布成标准的ES5的js代码，你可以通过原生的JS进行调用，你可以参考test目录下的对应测试代码。

These API codes are written in [TypeScript](http://www.typescriptlang.org) for better modulize and testing. The code will be compile to ES5 javascript when publish. You can use pure js to call this library.

### 文档相关操作 (Documents)

```
// 创建一个新的空白文档 (Create a new document) 
let doc = Document.add(300, 300, "test_abc");
doc.resize(new Size(500, 500));   // 重新设置文档的尺寸 (resize the document)
doc.resizeCanvas(new Size(800, 800));    // 调整画布的尺寸 (resize the canvas)
let newDoc = doc.duplicate();  // 复制一份当前的文档 (duplicate current document)
newDoc.close();
doc.close();   // 关闭文档 (close the document)

// 打开一个本地的文档 (open a local document)
let doc1 = App.open(test + '/assets/document_trim.psd');
doc1.trim();  // 裁剪文档中的透明区域 (trim the transparent area)

```


### 画板、图层相关操作 (Artboards, Layers)

```
let doc1 = App.open(test + '/assets/selected_layers.psd');
let artboards = doc1.getArtboardList();   // 获取文档中的所有画板列表 (get all artboards from document)
let art = artboards[0];
alert(art.name);   // 输出画板的名字  (output artboard name)

let layers = doc1.getSelectedLayers();    // 获取当前选中的图层列表  (get all selected layers)
let layers2 = doc1.getLayersByName('Rectangle 1');   // 根据名称查找图层 (find layers by layer name)
let layer = layers[0];
layer.setName('an awesome name');   // 修改图层名称  (set a new name for layer)
let bounds = layer.getBounds();   // 获取图层的尺寸，坐标 (get the postion & size of the layer)
let size = bounds.size();
alert(size.toString());  // 输出图层的尺寸  200 x 100  ( output layer size)

layer.hide();   // 隐藏图层  (hide the layer)
layer.show();   // 显示图层  (show the layer)
layer.select(); // 设置选中此图层  (set select the layer)
layer.toSelection();    // 将此图层的区域转换成选区 (create a selection with the layer bounds)
layer.rasterize();    // 栅格化图层 (rasterize the layer)
```

### 选区操作 (Selection)

```
let bounds = new Rect(100, 100, 100, 100);
let selection = new Selection(bounds);
selection.create();
selection.fill(new Color(30, 10, 10));
```

### 画布操作 (Canvas)

// TODO
画布可以通过简单的api在文档中绘制图形 (Canvas makes easy to draw shapes in document)


## 关于作者
业余独立开发者，前百度资深高级工程师，熟悉软件工程，熟悉web、移动端、多媒体开发技术，热爱设计。业余开发过多款设计相关的产品，产品拥有几十万的设计师用户。下面是对应产品的网站：

[Design Mirror - 最好用的设计稿实时预览工具](http://www.psmirror.cn)

[Cutterman - 自动化切图工具](http://www.cutterman.cn)

## About Me
Ten years Softerware Engineer from China, former Senior Engineer of Baidu Inc. Head in web, mobile, media development, in love with design. Have several welcome products for designers in China.

[Design Mirror - The best preview tool](http://www.psmirror.cn)

[Cutterman - Assets expoter](http://www.cutterman.cn)

