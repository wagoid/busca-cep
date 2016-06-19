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
    },
    updatetravis: {
      options: {
        version: '>=4.0',
        replacePreviousVersions: true,
        numberOfVersionsPerMajorNumber: 3
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        pushTo: 'origin'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-travis-node-updater');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint']);

};