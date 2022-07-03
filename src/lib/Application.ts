/**
 * Created by xiaoqiang
 * @date 2021/07/29
 * @description
 */

export enum HostVersion {
    Unknown,
    CC2015 = 16,
    CC2016 = 17,
    CC2017 = 18,
    CC2018 = 19,
    CC2019 = 20,
    CC2020 = 21,
    CC2021 = 22,
    CC2022 = 23
}

export class Application {

    private rulerUnits: Units;
    private typeUnits: TypeUnits;


    /**
     * get current photoshop version
     * @return version
     */
    public version(): string {
        return app.version;
    }

    /**
     * get current application host install path
     * which is photoshop.exe or MacOS/photoshop place
     * @return path: string
     */
    public getApplicationPath(): string {
        const kexecutablePathStr = app.stringIDToTypeID("executablePath");
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty(app.charIDToTypeID('Prpr'), kexecutablePathStr);
        ref.putEnumerated(app.charIDToTypeID('capp'), app.charIDToTypeID('Ordn'),
            app.charIDToTypeID('Trgt'));
        desc.putReference(app.charIDToTypeID('null'), ref);
        const result = app.executeAction(app.charIDToTypeID('getd'), desc, DialogModes.NO);
        //@ts-ignore
        return File.decode(result.getPath(kexecutablePathStr));
    }

    /**
     * get current application host version
     * @return HostVersion
     */
    public getHostVersion(): HostVersion {
        const v = parseInt(app.version);
        if (v>23 || v <16) {
            return HostVersion.Unknown;
        }
        return v as HostVersion;
    }

    /**
     * open a file from path
     * @param path
     */
    public open(path: string): void {
        const desc437 = new ActionDescriptor();
        // @ts-ignore
        desc437.putPath( app.charIDToTypeID( "null" ), new File(path) );
        app.executeAction( app.charIDToTypeID( "Opn " ), desc437, DialogModes.NO );
    }

    /**
     * save current units to private member
     */
    public saveUnits(): void {
        this.rulerUnits = this.getRulerUnits();
        this.typeUnits = this.getTypeUnits();
    }

    /**
     * restore units from member value
     */
    public restoreUnits(): void {
        if (this.rulerUnits && this.typeUnits) {
            this.setRulerUnits(this.rulerUnits);
            this.setTypeUnits(this.typeUnits);
        }
    }

    /**
     * set app units
     * @param rulerUnits
     * @param typeUnits
     */
    public setUnits(rulerUnits: Units, typeUnits: TypeUnits): void {
        this.setRulerUnits(rulerUnits);
        this.setTypeUnits(typeUnits);
    }

    /**
     * get app ruler units
     * @return rulerUnits
     */
    public getRulerUnits(): Units {
        return app.preferences.rulerUnits;
    }

    /**
     * set app ruler units
     * @param rulerUnits
     */
    public setRulerUnits(rulerUnits: Units): void {
        app.preferences.rulerUnits = rulerUnits;
    }

    /**
     * get app type units
     * @return typeUnits
     */
    public getTypeUnits(): TypeUnits {
        return app.preferences.typeUnits;
    }

    /**
     * set app type units
     * @param typeUnits
     */
    public setTypeUnits(typeUnits: TypeUnits): void {
        app.preferences.typeUnits = typeUnits;
    }


}
