const {dest, series, src, watch} = require('gulp');
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

/**
 * Concatenate, minify, and remove unused rules from CSS
 * Input: css/*, index.src.html
 * Output: css/home.min.css
 */
function css() {
    const plugins = [
        uncss({
            html: outputHTML
        })
    ];

    return src(homeCSS)
        .pipe(concat(homeCSSFileName))
        .pipe(cleanCSS())
        .pipe(postcss(plugins))
        .pipe(dest(homeCSSOutput));
};

/**
 * Minify HTML and inline assets
 * This task is defined as a function so it can be reused. Since the HTML and CSS tasks have a circular dependency on
 * each other (UnCSS needs the finished HTML, inlineSource needs the finished CSS), the tasks must be run in the order
 * HTML -> CSS -> HTML.
 * Input: index.src.html
 * Output: index.html
 */
function html() {
    return src(srcHTML)
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
        .pipe(dest('.'));
};

exports.build = series(html, css, html);
exports.default = () => watch([...homeCSS, srcHTML], series(html, css, html));
