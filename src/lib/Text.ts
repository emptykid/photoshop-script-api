/**
 * Created by xiaoqiang
 * @date
 * @description
 */

import {Rect} from "./Rect";
import {Point, UnitType} from "./Shape";
import {Document} from "./Document";
import {Stroke} from "./Stroke";
import {FontFormat} from "./base/Includes";
import {SolidColor} from "./base/SolidColor";

export enum TextAntiAliasType {
    None = "antiAliasNone",
    Sharp= "antiAliasSharp",
    Crisp = "antiAliasCrisp",
    Strong = "antiAliasStrong",
    Smooth = "antiAliasSmooth",
    LCD = "antiAliasPlatformLCD",
    Gray = "antiAliasPlatformGray"
}

export enum TextGriddingType {
    None = "none",
}

export enum TextOrientation {
    Horizontal = "horizontal",
    Vertical = "vertical",
}

export enum TextStrikeThroughType {
    Off = "strikethroughOff",
}

export enum TextAlignment {
    Left = "left",
    Center = "center",
    Right = "right",
}

export class Text {
    public content: string;
    public descriptorType: number = app.stringIDToTypeID( "textLayer" );
    public readonly textDesc: ActionDescriptor;
    public readonly styleDesc: ActionDescriptor;
    public readonly paragraphDesc: ActionDescriptor;
    private readonly styleRangeCount: number = 1;

    constructor(content: string, desc: ActionDescriptor = null)  {
        this.content = content;

        if (desc != null) {
            this.textDesc = desc;
            const textStyleRanges = desc.getList(app.stringIDToTypeID("textStyleRange"));
            this.styleRangeCount = textStyleRanges.count;
            if (this.styleRangeCount > 0) {
                const textStyleRange = textStyleRanges.getObjectValue(0);
                this.styleDesc = textStyleRange.getObjectValue(app.stringIDToTypeID("textStyle"));
            }
        } else {
            this.textDesc = new ActionDescriptor();
            this.textDesc.putString( app.stringIDToTypeID( "textKey" ), content );

            // default settings
            this.setAntiAlias(TextAntiAliasType.Smooth);
            this.setTextGridding(TextGriddingType.None);
            this.setOrientation(TextOrientation.Horizontal);

            // text style
            this.styleDesc = new ActionDescriptor();
            this.styleDesc.putBoolean( app.stringIDToTypeID( "styleSheetHasParent" ), true );
            this.setColor(SolidColor.blackColor());
        }
        this.paragraphDesc = new ActionDescriptor();
        this.paragraphDesc.putBoolean( app.stringIDToTypeID( "styleSheetHasParent" ), true );
    }

    static fromDescriptor(desc: ActionDescriptor): Text {
        const content = desc.getString(app.stringIDToTypeID("textKey"));
        return new Text(content, desc);
    }

    public textClickPoint(): Point {
        const textClickPoint = this.textDesc.getObjectValue(app.stringIDToTypeID("textClickPoint"));
        const x = textClickPoint.getDouble(app.stringIDToTypeID("horizontal"));
        const y = textClickPoint.getDouble(app.stringIDToTypeID("vertical"));
        return new Point(x, y);
    }

    public orientation(): TextOrientation {
        const orientation = this.textDesc.getEnumerationValue(app.stringIDToTypeID("orientation"));
        return app.typeIDToStringID(orientation) as TextOrientation;
    }

    public bounds(): Rect {
        return Rect.fromDescriptor(this.textDesc.getObjectValue(app.stringIDToTypeID("bounds")));
    }

    public boundingBox(): Rect {
        return Rect.fromDescriptor(this.textDesc.getObjectValue(app.stringIDToTypeID("boundingBox")));
    }

    public fontPostScriptName(): string {
        return this.safeGetStyle("fontPostScriptName");
    }

    public fontName(): string {
        return this.safeGetStyle("fontName");
    }

    public fontStyleName(): string {
        return this.safeGetStyle("fontStyleName");
    }

    private safeGetStyle(key: string): string {
        if (this.styleDesc) {
            if (this.styleDesc.hasKey(stringIDToTypeID(key))) {
                return this.styleDesc.getString(stringIDToTypeID(key));
            }
            if (this.styleDesc.hasKey(stringIDToTypeID("baseParentStyle"))) {
                const baseParentStyle = this.styleDesc.getObjectValue(stringIDToTypeID("baseParentStyle"));
                if (baseParentStyle.hasKey(stringIDToTypeID(key))) {
                    return baseParentStyle.getString(stringIDToTypeID(key));
                }
            }
        }
        return "";
    }

    public size(): number {
        const sizeArr = ["impliedFontSize", "size"];
        for (let i=0; i<sizeArr.length; i++) {
            if (this.styleDesc.hasKey(app.stringIDToTypeID(sizeArr[i]))) {
                return this.styleDesc.getDouble(app.stringIDToTypeID(sizeArr[i]));
            }
        }
        if (this.styleDesc.hasKey(app.stringIDToTypeID("baseParentStyle"))) {
            const baseParentStyle = this.styleDesc.getObjectValue(app.stringIDToTypeID("baseParentStyle"));
            for (let i=0; i<sizeArr.length; i++) {
                if (baseParentStyle.hasKey(app.stringIDToTypeID(sizeArr[i]))) {
                    return baseParentStyle.getDouble(app.stringIDToTypeID(sizeArr[i]));
                }
            }
        }

        return 12;
    }

