# `lezer-tex`

This is a TeX grammar for the
[lezer](https://lezer.codemirror.net/) parser system.

Since [TeX is context-sensitive](https://tex.stackexchange.com/questions/4201/is-there-a-bnf-grammar-of-the-tex-language?rq=1), we parse TeX according to a specific context. Specifically, we assume certain in-built macros are not redefined (such as `\begin`, `\csname`, `\end`, and many others). In doing so, the context is clear, so we can interpret the in-built macros as usual without worry.

This package should be used in conjuction with `lang-tex`.

The code is licensed under an MIT license.
