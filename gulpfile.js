const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');
const inlineSource = require('gulp-inline-source');

const homeCSS = ['css/animations.css', 'css/home.css'];
const homeCSSFileName = 'home.min.css';
const homeCSSOutput = 'css/';
const srcHTML = 'index.src.html';
const outputHTML = 'index.html';

gulp.task('default', ['css', 'html']);

/**
 * Concatenate, minify, and remove unused rules from CSS
 * Input: css/*, index.src.html
 * Output: css/home.min.css
 */
gulp.task('css', () => {
    const plugins = [
        uncss({
            html: srcHTML
        })
    ];

    return gulp.src(homeCSS)
        .pipe(concat(homeCSSFileName))
        .pipe(cleanCSS())
        .pipe(postcss(plugins))
        .pipe(gulp.dest(homeCSSOutput));
});

/**
 * Minify HTML
 * Input: index.src.html
 * Output: index.html
 */
gulp.task('html', () => {
    return gulp.src(srcHTML)
        .pipe(inlineSource())
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true,
            minifyJS: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.'))
  })

gulp.task('watch', () => {
    gulp.watch([homeCSS, srcHTML], ['default']);
});
