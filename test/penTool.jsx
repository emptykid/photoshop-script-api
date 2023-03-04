
#include "./JSON.jsx";
#include "./descriptor-info.jsx";

var ref1 = new ActionReference();
    ref1.putProperty(stringIDToTypeID('property'), stringIDToTypeID("tool"));
    ref1.putClass(stringIDToTypeID('application'))

var desc1 = executeActionGet(ref1);

var ref2 = new ActionReference();
    ref2.putClass(stringIDToTypeID('penTool'));
var desc2 = executeActionGet(ref1).getObjectValue(stringIDToTypeID('currentToolOptions'));
    desc2.putEnumerated(stringIDToTypeID("geometryToolMode"), stringIDToTypeID("geometryToolMode"), stringIDToTypeID("shape"));
    var strokeStyle = new ActionDescriptor();
        strokeStyle.putBoolean(stringIDToTypeID("fillEnabled"), false);
    var shapeStyle = new ActionDescriptor();
        shapeStyle.putObject(stringIDToTypeID("strokeStyle"), stringIDToTypeID("strokeStyle"), strokeStyle);
    desc2.putObject(stringIDToTypeID("shapeStyle"), stringIDToTypeID("shapeStyle"), shapeStyle);

desc1.putReference(stringIDToTypeID('null'), ref2),
desc1.putObject(stringIDToTypeID('to'), stringIDToTypeID('null'), desc2),
executeAction(stringIDToTypeID('set'), desc1)

/*
if (desc2.hasKey(stringIDToTypeID("geometryToolMode"))) {
    $.writeln("has key geometryToolMode")
    $.writeln(stringIDToTypeID("geometryToolMode"));
    for (var i=0; i<desc2.count;i++) {
        var typeID = desc2.getKey(i);
        $.writeln(typeID + " => " + typeIDToStringID(typeID) + " => " + desc2.getType(typeID).toString());
    }
}
*/

/*
var shapeStyle = desc2.getObjectValue(stringIDToTypeID("shapeStyle"));
var strokeStyle = shapeStyle.getObjectValue(stringIDToTypeID("strokeStyle"));
strokeStyle.putBoolean(stringIDToTypeID("fillEnabled"), false);
strokeStyle.putBoolean(stringIDToTypeID("strokeEnabled"), true);
shapeStyle.putObject(stringIDToTypeID("strokeStyle"), stringIDToTypeID("strokeStyle"), strokeStyle);
desc2.putObject(stringIDToTypeID("shapeStyle"), stringIDToTypeID("shapeStyle"), shapeStyle);
*/


/*
var descFlags = {
	reference : false,
	extended : false,
	maxRawLimit : 10000,
	maxXMPLimit : 100000,
	saveToFile: Folder.desktop.absoluteURI + '/descriptor-info-output.json'
};

var descObject = descriptorInfo.getProperties( desc2, descFlags );
// Running in ExtendScript
$.writeln(JSON.stringify(descObject, null, 4));
*/
