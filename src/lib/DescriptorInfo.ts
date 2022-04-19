/**
  *
  * DescriptorInfo
  * JSX script to recursively get all the properties in an ActionDescriptor used in Adobe applications
  * This script translate origin one to TypeScript by @Cutterman
  *
  * Origin Author: Javier Aroche (https://github.com/JavierAroche)
  * Repo: https://github.com/JavierAroche/descriptor-info
  * Version: v1.1.0
  * License MIT
  *
  */

export class DescriptorInfo {
    descParams: any;

    constructor() {
        this.descParams = {
            reference : false,
            extended : false,
            maxRawLimit : 10000,
            maxXMPLimit : 10000,
            saveToFile : '~/Desktop/descriptor-info.json'
        };
    }

    /**
    * @public
    * Handler function to get Action Descriptor properties
    * @param {Object} Action Descriptor
    * @param {Object} Optional params object
    * 	@param {Boolean} reference - return reference descriptors. Could slightly affect speed. Default = false.
    * 	@param {Boolean} extended - returns extended information about the descriptor. Default = false.
    * 	@param {Number} maxRawLimit - limits the max number of characters from a RAWTYPE descriptor. Default = 10000.
    * 	@param {Number} maxXMPLimit - limits the max number of characters from an XMPMetadataAsUTF8 property. Default = 10000.
    * 	@param {String} saveToFile - Saves the descriptor to a JSON file. Default = '~/Desktop/descriptor-info.json'.
    */
    getProperties(theDesc: ActionDescriptor | ActionList, params?: any): any {
        // Define params
        this.descParams = {
            reference: params.reference || false,
            extended: params.extended || false,
            maxRawLimit: params.maxRawLimit || 10000,
            maxXMPLimit: params.maxXMPLimit || 10000,
            saveToFile: params.saveToFile || '~/Desktop/descriptor-info.json'
        };

        var descObject: any;
        // @ts-ignore
        if (theDesc == '[ActionList]') {
            descObject = this.getDescList(theDesc as ActionList);
        } else {
            descObject = this.getDescObject(theDesc as ActionDescriptor, {});
        }

        /*
        if (params.hasOwnProperty('saveToFile')) {
            this._saveToFile(descObject, this.descParams.saveToFile);
        }
        */

        return descObject;

    }

    /**
    * @private
    * Handler function to get the items in an ActionDescriptor Object
    * @param {Object} Action Descritor
    * @param {Object} Empty object to return (required since it's a recursive function)
    */
    private getDescObject(theDesc: ActionDescriptor, descObject: any) {
        for (var i = 0; i < theDesc.count; i++) {
            var typeID = theDesc.getKey(i);
            var descType = (theDesc.getType(typeID)).toString();

            var descProperties,
                descStringID = app.typeIDToStringID(typeID),
                descCharID = app.typeIDToCharID(typeID);

            if (this.descParams.extended) {
                descProperties = {
                    stringID: descStringID,
                    charID: descCharID,
                    id: typeID,
                    key: i,
                    type: descType,
                    value: this.getValue(theDesc, descType, typeID)
                };
            } else {
                descProperties = this.getValue(theDesc, descType, typeID);
            }

            var objectName = this.getBestName(typeID);

            switch (descType) {
                case 'DescValueType.OBJECTTYPE':
                    if (this.descParams.extended) {
                        descProperties.object = this.getDescObject(descProperties.value, {});
                    } else {
                        descProperties = this.getDescObject(descProperties, {});
                    }
                    break;

                case 'DescValueType.LISTTYPE':
                    if (this.descParams.extended) {
                        descProperties.list = this.getDescList(descProperties.value);
                    } else {
                        descProperties = this.getDescList(descProperties);
                    }
                    break;

                case 'DescValueType.ENUMERATEDTYPE':
                    descProperties.enumerationType = app.typeIDToStringID(theDesc.getEnumerationType(typeID));
                    break;

                case 'DescValueType.REFERENCETYPE':
                    if (this.descParams.reference) {
                        var referenceValue;

                        if (this.descParams.extended) {
                            referenceValue = descProperties.value;
                        } else {
                            referenceValue = descProperties;
                        }

                        try {
                            descProperties.actionReference = this.getActionReferenceInfo(referenceValue);
                        } catch (err) {
                            $.writeln("Unable to get value: " + descStringID + ' - ' + err);
                        }

                        try {
                            descProperties.actionReferenceContainer = this.getActionReferenceInfo(referenceValue.getContainer());
                        } catch (err) {
                            $.writeln("Unable to get container: " + descStringID + ' - ' + err);
                        }

                        try {
                            descProperties.reference = app.executeActionGet(referenceValue);
                        } catch (err) {
                            $.writeln("Unable to run app.executeActionGet from value: " + descStringID + ' - ' + err);
                        }

                        try {
                            descProperties.referenceContainer = app.executeActionGet(referenceValue.getContainer());
                        } catch (err) {
                            $.writeln("Unable to run app.executeActionGet from container: " + descStringID + ' - ' + err);
                        }
                    }
                    break;

                default:
                    break;
            }
            descObject[objectName] = descProperties;
        }
        return descObject;
    }



