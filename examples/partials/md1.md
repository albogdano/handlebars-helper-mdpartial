---
layout: default.hbs

title: Markdown Helpers
description: Examples of how to compile markdown files to HTML using Handlebars helpers.
testvar: 12345

# Use lodash templates for "global" data
destpath: <%= site.dest %>
---

## Hello Markdown 1

- **this comes from above**: {{externalVar}}
- **this is local**: {{testvar}}
- **this is lodash**: {{destpath}}