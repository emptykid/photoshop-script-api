

export class MetaData {
    namespace: string;
    prefix: string;

    constructor(namespace: string, prefix: string) {
        this.namespace = namespace;
        this.prefix = prefix;
    }

    /**
     * 设置meta data
     * @param key
     * @param value
     */
    set(key: string, value: string): void {
        // @ts-ignore
        if (ExternalObject.AdobeXMPScript == undefined) {
            // @ts-ignore
            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
        }
        let xmpObject;
        try {
            const xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
            xmpObject = new XMPMeta();
        }
        XMPMeta.registerNamespace(this.namespace, this.prefix);
        xmpObject.deleteProperty(this.namespace, key);
        xmpObject.setProperty(this.namespace, key, value);
        app.activeDocument.xmpMetadata.rawData = xmpObject.serialize();

    }

    /**
     * 获取存在metadata中的某个key值
     * @param key
     */
    get(key: string): string | null {
        // @ts-ignore
        if (ExternalObject.AdobeXMPScript == undefined) {
            // @ts-ignore
            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
        }
        let xmp, xmpObject;
        try {
            xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
            xmpObject = new XMPMeta();
        }
        let value = null;
        try {
            XMPMeta.registerNamespace(this.namespace, this.prefix);
            const property = xmpObject.getProperty(this.namespace, key);
            value = property.value;
        } catch (e) {
        }
        return value;
    }

    /**
     * 删除metadata中的某个key
     * @param key
     */
    remove(key: string): void {
        // @ts-ignore
        if (ExternalObject.AdobeXMPScript == undefined) {
            // @ts-ignore
            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
        }
        let xmpObject;
        try {
            const xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
            xmpObject = new XMPMeta();
        }
        try {
            XMPMeta.registerNamespace(this.namespace, this.prefix);
            xmpObject.deleteProperty(this.namespace, key);
            app.activeDocument.xmpMetadata.rawData = xmpObject.serialize();
        } catch (e) {
        }
    }

    /**
     * 清除所有medata数据
     */
    clear() {
        // @ts-ignore
        if (ExternalObject.AdobeXMPScript == undefined) {
            // @ts-ignore
            ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
        }
        try {
            const xmp = new XMPMeta( app.activeDocument.xmpMetadata.rawData);
            // @ts-ignore
            xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
            app.activeDocument.xmpMetadata.rawData = xmp.serialize();
            /*
            const xmp = new XMPMeta(app.activeDocument.xmpMetadata.rawData);
            XMPUtils.removeProperties(xmp, "", "", XMPConst.REMOVE_ALL_PROPERTIES);
            app.activeDocument.xmpMetadata.rawData = xmp.serialize();
             */
        } catch (e) {
        }
    }
}
