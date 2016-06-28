var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    cssnano = require('gulp-cssnano'),
    gulpFilter = require('gulp-filter'),
    ngAnnotate = require('gulp-ng-annotate');

var paths = {
    styles: ['./app/styles/**/*.less','!./app/styles/variables/bootstrap-overrides.less'],
    scripts: ['./app/modules/**/*.js', './app/test/scripts/backendStubs.js', './app/scripts/**/*.js', '!./app/modules/**/*.spec.js'],
    html: ['./app/modules/**/*.html'],
    fonts: ['./app/fonts/**/*'],
    testData: ['./app/test/data/**/*'],
    config: './config/*.json'
};

// clean
gulp.task('clean', function () {
    return del([
        './build/**/*'
    ]);
});

gulp.task('clean-tmp', ['vendor-build'], function () {
    return del([
        './.tmp'
    ]);
});

// vendor scripts and css
gulp.task('bower', ['clean'], function () {
    var jsFilter = gulpFilter('*.js', {restore: true});
    var cssFilter = gulpFilter(['*.css','*.less'], {restore: true});

    return gulp.src(mainBowerFiles())
    // js
        .pipe(jsFilter)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/scripts'))
        .pipe(jsFilter.restore)

        // css
        .pipe(cssFilter)
        .pipe(less())
        .pipe(concat('bower.css'))
        .pipe(gulp.dest('./.tmp'))
        .pipe(cssFilter.restore);
});

// handle bootstrap separately to facilitate bootstrap overrides
// copy bootstrap mixins
gulp.task('bootstrapMixins', ['bower'], function () {
    return gulp.src('./app/bower_components/bootstrap/less/mixins/*.less')
        .pipe(gulp.dest('./.tmp/bootstrap/mixins'));
});

// copy bootstrap less files
gulp.task('bootstrap', ['bootstrapMixins'], function () {
    return gulp.src('./app/bower_components/bootstrap/less/*.less')
        .pipe(gulp.dest('./.tmp/bootstrap'));
});

// concat bootstrap variables and custom bootstrap override variables
gulp.task('bootstrapVariables', ['bootstrap'], function () {
    return gulp.src(['./app/bower_components/bootstrap/less/variables.less','./app/less/variables/bootstrap-overrides.less'])
        .pipe(concat('variables.less'))
        .pipe(gulp.dest('./.tmp/bootstrap'));
});

// compile bootstrap less
gulp.task('compileBootstrap', ['bootstrapVariables'], function () {
    return gulp.src('./.tmp/bootstrap/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('./.tmp'))
});

// concat bootstrap and other bower css
gulp.task('vendor', ['compileBootstrap'], function () {
    return gulp.src('./.tmp/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/stylesheets'));
});

// vendor fonts
gulp.task('fontawesome', ['clean'], function () {
    return gulp.src('./app/bower_components/font-awesome/fonts/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('glyphicons', ['clean'], function () {
    return gulp.src('./app/bower_components/bootstrap/fonts/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('ui-grid', ['clean'], function () {
    return gulp.src('./app/bower_components/angular-ui-grid/**/*.{otf,eot,woff,woff2,svg,ttf}')
        .pipe(gulp.dest('./build/stylesheets'));
});

gulp.task('vendor-fonts', ['fontawesome','glyphicons', 'ui-grid']);

gulp.task('vendor-build', ['vendor', 'vendor-fonts']);

// app
var appJs = function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-js', ['clean'], appJs);
gulp.task('app-js-watch', appJs);

var appConfig = function () {
    return gulp.src(paths.config)
        .pipe(gulp.dest('./build/config'));
};
gulp.task('app-config', ['clean'], appConfig);

var appHtml = function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/modules'));
};
gulp.task('app-html', ['clean'], appHtml);
gulp.task('app-html-watch', appHtml);

var appCss = function () {
    return gulp.src('./app/styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/stylesheets'));
};
gulp.task('app-css', ['clean'], appCss);
gulp.task('app-css-watch', appCss);

var appFonts = function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./build/fonts'));
};
gulp.task('app-fonts', ['clean'], appFonts);

var appTestData = function () {
    return gulp.src(paths.testData)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/test/data'));
};
gulp.task('app-test-data', ['clean'], appTestData);
gulp.task('app-test-data-watch', appTestData);

gulp.task('app-build', ['app-js', 'app-config', 'app-html', 'app-css', 'app-fonts', 'app-test-data']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint({ devel: true, debug: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// dev server
gulp.task('connect', ['build'], function () {
    connect.server({
        port: 9000,
        root: 'build',
        livereload: true
    });
});

// watch files
gulp.task('watch', ['connect'], function () {
    gulp.watch(paths.html, ['app-html-watch']);
    //gulp.watch(paths.scripts, ['lint', 'app-js-watch']);
    gulp.watch(paths.scripts, ['app-js-watch']);
    gulp.watch(paths.styles, ['app-css-watch']);
});

// build
gulp.task('build', ['vendor-build', 'clean-tmp', 'app-build'], function () {
    return gulp.src(['app/index.html'],{base: 'app/'})
        .pipe(gulp.dest('build'));
});

// default gulp task
gulp.task('default', ['watch']);
