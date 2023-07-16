/**
 * 这个脚本负责批量将png文件转为CMYK格式，并设置为单黑模式（即C=0, M=0, Y=0, K=100）。
 * 此脚本仅提供给作业帮智能图书二维码项目使用，其他项目请勿使用。
 * 
 * 使用方法：
 * 1. 安装photoshop
 * 2. 打开photoshop, 菜单栏->文件->脚本->浏览，选择本文件
 * 3. 在弹出的对话框中选择需要处理的png文件，可以批量选择，只支持png格式图片
 * 4. 等待处理完成，处理完成后会弹出提示框
 * 5. 处理完成的图片保存在原文件夹下的output文件夹中，以jpg格式结尾 
 * 
 * 注意事项：
 * 1. 请勿在处理过程中打开其他文件，否则会导致处理失败
 * 2. 请勿在处理过程中关闭photoshop，否则会导致处理失败
 * 3. 请勿在处理过程中进行其他操作，否则会导致处理失败
 * 
 * 如果遇到使用问题，请联系 zhengqianglong@zuoyebang.com
 * 
 * @author xiaoqiang
 * @date   2023-05-29
 */

// 1. open the png image
function selectFiles() {
    return File.openDialog("选择需要处理的png文件", "*.png", true);
}

// 2. convert the color mode to cmyk
function toCMYK() {
    var desc1 = new ActionDescriptor();
    desc1.putClass( stringIDToTypeID( "to" ), stringIDToTypeID( "CMYKColorMode" ) );
    executeAction( stringIDToTypeID( "convertMode" ), desc1, DialogModes.NO );
}
// 3. remove all cmy colors and set k = 100
function threshold() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass( stringIDToTypeID( "adjustmentLayer" ) );
    desc1.putReference( stringIDToTypeID( "null" ), ref1 );
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    desc3.putInteger( stringIDToTypeID( "level" ), 128 );
    desc2.putObject( stringIDToTypeID( "type" ), stringIDToTypeID( "thresholdClassEvent" ), desc3 );
    desc1.putObject( stringIDToTypeID( "using" ), stringIDToTypeID( "adjustmentLayer" ), desc2 );
    executeAction( stringIDToTypeID( "make" ), desc1, DialogModes.NO );
}

// 4. save the image as jpg
function save(filename) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putInteger( stringIDToTypeID( "extendedQuality" ), 12 );
    desc2.putEnumerated( stringIDToTypeID( "matteColor" ), stringIDToTypeID( "matteColor" ), stringIDToTypeID( "none" ) );
    desc1.putObject( stringIDToTypeID( "as" ), stringIDToTypeID( "JPEG" ), desc2 );
    desc1.putPath( stringIDToTypeID( "in" ), new File( filename ) );
    desc1.putInteger( stringIDToTypeID( "documentID" ), app.activeDocument.id);
    desc1.putBoolean( stringIDToTypeID( "copy" ), true );
    desc1.putBoolean( stringIDToTypeID( "lowerCase" ), true );
    desc1.putEnumerated( stringIDToTypeID( "saveStage" ), stringIDToTypeID( "saveStageType" ), stringIDToTypeID( "saveSucceeded" ) );
    executeAction( stringIDToTypeID( "save" ), desc1, DialogModes.NO );
}

// 5. close the image
function close() {
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated( stringIDToTypeID( "saving" ), stringIDToTypeID( "yesNo" ), stringIDToTypeID( "no" ) );
    desc1.putInteger( stringIDToTypeID( "documentID" ), app.activeDocument.id);
    desc1.putBoolean( stringIDToTypeID( "forceNotify" ), true );
    executeAction( stringIDToTypeID( "close" ), desc1, DialogModes.NO );
}

// 6. make output folder
function makeOutputFolder(folder) {
    var outputFolder = new Folder(folder + "/output");
    if (!outputFolder.exists) {
        outputFolder.create();
    }
    return outputFolder;
}

// 7. main function
function main() {
    var files = selectFiles();
    for (var i=0; i<files.length; i++) {
        $.writeln(files[i]);
        var f = new File(files[i]);
        var folder = f.parent;
        var output = makeOutputFolder(folder.absoluteURI);
        var filename = f.name;
        app.open(files[i]);
        toCMYK();
        threshold();
        var filename = filename.toString().replace(".png", ".jpg");
        save(output.absoluteURI + "/" + filename);
        close();
    }
    alert("处理完成" + files.length + "张图片，图片保存在output文件夹中，以jpg格式结尾。");
}

main();