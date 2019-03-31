var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var fs = require('fs');

var files = [
    './src/frontend/dfa_client.ts'
]

gulp.task('default', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: files,
        cache: {},
        packageCache: {}
    })
    .plugin('tsify')
    .plugin('factor-bundle', {
        outputs: ['public/js/bundle/dfa.js']
    })
    .bundle()
    .pipe(fs.createWriteStream('public/js/bundle/common.js'));
});
