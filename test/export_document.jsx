
#include "./JSON.jsx";
#include "./descriptor-info.jsx";

var descFlags = {
    reference : false,
    extended : false,
    maxRawLimit : 10000,
    maxXMPLimit : 100000,
    saveToFile: Folder.desktop.absoluteURI + '/descriptor-info-output3.json'
};


var documentReference = new ActionReference();
documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
var documentDescriptor = app.executeActionGet(documentReference);



var descObject = descriptorInfo.getProperties( documentDescriptor, descFlags );
$.writeln(JSON.stringify(descObject, null, 4));

/*
var ref = new ActionReference();
ref.putProperty( charIDToTypeID('Chnl'), charIDToTypeID('fsel') );
var desc1 = executeActionGet(ref);

var descObject = descriptorInfo.getProperties( desc1, descFlags );
$.writeln(JSON.stringify(descObject, null, 4));

 */

/*

 */
