
var desc1 = new ActionDescriptor();
var ref1 = new ActionReference();
ref1.putName(stringIDToTypeID( "pattern" ), "Tree Tile 3")
desc1.putReference( stringIDToTypeID( "null" ), ref1 );
executeAction( stringIDToTypeID( "delete" ), desc1, DialogModes.NO );

