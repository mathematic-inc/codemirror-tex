# `lezer-tex`<!-- omit in toc -->

This repository holds [`lezer`](https://lezer.codemirror.net/)-compatible TeX grammar for use with
[codemirror 6](https://codemirror.net/6/).

This package should be used in conjuction with `lang-tex`, but custom `TeX` language packs could use
this as a parser.

- [Background](#background)
- [Features](#features)
  - [Commands](#commands)
- [FAQ](#faq)
  - [Why is `\blahblahblah` not executable?](#why-is-blahblahblah-not-executable)
- [License](#license)

## Background

Since
[TeX is context-sensitive](https://tex.stackexchange.com/questions/4201/is-there-a-bnf-grammar-of-the-tex-language),
we parse TeX according to a specific context. Specifically, we assume certain built-in macros are
not redefined (such as `\begingroup`, `\csname`, `\endgroup`, and many others). In doing so, the
context is clear, so we can interpret the built-in macros as usual without worry.

## Features

This parser is particularly strong since it parses tokens in the same way `TeX` parses tokens. In
particular, this allows built-in tokens (e.g. commands) to modify the parser as the input is read.

### Commands

The following is a table of supported commands and the
[dialects](https://lezer.codemirror.net/docs/guide/#dialects) they are supported in:

{{{commands}}}

## FAQ

### Why is `\blahblahblah` not executable?

There are two reasons a given command may not be executable:

1. It is from a package.
2. It will destroy the parser.

Package commands are generally specific to a given document, so implementing the command generically
would just increase the size of the parser.

For the second reason, more likely than not, the command will either increase the parser's runtime
or make the parser unusable. For example, definition commands (such as `\newcommand`, `\def`, etc)
can build inescapable loops for the parser.

If you would like a particular command to be executed (and you have thoroughly researched its
ramifications),
[submit an issue](https://github.com/mu-io/codemirror-tex/issues/new?assignees=jun-sheaf&labels=enhancement&template=command-request.md&title=feat%28lezer-tex%29%3A+%60%5Cblahblahblah%60+%3C--+insert+name+of+command)
and we will try to accomodate.

## License

The code is licensed under a GNU general public license.
