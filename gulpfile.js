var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var fs = require('fs');
var watchify = require('watchify');
var gutil = require('gulp-util');

var files = [
    './src/frontend/dfa_client.ts'
]

/*gulp.task('backup', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: files,
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .plugin('factor-bundle', {
        outputs: ['public/js/bundle/dfa.js']
    })
    .bundle()
    .pipe(fs.createWriteStream('public/js/bundle/common.js'));
});*/

var watchedBrowserify = watchify(
    browserify({
        basedir: '.',
        debug: true,
        entries: files,
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
);

function bundle() {
    return watchedBrowserify.plugin('factor-bundle', {
        outputs: ['public/js/bundle/dfa.js']
    })
    .bundle()
    .pipe(fs.createWriteStream('public/js/bundle/common.js'));
}

gulp.task("default", bundle);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);