/**
 * Gruntfile.js
 * Defines custom Grunt tasks for my workflow
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          services: {
            src: ['public/js/src/services/**/*.js'],
            dest: 'public/js/dist/services.js'
          },
          controllers: {
            src: ['public/js/src/controllers/**/*.js'],
            dest: 'public/js/dist/controllers.js'
          },
          directives: {
            src: ['public/js/src/directives/**/*.js'],
            dest: 'public/js/dist/directives.js'
          },
          app: {
            src: ['public/js/src/app.js',
                  'public/js/dist/services.js',
                  'public/js/dist/controllers.js',
                  'public/js/dist/directives.js'],
            dest: 'public/js/dist/app.js'
          },
        },
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
            configFile: 'public/js/test/karma.conf.js'
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
    grunt.registerTask('run-build', ['concat:services', 'concat:controllers', 'concat:directives', 'concat:app']);
};
