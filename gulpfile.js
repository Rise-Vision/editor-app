var gulp = require('gulp');
var gutil = require("gulp-util");
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var prettify = require('gulp-jsbeautifier');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var factory = require("widget-tester").gulpTaskFactory;
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");
var usemin = require("gulp-usemin");
var minifyCSS = require("gulp-minify-css");
var minifyHtml  = require('gulp-minify-html');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require("gulp-concat");

/*---- tooling ---*/
gulp.task('pretty', function() {
  return gulp.src('./js/**/*.js')
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./js'))
    .on('error', function (error) {
      console.error(String(error));
    });
});

var appJSFiles = [
  "./js/**/*.js"
];

var cssFiles = [
  "support-app-styles.css"
];

var localeFiles = [
  "bower_components/rv-common-i18n/dist/locales/**/*"
];

gulp.task("clean-dist", function () {
  return gulp.src("dist", {read: false})
    .pipe(rimraf());
});

gulp.task("clean-tmp", function () {
  return gulp.src("tmp", {read: false})
    .pipe(rimraf());
});

gulp.task("clean", ["clean-dist", "clean-tmp"]);

gulp.task("config", function() {
  var env = process.env.NODE_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["js/config/" + env + ".js"])
    .pipe(rename("config.js"))
    .pipe(gulp.dest("js/config"));
});

gulp.task("config-e2e", function() {
  var env = process.env.E2E_ENV || "dev";
  gutil.log("Environment is", env);

  return gulp.src(["test/e2e/config/" + env + ".json"])
    .pipe(rename("config.json"))
    .pipe(gulp.dest("test/e2e/config"));
});

gulp.task("locales", function() {
  return gulp.src(localeFiles)
    .pipe(gulp.dest("dist/locales"));
});

gulp.task("lint", function() {
  return gulp.src(appJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("html", ["lint"], function () {
  return gulp.src(['./index.html'])
     .pipe(usemin({
      html: [minifyHtml({empty: true})],
      js: [uglify({
         mangle:true,
         outSourceMap: false // source map generation doesn't seem to function correctly
       })]
    }))
    .pipe(gulp.dest("dist/"))
    .on('error',function(e){
    console.error(String(e));

    })
});

gulp.task("html2js", function() {
  return gulp.src("./partials/*.html")
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      loose: true
    }))
    .pipe(ngHtml2Js({
      moduleName: "risevision.editorApp.partials",
      prefix: "partials/"
    }))
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("./tmp/"));
});

gulp.task("css", function () {
  return gulp.src(cssFiles)
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(concat("all.min.css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("fonts", function() {
  return gulp.src("bower_components/rv-common-style/dist/fonts/**/*")
    .pipe(gulp.dest("dist/fonts"));
});

gulp.task('build', function (cb) {
  runSequence(["clean", "config"], ['pretty', 'html2js'],["html","css", "fonts", "locales"], cb);
});


//------------------------- Browser Sync --------------------------------

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    },
    port: 8000,
    open: false
  });
});

gulp.task('browser-sync-reload', function() {
  browserSync.reload();
});


/*---- testing ----*/

var unitTestFiles = [
  "bower_components/common-header/dist/js/dependencies.js",
  "bower_components/angular-mocks/angular-mocks.js",
  "bower_components/q/q.js",
  "bower_components/common-header/dist/js/common-header.js",
  "bower_components/angular-ui-router/release/angular-ui-router.js",
  "bower_components/angular-translate/angular-translate.js",
  "bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
  "bower_components/rv-common-i18n/dist/i18n.js",
  "bower_components/rv-common-app-components/dist/js/focus-me.js",
  "bower_components/rv-common-app-components/dist/js/confirm-instance.js",
  "bower_components/component-storage-selector/dist/storage-selector.js",
  "node_modules/widget-tester/mocks/segment-analytics-mock.js",
  "js/app.js",
  "js/**/*.js",
  "test/unit/translate-mock.js",
  "test/unit/**/*.tests.js"
];


gulp.task("test:unit", factory.testUnitAngular({testFiles: unitTestFiles}));

gulp.task("server", factory.testServer({https: false}));
gulp.task("server-close", factory.testServerClose());
gulp.task("test:webdrive_update", factory.webdriveUpdate());
gulp.task("test:e2e:core", ["test:webdrive_update"], factory.testE2EAngular({
  browser: "chrome",
  loginUser: process.env.E2E_USER,
  loginPass: process.env.E2E_PASS,
  testFiles: process.env.TEST_FILES
}));
gulp.task("test:e2e", function (cb) {
  runSequence("config-e2e", "html2js", "server", "test:e2e:core", "server-close", cb);
});


gulp.task("metrics", factory.metrics());
gulp.task("test",  function (cb) {
  runSequence("config", ["test:unit", "test:e2e"], cb);
});

gulp.task("test:ci",  function (cb) {
  runSequence("test:unit", "metrics", cb);
});


//------------------------- Watch --------------------------------
gulp.task('watch', function () {
  gulp.watch(['./partials/**/*.html'], ['html2js']);
  gulp.watch(['./tmp/partials.js', './js/**/*.js', './bower_components/rv-common-style/**/*', './index.html'], ['browser-sync-reload']);
  gulp.watch(unitTestFiles, ['test:unit']);
});

/*---- dev task ---*/
gulp.task('dev', ['config','browser-sync', 'watch']);


gulp.task('default', [], function() {
  console.log('***********************'.yellow);
  console.log('  gulp dev: start a server in the  root folder and watch dev files'.yellow);
  console.log('  gulp test: run unit and e2e tests'.yellow);
  console.log('  gulp build: hint, lint, and minify files into ./dist '.yellow);
  console.log('  gulp json-combine:  i18n'.yellow);
  console.log('***********************'.yellow);
  return true;
});
