const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const cleanCSS = require('gulp-clean-css')
const minify = require('gulp-minify')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')

// paths 
const paths = {
    scss: './src/scss/',
    js: './src/js/',
    cssDest : './dist/css',
    jsDest : './dist/js',
}

//compile sccs into css 
function style(){
    return gulp.src(paths.scss+'*.scss')
    .pipe(sourcemaps.init({loadMaps: true,largeFile: true}))
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssDest))
    .pipe(browserSync.stream())
}

// copy images into dist 
function copyFiles(){
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images'))
    .pipe(browserSync.stream())
}

// compile scripts into dist 
function scriptjs (){
    return gulp.src(paths.js+'**/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(minify({noSource: true,keepBreaks: true}))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(browserSync.stream())
}

// watch changes 
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(paths.scss+'**/*.scss',style)
    gulp.watch(paths.js+'**/*.js',scriptjs)
    gulp.watch('./src/images/**/*',copyFiles)
    gulp.watch('./**/*.html')
    .on('change',browserSync.reload)
}

exports.style = style
exports.copyFiles = copyFiles
exports.scriptjs = scriptjs
exports.default = watch
