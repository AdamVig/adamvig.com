var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uncss = require('gulp-uncss');
var critical = require('critical');

var homeCSS = ['css/normalize.css', 'css/skeleton.css', 'css/animations.css', 'css/home.css'];
var homeCSSFileName = 'home.min.css';
var homeCSSOutput = 'css/';
var srcHTML = 'index.src.html';
var outputHTML = 'index.html';

gulp.task('default', ['css', 'critical']);

/**
 * Concatenate, minify, and remove unused rules from CSS
 * Input: css/*, index.src.html
 * Output: css/home.min.css
 */
gulp.task('css', function () {
    return gulp.src(homeCSS)
        .pipe(concat(homeCSSFileName))
        .pipe(minifyCSS({compatibility: 'ie9'}))
        .pipe(uncss({html: [srcHTML]}))
        .pipe(gulp.dest(homeCSSOutput));
});

/**
 * Inlines critical path CSS to improve page render time
 * Input: index.src.html, all CSS files referenced by index.src.html
 * Output: index.html
 */
gulp.task('critical', function () {
    critical.generate({
        inline: true,
        base: './',
        src: srcHTML,
        dest: outputHTML,
        minify: true,
        width: 320,
        height: 480
    });
});


gulp.task('watch', function() {
    gulp.watch(homeCSS, ['default']);
});
