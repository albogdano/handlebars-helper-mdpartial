---
layout: default.hbs

title: Markdown Helpers
description: Examples of how to compile markdown files to HTML using Handlebars helpers.
testvar: 67890
destpath: <%= site.dest %>
---

## Hello again, Markdown

- **this comes from above**: {{externalVar}}
- **this is local**: {{testvar}}