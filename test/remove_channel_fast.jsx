
#include "./JSON.jsx";
#include "./descriptor-info.jsx";

var descFlags = {
    reference : false,
    extended : false,
    maxRawLimit : 10000,
    maxXMPLimit : 100000,
    saveToFile: Folder.desktop.absoluteURI + '/descriptor-info-output1.json'
};

var start = (new Date()).getTime();

var documentReference = new ActionReference();
documentReference.putProperty(app.charIDToTypeID("Prpr"), app.stringIDToTypeID("itemIndex"));
documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
var documentDescriptor = app.executeActionGet(documentReference);
var docIndex = documentDescriptor.getInteger(app.stringIDToTypeID("itemIndex"));


var desc1 = new ActionDescriptor();
var list1 = new ActionList();

var doc = app.activeDocument;
var channels = doc.channels;
var length = channels.length;
var deleteCount = 0;
for (var i= 1; i<=length; i++) {
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Chnl"), i);
    ref.putIndex(charIDToTypeID("Dcmn"), docIndex);
    var desc = app.executeActionGet(ref);
    var channelName = desc.getString(charIDToTypeID("ChnN"));
    if (!/(Red)|(Green)|(Blue)|(红)|(绿)|(蓝)/.test(channelName)) {
        var ref1 = new ActionReference();
        ref1.putName( app.stringIDToTypeID( "channel" ), channelName);
        list1.putReference( ref1 );
        deleteCount++;
    }
}
if (deleteCount > 0) {
    desc1.putList( stringIDToTypeID( "null" ), list1 );
    executeAction( stringIDToTypeID( "delete" ), desc1, DialogModes.NO );
}

var end = (new Date()).getTime();
var cost = "Time: " + (end - start) + "ms";
cost;

/*
var r = new ActionReference();
r.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

var desc1 = executeActionGet(r);


var descObject = descriptorInfo.getProperties( desc1, descFlags );
$.writeln(JSON.stringify(descObject, null, 4));
 */

/*
var ref = new ActionReference();
ref.putProperty( charIDToTypeID('Chnl'), charIDToTypeID('fsel') );
var desc1 = executeActionGet(ref);

var descObject = descriptorInfo.getProperties( desc1, descFlags );
$.writeln(JSON.stringify(descObject, null, 4));

 */

/*

 */
