module.exports = function(grunt) {

  grunt.config.set('exec', {
    installUiDeps: {
      command: 'npm install',
      cwd: "./UI"
    },
    buildUi: {
      command: 'npm run build',
      cwd: "./UI"
    }
  });

  grunt.loadNpmTasks('grunt-exec');
};
