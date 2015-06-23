module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            lib: {
                src: ['lib/*.js*', 'lib/*.d.ts']
            }
        },
        // ts: {
        //     lib: {
        //         src: ['lib/**/*.ts'],
        //         options: {
        //             target: 'es3',
        //             module: 'commonjs',
        //             sourceMaps: true,
        //             declaration: true,
        //             removeComments: false
        //         }
        //     }
        // },
        // copy: {
        //    lib: {
        //      files: [
        //             { expand: true, flatten: true, src: ['src/*.js'], dest: './lib/', filter: 'isFile' }
        //             ]
        //      }
        // },
        watch: {
            lib: {
                files: ['lib/**/*.ts', 'lib/**/*.coffee'],
                tasks: ['default']
            }
        }
    });
    grunt.registerTask('default', ['clean', 'ts:lib']);
};
