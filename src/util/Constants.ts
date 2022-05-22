/**
 * Created by xiaoqiang
 * @date
 * @description
 */

export enum Kind {
    kAnySheet             = 0,
    kPixelSheet           = 1,
    kAdjustmentSheet      = 2,
    kTextSheet            = 3,
    kVectorSheet          = 4,
    kSmartObjectSheet     = 5,
    kVideoSheet           = 6,
    kLayerGroupSheet      = 7,
    k3DSheet              = 8,
    kGradientSheet        = 9,
    kPatternSheet         = 10,
    kSolidColorSheet      = 11,
    kBackgroundSheet      = 12,
    kHiddenSectionBounder = 13
}

export enum DocumentFormat {
    PHOTOSHOP = "Photoshop",
    JPEG = "JPEG",
    PNG = "PNG"
}
