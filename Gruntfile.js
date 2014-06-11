/**
 * Gruntfile.js
 * Defines custom Grunt tasks for my workflow
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          apiClient: {
            src: ['public/js/src/PApiClient/**/*.js'],
            dest: 'public/js/dist/PApiClient.js'
          },
          constructors: {
            src: ['public/js/src/PConstructors/**/*.js'],
            dest: 'public/js/dist/PConstructors.js'
          },
					loaders : {
						src: ['public/js/src/PLoaders/**/*.js'],
						dest: 'public/js/dist/PLoaders.js'
					},
          managers: {
            src: ['public/js/src/PManagers/**/*.js'],
            dest: 'public/js/dist/PManagers.js'
          },
          utilities: {
            src: ['public/js/src/PUtilities/**/*.js'],
            dest: 'public/js/dist/PUtilities.js'
          },
          controllers: {
            src: ['public/js/src/PControllers/**/*.js'],
            dest: 'public/js/dist/PControllers.js'
          },
          directives: {
            src: ['public/js/src/PDirectives/**/*.js'],
            dest: 'public/js/dist/PDirectives.js'
          },
          app: {
            src: ['public/js/src/app.js',
                  'public/js/dist/PApiClient.js',
                  'public/js/dist/PConstructors.js',
									'public/js/dist/PLoaders.js',
                  'public/js/dist/PManagers.js',
                  'public/js/dist/PUtilities.js',
                  'public/js/dist/PControllers.js',
                  'public/js/dist/PDirectives.js'],
            dest: 'public/js/dist/app.js'
          }
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

    grunt.registerTask('run-build', ['concat:apiClient', 'concat:constructors', 'concat:managers', 'concat:loaders',
                                     'concat:utilities', 'concat:controllers', 'concat:directives', 'concat:app']);

    grunt.registerTask('run-tests', ['concat:apiClient', 'concat:constructors', 'concat:managers', 'concat:loaders',
                                     'concat:utilities', 'concat:controllers', 'concat:directives', 'concat:app',
                                     'karma:unit']);
};
