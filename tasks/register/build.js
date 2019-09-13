module.exports = function(grunt) {
  grunt.registerTask('build', [
    'clean:build',
    'string-replace:fillBuildInfo',
    'exec:installUiDevDeps',
    'exec:installUiDeps',
    'exec:buildUi',
    'copy:build',
    'clean:uiNodeModules'
  ]);
};
