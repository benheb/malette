
/* global module */
module.exports = function (config) {
  'use strict';
  config.set({
    
    autoWatch: true,

    singleRun: false,
    
    frameworks: [ 'browserify', 'jasmine' ],

    preprocessors: {
      'src/**/*.js': [ 'browserify' ],
      'spec/**/*.js': [ 'browserify' ]
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    },

    files: [
      'spec/**/*.js'
    ],
    
    // proxies: {
    //   '/base': '/base/src'
    // },
    
    browsers: [ 'PhantomJS' ],
    
    reporters: [ 'progress' ],

  });
};