    public horizontalScale(): number {
        if (this.styleDesc.hasKey(stringIDToTypeID("horizontalScale"))) {
            return this.styleDesc.getDouble(app.stringIDToTypeID("horizontalScale"));
        }
        return 0;
    }

    public verticalScale(): number {
        if (this.styleDesc.hasKey(stringIDToTypeID("verticalScale"))) {
            return this.styleDesc.getDouble(app.stringIDToTypeID("verticalScale"));
        }
        return 0;
    }

    public bold(): boolean {
        return this.styleDesc.hasKey(app.stringIDToTypeID("syntheticBold"))? this.styleDesc.getBoolean(app.stringIDToTypeID("syntheticBold")) : false;
    }

    public italic(): boolean {
        return this.styleDesc.hasKey(app.stringIDToTypeID("syntheticItalic"))? this.styleDesc.getBoolean(app.stringIDToTypeID("syntheticItalic")): false;
    }

    public lineHeight(): number {
        if (this.styleDesc.hasKey(app.stringIDToTypeID("autoLeading"))) {
            const autoLeading = this.styleDesc.getBoolean(app.stringIDToTypeID("autoLeading"));
            if (autoLeading) {
                return -1;
            }
        }
        if (this.styleDesc.hasKey(app.stringIDToTypeID("leading"))) {
            return this.styleDesc.getDouble(app.stringIDToTypeID("leading"));
        }
        return -1;
    }

    public strikethrough(): TextStrikeThroughType {
        if (this.styleDesc.hasKey(stringIDToTypeID("strikethrough"))) {
            const strikethrough = app.typeIDToStringID(this.styleDesc.getEnumerationValue(app.stringIDToTypeID("strikethrough")));
            return strikethrough as TextStrikeThroughType;
        }
        return TextStrikeThroughType.Off;
    }

    public underline(): string {
        if (!this.styleDesc.hasKey(stringIDToTypeID("underline"))) {
            return app.typeIDToStringID(this.styleDesc.getEnumerationValue(app.stringIDToTypeID("underline")));
        }
        return "";
    }

    public color(): SolidColor {
        if (this.styleDesc.hasKey(app.stringIDToTypeID("color"))) {
            return SolidColor.fromDescriptor(this.styleDesc.getObjectValue(app.stringIDToTypeID("color")));
        }
        return SolidColor.blackColor();
    }

    public colorList(): SolidColor[] {
        const colors: SolidColor[] = [];
        const textStyleRanges = this.textDesc.getList(app.stringIDToTypeID("textStyleRange"));
        for (let i=0; i<textStyleRanges.count; i++) {
            const textStyleRange = textStyleRanges.getObjectValue(i);
            const styleDesc = textStyleRange.getObjectValue(app.stringIDToTypeID("textStyle"));
            if (styleDesc.hasKey(app.stringIDToTypeID("color"))) {
                colors.push(SolidColor.fromDescriptor(styleDesc.getObjectValue(app.stringIDToTypeID("color"))));
            } else {
                if (styleDesc.hasKey(app.stringIDToTypeID("baseParentStyle"))) {
                    const baseParentStyle = styleDesc.getObjectValue(app.stringIDToTypeID("baseParentStyle"));
                    colors.push(SolidColor.fromDescriptor(baseParentStyle.getObjectValue(app.stringIDToTypeID("color"))));
                }
            }
        }
        return colors;
    }

    public paragraphCount(): number {
        const paragraphStyleRange = this.textDesc.getList(app.stringIDToTypeID("paragraphStyleRange"));
        return paragraphStyleRange.count;
    }

    public setTextClickPoint(point: Point): Text {
        const doc = Document.activeDocument().size();
        const xPercent = 100.0 * point.x / doc.width;
        const yPercent = 100.0 * point.y / doc.height;
        this.textDesc.putObject( app.stringIDToTypeID( "textClickPoint" ), app.stringIDToTypeID( "paint" ), new Point(xPercent, yPercent).toDescriptor(UnitType.Percent));
        return this;
    }

    public setAntiAlias(antiAliasType: TextAntiAliasType): Text {
        this.textDesc.putEnumerated( app.stringIDToTypeID( "antiAlias" ), app.stringIDToTypeID( "antiAliasType" ), app.stringIDToTypeID( antiAliasType ) );
        return this;
    }

    public setTextGridding(textGridding: TextGriddingType): Text {
        this.textDesc.putEnumerated( app.stringIDToTypeID( "textGridding" ), app.stringIDToTypeID( "textGridding" ), app.stringIDToTypeID( textGridding ) );
        return this;
    }

    public setOrientation(orientation: TextOrientation): Text {
        this.textDesc.putEnumerated( app.stringIDToTypeID( "orientation" ), app.stringIDToTypeID( "orientation" ), app.stringIDToTypeID( orientation ) );
        return this;
    }

