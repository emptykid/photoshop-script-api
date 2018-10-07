/**
 * Created by xiaoqiang on 2018/10/7.
 */

// some setting
let fileName = 'unittest_selection.js';
let current = $.fileName;
let test = current.replace(new RegExp(fileName), '');
$.evalFile(test + './test_base.js');
$.evalFile(test + '../output/photoshop_script_api.js');

// test start
let bounds = new Rect(100, 100, 100, 100);
let selection = new Selection(bounds);
selection.create();
selection.fill(new Color(30, 10, 10));
CHECK_EQ(selection.bounds.size().width, 100, "create selection");
