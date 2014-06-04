# handlebars-helper-mdpartial [![NPM version](https://badge.fury.io/js/handlebars-helper-mdpartial.png)](http://badge.fury.io/js/handlebars-helper-mdpartial) 

> Helpers for [Assemble](https://github.com/assemble/assemble) and [Handlebars](http://github.com/wycats/handlebars.js) 
> that make working with Markdown partials easier and more flexible.
> `{{mdpartial}}` is a block helper which renders a Markdown partial and passes data to it, and
> `{{eachPartial}}` iterates over a set of partials.


## Installation
Use [npm](npmjs.org) to install the package in your project's directory: 

```
$ cd your-project
$ npm install handlebars-helper-mdpartial --save-dev
```

### Register the helper

The easiest way to register the helper with [Assemble](https://github.com/assemble/assemble) is to add the module to `devDependencies` and `keywords` in your project's package.json:

```
{
  "devDependencies": {
    "handlebars-helper-mdpartial": "*"
  },
  "keywords": [
    "handlebars-helper-mdpartial"
  ]
}
```

Alternatively, to register the helper explicitly in the Gruntfile:

```
grunt.initConfig({
  assemble: {
    options: {
      // the "handlebars-helper-mdpartial" npm module must also be listed in
      // devDependencies for assemble to automatically resolve the helper
      helpers: ["handlebars-helper-mdpartial", "foo/*.js"]
    },
    files: {
      "dist/": ["src/templates/*.html"]
    }
  }
});
```

## `{{mdpartial}}`
Similar to [`{{partial}}`](https://github.com/helpers/handlebars-helper-partial), but this helper is used as **block helper**. 

Inside the block you can use `{{this.content}}` to get the content of the partial. Also you have access to the context (in order of precedence):

1. **given context**     : a context explicitly passed as a second parameter, e.g. `{{partial "foo" bar}}`, will win over other contexts.
2. **YAML front matter** : YAML front matter of the partial
3. **this**              : A context of `this` usually means either YAML front matter of the "inheriting" page or a block expression wrapping the helper
4. **Assemble options**  : Custom properties defined in Assemble options
5. **grunt.config.data** : Data from `grunt.config.data` (e.g. `pkg: grunt.file.readJSON("package.json"`))

**Note:** this helper can be used for all partials, not just those ending in `*.md`. If the partial ends with `*.md` then `{{this.content}}` will return the content rendered as HTML.

### Examples

```
{{#mdpartial "foo"}}
  {{this.bar}} {{this.content}}
{{/mdpartial}}
```
```
{{#mdpartial "path/to/foo.md"}}
  {{this.bar}} {{this.content}}
{{/mdpartial}}
```
Optionally pass in a context object as the second parameter:

```
{{#mdpartial "foo" contextObject}}
  {{this.bar}} {{this.content}}
{{/mdpartial}}
```

## `{{eachPartial}}`

Iterates over a set of partials and adds their data to the context object.
The set of partials can be filtered using blobbing patterns. 
It can be used inside other partials. 

The context is:

1. **YAML front matter** : YAML front matter of the partial
2. `{ partialSrc: "[filepath]", partialName: "[name]" }`
3. **Assemble options**  : Custom properties defined in Assemble options
4. **grunt.config.data** : Data from `grunt.config.data` (e.g. `pkg: grunt.file.readJSON("package.json"`))

### Examples

```
{{#eachPartial "**/*.md"}}
  ...
  {{partialSrc}} {{partialName}}
  ...  
{{/eachPartial}}
```

## Combined example

```
{{#eachPartial "**/*.md"}}
  {{#mdpartial this}}
    
    {{this.content}}
        
    {{partialSrc}} {{partialName}}
    
  {{/mdpartial}}
{{/eachPartial}}
```

## License
[MIT License](LICENSE)
