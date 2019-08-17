module.exports = function(grunt) {
  grunt.registerTask('build', [
    'clean:build',
    'exec:installUiDeps',
    'exec:buildUi',
    'copy:build'
  ]);
};