    /**
  * @private
  * Handler function to get the items in an ActionList
  * @param {ActionList} Action List
  * @return {[ActionDescriptor]}
  */
    private getDescList(list: ActionList): ActionDescriptor[] {
        var listArray = [];

        for ( var ii = 0; ii < list.count; ii++ ) {
            var listItemType = list.getType(ii).toString();
            var listItemValue = this.getValue( list, listItemType, ii );
    
            switch( listItemType ) {
                case 'DescValueType.OBJECTTYPE':
                    var listItemOBJ = {};
    
                    // fixed exception in windows by xiaoqiang
                    var listItemProperties: any,
                        descStringID = app.typeIDToStringID( list.getObjectType(ii) );
    
                    if( this.descParams.extended ) {
                        listItemProperties = {
                            stringID : descStringID,
                            key : ii,
                            type : listItemType,
                            value : listItemValue
                        };
    
                        listItemProperties.object = this.getDescObject( listItemValue, {} );
                    } else {
                        listItemProperties = this.getDescObject( listItemValue, {} );
                    }
    
                    var listItemObject: any = {};
                    listItemObject[descStringID] = listItemProperties;
    
                    listArray.push( listItemObject );
                    break;
    
                case 'DescValueType.LISTTYPE':
                    listArray.push( this.getDescList( listItemValue ) );
                    break;
    
                case 'DescValueType.REFERENCETYPE':
                    if( this.descParams.reference ) {
                        var referenceProperties: any = {};
    
                        try {
                            referenceProperties.actionReference = this.getActionReferenceInfo( listItemValue );
                        } catch( err) {
                            $.writeln( "Unable to get value: " + descStringID + ' - ' + err );
                        }
    
                        try {
                            referenceProperties.actionReferenceContainer = this.getActionReferenceInfo( listItemValue.getContainer() );
                        } catch( err ) {
                            $.writeln( "Unable to get container: " + descStringID + ' - ' + err );
                        }
    
                        try {
                            referenceProperties.reference = app.executeActionGet( listItemValue );
                        } catch( err ) {
                            $.writeln( "Unable to run app.executeActionGet from value: " + descStringID + ' - ' + err );
                        }
    
                        try {
                            referenceProperties.referenceContainer = app.executeActionGet( listItemValue.getContainer() );
                        } catch( err ) {
                            $.writeln( "Unable to run app.executeActionGet from container: " + descStringID + ' - ' + err );
                        }
    
                        listArray.push( referenceProperties );
    
                    } else {
                        listArray.push( listItemValue );
                    }
                    break;
    
                default:
                    listArray.push( listItemValue );
                    break;
            }
        }
    
        return listArray;
    }

