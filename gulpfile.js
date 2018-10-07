/**
 * Created by xiaoqiang on 2018/10/6.
 */
var gulp                    = require('gulp'),
    fs                      = require('fs'),
    path                    = require('path'),
    concat                  = require('gulp-concat');


var output_dir = './output';

gulp.task('init', function () {
    if (!fs.existsSync(output_dir)) {
        fs.mkdirSync(output_dir);
    }
});

gulp.task('copySrc', function () {
    gulp.src(['src/Application.js',
        'src/Artboard.js',
        'src/Color.js',
        'src/Document.js',
        'src/History.js',
        'src/json2.js',
        'src/Layer.js',
        'src/Line.js',
        'src/Point.js',
        'src/Rect.js',
        'src/Rectangle.js',
        'src/Selection.js',
        'src/Size.js'])
        .pipe(concat('photoshop_script_api.js'))
        .pipe(gulp.dest(output_dir));
});

gulp.task('dist', ['init', 'copySrc']);