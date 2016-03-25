module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['*.js'],
      options: {
        esnext: true,
        node: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);

};