
const project = "public";
const source = "#src";

let path = {
    build: {
        html: project + "/",
        css: project + "/css/",
        js: project + "/js/",
        img: project + "/img/",
        fonts: project + "/fonts/",
    },
    src: {
        html: source + "/*.html",
        css: source + "/scss/style.scss",
        js: source + "/js/script.js",
        img: source + "/img/**/*.{jpg,png,svg,ico,webp,gif}",
        fonts: source + "/fonts/*.ttf",
    },
    watch: {
        html: source + "/**/*.html",
        css: source + "/scss/**/*.scss",
        js: source + "/js/**/*.js",
        img: source + "/img/**/*.{jpg,png,svg,ico,webp,gif}",
    },
    clear: "./" + project + "/"
}

const { src, dest } = require('gulp')
const gulp = require('gulp')
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const group = require('gulp-group-css-media-queries');
const autoPrefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const rename = require('gulp-rename');




function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project + "/"
        },
        port: 3000,
        notify: false
    })
}
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}
function css() {
    return src(path.src.css)
        .pipe(
            autoPrefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(
            sass({
                outputStyle: "expanded"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        // .pipe(group())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}


function watchfile() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)

}
function clear() {
    return del(path.clear)
}


const build = gulp.series(clear, gulp.parallel(js, css, html))
const watch = gulp.parallel(build, watchfile, browserSync);


exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
