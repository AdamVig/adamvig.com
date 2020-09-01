const {dest, src, watch} = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const inlineSource = require('gulp-inline-source');

const srcHTML = 'index.src.html';

/**
 * Minify HTML and inline assets
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

exports.build = html;
exports.default = () => watch([srcHTML], html);
