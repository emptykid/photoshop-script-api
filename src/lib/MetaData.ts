

export class MetaData {
    namespace: string;
    prefix: string;

    constructor(namespace: string, prefix: string) {
        this.namespace = namespace;
        this.prefix = prefix;
    }

    /**
     * is XMP is available
     * return bool
     */
    available(): boolean {
        return typeof ExternalObject === 'function';
    }

    /**
     * 设置meta data
     * @param key
     * @param value
     */
    set(key: string, value: string): void {
        let xmpObject = null;
        try {
            // @ts-ignore
            if (ExternalObject && ExternalObject.AdobeXMPScript == undefined) {
                // @ts-ignore
                ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
            }
            const xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
        }
        if (xmpObject != null) {
            XMPMeta.registerNamespace(this.namespace, this.prefix);
            xmpObject.deleteProperty(this.namespace, key);
            xmpObject.setProperty(this.namespace, key, value);
            app.activeDocument.xmpMetadata.rawData = xmpObject.serialize();
        }

    }

    /**
     * 获取存在metadata中的某个key值
     * @param key
     */
    get(key: string): string | null {
        let xmp, xmpObject = null;
        try {
            // @ts-ignore
            if (ExternalObject && ExternalObject.AdobeXMPScript == undefined) {
                // @ts-ignore
                ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
            }
            xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
        }
        if (xmpObject === null) { return null }
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
        let xmpObject = null;
        try {
            // @ts-ignore
            if (ExternalObject.AdobeXMPScript == undefined) {
                // @ts-ignore
                ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
            }
            const xmp = app.activeDocument.xmpMetadata.rawData;
            xmpObject = new XMPMeta(xmp);
        } catch (e) {
        }
        if (xmpObject === null) { return; }
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

        try {
            // @ts-ignore
            if (ExternalObject.AdobeXMPScript == undefined) {
                // @ts-ignore
                ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
            }
            const xmp = new XMPMeta( app.activeDocument.xmpMetadata.rawData);
            // @ts-ignore
            xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
            app.activeDocument.xmpMetadata.rawData = xmp.serialize();
        } catch (e) {
        }
    }
}
