var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var util = require('util');
var karma = require('karma').server;

var port = 3333;
var paths = {
  scripts: 'src/**/*.js',
  test: 'test/**/*.js'
};

// Run karma with gulp.
// https://github.com/karma-runner/gulp-karma
// HACK: Emulate config method.
var karmaConfig = {
  config: {},
  set: function(config) {
    util._extend(this.config, config);
  },
  LOG_INFO: 'INFO'
};
require('./karma.conf.js')(karmaConfig);

gulp.task('copy-traceur-runtime', function() {
  return gulp.src('node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['copy-traceur-runtime'], function() {
  return gulp.src(paths.scripts)
    .pipe($.traceur({ modules: 'register' }))
    .pipe($.concat('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe($.connect.reload());
});

gulp.task('test', function(done) {
  var config = util._extend({}, karmaConfig.config);
  config = util._extend(config, { autoWatch: false, singleRun: true });
  karma.start(config, done);
});

gulp.task('connect', ['scripts'], function() {
  return $.connect.server({
    root: process.cwd(),
    livereload: true,
    port: port
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  karma.start(karmaConfig.config);
});

gulp.task('server', ['connect'], function() {
  return gulp.src('index.html')
    .pipe($.open('', { url: 'http://localhost:' + port }));
});

gulp.task('default', ['server', 'watch']);
gulp.task('build', ['scripts']);
