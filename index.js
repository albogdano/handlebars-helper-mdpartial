/**
 * Assemble + Handlebars Helpers: {{eachPartial}}, {{mdpartial}}
 * 
 * Copyright (c) 2014 Alex Bogdanovski
 * Licensed under the MIT License
 */
"use strict";

var _ = require("lodash");
var path = require("path");
var matter = require("gray-matter");
var marked = require("marked");
var minimatch = require("minimatch");

// Export helpers
module.exports.register = function(Handlebars, opts, params) {

	var assemble = params.assemble;
	var grunt = params.grunt;
	opts = opts || {};
	opts.marked = opts.marked || {};
	marked.setOptions(opts.marked);

	var omit = function(target) {
		return _.omit(target, "pages", "pagination", "collections");
	};

	/**
	 * {{eachPartial}} - block helper that iterates over multiple partials
	 * Partials can be filtered using globbing patterns.
	 *
	 * @param  {String} glob    The pattern to match against the partial name
	 * @param  {Object} options The options to pass to the partial
	 * @return {String}         Returns compiled Handlebars string
	 * @example: {{eachPartial "*.md"}}
	 */
	Handlebars.registerHelper("eachPartial", function(glob, options) {
		if (!_.isString(glob)) {
			return;
		}

		var files = assemble.partials.filter(minimatch.filter(glob));
		var ret = "";

		for (var i = 0, j = files.length; i < j; i++) {
			var src = files[i];
			var name = path.basename(src, path.extname(src));

			ret = ret + options.fn(_.extend({}, grunt.config.data, omit(opts), {
				partialSrc: src,
				partialName: name
			}, assemble.options.data[name]));
		}

		return ret;
	});

	/**
	 * {{mdpartial}} - block helper that renders Markdown and also
	 * shares data to and from the partial. Similar to {{partial}}
	 * but for Markdown partials.
	 *
	 * @param  {String} name    The name of the partial to use
	 * @param  {Object} context The context to pass to the partial
	 * @param  {Object} options The options to pass to the partial
	 * @return {String}         Returns compiled Handlebars string
	 * @example: {{mdpartial "partial-name"}}
	 */
	Handlebars.registerHelper("mdpartial", function(name, context, options) {
		if (!Array.isArray(assemble.partials)) {
			assemble.partials = [assemble.partials];
		}

		if (!_.isString(name)) {
			return;
		}

		if (!options) {
			options = context;
			context = {};
		}

		// find by name
		var filepath = _.first(_.filter(assemble.partials, function(fp) {
			return path.basename(fp, path.extname(fp)) === name;
		}));
    
		// not found - find by path
		if (!filepath || filepath.length <= 0) {
			filepath = name;
		}

		// Process context, using YAML front-matter,
		// grunt config and Assemble options.data
		var pageObj = matter.read(filepath) || {};
		var pageCtx = pageObj.context || {};
		var pageData = pageObj.data || {};
		
		// Remove page content from `this` and `opts` before creating new context
		context = _.extend({}, pageData, pageCtx, context);

		// process any templates inside context property values
		context = grunt.config.process(context);

		var compiledTemplate = Handlebars.compile(pageObj.content || "");
		var output = compiledTemplate(context).replace(/^\s+/, "");    
    	var content = (path.extname(filepath) === ".md") ? marked(output) : output;
    
		context = _.extend(context, {
			content: new Handlebars.SafeString(content),
			partialSrc: filepath,
			partialName: path.basename(filepath, path.extname(filepath))
		});

		return options.fn(context);
	});
};
