module.exports = function(grunt) {
  grunt.registerTask('build', [
    'clean:build',
    'exec:installUiDevDeps',
    // TODO cleanup dev deps & also deps (but perf??? of build)
    'exec:installUiDeps',
    'exec:buildUi',
    'copy:build'
  ]);
};
