module.exports = function(grunt) {
  grunt.registerTask('build', [
    'clean:build',
    'string-replace:fillBuildInfo',
    /*'exec:installUiDevDeps',
    // TODO cleanup dev deps & also deps (but perf??? of build)
    'exec:installUiDeps',
    'exec:buildUi',
    'copy:build'*/
  ]);
};
