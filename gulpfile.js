var gulp = require('gulp'),
    // html
    html_templating = require('gulp-handlebars'),
    // css/scss
    css_prefixer = require('gulp-autoprefixer'),
    scss = require('gulp-sass'),
    csso = require('gulp-csso'),
    // js
    js_plumber = require('gulp-plumber'),
    js_babel = require('gulp-babel'),
    js_uglify = require('gulp-uglify'),
    // misc
    gulp_rename = require('gulp-rename'),
    gulp_wrap = require('gulp-wrap'),
    gulp_declare = require('gulp-declare'),
    gulp_concat = require('gulp-concat'),
    gulp_sourcemaps = require('gulp-sourcemaps'),
    gulp_cached = require('gulp-cached');

// build html
gulp.task('build_html', function () {
    gulp.src('./src/html/**/*.html')
        .pipe(gulp_cached('cached-html'))
        .pipe(gulp.dest('./dist'));
});

// build css from scss
gulp.task('build_scss', function(){
    gulp.src("./src/scss/**/*.scss")
        .pipe(gulp_cached('cached-scss'))
        .pipe(gulp_sourcemaps.init())
        .pipe(scss({ includePaths: ['./node_modules'] }).on('error', scss.logError))
        .pipe(css_prefixer( {
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp_sourcemaps.write("."))
        .pipe(gulp.dest('./dist/css'));
});

// build js and babelify
gulp.task('build_js', function(){
    gulp.src('./src/js/*.js')
        .pipe(gulp_cached('cached-js'))
        .pipe(js_plumber())
        .pipe(js_babel({
            presets: ['es2015', 'es2017'],
            plugins: ["transform-remove-strict-mode"]
        }))
        .pipe(gulp_sourcemaps.init())
        .pipe(js_uglify())
        .pipe(gulp_sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'));
});

// build assets
gulp.task('build_assets', function () {
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest('./dist/assets'));
});

// build handlebars templates
gulp.task('build_templates', function() {
    gulp.src('./src/html/**/*.hbs')
        .pipe(js_plumber())
        .pipe(html_templating())
        .pipe(gulp_wrap('Handlebars.template(<%= contents %>)'))
        .pipe(gulp_declare({
            namespace: 'Templates',
            noRedeclare: true // Avoid duplicate declarations
        }))
        .pipe(gulp_concat('templates.js'))
        .pipe(js_uglify())
        .pipe(gulp.dest('./dist/js/templates'))
        .pipe(gulp_cached('cached-templates'));
});
    
// import vendor libraries
gulp.task('import_vendors', function () {
    gulp.src('./node_modules/handlebars/dist/handlebars.runtime.min.js')
        .pipe(gulp.dest('./dist/js/vendors'));
    
    gulp.src('./node_modules/promise-polyfill/promise.min.js')
        .pipe(gulp.dest('./dist/js/vendors'));
    
    gulp.src('./node_modules/babel-polyfill/dist/polyfill.min.js')
        .pipe(rename({
            basename: "babel-polyfill.min"
        }))
        .pipe(gulp.dest('./dist/js/vendors'));
});

// watch files and run specified task
gulp.task('watch', function () {
    gulp.watch('./src/html/**/*.html', ['build_html']);
    gulp.watch('./src/scss/**/*.scss', ['build_scss']);
    gulp.watch('./src/js/**/*.js', ['build_js']);
    gulp.watch('./src/assets/**/*', ['build_assets']);
    gulp.watch('./src/html/**/*.hbs', ['build_templates']);
});
    
gulp.task('build', ['build_html','build_scss', 'build_js', 'build_assets', "build_templates"]);