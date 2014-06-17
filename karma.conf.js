// Karma configuration
// Generated on Thu Oct 24 2013 23:54:33 GMT+0900 (JST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha', 'chai', 'traceur'],

    preprocessors: {
      'src/**/*.js': ['traceur'],
      'test/**/*_spec.js': ['traceur']
    },

    traceurPreprocessor: {
      options: {
        sourceMap: false,
        modules: 'register'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      'test/**/*_spec.js',
      'test/suite.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    //
    // FIXME: traceur-runtime.js doens't work right now.
    // https://github.com/karma-runner/karma-traceur-preprocessor/issues/1
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,
  });
};
