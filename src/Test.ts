/**
 * Created by xiaoqiang
 * @date
 * @description
 */
import {Layer} from "./lib/Layer";


function getLayer() {
    const layers = Layer.getSelectedLayers();
    $.writeln(layers.length);
}