    public setBounds(bounds: Rect): Text {
        this.textDesc.putObject( app.stringIDToTypeID( "bounds" ), app.stringIDToTypeID( "bounds" ), bounds.toDescriptor());
        return this;
    }

    public setBoundingBox(bounds: Rect): Text {
        this.textDesc.putObject( app.stringIDToTypeID( "boundingBox" ), app.stringIDToTypeID( "boundingBox" ), bounds.toDescriptor());
        return this;
    }

    public setSize(size: number): Text {
        this.styleDesc.putUnitDouble( app.stringIDToTypeID( "size" ), app.stringIDToTypeID( "pointsUnit" ), size );
        this.styleDesc.putUnitDouble( app.stringIDToTypeID( "impliedFontSize" ), app.stringIDToTypeID( "pointsUnit" ), size );
        return this;
    }

    public setFont(font: FontFormat): Text {
        this.styleDesc.putBoolean( app.stringIDToTypeID( "styleSheetHasParent" ), true );
        this.styleDesc.putString( app.stringIDToTypeID( "fontPostScriptName" ), font.scriptName );
        this.styleDesc.putString( app.stringIDToTypeID( "fontName" ), font.name );
        this.styleDesc.putString( app.stringIDToTypeID( "fontStyleName" ), font.style );
        return this;
    }

    public setScale(horizontal: number = 100, vertical: number = 100): Text {
        this.styleDesc.putDouble( app.stringIDToTypeID( "horizontalScale" ), horizontal );
        this.styleDesc.putDouble( app.stringIDToTypeID( "verticalScale" ), vertical );
        return this;
    }

    public setBold(bold: boolean): Text {
        this.styleDesc.putBoolean( app.stringIDToTypeID( "syntheticBold" ), bold );
        return this;
    }

    public setItalic(italic: boolean): Text {
        this.styleDesc.putBoolean( app.stringIDToTypeID( "syntheticItalic" ), italic );
        return this;
    }

    public setAutoLeading(leading: boolean): Text {
        this.styleDesc.putBoolean( app.stringIDToTypeID( "autoLeading" ), leading );
        return this;
    }

    public setLineHeight(lineHeight: number): Text {
        this.styleDesc.putBoolean( app.stringIDToTypeID( "autoLeading" ), false);
        this.styleDesc.putDouble( app.stringIDToTypeID( "leading" ), lineHeight );
        return this;
    }

    public setStrikeThrough(through: TextStrikeThroughType): Text {
        this.styleDesc.putEnumerated( app.stringIDToTypeID( "strikethrough" ), app.stringIDToTypeID( "strikethrough" ), app.stringIDToTypeID( through ) );
        return this;
    }

    public setUnderLine(): Text {
        this.styleDesc.putEnumerated( app.stringIDToTypeID( "underline" ), app.stringIDToTypeID( "underline" ), app.stringIDToTypeID( "underlineOff" ) );
        return this;
    }

    public setColor(color: SolidColor): Text {
        this.styleDesc.putObject( app.stringIDToTypeID( "color" ), app.stringIDToTypeID( "RGBColor" ), color.toDescriptor() );
        return this;
    }

    public setAlignment(alignment: TextAlignment): Text {
        this.paragraphDesc.putEnumerated(stringIDToTypeID("align"), stringIDToTypeID("align"), stringIDToTypeID(alignment));
        return this;
    }

    public paint() {
        const desc1 = new ActionDescriptor();
        const ref1 = new ActionReference();
        ref1.putClass( app.stringIDToTypeID( "textLayer" ) );
        desc1.putReference( app.stringIDToTypeID( "null" ), ref1 );

        // text style range
        const desc10 = new ActionDescriptor();
        desc10.putInteger( app.stringIDToTypeID( "from" ), 0 );
        desc10.putInteger( app.stringIDToTypeID( "to" ), this.content.length );
        desc10.putObject( app.stringIDToTypeID( "textStyle" ), app.stringIDToTypeID( "textStyle" ), this.styleDesc );
        const list2 = new ActionList();
        list2.putObject( app.stringIDToTypeID( "textStyleRange" ), desc10 );
        this.textDesc.putList( app.stringIDToTypeID( "textStyleRange" ), list2 );

        // paragraph style range
        const desc11 = new ActionDescriptor();
        desc11.putInteger( app.stringIDToTypeID( "from" ), 0 );
        desc11.putInteger( app.stringIDToTypeID( "to" ), this.content.length );
        desc11.putObject( app.stringIDToTypeID( "paragraphStyle" ), app.stringIDToTypeID( "paragraphStyle" ), this.paragraphDesc );
        const list3 = new ActionList();
        list3.putObject( app.stringIDToTypeID( "paragraphStyleRange" ), desc11 );
        this.textDesc.putList( app.stringIDToTypeID( "paragraphStyleRange" ), list3 );

        desc1.putObject( app.stringIDToTypeID( "using" ), app.stringIDToTypeID( "textLayer" ), this.textDesc);
        app.executeAction( app.stringIDToTypeID( "make" ), desc1, DialogModes.NO );
    }

}
