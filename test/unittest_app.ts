/**
 * Created by xiaoqiang on 2018/10/6.
 */

// some setting
let fileName = 'unittest_app.js';
let current = $.fileName;
let test = current.replace(new RegExp(fileName), '');
$.evalFile(test + './test_base.js');
$.evalFile(test + '../output/photoshop_script_api.js');

// test start
let doc = App.open(test + '/assets/document_trim.psd');
CHECK_EQ(doc.getName(), 'document_trim.psd', 'check document open');
CHECK_EQ(doc.getSize().width, 500, 'check document width');
CHECK_EQ(doc.getSize().height, 500, 'check document height');