    /**
    * @private
    *
    * Based on code by Michael Hale
    * http://www.ps-scripts.com/
    *
    * Handler function to get the value of an Action Descriptor
    * @param {Object} Action Descriptor
    * @param {String} Action Descriptor type
    * @param {Number} Action Descriptor Key / Index
    */
    private getValue(theDesc: ActionDescriptor | ActionReference | ActionList, descType: string, position: number): any {
        switch( descType ) {
            case 'DescValueType.BOOLEANTYPE':
                // @ts-ignore
                return theDesc.getBoolean( position );
            case 'DescValueType.CLASSTYPE':
                // @ts-ignore
                return theDesc.getClass( position );
            case 'DescValueType.DOUBLETYPE':
                // @ts-ignore
                return theDesc.getDouble( position );
            case 'DescValueType.ENUMERATEDTYPE':
                // @ts-ignore
                return app.typeIDToStringID(theDesc.getEnumerationValue( position ));
            case 'DescValueType.INTEGERTYPE':
                // @ts-ignore
                return theDesc.getInteger( position );
            case 'DescValueType.LISTTYPE':
                // @ts-ignore
                return theDesc.getList( position );
            case 'DescValueType.OBJECTTYPE':
                // @ts-ignore
                return theDesc.getObjectValue( position );
            case 'DescValueType.REFERENCETYPE':
                // @ts-ignore
                return theDesc.getReference( position );
            case 'DescValueType.STRINGTYPE':
                var str = '';
                if( app.typeIDToStringID( position ) == 'XMPMetadataAsUTF8' ) {
                    // @ts-ignore
                    return str + JSON.stringify(theDesc.getString( position )).substring( 0, this.descParams.maxXMPLimit );
                } else {
                    // @ts-ignore
                    return str + theDesc.getString( position );
                }
            case 'DescValueType.UNITDOUBLE':
                // @ts-ignore
                return theDesc.getUnitDoubleValue( position );
            case 'DescValueType.ALIASTYPE':
                // @ts-ignore
                return decodeURI(theDesc.getPath( position ));
            case 'DescValueType.RAWTYPE':
                // @ts-ignore
                return theDesc.getData( position ).substring( 0, this.descParams.maxRawLimit );
            case 'ReferenceFormType.CLASSTYPE':
                // @ts-ignore
                return theDesc.getDesiredClass();
            case 'ReferenceFormType.ENUMERATED':
                // @ts-ignore
                var enumeratedID = theDesc.getEnumeratedValue();
                return this.getBestName( enumeratedID );
            case 'ReferenceFormType.IDENTIFIER':
                // @ts-ignore
                return theDesc.getIdentifier();
            case 'ReferenceFormType.INDEX':
                // @ts-ignore
                return theDesc.getIndex();
            case 'ReferenceFormType.NAME':
                var str = '';
                // @ts-ignore
                return str + theDesc.getName();
            case 'ReferenceFormType.OFFSET':
                // @ts-ignore
                return theDesc.getOffset();
            case 'ReferenceFormType.PROPERTY':
                // @ts-ignore
                var propertyID = theDesc.getProperty();
                return this.getBestName( propertyID );
            default:
                break;
        };

    }

    /**
    * @private
    *
    * Handler function to get the info about action reference
    * @param {Object} Action Reference
    */
    private getActionReferenceInfo(reference: ActionReference): object {
        var form = reference.getForm().toString();
        var classID = reference.getDesiredClass();
        var info;
    
        if( this.descParams.extended ) {
            info = {
                stringID : app.typeIDToStringID( classID ),
                charID : app.typeIDToCharID( classID ),
                id : classID,
                type : form,
                value : this.getValue( reference, form, 0 )
            };
        } else {
            info = this.getValue( reference, form, 0 );
        }
    
        return info;
    }


    /**
    * @private
    *
    * Handler function to get the best name for typeID
    * @param {Number} typeID
    */
    private getBestName(typeID: number) {
        var stringValue = app.typeIDToStringID( typeID );
        var charValue = app.typeIDToCharID( typeID );
        if( stringValue ) {
            return stringValue;
        } else if( charValue ) {
            return charValue;
        } else {
            return typeID + "";
        }
    }

    /**
    * @private
    *
    * Handler function to save descriptor into a file
    * @param {String} descriptor
    private saveToFile(descriptor: ActionDescriptor, outputFile: string) {
        outputFile = File(outputFile);

        if(outputFile.exists) {
            outputFile.remove();
        }
    
        outputFile.encoding = "UTF8";
        outputFile.open( "e", "TEXT", "????" );
        outputFile.writeln( JSON.stringify(descriptor, null, 4) );
        outputFile.close()

    }
    */


}
