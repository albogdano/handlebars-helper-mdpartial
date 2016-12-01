/*
 * handlebars-helper-mdpartial
 *
 * Alex Bogdanovski
 * https://github.com/albogdano/handlebars-helper-mdpartial
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON("package.json"),
    site: grunt.file.readJSON("assemble.json"),
    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        layouts: "<%= site.layouts %>",
        layout: "<%= site.layout %>",
        plugins: ["<%= site.plugins %>/*.js"],
        helpers: ["index.js"],
        partials: ["<%= site.partials %>/*.{html,md}"],
        template: "<%= site.template %>",
        // Metadata
        pkg: "<%= pkg %>",
        site: "<%= site %>",
      },
      htmls: {
        files: {
          "<%= site.dest %>/": ["<%= site.templates %>/*.html"]
        }
      }
    },
    copy: {
      content: {
        files: [{
          flatten: true,
          expand: true,
          cwd: "<%= site.templates %>/",
          src: ["*.html"],
          dest: "<%= site.dest %>/"
        }]
      }
    },
    // Before generating new files remove files from previous build.
    clean: {
      dest: ["<%= site.dest %>/**"]
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-assemble");

  grunt.registerTask("default", ["clean", "copy:content", "assemble"]);
};
