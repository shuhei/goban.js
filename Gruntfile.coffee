module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.initConfig
    connect:
      server:
        options:
          port: 3333

