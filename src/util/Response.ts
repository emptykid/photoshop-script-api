/**
 * Created by xiaoqiang
 * @date
 * @description
 */

type ErrorMessage = {errNo: number, message: string}

export class Response {

    static NO_DATA: ErrorMessage = {errNo: 100, message: "no valida data"};
    static NO_SELECTED_LAYER: ErrorMessage = {errNo: 1, message: "no selected layer"};
    static PROCESS_EXCEPTION: ErrorMessage = {errNo: 2, message: "process exception"};
    static PREPARE_LOCAL_FAIL: ErrorMessage = {errNo: 3, message: "create local file failed"};
    static LAYER_INVISIBLE: ErrorMessage = {errNo: 4, message: "layer invisible"};
    static NO_DOCUMENT_OPEN: ErrorMessage = {errNo: 5, message: "no document open"};

    static success(data: any): string {
        return JSON.stringify({
            errno: 0,
            data: data
        });
    }

    static fail(msg: ErrorMessage): string {
        return JSON.stringify({
            errno: msg.errNo,
            data: msg.message
        });
    }
}
