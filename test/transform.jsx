var desc1 = new ActionDescriptor();
var ref1 = new ActionReference();
ref1.putEnumerated( stringIDToTypeID( "path" ), stringIDToTypeID( "ordinal" ), stringIDToTypeID( "targetEnum" ) );
desc1.putReference( stringIDToTypeID( "null" ), ref1 );
desc1.putEnumerated( stringIDToTypeID( "freeTransformCenterState" ), stringIDToTypeID( "quadCenterState" ), stringIDToTypeID( "QCSAverage" ) );
var desc2 = new ActionDescriptor();
desc2.putUnitDouble( stringIDToTypeID( "horizontal" ), stringIDToTypeID( "pixelsUnit" ), 0.000000 );
desc2.putUnitDouble( stringIDToTypeID( "vertical" ), stringIDToTypeID( "pixelsUnit" ), 0.000000 );
desc1.putObject( stringIDToTypeID( "offset" ), stringIDToTypeID( "offset" ), desc2 );
desc1.putUnitDouble( stringIDToTypeID( "width" ), stringIDToTypeID( "percentUnit" ), 4.96258916582441 );
desc1.putUnitDouble( stringIDToTypeID( "height" ), stringIDToTypeID( "percentUnit" ), 84.0386238744702);

desc1.putBoolean( stringIDToTypeID( "transformOnlyLineEnds" ), true );
executeAction( stringIDToTypeID( "transform" ), desc1, DialogModes.NO );
