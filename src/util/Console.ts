

export class Console {
    private logFile: string = null;
    private actionList: any = {};

    constructor(appKey?: string) {
        const root = (appKey)? Folder.userData.absoluteURI + '/' + appKey : Folder.desktop.absoluteURI;
        const folder = new Folder(root);
        if (!folder.exists) {
            const ret = folder.create();
            if (ret === false) {
                this.fire(`can not create folder[${folder.absoluteURI}]`);
                alert(`can not create folder[${folder.absoluteURI}]`);
                return;
            }
        }

        const logDir = new Folder(folder.absoluteURI + '/logs');
        if (!logDir.exists) {
            const ret = logDir.create()
            if (ret === false) {
                this.fire(`can not create folder[${logDir.absoluteURI}]`);
                return;
            }
        }

        this.logFile = logDir.absoluteURI + '/' + this.today() + '.log';
    }

    fire (message: string) {
        $.writeln(message);
        try {
            // @ts-ignore
            var eventObj = new CSXSEvent();
            eventObj.type = "DevToolsConsoleEvent";
            eventObj.data = '[DEBUG] [MSG: ' + message + ']';
            eventObj.dispatch();
        } catch (e) {
        }
    }

    debug(message: string) {
        this.write(message, "DEBUG");
    }

    info(message: string) {
        this.write(message, "INFO");
    }

    warning(message: string) {
        this.write(message, "WARNING");
    }

    error(message: string) {
        this.fire(message);
        this.write(message, "ERROR");
    }

    timer(action: string, mesage?: string) {
        const now = (new Date()).getTime();
        mesage = (mesage)? mesage: "";
        if (this.actionList[action] === undefined) {
            this.actionList[action] = { t: now, }
            this.info(`[${action}] start ${mesage}`);
        } else {
            const item = this.actionList[action];
            const gap = now - item.t;
            delete this.actionList[action];
            this.info(`[${action}] end cost[${gap}ms] ${mesage}`);
        }
    }

    write(message: string, prefix: string) {
        const output = `[${prefix}] [${this.now()}] ${message}`;
        $.writeln(output)
        if (this.logFile != null) {
            // @ts-ignore
            const f = new File(this.logFile);
            // @ts-ignore
            f.open('a');
            // @ts-ignore
            f.encoding = "UTF-8";
            // @ts-ignore
            f.lineFeed = "Unix";
            // @ts-ignore
            f.writeln(output);
            // @ts-ignore
            f.close();
        }
    }

    today(): string {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    now(): string {
        const d = new Date();
        let month = d.getMonth() + 1;
        const monthString = (month < 10)? "0" + month : month;
        const date = d.getDate();
        const dateString = (date < 10)? "0" + date : date;
        const hour = d.getHours();
        const hourString = (hour < 10)? "0" + hour : hour;
        const minutes = d.getMinutes();
        const minutesString = (minutes < 10)? "0" + minutes: minutes;
        const seconds = d.getSeconds();
        const secondString = (seconds < 10)? "0" + seconds: seconds;
        return `${d.getFullYear()}-${monthString}-${dateString} ${hourString}:${minutesString}:${secondString}`;
    }

}

//$._ext.console = new Console();
