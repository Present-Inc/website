module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['public/js/*.js', 'public/js/controllers/*js'],
                dest: 'public/dist/<%= pkg.name %>.js'
            }
        },


        ngmin: {
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= concat.dist.dest %>'
            }
        },


        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'public/js/core/dist/<%= pkg.name %>.min.js': ['<%= ngmin.dist.dest %>']
                }
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


        watch: {
          js: {
            files: ['public/js/*.js', 'public/js/controllers/*.js'],
            tasks: ['concat']
          },
          scss: {
              files: ['public/css/*.scss'],
              tasks: ['sass']
          }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('build', ['concat', 'ngmin', 'uglify']);
    grunt.registerTask('watch-scss', ['watch:scss']);
    grunt.registerTask('watch-js', ['watch:js']);
};
