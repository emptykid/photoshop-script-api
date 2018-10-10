/**
 * Created by xiaoqiang on 2018/10/10.
 */


// some setting
let fileName = 'unittest_canvas.js';
let current = $.fileName;
let test = current.replace(new RegExp(fileName), '');
$.evalFile(test + './test_base.js');
$.evalFile(test + '../output/photoshop_script_api.js');

// -------------------------------------
// test start

let doc = Document.add(500, 500, "test_canvas");
let canvas = new Canvas();
canvas.fill = new Color(255, 20, 100);
canvas.addRectangle(20, 20, 100, 100, 0);
canvas.addRectangle(150, 150, 100, 100, 20);
canvas.addLine(0, 200, 500, true);
canvas.addEllipse(100, 300, 100, 100);
canvas.drawShapes();
