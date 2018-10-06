/**
 * Created by xiaoqiang on 2018/10/6.
 */

let fileName = 'unittest_document.js';
let current = $.fileName;
let src = current.replace(new RegExp(fileName), '');
$.evalFile(src + "../src/Document.js");

let doc = Document.add(300, 300, "test_abc");
$.writeln(doc.getName() + ' - ' + doc.getResolution());

