/**
    cli-components-io gulpfile

    Creates the following:

    - BUILD_DIR/index.js

    Questions -> bryn.bellomy@gmail.com
 */

var gulp = require('gulp')
  , $ = require('gulp-load-plugins')()
  , jasmineReporters = require('jasmine-reporters')
  , source = require('vinyl-source-stream')
  , assign = require('object-assign')
  , fs = require('fs')
  , path = require('path')
  , del = require('del')
  , glob = require('glob')


gulp.task('default', ['clean', 'build'])

gulp.task('build', ['build-ts'])

gulp.task('build-ts', function () {
    var tsCompiler = $.typescript({
        outDir: 'build',
        typescript: require('typescript'),
        removeComments: false,
        target: 'ES5',
        module: 'commonjs',
        sortOutput: true,
        definitionFiles: true,
        noExternalResolve: true,
        sourceMap: true,
    })

    var tsResult = gulp.src(tsconfig().files)
                       .pipe(tsCompiler)

    $.merge( tsResult.js, tsResult.dts ).pipe( gulp.dest('build') )
})

gulp.task('clean', function (next) {
    del(BUILD_DIR)
    next()
})

gulp.task('watch', function () {
    gulp.watch(['src/**/*.ts', ['build-ts']])
})

gulp.task('test', ['build-tests'], function () {
    return gulp.src('spec/build/all-tests.js')
               .pipe($.jasmine({
                    verbose: true,
               }))
})

gulp.task('build-tests', function () {
    var files = glob.sync('src/**/*.spec.ts')

    var bundler = browserify({ basedir: '.', debug: true })

    // add all of the specs found by the file glob
    files.forEach(function (file) { bundler.add(file) })
    bundler.plugin('tsify') // tsify's config is automatically read from the tsconfig.json in the same directory as the gulpfile, if one exists.

    return bundler.bundle()
                  .pipe(source('all-tests.js'))
                  .pipe(gulp.dest('spec/build'))
})



var _tsconfigCache = null
function tsconfig (opts) {
    if (_tsconfigCache == null) {
        var json = fs.readFileSync(path.join(__dirname, 'tsconfig.json'))
        var obj  = JSON.parse(json)
        obj      = assign(obj, opts || {})
        _tsconfigCache = obj
    }
    return _tsconfigCache
}

