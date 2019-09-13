module.exports = function (grunt) {

  grunt.config.set('string-replace', {
    fillBuildInfo: {
      files: {
        './': 'UI/src/environments/**',
      },
      options: {
        replacements: [
          {
            pattern: 'HEROKU_RELEASE_CREATED_AT',
            replacement: process.env.HEROKU_RELEASE_CREATED_AT
          },
          {
            pattern: 'HEROKU_RELEASE_VERSION',
            replacement: process.env.HEROKU_RELEASE_VERSION
          },
          {
            pattern: 'HEROKU_SLUG_COMMIT',
            replacement: process.env.HEROKU_SLUG_COMMIT
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-string-replace');
};
