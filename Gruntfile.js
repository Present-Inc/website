/**
 * Gruntfile.js
 * Defines custom Grunt tasks for my workflow
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          apiClient: {
            src: ['public/js/src/apiClient/**/*.js'],
            dest: 'public/js/dist/apiClient.js'
          },
          constructors: {
            src: ['public/js/src/constructors/**/*.js'],
            dest: 'public/js/dist/constructors.js'
          },
          loaders: {
            src: ['public/js/src/loaders/**/*.js'],
            dest: 'public/js/dist/loaders.js'
          },
          managers: {
            src: ['public/js/src/managers/**/*.js'],
            dest: 'public/js/dist/managers.js'
          },
          utilities: {
            src: ['public/js/src/utilities/**/*.js'],
            dest: 'public/js/dist/utilities.js'
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
                  'public/js/dist/apiClient.js',
                  'public/js/dist/constructors.js',
                  'public/js/dist/loaders.js',
                  'public/js/dist/managers.js',
                  'public/js/dist/utilities.js',
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

    grunt.registerTask('run-build', ['concat:apiClient', 'concat:constructors', 'concat:loaders', 'concat:managers',
                                     'concat:utilities', 'concat:controllers', 'concat:directives', 'concat:app']);

    grunt.registerTask('run-tests', ['concat:apiClient', 'concat:constructors', 'concat:loaders', 'concat:managers',
                                     'concat:utilities', 'concat:controllers', 'concat:directives', 'concat:app',
                                     'karma:unit']);
};
