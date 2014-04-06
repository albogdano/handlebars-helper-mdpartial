---
layout: default.hbs

title: Markdown Helpers
description: Examples of how to compile markdown files to HTML using Handlebars helpers.
testvar: 33333
---

## Markdown 3

- **this comes from above**: {{externalVar}}
- **this is local**: {{testvar}}

**override me**: {{testvar}} 