module.exports = function(grunt) {

  grunt.config.set('exec', {
    installUiDeps: {
      command: 'npm install',
      cwd: "./UI"
    },
    installUiDevDeps: {
      command: 'npm install --only=dev',
      cwd: "./UI"
    },
    buildUi: {
      command: 'npm run build-prod',
      cwd: "./UI"
    }
  });

  grunt.loadNpmTasks('grunt-exec');
};
