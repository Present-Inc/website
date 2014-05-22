/**
 * Gruntfile.js
 * Defines custom Grunt tasks for my workflow
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        con
        sass: {
            dist: {
                options: {
                    style: 'compact',
                    lineNumbers: false
                },
                files: {
                  'public/css/main.css' : 'public/css/main.scss'
                }
            }
        },
        karma: {
          unit: {
            configFile: 'tests/runner/karma.config.js'
          }
        },
        watch: {
          scss: {
              files: ['public/css/*.scss'],
              tasks: ['sass']
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-karma');


    grunt.registerTask('run-sass', ['watch:scss']);
    grunt.registerTask('run-karma', ['karma']);
};
