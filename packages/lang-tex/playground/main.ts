import { autocompletion } from "@codemirror/next/autocomplete";
import { closeBrackets } from "@codemirror/next/closebrackets";
import { standardKeymap } from "@codemirror/next/commands";
import { commentKeymap } from "@codemirror/next/comment";
import { foldGutter } from "@codemirror/next/fold";
import { highlightActiveLine } from "@codemirror/next/highlight-selection";
import { history, historyKeymap } from "@codemirror/next/history";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { EditorState } from "@codemirror/next/state";
import { EditorView, keymap } from "@codemirror/next/view";
import { mathjaxSnippets, texLightTheme, texSyntax } from "../src";

const test = `
\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage[latin1]{inputenc}
\\textit{test}
\\title{Getting started}
\\author{Veloci Raptor}
\\date{03/14/15}
\\begin{document}
\\maketitle
\\\\
\\&
\\0
\\csname test \\endcsname
\\textit{This is italic}
\\textbf{This is boldface}
\\textsc{This is small caps}
\\textit{
  \\textbf{
    \\textsc{
      This is italic, bold, and small caps, but
      \\textnormal{makes everything normal}
    }
  }
}
\\verb|test|
% This is a comment
\\begin{test}
This is a test
\\end{testt}
Welcome to LaTeX Base, a web-based \\LaTeX{} editor with live document preview!
Here are some things to try --

\\begin{itemize}
  \\item edit the document name above by typing in the input field
  \\item make changes to the body on the left and watch the preview update
  \\item include an image by url like this one
        \\hspace*{3em}
        $$
          test\\m
        $$
        \\includegraphics{https://latexbase.com/images/raptor.jpg}
  \\item check the compiler output by clicking the log button
  \\item format a mathematical expression like
        $\\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty}e^{-\\frac{x^2}{2}}dx$
  \\item download the document as a pdf by selecting Export $>$ Local
        Filesystem (or by clicking the desktop download button)
  \\item export your work to Dropbox or Google Drive
  \\item import an existing document from your local computer
  \\item try using the vim or emacs keyboard shortcuts
\\end{itemize}

Editing short documents online is free. View premium plans and pricing at
\\url{https://latexbase.com/static/pricing} to enjoy unlimited document editing
(online or offline) and a variety of other useful features. Thanks for trying
out our service and don't hesitate to get in touch at
\\href{mailto:support@latexbase.com}{support@latexbase.com}!

\\end{document}
`;

const syntax = texSyntax();

const startState = EditorState.create({
  doc: test,
  extensions: [
    // Keymaps
    keymap(standardKeymap, "mac"),
    keymap(historyKeymap, "mac"),
    keymap(commentKeymap, "mac"),

    // Extensions
    history(),
    highlightActiveLine(),
    syntax,
    autocompletion(),
    syntax.languageData.of({ autocomplete: mathjaxSnippets }),
    texLightTheme,
    closeBrackets(),
    bracketMatching(),
    foldGutter(),
  ],
});

(() =>
  new EditorView({
    state: startState,
    parent: document.body,
  }))();
