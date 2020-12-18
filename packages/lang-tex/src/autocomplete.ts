import { completeSnippets } from "@codemirror/next/autocomplete";
import mathjaxSnippetDefinitions from "./mathjax.snippet.json";

// A collection of MathJax snippets for autocompletion.
export const mathjaxSnippets = completeSnippets(mathjaxSnippetDefinitions);
