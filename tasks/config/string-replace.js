module.exports = function(grunt) {

  grunt.config.set('string-replace', {
    fillBuildInfo: {
      inline: {
        files: {
          'dest/': 'src/**',
        },
        options: {
          replacements: [
            {
              pattern: 'a',
              replacement: 'b'
            }
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-string-replace');
};
