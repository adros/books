module.exports = function(grunt) {
  grunt.registerTask('build', [
    'clean:build',
    'exec:installUiDevDeps',
    'exec:installUiDeps',
    'exec:buildUi',
    'copy:build'
  ]);
};
