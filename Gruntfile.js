module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/js/core/*.js'],
                dest: 'public/js/core/dist/<%= pkg.name %>.js'
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
};
