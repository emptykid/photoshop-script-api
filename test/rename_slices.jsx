/**
 * 遍历文档中的切片并重新命名
 * @xiaoqiang
 * @date 2022/11/19
 */

function getAllSlices() {
    var documentReference = new ActionReference();
    documentReference.putEnumerated(app.charIDToTypeID("Dcmn"), app.charIDToTypeID("Ordn"), app.charIDToTypeID("Trgt"));
    var desc = app.executeActionGet(documentReference);

    var sliceItems = [];
    if (desc.hasKey(app.stringIDToTypeID("slices"))) {
        var slices = desc.getObjectValue(app.stringIDToTypeID("slices"));
        var slicesList = slices.getList(app.stringIDToTypeID("slices"));
        for (var i = 0; i < slicesList.count; i++) {
            var slice = slicesList.getObjectValue(i);
            var id = slice.getInteger(app.stringIDToTypeID("sliceID"));
            var bounds = slice.getObjectValue(app.stringIDToTypeID("bounds"));
            var left = bounds.getUnitDoubleValue(app.stringIDToTypeID("left"));
            var top = bounds.getUnitDoubleValue(app.stringIDToTypeID("top"));
            var right = bounds.getUnitDoubleValue(app.stringIDToTypeID("right"));
            var bottom = bounds.getUnitDoubleValue(app.stringIDToTypeID("bottom"));
            $.writeln(id + " " + left + " " + top + " " + right + " " + bottom);
            sliceItems.push({
                id: id,
                bounds: {left: left, top: top, right: right, bottom: bottom},
                center: {
                    x: (left + right) / 2,
                    y: (top + bottom) / 2
                }
            });
        }
    }

    return sliceItems;
}

function selectSlice(center) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass( stringIDToTypeID( "slice" ) );
    desc1.putReference( stringIDToTypeID( "null" ), ref1 );
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble( stringIDToTypeID( "horizontal" ), stringIDToTypeID( "pixelsUnit" ), center.x );
    desc2.putUnitDouble( stringIDToTypeID( "vertical" ), stringIDToTypeID( "pixelsUnit" ), center.y );
    desc1.putObject( stringIDToTypeID( "at" ), stringIDToTypeID( "paint" ), desc2 );
    desc1.putBoolean( stringIDToTypeID( "addToSelection" ), false );
    executeAction( stringIDToTypeID( "select" ), desc1, DialogModes.NO );
}

function renameSlice(name) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated( stringIDToTypeID( "slice" ), stringIDToTypeID( "ordinal" ), stringIDToTypeID( "targetEnum" ) );
    desc1.putReference( stringIDToTypeID( "null" ), ref1 );
    var desc2 = new ActionDescriptor();
    desc2.putString( stringIDToTypeID( "name" ), name );
    desc2.putEnumerated( stringIDToTypeID( "sliceImageType" ), stringIDToTypeID( "sliceImageType" ), stringIDToTypeID( "image" ) );
    desc1.putObject( stringIDToTypeID( "to" ), stringIDToTypeID( "slice" ), desc2 );
    executeAction( stringIDToTypeID( "set" ), desc1, DialogModes.NO );
}

var sliceItems = getAllSlices();
for (var i = 0; i < sliceItems.length; i++) {
    selectSlice(sliceItems[i].center);
    renameSlice("my_slice_name_" + i);
}

