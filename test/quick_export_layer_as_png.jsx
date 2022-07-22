//quick_export_png(activeDocument.path.fsName)
// export activeLayer
function quick_export_png(path, layer)
{
    try {
        if (layer == undefined) layer = false;
        var d = new ActionDescriptor();
        var r = new ActionReference();
        r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        d.putReference(stringIDToTypeID("null"), r);
        d.putString(stringIDToTypeID("fileType"), "png");
        d.putInteger(stringIDToTypeID("quality"), 32);
        d.putInteger(stringIDToTypeID("metadata"), 0);
        d.putString(stringIDToTypeID("destFolder"), path);
        d.putBoolean(stringIDToTypeID("sRGB"), true);
        d.putBoolean(stringIDToTypeID("openWindow"), false);
        executeAction(stringIDToTypeID(layer?"exportSelectionAsFileTypePressed":"exportDocumentAsFileTypePressed"), d, DialogModes.NO);
    }
    catch (e) { throw(e); }
}

quick_export_png(activeDocument.path.fsName, true);
