# `lang-tex`

This is the TeX extension for CodeMirror 6.

Since TeX can change its notation during parsing, we can't expect any semantic meaning in any given command. However, there are a lot of **best practices** with TeX, so this project, along with [`lezer-tex`](https://github.com/mu-io/lezer-tex), are based on these best practices.

## Usage

### Syntax

For the syntax extension, you must call `texSyntax`:

```typescript
import { texSyntax } from "lang-tex";
const syntax = texSyntax();
```

It can take an optional object that specifies what `TagSystem` to use via the `tagSystem` key.

> Remark: The tag system must extend the default CodeMirror tag system. By default, **we use our TeX tag system**, as opposed to the default CodeMirror tag system.

### Highlighting

We currently provide a light theme extension accessible via `texLightTheme`. In order to use this theme however, the tag system must be our TeX tag system. You can create your own theme by using the `highlighter` function of our `TeXTagSystem` like so:

```typescript
import { TeXTagSystem } from "lang-tex";
const highlighter = TeXTagSystem.highlighter(...ReactCSSStyleLikeObject)
```

### Autocomplete

We currently only provide MathJax snippets. You can provide your own by following the CodeMirror `autocomplete` module docs.

MVP:

```typescript
import { mathjaxSnippets, texSyntax, TeXTagSystem } from "../dist";
import { autocompletion } from "@codemirror/next/autocomplete";

// You must declare the syntax as a variable
const syntax = texSyntax();

// Adding the mathjax snippets to the syntax.
const texSupport = [syntax, syntax.languageData.of({ autocomplete: mathjaxSnippets })];

// DON'T FORGET THE `autocomplete` EXTENSION ITSELF!
const autocompleteExt = [autocompletion()].concat(texSupport)
```

## Suggestions?

Since TeX can be used *everywhere*, we welcome suggestions for specific syntax with TeX (e.g. `tikzpicture` syntax). *You must provide an explicit BNF grammar (or BNF-like grammar)*.
 