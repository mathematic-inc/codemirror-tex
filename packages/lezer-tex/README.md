# `lezer-tex`<!-- omit in toc -->

This responsitory holds [`lezer`](https://lezer.codemirror.net/)-compatible TeX grammar for use with
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

### Block Symbol
[Top](#lezer-tex) • **Symbol** • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|` `|Built-in|`false`|
|`-`|Built-in|`false`|
|`/`|Built-in|`false`|

### Block A
[Top](#lezer-tex) • [Symbol](#block-Symbol) • **A** • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`above`|Built-in|`false`|
|`abovedisplayshortskip`|Built-in|`false`|
|`abovedisplayskip`|Built-in|`false`|
|`abovewithdelims`|Built-in|`false`|
|`accent`|Built-in|`false`|
|`adjdemerits`|Built-in|`false`|
|`adjustspacing`|`luatex`|`false`|
|`advance`|Built-in|`false`|
|`afterassignment`|Built-in|`false`|
|`aftergroup`|Built-in|`false`|
|`alignmark`|`luatex`|`false`|
|`aligntab`|`luatex`|`false`|
|`atop`|Built-in|`false`|
|`atopwithdelims`|Built-in|`false`|
|`attribute`|`luatex`|`false`|
|`attributedef`|`luatex`|`false`|
|`automaticdiscretionary`|`luatex`|`false`|
|`automatichyphenmode`|`luatex`|`false`|
|`automatichyphenpenalty`|`luatex`|`false`|

### Block B
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • **B** • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`badness`|Built-in|`false`|
|`baselineskip`|Built-in|`false`|
|`batchmode`|Built-in|`false`|
|`begincsname`|`luatex`|`false`|
|`begingroup`|Built-in|`true`|
|`beginL`|`etex`, `pdftex`, `xetex`|`false`|
|`beginR`|`etex`, `pdftex`, `xetex`|`false`|
|`belowdisplayshortskip`|Built-in|`false`|
|`belowdisplayskip`|Built-in|`false`|
|`binoppenalty`|Built-in|`false`|
|`bodydir`|`luatex`|`false`|
|`bodydirection`|`luatex`|`false`|
|`botmark`|Built-in|`false`|
|`botmarks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`boundary`|`luatex`|`false`|
|`box`|Built-in|`false`|
|`boxdir`|`luatex`|`false`|
|`boxdirection`|`luatex`|`false`|
|`boxmaxdepth`|Built-in|`false`|
|`breakafterdirmode`|`luatex`|`false`|
|`brokenpenalty`|Built-in|`false`|

### Block C
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • **C** • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`catcode`|Built-in|`false`|
|`catcodetable`|`luatex`|`false`|
|`char`|Built-in|`false`|
|`chardef`|Built-in|`false`|
|`charsubdef`|`tex`, `etex`, `pdftex`|`false`|
|`charsubdefmax`|`tex`, `etex`, `pdftex`|`false`|
|`cleaders`|Built-in|`false`|
|`clearmarks`|`luatex`|`false`|
|`closein`|Built-in|`false`|
|`closeout`|Built-in|`false`|
|`clubpenalties`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`clubpenalty`|Built-in|`false`|
|`compoundhyphenmode`|`luatex`|`false`|
|`copy`|Built-in|`false`|
|`copyfont`|`luatex`|`false`|
|`count`|Built-in|`false`|
|`countdef`|Built-in|`false`|
|`cr`|Built-in|`false`|
|`crampeddisplaystyle`|`luatex`|`false`|
|`crampedscriptscriptstyle`|`luatex`|`false`|
|`crampedscriptstyle`|`luatex`|`false`|
|`crampedtextstyle`|`luatex`|`false`|
|`crcr`|Built-in|`false`|
|`csname`|Built-in|`false`|
|`csstring`|`luatex`|`false`|
|`currentgrouplevel`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`currentgrouptype`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`currentifbranch`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`currentiflevel`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`currentiftype`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|

### Block D
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • **D** • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`day`|Built-in|`false`|
|`deadcycles`|Built-in|`false`|
|`def`|Built-in|`false`|
|`defaulthyphenchar`|Built-in|`false`|
|`defaultskewchar`|Built-in|`false`|
|`delcode`|Built-in|`false`|
|`delimiter`|Built-in|`false`|
|`delimiterfactor`|Built-in|`false`|
|`delimitershortfall`|Built-in|`false`|
|`detokenize`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`dimen`|Built-in|`false`|
|`dimendef`|Built-in|`false`|
|`dimexpr`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`directlua`|`luatex`|`false`|
|`discretionary`|Built-in|`false`|
|`displayindent`|Built-in|`false`|
|`displaylimits`|Built-in|`false`|
|`displaystyle`|Built-in|`false`|
|`displaywidowpenalties`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`displaywidowpenalty`|Built-in|`false`|
|`displaywidth`|Built-in|`false`|
|`divide`|Built-in|`false`|
|`doublehyphendemerits`|Built-in|`false`|
|`dp`|Built-in|`false`|
|`draftmode`|`luatex`|`false`|
|`dump`|Built-in|`false`|
|`dviextension`|`luatex`|`false`|
|`dvifeedback`|`luatex`|`false`|
|`dvivariable`|`luatex`|`false`|

### Block E
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • **E** • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`edef`|Built-in|`false`|
|`efcode`|`pdftex`, `luatex`|`false`|
|`else`|Built-in|`false`|
|`emergencystretch`|Built-in|`false`|
|`end`|Built-in|`false`|
|`endcsname`|Built-in|`false`|
|`endgroup`|Built-in|`true`|
|`endinput`|Built-in|`false`|
|`endL`|`etex`, `pdftex`, `xetex`|`false`|
|`endlinechar`|Built-in|`false`|
|`endlocalcontrol`|`luatex`|`false`|
|`endmubyte`|`tex`, `etex`, `pdftex`|`false`|
|`endR`|`etex`, `pdftex`, `xetex`|`false`|
|`eqno`|Built-in|`false`|
|`errhelp`|Built-in|`false`|
|`errmessage`|Built-in|`false`|
|`errorcontextlines`|Built-in|`false`|
|`errorstopmode`|Built-in|`false`|
|`escapechar`|Built-in|`false`|
|`eTeXminorversion`|`luatex`|`false`|
|`eTeXrevision`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`eTeXVersion`|`luatex`|`false`|
|`eTeXversion`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`etoksapp`|`luatex`|`false`|
|`etokspre`|`luatex`|`false`|
|`everycr`|Built-in|`false`|
|`everydisplay`|Built-in|`false`|
|`everyeof`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`everyhbox`|Built-in|`false`|
|`everyjob`|Built-in|`false`|
|`everymath`|Built-in|`false`|
|`everypar`|Built-in|`false`|
|`everyvbox`|Built-in|`false`|
|`exceptionpenalty`|`luatex`|`false`|
|`exhyphenchar`|`luatex`|`false`|
|`exhyphenpenalty`|Built-in|`false`|
|`expandafter`|Built-in|`false`|
|`expanded`|`luatex`|`false`|
|`expandglyphsinfont`|`luatex`|`false`|
|`explicitdiscretionary`|`luatex`|`false`|
|`explicithyphenpenalty`|`luatex`|`false`|

### Block F
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • **F** • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`fam`|Built-in|`false`|
|`fi`|Built-in|`false`|
|`finalhyphendemerits`|Built-in|`false`|
|`firstmark`|Built-in|`false`|
|`firstmarks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`firstvalidlanguage`|`luatex`|`false`|
|`fixupboxesmode`|`luatex`|`false`|
|`floatingpenalty`|Built-in|`false`|
|`font`|Built-in|`false`|
|`fontchardp`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`fontcharht`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`fontcharic`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`fontcharwd`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`fontdimen`|Built-in|`false`|
|`fontid`|`luatex`|`false`|
|`fontname`|Built-in|`false`|
|`formatname`|`luatex`|`false`|
|`futurelet`|Built-in|`false`|

### Block G
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • **G** • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`gdef`|Built-in|`false`|
|`gleaders`|`luatex`|`false`|
|`glet`|`luatex`|`false`|
|`global`|Built-in|`false`|
|`globaldefs`|Built-in|`false`|
|`glueexpr`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`glueshrink`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`glueshrinkorder`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`gluestretch`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`gluestretchorder`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`gluetomu`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`gtoksapp`|`luatex`|`false`|
|`gtokspre`|`luatex`|`false`|

### Block H
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • **H** • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`halign`|Built-in|`false`|
|`hangafter`|Built-in|`false`|
|`hangindent`|Built-in|`false`|
|`hbadness`|Built-in|`false`|
|`hbox`|Built-in|`false`|
|`hfil`|Built-in|`false`|
|`hfill`|Built-in|`false`|
|`hfilneg`|Built-in|`false`|
|`hfuzz`|Built-in|`false`|
|`hjcode`|`luatex`|`false`|
|`hoffset`|Built-in|`false`|
|`holdinginserts`|Built-in|`false`|
|`hpack`|`luatex`|`false`|
|`hrule`|Built-in|`false`|
|`hsize`|Built-in|`false`|
|`hskip`|Built-in|`false`|
|`hss`|Built-in|`false`|
|`ht`|Built-in|`false`|
|`hyphenation`|Built-in|`false`|
|`hyphenationbounds`|`luatex`|`false`|
|`hyphenationmin`|`luatex`|`false`|
|`hyphenchar`|Built-in|`false`|
|`hyphenpenalty`|Built-in|`false`|
|`hyphenpenaltymode`|`luatex`|`false`|

### Block I
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • **I** • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`if`|Built-in|`false`|
|`ifabsdim`|`luatex`|`false`|
|`ifabsnum`|`luatex`|`false`|
|`ifcase`|Built-in|`false`|
|`ifcat`|Built-in|`false`|
|`ifcondition`|`luatex`|`false`|
|`ifcsname`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`ifdefined`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`ifdim`|Built-in|`false`|
|`ifeof`|Built-in|`false`|
|`iffalse`|Built-in|`false`|
|`iffontchar`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`ifhbox`|Built-in|`false`|
|`ifhmode`|Built-in|`false`|
|`ifincsname`|`pdftex`, `xetex`, `luatex`|`false`|
|`ifinner`|Built-in|`false`|
|`ifmmode`|Built-in|`false`|
|`ifnum`|Built-in|`false`|
|`ifodd`|Built-in|`false`|
|`ifpdfabsdim`|`pdftex`|`false`|
|`ifpdfabsnum`|`pdftex`|`false`|
|`ifpdfprimitive`|`pdftex`|`false`|
|`ifprimitive`|`xetex`, `luatex`|`false`|
|`iftrue`|Built-in|`false`|
|`ifvbox`|Built-in|`false`|
|`ifvmode`|Built-in|`false`|
|`ifvoid`|Built-in|`false`|
|`ifx`|Built-in|`false`|
|`ignoreligaturesinfont`|`luatex`|`false`|
|`ignorespaces`|Built-in|`false`|
|`immediate`|Built-in|`false`|
|`immediateassigned`|`luatex`|`false`|
|`immediateassignment`|`luatex`|`false`|
|`indent`|Built-in|`false`|
|`initcatcodetable`|`luatex`|`false`|
|`input`|Built-in|`false`|
|`inputlineno`|Built-in|`false`|
|`insert`|Built-in|`false`|
|`insertht`|`luatex`|`false`|
|`insertpenalties`|Built-in|`false`|
|`interactionmode`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`interlinepenalties`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`interlinepenalty`|Built-in|`false`|

### Block J
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • **J** • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`jobname`|Built-in|`false`|

### Block K
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • **K** • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`kern`|Built-in|`false`|
|`knaccode`|`pdftex`|`false`|
|`knbccode`|`pdftex`|`false`|
|`knbscode`|`pdftex`|`false`|

### Block L
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • **L** • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`language`|Built-in|`false`|
|`lastbox`|Built-in|`false`|
|`lastkern`|Built-in|`false`|
|`lastlinefit`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`lastnamedcs`|`luatex`|`false`|
|`lastnodetype`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`lastpenalty`|Built-in|`false`|
|`lastsavedboxresourceindex`|`luatex`|`false`|
|`lastsavedimageresourceindex`|`luatex`|`false`|
|`lastsavedimageresourcepages`|`luatex`|`false`|
|`lastskip`|Built-in|`false`|
|`lastxpos`|`luatex`|`false`|
|`lastypos`|`luatex`|`false`|
|`latelua`|`luatex`|`false`|
|`lateluafunction`|`luatex`|`false`|
|`lccode`|Built-in|`false`|
|`leaders`|Built-in|`false`|
|`left`|Built-in|`false`|
|`leftghost`|`luatex`|`false`|
|`lefthyphenmin`|Built-in|`false`|
|`leftmarginkern`|`pdftex`, `xetex`, `luatex`|`false`|
|`leftskip`|Built-in|`false`|
|`leqno`|Built-in|`false`|
|`let`|Built-in|`false`|
|`letcharcode`|`luatex`|`false`|
|`letterspacefont`|`pdftex`, `luatex`|`false`|
|`limits`|Built-in|`false`|
|`linedir`|`luatex`|`false`|
|`linedirection`|`luatex`|`false`|
|`linepenalty`|Built-in|`false`|
|`lineskip`|Built-in|`false`|
|`lineskiplimit`|Built-in|`false`|
|`localbrokenpenalty`|`luatex`|`false`|
|`localinterlinepenalty`|`luatex`|`false`|
|`localleftbox`|`luatex`|`false`|
|`localrightbox`|`luatex`|`false`|
|`long`|Built-in|`false`|
|`looseness`|Built-in|`false`|
|`lower`|Built-in|`false`|
|`lowercase`|Built-in|`false`|
|`lpcode`|`pdftex`, `xetex`, `luatex`|`false`|
|`luabytecode`|`luatex`|`false`|
|`luabytecodecall`|`luatex`|`false`|
|`luacopyinputnodes`|`luatex`|`false`|
|`luadef`|`luatex`|`false`|
|`luaescapestring`|`luatex`|`false`|
|`luafunction`|`luatex`|`false`|
|`luafunctioncall`|`luatex`|`false`|
|`luatexbanner`|`luatex`|`false`|
|`luatexrevision`|`luatex`|`false`|
|`luatexversion`|`luatex`|`false`|

### Block M
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • **M** • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`mag`|Built-in|`false`|
|`mark`|Built-in|`false`|
|`marks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`mathaccent`|Built-in|`false`|
|`mathbin`|Built-in|`false`|
|`mathchar`|Built-in|`false`|
|`mathchardef`|Built-in|`false`|
|`mathchoice`|Built-in|`false`|
|`mathclose`|Built-in|`false`|
|`mathcode`|Built-in|`false`|
|`mathdelimitersmode`|`luatex`|`false`|
|`mathdir`|`luatex`|`false`|
|`mathdirection`|`luatex`|`false`|
|`mathdisplayskipmode`|`luatex`|`false`|
|`matheqnogapstep`|`luatex`|`false`|
|`mathflattenmode`|`luatex`|`false`|
|`mathinner`|Built-in|`false`|
|`mathitalicsmode`|`luatex`|`false`|
|`mathnolimitsmode`|`luatex`|`false`|
|`mathop`|Built-in|`false`|
|`mathopen`|Built-in|`false`|
|`mathoption`|`luatex`|`false`|
|`mathord`|Built-in|`false`|
|`mathpenaltiesmode`|`luatex`|`false`|
|`mathpunct`|Built-in|`false`|
|`mathrel`|Built-in|`false`|
|`mathrulesfam`|`luatex`|`false`|
|`mathrulesmode`|`luatex`|`false`|
|`mathrulethicknessmode`|`luatex`|`false`|
|`mathscriptboxmode`|`luatex`|`false`|
|`mathscriptcharmode`|`luatex`|`false`|
|`mathscriptsmode`|`luatex`|`false`|
|`mathstyle`|`luatex`|`false`|
|`mathsurround`|Built-in|`false`|
|`mathsurroundmode`|`luatex`|`false`|
|`mathsurroundskip`|`luatex`|`false`|
|`maxdeadcycles`|Built-in|`false`|
|`maxdepth`|Built-in|`false`|
|`mdfivesum`|`xetex`|`false`|
|`meaning`|Built-in|`false`|
|`medmuskip`|Built-in|`false`|
|`message`|Built-in|`false`|
|`middle`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`mkern`|Built-in|`false`|
|`month`|Built-in|`false`|
|`moveleft`|Built-in|`false`|
|`moveright`|Built-in|`false`|
|`mskip`|Built-in|`false`|
|`mubyte`|`tex`, `etex`, `pdftex`|`false`|
|`mubytein`|`tex`, `etex`, `pdftex`|`false`|
|`mubytelog`|`tex`, `etex`, `pdftex`|`false`|
|`mubyteout`|`tex`, `etex`, `pdftex`|`false`|
|`muexpr`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`multiply`|Built-in|`false`|
|`muskip`|Built-in|`false`|
|`muskipdef`|Built-in|`false`|
|`mutoglue`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|

### Block N
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • **N** • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`newlinechar`|Built-in|`false`|
|`noalign`|Built-in|`false`|
|`noboundary`|Built-in|`false`|
|`noconvert`|`tex`, `etex`, `pdftex`|`false`|
|`noexpand`|Built-in|`false`|
|`nohrule`|`luatex`|`false`|
|`noindent`|Built-in|`false`|
|`nokerns`|`luatex`|`false`|
|`noligs`|`luatex`|`false`|
|`nolimits`|Built-in|`false`|
|`nonscript`|Built-in|`false`|
|`nonstopmode`|Built-in|`false`|
|`normaldeviate`|`luatex`|`false`|
|`nospaces`|`luatex`|`false`|
|`novrule`|`luatex`|`false`|
|`nulldelimiterspace`|Built-in|`false`|
|`nullfont`|Built-in|`false`|
|`number`|Built-in|`false`|
|`numexpr`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|

### Block O
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • **O** • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`omit`|Built-in|`false`|
|`openin`|Built-in|`false`|
|`openout`|Built-in|`false`|
|`or`|Built-in|`false`|
|`outer`|Built-in|`false`|
|`output`|Built-in|`false`|
|`outputbox`|`luatex`|`false`|
|`outputmode`|`luatex`|`false`|
|`outputpenalty`|Built-in|`false`|
|`over`|Built-in|`false`|
|`overfullrule`|Built-in|`false`|
|`overline`|Built-in|`false`|
|`overwithdelims`|Built-in|`false`|

### Block P
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • **P** • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`pagebottomoffset`|`luatex`|`false`|
|`pagedepth`|Built-in|`false`|
|`pagedir`|`luatex`|`false`|
|`pagedirection`|`luatex`|`false`|
|`pagediscards`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`pagefilllstretch`|Built-in|`false`|
|`pagefillstretch`|Built-in|`false`|
|`pagefilstretch`|Built-in|`false`|
|`pagegoal`|Built-in|`false`|
|`pageheight`|`luatex`|`false`|
|`pageleftoffset`|`luatex`|`false`|
|`pagerightoffset`|`luatex`|`false`|
|`pageshrink`|Built-in|`false`|
|`pagestretch`|Built-in|`false`|
|`pagetopoffset`|`luatex`|`false`|
|`pagetotal`|Built-in|`false`|
|`pagewidth`|`luatex`|`false`|
|`par`|Built-in|`false`|
|`pardir`|`luatex`|`false`|
|`pardirection`|`luatex`|`false`|
|`parfillskip`|Built-in|`false`|
|`parindent`|Built-in|`false`|
|`parshape`|Built-in|`false`|
|`parshapedimen`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`parshapeindent`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`parshapelength`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`parskip`|Built-in|`false`|
|`patterns`|Built-in|`false`|
|`pausing`|Built-in|`false`|
|`pdfadjustinterwordglue`|`pdftex`|`false`|
|`pdfadjustspacing`|`pdftex`|`false`|
|`pdfannot`|`pdftex`|`false`|
|`pdfappendkern`|`pdftex`|`false`|
|`pdfcatalog`|`pdftex`|`false`|
|`pdfcolorstack`|`pdftex`|`false`|
|`pdfcolorstackinit`|`pdftex`|`false`|
|`pdfcompresslevel`|`pdftex`|`false`|
|`pdfcopyfont`|`pdftex`|`false`|
|`pdfcreationdate`|`pdftex`|`false`|
|`pdfdecimaldigits`|`pdftex`|`false`|
|`pdfdest`|`pdftex`|`false`|
|`pdfdestmargin`|`pdftex`|`false`|
|`pdfdraftmode`|`pdftex`|`false`|
|`pdfeachlinedepth`|`pdftex`|`false`|
|`pdfeachlineheight`|`pdftex`|`false`|
|`pdfelapsedtime`|`pdftex`|`false`|
|`pdfendlink`|`pdftex`|`false`|
|`pdfendthread`|`pdftex`|`false`|
|`pdfescapehex`|`pdftex`|`false`|
|`pdfescapename`|`pdftex`|`false`|
|`pdfescapestring`|`pdftex`|`false`|
|`pdfextension`|`luatex`|`false`|
|`pdffakespace`|`pdftex`|`false`|
|`pdffeedback`|`luatex`|`false`|
|`pdffiledump`|`pdftex`|`false`|
|`pdffilemoddate`|`pdftex`|`false`|
|`pdffilesize`|`pdftex`|`false`|
|`pdffirstlineheight`|`pdftex`|`false`|
|`pdffontattr`|`pdftex`|`false`|
|`pdffontexpand`|`pdftex`|`false`|
|`pdffontname`|`pdftex`|`false`|
|`pdffontobjnum`|`pdftex`|`false`|
|`pdffontsize`|`pdftex`|`false`|
|`pdfforcepagebox`|`pdftex`|`false`|
|`pdfgamma`|`pdftex`|`false`|
|`pdfgentounicode`|`pdftex`|`false`|
|`pdfglyphtounicode`|`pdftex`|`false`|
|`pdfhorigin`|`pdftex`|`false`|
|`pdfignoreddimen`|`pdftex`|`false`|
|`pdfimageapplygamma`|`pdftex`|`false`|
|`pdfimagegamma`|`pdftex`|`false`|
|`pdfimagehicolor`|`pdftex`|`false`|
|`pdfimageresolution`|`pdftex`|`false`|
|`pdfincludechars`|`pdftex`|`false`|
|`pdfinclusioncopyfonts`|`pdftex`|`false`|
|`pdfinclusionerrorlevel`|`pdftex`|`false`|
|`pdfinfo`|`pdftex`|`false`|
|`pdfinfoomitdate`|`pdftex`|`false`|
|`pdfinsertht`|`pdftex`|`false`|
|`pdfinterwordspaceoff`|`pdftex`|`false`|
|`pdfinterwordspaceon`|`pdftex`|`false`|
|`pdflastannot`|`pdftex`|`false`|
|`pdflastlinedepth`|`pdftex`|`false`|
|`pdflastlink`|`pdftex`|`false`|
|`pdflastmatch`|`pdftex`|`false`|
|`pdflastobj`|`pdftex`|`false`|
|`pdflastxform`|`pdftex`|`false`|
|`pdflastximage`|`pdftex`|`false`|
|`pdflastximagecolordepth`|`pdftex`|`false`|
|`pdflastximagepages`|`pdftex`|`false`|
|`pdflastxpos`|`pdftex`, `xetex`|`false`|
|`pdflastypos`|`pdftex`, `xetex`|`false`|
|`pdflinkmargin`|`pdftex`|`false`|
|`pdfliteral`|`pdftex`|`false`|
|`pdfmapfile`|`pdftex`|`false`|
|`pdfmapline`|`pdftex`|`false`|
|`pdfmatch`|`pdftex`|`false`|
|`pdfmdfivesum`|`pdftex`|`false`|
|`pdfminorversion`|`pdftex`|`false`|
|`pdfmovechars`|`pdftex`|`false`|
|`pdfnames`|`pdftex`|`false`|
|`pdfnobuiltintounicode`|`pdftex`|`false`|
|`pdfnoligatures`|`pdftex`|`false`|
|`pdfnormaldeviate`|`pdftex`|`false`|
|`pdfobj`|`pdftex`|`false`|
|`pdfobjcompresslevel`|`pdftex`|`false`|
|`pdfoptionalwaysusepdfpagebox`|`pdftex`|`false`|
|`pdfoptionpdfinclusionerrorlevel`|`pdftex`|`false`|
|`pdfoptionpdfminorversion`|`pdftex`|`false`|
|`pdfoutline`|`pdftex`|`false`|
|`pdfoutput`|`pdftex`|`false`|
|`pdfpageattr`|`pdftex`|`false`|
|`pdfpagebox`|`pdftex`|`false`|
|`pdfpageheight`|`pdftex`, `xetex`|`false`|
|`pdfpageref`|`pdftex`|`false`|
|`pdfpageresources`|`pdftex`|`false`|
|`pdfpagesattr`|`pdftex`|`false`|
|`pdfpagewidth`|`pdftex`, `xetex`|`false`|
|`pdfpkmode`|`pdftex`|`false`|
|`pdfpkresolution`|`pdftex`|`false`|
|`pdfprependkern`|`pdftex`|`false`|
|`pdfprimitive`|`pdftex`|`false`|
|`pdfprotrudechars`|`pdftex`|`false`|
|`pdfpxdimen`|`pdftex`|`false`|
|`pdfrandomseed`|`pdftex`|`false`|
|`pdfrefobj`|`pdftex`|`false`|
|`pdfrefxform`|`pdftex`|`false`|
|`pdfrefximage`|`pdftex`|`false`|
|`pdfresettimer`|`pdftex`|`false`|
|`pdfrestore`|`pdftex`|`false`|
|`pdfretval`|`pdftex`|`false`|
|`pdfsave`|`pdftex`|`false`|
|`pdfsavepos`|`pdftex`, `xetex`|`false`|
|`pdfsetmatrix`|`pdftex`|`false`|
|`pdfsetrandomseed`|`pdftex`|`false`|
|`pdfshellescape`|`pdftex`|`false`|
|`pdfsnaprefpoint`|`pdftex`|`false`|
|`pdfsnapy`|`pdftex`|`false`|
|`pdfsnapycomp`|`pdftex`|`false`|
|`pdfstartlink`|`pdftex`|`false`|
|`pdfstartthread`|`pdftex`|`false`|
|`pdfstrcmp`|`pdftex`|`false`|
|`pdfsuppressptexinfo`|`pdftex`|`false`|
|`pdfsuppresswarningdupdest`|`pdftex`|`false`|
|`pdfsuppresswarningdupmap`|`pdftex`|`false`|
|`pdfsuppresswarningpagegroup`|`pdftex`|`false`|
|`pdftexbanner`|`pdftex`|`false`|
|`pdftexrevision`|`pdftex`|`false`|
|`pdftexversion`|`pdftex`|`false`|
|`pdfthread`|`pdftex`|`false`|
|`pdfthreadmargin`|`pdftex`|`false`|
|`pdftracingfonts`|`pdftex`|`false`|
|`pdftrailer`|`pdftex`|`false`|
|`pdftrailerid`|`pdftex`|`false`|
|`pdfunescapehex`|`pdftex`|`false`|
|`pdfuniformdeviate`|`pdftex`|`false`|
|`pdfuniqueresname`|`pdftex`|`false`|
|`pdfvariable`|`luatex`|`false`|
|`pdfvorigin`|`pdftex`|`false`|
|`pdfxform`|`pdftex`|`false`|
|`pdfxformname`|`pdftex`|`false`|
|`pdfximage`|`pdftex`|`false`|
|`pdfximagebbox`|`pdftex`|`false`|
|`penalty`|Built-in|`false`|
|`postdisplaypenalty`|Built-in|`false`|
|`postexhyphenchar`|`luatex`|`false`|
|`posthyphenchar`|`luatex`|`false`|
|`prebinoppenalty`|`luatex`|`false`|
|`predisplaydirection`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`predisplaygapfactor`|`luatex`|`false`|
|`predisplaypenalty`|Built-in|`false`|
|`predisplaysize`|Built-in|`false`|
|`preexhyphenchar`|`luatex`|`false`|
|`prehyphenchar`|`luatex`|`false`|
|`prerelpenalty`|`luatex`|`false`|
|`pretolerance`|Built-in|`false`|
|`prevdepth`|Built-in|`false`|
|`prevgraf`|Built-in|`false`|
|`primitive`|`xetex`, `luatex`|`false`|
|`protected`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`protrudechars`|`luatex`|`false`|
|`protrusionboundary`|`luatex`|`false`|
|`pxdimen`|`luatex`|`false`|

### Block Q
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • **Q** • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`quitvmode`|`pdftex`, `luatex`|`false`|

### Block R
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • **R** • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`radical`|Built-in|`false`|
|`raise`|Built-in|`false`|
|`randomseed`|`luatex`|`false`|
|`read`|Built-in|`false`|
|`readline`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`relax`|Built-in|`false`|
|`relpenalty`|Built-in|`false`|
|`right`|Built-in|`false`|
|`rightghost`|`luatex`|`false`|
|`righthyphenmin`|Built-in|`false`|
|`rightmarginkern`|`pdftex`, `xetex`, `luatex`|`false`|
|`rightskip`|Built-in|`false`|
|`romannumeral`|Built-in|`false`|
|`rpcode`|`pdftex`, `xetex`, `luatex`|`false`|

### Block S
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • **S** • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`saveboxresource`|`luatex`|`false`|
|`savecatcodetable`|`luatex`|`false`|
|`saveimageresource`|`luatex`|`false`|
|`savepos`|`luatex`|`false`|
|`savinghyphcodes`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`savingvdiscards`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`scantextokens`|`luatex`|`false`|
|`scantokens`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`scriptfont`|Built-in|`false`|
|`scriptscriptfont`|Built-in|`false`|
|`scriptscriptstyle`|Built-in|`false`|
|`scriptspace`|Built-in|`false`|
|`scriptstyle`|Built-in|`false`|
|`scrollmode`|Built-in|`false`|
|`setbox`|Built-in|`false`|
|`setfontid`|`luatex`|`false`|
|`setlanguage`|Built-in|`false`|
|`setrandomseed`|`luatex`|`false`|
|`sfcode`|Built-in|`false`|
|`shapemode`|`luatex`|`false`|
|`shbscode`|`pdftex`|`false`|
|`shellescape`|`xetex`|`false`|
|`shipout`|Built-in|`false`|
|`show`|Built-in|`false`|
|`showbox`|Built-in|`false`|
|`showboxbreadth`|Built-in|`false`|
|`showboxdepth`|Built-in|`false`|
|`showgroups`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`showifs`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`showlists`|Built-in|`false`|
|`showthe`|Built-in|`false`|
|`showtokens`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`skewchar`|Built-in|`false`|
|`skip`|Built-in|`false`|
|`skipdef`|Built-in|`false`|
|`spacefactor`|Built-in|`false`|
|`spaceskip`|Built-in|`false`|
|`span`|Built-in|`false`|
|`special`|Built-in|`false`|
|`specialout`|`tex`, `etex`, `pdftex`|`false`|
|`splitbotmark`|Built-in|`false`|
|`splitbotmarks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`splitdiscards`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`splitfirstmark`|Built-in|`false`|
|`splitfirstmarks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`splitmaxdepth`|Built-in|`false`|
|`splittopskip`|Built-in|`false`|
|`stbscode`|`pdftex`|`false`|
|`strcmp`|`xetex`|`false`|
|`string`|Built-in|`false`|
|`suppressfontnotfounderror`|`xetex`, `luatex`|`false`|
|`suppressifcsnameerror`|`luatex`|`false`|
|`suppresslongerror`|`luatex`|`false`|
|`suppressmathparerror`|`luatex`|`false`|
|`suppressoutererror`|`luatex`|`false`|
|`suppressprimitiveerror`|`luatex`|`false`|
|`synctex`|Built-in|`false`|

### Block T
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • **T** • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`tabskip`|Built-in|`false`|
|`tagcode`|`pdftex`, `luatex`|`false`|
|`textdir`|`luatex`|`false`|
|`textdirection`|`luatex`|`false`|
|`textfont`|Built-in|`false`|
|`textstyle`|Built-in|`false`|
|`TeXXeTstate`|`etex`, `pdftex`, `xetex`|`false`|
|`the`|Built-in|`false`|
|`thickmuskip`|Built-in|`false`|
|`thinmuskip`|Built-in|`false`|
|`time`|Built-in|`false`|
|`toks`|Built-in|`false`|
|`toksapp`|`luatex`|`false`|
|`toksdef`|Built-in|`false`|
|`tokspre`|`luatex`|`false`|
|`tolerance`|Built-in|`false`|
|`topmark`|Built-in|`false`|
|`topmarks`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`topskip`|Built-in|`false`|
|`tpack`|`luatex`|`false`|
|`tracingassigns`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`tracingcharsubdef`|`tex`, `etex`, `pdftex`|`false`|
|`tracingcommands`|Built-in|`false`|
|`tracingfonts`|`luatex`|`false`|
|`tracinggroups`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`tracingifs`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`tracinglostchars`|Built-in|`false`|
|`tracingmacros`|Built-in|`false`|
|`tracingnesting`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`tracingonline`|Built-in|`false`|
|`tracingoutput`|Built-in|`false`|
|`tracingpages`|Built-in|`false`|
|`tracingparagraphs`|Built-in|`false`|
|`tracingrestores`|Built-in|`false`|
|`tracingscantokens`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`tracingstats`|Built-in|`false`|

### Block U
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • **U** • [V](#block-V) • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`uccode`|Built-in|`false`|
|`Uchar`|`xetex`, `luatex`|`false`|
|`Ucharcat`|`xetex`|`false`|
|`uchyph`|Built-in|`false`|
|`Udelcode`|`xetex`, `luatex`|`false`|
|`Udelcodenum`|`xetex`, `luatex`|`false`|
|`Udelimiter`|`xetex`, `luatex`|`false`|
|`Udelimiterover`|`luatex`|`false`|
|`Udelimiterunder`|`luatex`|`false`|
|`Uhextensible`|`luatex`|`false`|
|`Uleft`|`luatex`|`false`|
|`Umathaccent`|`xetex`, `luatex`|`false`|
|`Umathaxis`|`luatex`|`false`|
|`Umathbinbinspacing`|`luatex`|`false`|
|`Umathbinclosespacing`|`luatex`|`false`|
|`Umathbininnerspacing`|`luatex`|`false`|
|`Umathbinopenspacing`|`luatex`|`false`|
|`Umathbinopspacing`|`luatex`|`false`|
|`Umathbinordspacing`|`luatex`|`false`|
|`Umathbinpunctspacing`|`luatex`|`false`|
|`Umathbinrelspacing`|`luatex`|`false`|
|`Umathchar`|`xetex`, `luatex`|`false`|
|`Umathcharclass`|`luatex`|`false`|
|`Umathchardef`|`xetex`, `luatex`|`false`|
|`Umathcharfam`|`luatex`|`false`|
|`Umathcharnum`|`xetex`, `luatex`|`false`|
|`Umathcharnumdef`|`xetex`, `luatex`|`false`|
|`Umathcharslot`|`luatex`|`false`|
|`Umathclosebinspacing`|`luatex`|`false`|
|`Umathcloseclosespacing`|`luatex`|`false`|
|`Umathcloseinnerspacing`|`luatex`|`false`|
|`Umathcloseopenspacing`|`luatex`|`false`|
|`Umathcloseopspacing`|`luatex`|`false`|
|`Umathcloseordspacing`|`luatex`|`false`|
|`Umathclosepunctspacing`|`luatex`|`false`|
|`Umathcloserelspacing`|`luatex`|`false`|
|`Umathcode`|`xetex`, `luatex`|`false`|
|`Umathcodenum`|`xetex`, `luatex`|`false`|
|`Umathconnectoroverlapmin`|`luatex`|`false`|
|`Umathfractiondelsize`|`luatex`|`false`|
|`Umathfractiondenomdown`|`luatex`|`false`|
|`Umathfractiondenomvgap`|`luatex`|`false`|
|`Umathfractionnumup`|`luatex`|`false`|
|`Umathfractionnumvgap`|`luatex`|`false`|
|`Umathfractionrule`|`luatex`|`false`|
|`Umathinnerbinspacing`|`luatex`|`false`|
|`Umathinnerclosespacing`|`luatex`|`false`|
|`Umathinnerinnerspacing`|`luatex`|`false`|
|`Umathinneropenspacing`|`luatex`|`false`|
|`Umathinneropspacing`|`luatex`|`false`|
|`Umathinnerordspacing`|`luatex`|`false`|
|`Umathinnerpunctspacing`|`luatex`|`false`|
|`Umathinnerrelspacing`|`luatex`|`false`|
|`Umathlimitabovebgap`|`luatex`|`false`|
|`Umathlimitabovekern`|`luatex`|`false`|
|`Umathlimitabovevgap`|`luatex`|`false`|
|`Umathlimitbelowbgap`|`luatex`|`false`|
|`Umathlimitbelowkern`|`luatex`|`false`|
|`Umathlimitbelowvgap`|`luatex`|`false`|
|`Umathnolimitsubfactor`|`luatex`|`false`|
|`Umathnolimitsupfactor`|`luatex`|`false`|
|`Umathopbinspacing`|`luatex`|`false`|
|`Umathopclosespacing`|`luatex`|`false`|
|`Umathopenbinspacing`|`luatex`|`false`|
|`Umathopenclosespacing`|`luatex`|`false`|
|`Umathopeninnerspacing`|`luatex`|`false`|
|`Umathopenopenspacing`|`luatex`|`false`|
|`Umathopenopspacing`|`luatex`|`false`|
|`Umathopenordspacing`|`luatex`|`false`|
|`Umathopenpunctspacing`|`luatex`|`false`|
|`Umathopenrelspacing`|`luatex`|`false`|
|`Umathoperatorsize`|`luatex`|`false`|
|`Umathopinnerspacing`|`luatex`|`false`|
|`Umathopopenspacing`|`luatex`|`false`|
|`Umathopopspacing`|`luatex`|`false`|
|`Umathopordspacing`|`luatex`|`false`|
|`Umathoppunctspacing`|`luatex`|`false`|
|`Umathoprelspacing`|`luatex`|`false`|
|`Umathordbinspacing`|`luatex`|`false`|
|`Umathordclosespacing`|`luatex`|`false`|
|`Umathordinnerspacing`|`luatex`|`false`|
|`Umathordopenspacing`|`luatex`|`false`|
|`Umathordopspacing`|`luatex`|`false`|
|`Umathordordspacing`|`luatex`|`false`|
|`Umathordpunctspacing`|`luatex`|`false`|
|`Umathordrelspacing`|`luatex`|`false`|
|`Umathoverbarkern`|`luatex`|`false`|
|`Umathoverbarrule`|`luatex`|`false`|
|`Umathoverbarvgap`|`luatex`|`false`|
|`Umathoverdelimiterbgap`|`luatex`|`false`|
|`Umathoverdelimitervgap`|`luatex`|`false`|
|`Umathpunctbinspacing`|`luatex`|`false`|
|`Umathpunctclosespacing`|`luatex`|`false`|
|`Umathpunctinnerspacing`|`luatex`|`false`|
|`Umathpunctopenspacing`|`luatex`|`false`|
|`Umathpunctopspacing`|`luatex`|`false`|
|`Umathpunctordspacing`|`luatex`|`false`|
|`Umathpunctpunctspacing`|`luatex`|`false`|
|`Umathpunctrelspacing`|`luatex`|`false`|
|`Umathquad`|`luatex`|`false`|
|`Umathradicaldegreeafter`|`luatex`|`false`|
|`Umathradicaldegreebefore`|`luatex`|`false`|
|`Umathradicaldegreeraise`|`luatex`|`false`|
|`Umathradicalkern`|`luatex`|`false`|
|`Umathradicalrule`|`luatex`|`false`|
|`Umathradicalvgap`|`luatex`|`false`|
|`Umathrelbinspacing`|`luatex`|`false`|
|`Umathrelclosespacing`|`luatex`|`false`|
|`Umathrelinnerspacing`|`luatex`|`false`|
|`Umathrelopenspacing`|`luatex`|`false`|
|`Umathrelopspacing`|`luatex`|`false`|
|`Umathrelordspacing`|`luatex`|`false`|
|`Umathrelpunctspacing`|`luatex`|`false`|
|`Umathrelrelspacing`|`luatex`|`false`|
|`Umathskewedfractionhgap`|`luatex`|`false`|
|`Umathskewedfractionvgap`|`luatex`|`false`|
|`Umathspaceafterscript`|`luatex`|`false`|
|`Umathstackdenomdown`|`luatex`|`false`|
|`Umathstacknumup`|`luatex`|`false`|
|`Umathstackvgap`|`luatex`|`false`|
|`Umathsubshiftdown`|`luatex`|`false`|
|`Umathsubshiftdrop`|`luatex`|`false`|
|`Umathsubsupshiftdown`|`luatex`|`false`|
|`Umathsubsupvgap`|`luatex`|`false`|
|`Umathsubtopmax`|`luatex`|`false`|
|`Umathsupbottommin`|`luatex`|`false`|
|`Umathsupshiftdrop`|`luatex`|`false`|
|`Umathsupshiftup`|`luatex`|`false`|
|`Umathsupsubbottommax`|`luatex`|`false`|
|`Umathunderbarkern`|`luatex`|`false`|
|`Umathunderbarrule`|`luatex`|`false`|
|`Umathunderbarvgap`|`luatex`|`false`|
|`Umathunderdelimiterbgap`|`luatex`|`false`|
|`Umathunderdelimitervgap`|`luatex`|`false`|
|`Umiddle`|`luatex`|`false`|
|`underline`|Built-in|`false`|
|`unexpanded`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`unhbox`|Built-in|`false`|
|`unhcopy`|Built-in|`false`|
|`uniformdeviate`|`luatex`|`false`|
|`unkern`|Built-in|`false`|
|`unless`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`Unosubscript`|`luatex`|`false`|
|`Unosuperscript`|`luatex`|`false`|
|`unpenalty`|Built-in|`false`|
|`unskip`|Built-in|`false`|
|`unvbox`|Built-in|`false`|
|`unvcopy`|Built-in|`false`|
|`Uoverdelimiter`|`luatex`|`false`|
|`uppercase`|Built-in|`false`|
|`Uradical`|`xetex`, `luatex`|`false`|
|`Uright`|`luatex`|`false`|
|`Uroot`|`luatex`|`false`|
|`useboxresource`|`luatex`|`false`|
|`useimageresource`|`luatex`|`false`|
|`Uskewed`|`luatex`|`false`|
|`Uskewedwithdelims`|`luatex`|`false`|
|`Ustack`|`luatex`|`false`|
|`Ustartdisplaymath`|`luatex`|`false`|
|`Ustartmath`|`luatex`|`false`|
|`Ustopdisplaymath`|`luatex`|`false`|
|`Ustopmath`|`luatex`|`false`|
|`Usubscript`|`luatex`|`false`|
|`Usuperscript`|`luatex`|`false`|
|`Uunderdelimiter`|`luatex`|`false`|
|`Uvextensible`|`luatex`|`false`|

### Block V
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • **V** • [W](#block-W) • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`vadjust`|Built-in|`false`|
|`valign`|Built-in|`false`|
|`vbadness`|Built-in|`false`|
|`vbox`|Built-in|`false`|
|`vcenter`|Built-in|`false`|
|`vfil`|Built-in|`false`|
|`vfill`|Built-in|`false`|
|`vfilneg`|Built-in|`false`|
|`vfuzz`|Built-in|`false`|
|`voffset`|Built-in|`false`|
|`vpack`|`luatex`|`false`|
|`vrule`|Built-in|`false`|
|`vsize`|Built-in|`false`|
|`vskip`|Built-in|`false`|
|`vsplit`|Built-in|`false`|
|`vss`|Built-in|`false`|
|`vtop`|Built-in|`false`|

### Block W
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • **W** • [X](#block-X) • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`wd`|Built-in|`false`|
|`widowpenalties`|`etex`, `pdftex`, `xetex`, `luatex`|`false`|
|`widowpenalty`|Built-in|`false`|
|`wordboundary`|`luatex`|`false`|
|`write`|Built-in|`false`|

### Block X
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • **X** • [Y](#block-Y)
|Name|Dialects|Executable?|
|-|-|-|
|`xchrcode`|`tex`, `etex`, `pdftex`|`false`|
|`xdef`|Built-in|`false`|
|`XeTeXcharclass`|`xetex`|`false`|
|`XeTeXcharglyph`|`xetex`|`false`|
|`XeTeXcountfeatures`|`xetex`|`false`|
|`XeTeXcountglyphs`|`xetex`|`false`|
|`XeTeXcountselectors`|`xetex`|`false`|
|`XeTeXcountvariations`|`xetex`|`false`|
|`XeTeXdashbreakstate`|`xetex`|`false`|
|`XeTeXdefaultencoding`|`xetex`|`false`|
|`XeTeXdelcode`|`xetex`|`false`|
|`XeTeXdelcodenum`|`xetex`|`false`|
|`XeTeXdelimiter`|`xetex`|`false`|
|`XeTeXfeaturecode`|`xetex`|`false`|
|`XeTeXfeaturename`|`xetex`|`false`|
|`XeTeXfindfeaturebyname`|`xetex`|`false`|
|`XeTeXfindselectorbyname`|`xetex`|`false`|
|`XeTeXfindvariationbyname`|`xetex`|`false`|
|`XeTeXfirstfontchar`|`xetex`|`false`|
|`XeTeXfonttype`|`xetex`|`false`|
|`XeTeXgenerateactualtext`|`xetex`|`false`|
|`XeTeXglyph`|`xetex`|`false`|
|`XeTeXglyphbounds`|`xetex`|`false`|
|`XeTeXglyphindex`|`xetex`|`false`|
|`XeTeXglyphname`|`xetex`|`false`|
|`XeTeXhyphenatablelength`|`xetex`|`false`|
|`XeTeXinputencoding`|`xetex`|`false`|
|`XeTeXinputnormalization`|`xetex`|`false`|
|`XeTeXinterchartokenstate`|`xetex`|`false`|
|`XeTeXinterchartoks`|`xetex`|`false`|
|`XeTeXinterwordspaceshaping`|`xetex`|`false`|
|`XeTeXisdefaultselector`|`xetex`|`false`|
|`XeTeXisexclusivefeature`|`xetex`|`false`|
|`XeTeXlastfontchar`|`xetex`|`false`|
|`XeTeXlinebreaklocale`|`xetex`|`false`|
|`XeTeXlinebreakpenalty`|`xetex`|`false`|
|`XeTeXlinebreakskip`|`xetex`|`false`|
|`XeTeXmathaccent`|`xetex`|`false`|
|`XeTeXmathchar`|`xetex`|`false`|
|`XeTeXmathchardef`|`xetex`|`false`|
|`XeTeXmathcharnum`|`xetex`|`false`|
|`XeTeXmathcharnumdef`|`xetex`|`false`|
|`XeTeXmathcode`|`xetex`|`false`|
|`XeTeXmathcodenum`|`xetex`|`false`|
|`XeTeXOTcountfeatures`|`xetex`|`false`|
|`XeTeXOTcountlanguages`|`xetex`|`false`|
|`XeTeXOTcountscripts`|`xetex`|`false`|
|`XeTeXOTfeaturetag`|`xetex`|`false`|
|`XeTeXOTlanguagetag`|`xetex`|`false`|
|`XeTeXOTscripttag`|`xetex`|`false`|
|`XeTeXpdffile`|`xetex`|`false`|
|`XeTeXpdfpagecount`|`xetex`|`false`|
|`XeTeXpicfile`|`xetex`|`false`|
|`XeTeXprotrudechars`|`xetex`|`false`|
|`XeTeXradical`|`xetex`|`false`|
|`XeTeXrevision`|`xetex`|`false`|
|`XeTeXselectorcode`|`xetex`|`false`|
|`XeTeXselectorname`|`xetex`|`false`|
|`XeTeXtracingfonts`|`xetex`|`false`|
|`XeTeXupwardsmode`|`xetex`|`false`|
|`XeTeXuseglyphmetrics`|`xetex`|`false`|
|`XeTeXvariation`|`xetex`|`false`|
|`XeTeXvariationdefault`|`xetex`|`false`|
|`XeTeXvariationmax`|`xetex`|`false`|
|`XeTeXvariationmin`|`xetex`|`false`|
|`XeTeXvariationname`|`xetex`|`false`|
|`XeTeXversion`|`xetex`|`false`|
|`xleaders`|Built-in|`false`|
|`xordcode`|`tex`, `etex`, `pdftex`|`false`|
|`xprncode`|`tex`, `etex`, `pdftex`|`false`|
|`xspaceskip`|Built-in|`false`|
|`xtoksapp`|`luatex`|`false`|
|`xtokspre`|`luatex`|`false`|

### Block Y
[Top](#lezer-tex) • [Symbol](#block-Symbol) • [A](#block-A) • [B](#block-B) • [C](#block-C) • [D](#block-D) • [E](#block-E) • [F](#block-F) • [G](#block-G) • [H](#block-H) • [I](#block-I) • [J](#block-J) • [K](#block-K) • [L](#block-L) • [M](#block-M) • [N](#block-N) • [O](#block-O) • [P](#block-P) • [Q](#block-Q) • [R](#block-R) • [S](#block-S) • [T](#block-T) • [U](#block-U) • [V](#block-V) • [W](#block-W) • [X](#block-X) • **Y**
|Name|Dialects|Executable?|
|-|-|-|
|`year`|Built-in|`false`|

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
