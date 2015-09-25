var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var homeCSS = ['css/normalize.css', 'css/skeleton.css', 'css/animations.css', 'css/home.css'];
var homeCSSFileName = 'home.min.css';
var homeCSSOutput = 'css/';

gulp.task('default', function() {
  return gulp.src(homeCSS)
    .pipe(concat(homeCSSFileName))
    .pipe(minifyCSS({compatibility: 'ie9'}))
    .pipe(gulp.dest(homeCSSOutput));
});

gulp.task('watch', function() {
  gulp.watch(homeCSS, ['default']);
});
