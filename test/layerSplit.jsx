
function makeSelectionFromLayer() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "selection" ) );
    desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
    var ref2 = new ActionReference();
    ref2.putEnumerated( app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "channel" ), app.stringIDToTypeID( "transparencyEnum" ) );
    desc1.putReference( app.stringIDToTypeID( "to" ), ref2 );
    app.executeAction( app.stringIDToTypeID( "set" ), desc1, DialogModes.NO );
}

function selectionToPath() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass( app.stringIDToTypeID( "path" ) );
    desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );
    var ref2 = new ActionReference();
    ref2.putProperty( app.stringIDToTypeID( "selectionClass" ), app.stringIDToTypeID( "selection" ) );
    desc1.putReference( app.stringIDToTypeID( "from" ), ref2 );
    desc1.putUnitDouble( app.stringIDToTypeID( "tolerance" ), app.stringIDToTypeID( "pixelsUnit" ), 2.000000 );
    app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
}

function splitPaths() {
    var pathItems = app.activeDocument.pathItems;
    for (var i=0; i<pathItems.length; i++) {
        var pathItem = pathItems[i];
        $.writeln(pathItem.name + '-' + pathItem.kind + '-' + pathItem.subPathItems.length);
        var newPathItemArray = [];
        for (var j=0; j<pathItem.subPathItems.length; j++) {
            var pointInfoArray = [];
            var subPathItem = pathItem.subPathItems[j];
            for (var k=0; k<subPathItem.pathPoints.length; k++) {
                var point = subPathItem.pathPoints[k];
                var pInfo = new PathPointInfo();
                pInfo.anchor = point.anchor;
                pInfo.kind = point.kind;
                pInfo.leftDirection = point.leftDirection;
                pInfo.rightDirection = point.rightDirection;
                pointInfoArray.push(pInfo);
            }

            var info = new SubPathInfo();
            info.closed = true;
            info.entireSubPath = pointInfoArray;
            info.operation = ShapeOperation.SHAPEXOR;
            newPathItemArray.push(info);
        }

        var targetLayer = app.activeDocument.activeLayer;
        for (var m=0; m<newPathItemArray.length; m++) {
            var info = newPathItemArray[m];
            var newPath = app.activeDocument.pathItems.add("split_path_" + m, [info]);
            newPath.makeSelection();
            app.activeDocument.activeLayer = targetLayer;
            duplicateLayerPixels();
            newPath.remove();
        }
    }
}

function duplicateLayerPixels() {
    var idcopyToLayer = stringIDToTypeID( "copyToLayer" );
    executeAction( idcopyToLayer, undefined, DialogModes.NO );
}

var start = (new Date()).getTime();
makeSelectionFromLayer();
selectionToPath();
splitPaths();
var end = (new Date()).getTime();
var cost = end - start;
$.writeln("process finish cost["+cost+"]");
