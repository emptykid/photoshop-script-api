//#include "./JSON.jsx";
//#include "./descriptor-info.jsx";


/**
 * 设置裁切工具的工具栏参数
 * 限定为 宽x高x分辨率的设置
 * @param width
 * @param height
 * @param resolution
 * @param density   1:px/inch 2:px/cm
 */
function setCropToolOptions(width, height, resolution, density) {
    var ref1 = new ActionReference();
    ref1.putProperty(app.stringIDToTypeID('property'), app.stringIDToTypeID("tool"));
    ref1.putClass(app.stringIDToTypeID('application'))

    var desc1 = app.executeActionGet(ref1);

    var ref2 = new ActionReference();
    ref2.putClass(app.stringIDToTypeID('cropTool'));

    var desc2 = app.executeActionGet(ref1).getObjectValue(app.stringIDToTypeID('currentToolOptions'));

    var cropOption = desc2.getObjectValue(app.charIDToTypeID("CrpO"))

    var rate = density === 1? 1 : 2.54;
    cropOption.putEnumerated(app.stringIDToTypeID("cropAspectRatioModeKey"), app.stringIDToTypeID("cropAspectRatioModeKey"), app.stringIDToTypeID("targetSize"));
    cropOption.putInteger(app.charIDToTypeID("CrRS"), density);
    cropOption.putUnitDouble(app.charIDToTypeID("CrWV"),app.stringIDToTypeID( "pixelsUnit" ), width);
    cropOption.putUnitDouble(app.charIDToTypeID("CrHV"),app.stringIDToTypeID( "pixelsUnit" ), height);
    cropOption.putUnitDouble(app.charIDToTypeID("CrRV"),app.stringIDToTypeID( "densityUnit" ), resolution*rate*65536);

    desc2.putObject(app.charIDToTypeID("CrpO"), app.charIDToTypeID("CrpO"), cropOption);

    desc1.putReference(app.stringIDToTypeID('null'), ref2);
    desc1.putObject(app.stringIDToTypeID('to'), app.stringIDToTypeID('null'), desc2);
    executeAction(app.stringIDToTypeID('set'), desc1);

}

setCropToolOptions(150, 150, 100, 1);

/*
var ref1 = new ActionReference();
ref1.putEnumerated(stringIDToTypeID('application'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
var appDesc = executeActionGet(ref1);
var currentToolOptions = appDesc.getObjectValue(stringIDToTypeID("currentToolOptions"));

var cropOption = currentToolOptions.getObjectValue(charIDToTypeID("CrpO"));

var descFlags = {
    reference : false,
    extended : false,
    maxRawLimit : 10000,
    maxXMPLimit : 100000,
    saveToFile: Folder.desktop.absoluteURI + '/descriptor-info-output.json'
};

var descObject = descriptorInfo.getProperties( cropOption, descFlags );
// Running in ExtendScript
var output = JSON.stringify(descObject, null, 4);
output

 */
