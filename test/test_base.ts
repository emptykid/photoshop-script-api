/**
 * Created by xiaoqiang on 2018/10/6.
 */

function CHECK_EQ(a, b, text) {
    var result = ''; (a === b)? '' : '';
    if (a === b) {
        result = '[SUCCESS]';
    } else {
        result = '[FAILED] ORIGIN['+a+'] EXPECT[' + b + ']';
    }
    $.writeln(`TEST ${text} ${result}`);
}

function EVAL_SRC (dir) {
    $.evalFile(dir + "Application.js");
    $.evalFile(dir + "Color.js");
    $.evalFile(dir + "Layer.js");
    $.evalFile(dir + "Line.js");
    $.evalFile(dir + "Point.js");
    $.evalFile(dir + "Rect.js");
    $.evalFile(dir + "Rectangle.js");
    $.evalFile(dir + "Size.js");
    $.evalFile(dir + "Document.js");
}

function EVAL_FILES(dir) {
    var files = [];
    var ext  = '*.js';
    var folder = new Folder(dir);
    if (folder.exists) {
        files = files.concat(folder.getFiles(ext));
    }

    for (var i = 0; i < files.length; i++) {
        $.writeln(files[i]);
        $.evalFile(files[i]);
        $.sleep(300);
    }
    $.writeln('eval file complete');
}