/**
 * Created by xiaoqiang on 2018/10/6.
 */
var fileName = 'unittest_document.js';
var current = $.fileName;
var src = current.replace(new RegExp(fileName), '');
$.evalFile(src + "../src/Document.js");
var doc = Document.add(300, 300, "test_abc");
$.writeln(doc.getName() + ' - ' + doc.getResolution());
//# sourceMappingURL=unittest_document.js.map