/**
 * Created by xiaoqiang on 2018/10/6.
 */

class Artboard {
    name:string;
    id:number;
    index:number;
    bounds:Rect;

    constructor(name, id, index, bounds) {
        this.name = name;
        this.id = id;
        this.index = index;
        this.bounds = bounds;
    }
}
