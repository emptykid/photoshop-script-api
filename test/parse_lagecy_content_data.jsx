#include "./JSON.jsx";

function getHueSatAdjustment(){
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var desc = executeActionGet(ref).getList(stringIDToTypeID('adjustment')).getObjectValue(0);
    var rawData = desc.getData(stringIDToTypeID('legacyContentData'));
    var hueSatAdjustment = {};
    hueSatAdjustment.isColorized = Boolean(readInteger(rawData, 2));
    hueSatAdjustment.colorized = {};
    hueSatAdjustment.colorized.hue = readAngle(rawData, 4);
    hueSatAdjustment.colorized.sat = readInteger(rawData, 6);
    hueSatAdjustment.colorized.brightness = readInteger(rawData, 8);
    hueSatAdjustment.master = {};
    hueSatAdjustment.master.hue = readInteger(rawData, 10);
    hueSatAdjustment.master.sat = readInteger(rawData, 12);
    hueSatAdjustment.master.brightness = readInteger(rawData, 14);
    hueSatAdjustment.reds = {};
    hueSatAdjustment.reds.beginRamp = readInteger(rawData, 16);
    hueSatAdjustment.reds.beginSustain = readInteger(rawData, 18);
    hueSatAdjustment.reds.endSustain = readInteger(rawData, 20);
    hueSatAdjustment.reds.endRamp = readInteger(rawData, 22);
    hueSatAdjustment.reds.hue = readInteger(rawData, 24);
    hueSatAdjustment.reds.sat = readInteger(rawData, 26);
    hueSatAdjustment.reds.brightness = readInteger(rawData, 28);
    hueSatAdjustment.yellows = {};
    hueSatAdjustment.yellows.beginRamp = readInteger(rawData, 30);
    hueSatAdjustment.yellows.beginSustain = readInteger(rawData, 32);
    hueSatAdjustment.yellows.endSustain = readInteger(rawData, 34);
    hueSatAdjustment.yellows.endRamp = readInteger(rawData, 36);
    hueSatAdjustment.yellows.hue = readInteger(rawData, 38);
    hueSatAdjustment.yellows.sat = readInteger(rawData, 40);
    hueSatAdjustment.yellows.brightness = readInteger(rawData, 42);
    hueSatAdjustment.greens = {};
    hueSatAdjustment.greens.beginRamp = readInteger(rawData, 44);
    hueSatAdjustment.greens.beginSustain = readInteger(rawData, 46);
    hueSatAdjustment.greens.endSustain = readInteger(rawData, 48);
    hueSatAdjustment.greens.endRamp = readInteger(rawData, 50);
    hueSatAdjustment.greens.hue = readInteger(rawData, 52);
    hueSatAdjustment.greens.sat = readInteger(rawData, 54);
    hueSatAdjustment.greens.brightness = readInteger(rawData, 56);
    hueSatAdjustment.cyans = {};
    hueSatAdjustment.cyans.beginRamp = readInteger(rawData, 58);
    hueSatAdjustment.cyans.beginSustain = readInteger(rawData, 60);
    hueSatAdjustment.cyans.endSustain = readInteger(rawData, 62);
    hueSatAdjustment.cyans.endRamp = readInteger(rawData, 64);
    hueSatAdjustment.cyans.hue = readInteger(rawData, 66);
    hueSatAdjustment.cyans.sat = readInteger(rawData, 68);
    hueSatAdjustment.cyans.brightness = readInteger(rawData, 70);
    hueSatAdjustment.blues = {};
    hueSatAdjustment.blues.beginRamp = readInteger(rawData, 72);
    hueSatAdjustment.blues.beginSustain = readInteger(rawData, 74);
    hueSatAdjustment.blues.endSustain = readInteger(rawData, 76);
    hueSatAdjustment.blues.endRamp = readInteger(rawData, 78);
    hueSatAdjustment.blues.hue = readInteger(rawData, 80);
    hueSatAdjustment.blues.sat = readInteger(rawData, 82);
    hueSatAdjustment.blues.brightness = readInteger(rawData, 84);
    hueSatAdjustment.magentas = {};
    hueSatAdjustment.magentas.beginRamp = readInteger(rawData, 86);
    hueSatAdjustment.magentas.beginSustain = readInteger(rawData, 88);
    hueSatAdjustment.magentas.endSustain = readInteger(rawData, 90);
    hueSatAdjustment.magentas.endRamp = readInteger(rawData, 92);
    hueSatAdjustment.magentas.hue = readInteger(rawData, 94);
    hueSatAdjustment.magentas.sat = readInteger(rawData, 96);
    hueSatAdjustment.magentas.brightness = readInteger(rawData, 98);
    return hueSatAdjustment;
};
function readInteger(str, pointer) {
    var byte1 = str.charCodeAt(pointer);
    var byte2 = str.charCodeAt(pointer + 1);
    var singedsShort = (byte1 <<8) + byte2;
    if (singedsShort > 0x7FFF) {
        singedsShort = 0xFFFF0000 ^ singedsShort;
    }
    return singedsShort;
}
function readAngle(str, pointer) {
    var b1 = str.charCodeAt(pointer);
    var b2 = str.charCodeAt(pointer+1);
    if(b1==0){
        var ss = b2;
    }else{
        var ss = b2+104;//???
    }
    return ss;
};

var result = getHueSatAdjustment();
JSON.stringify(result, null, 4);
