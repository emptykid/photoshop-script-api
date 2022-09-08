/**
 * Created by xiaoqiang
 * @date 2022/04/29
 * @description
 */

export class Utils {

    /**
     * save some text to local file
     * @param text
     * @param file
     */
    static saveFile(text: string, file: string): void {
        // @ts-ignore
        const jsonFile = new File(file);
        // @ts-ignore
        jsonFile.open("w");
        // @ts-ignore
        jsonFile.encoding = "UTF-8";
        // @ts-ignore
        jsonFile.lineFeed = "Unix";
        // @ts-ignore
        jsonFile.write(text);
        // @ts-ignore
        jsonFile.close();

    }

    /**
     * read data from file
     * @param filepath
     * @return string
     */
    static readFile(filepath: string): string {
        // @ts-ignore
        const f = new File(filepath);
        // @ts-ignore
        f.encoding = "UTF-8";
        // @ts-ignore
        f.open('r');
        // @ts-ignore
        const content = f.read();
        // @ts-ignore
        f.close();
        return content;
    }

    /**
     * check file exists
     * @param filepath
     * @return boolean
     */
    static fileExists(filepath: string): boolean {
        // @ts-ignore
        const f = new File(filepath);
        // @ts-ignore
        return f.exists;
    }

    /**
     * current os is mac or not
     * return boolean
     */
    static isMac(): boolean {
        return /mac/.test($.os.toLowerCase());
    }

    /**
     * current os is windows or not
     * return boolean
     */
    static isWin(): boolean {
        return /win/.test($.os.toLowerCase());
    }
}
