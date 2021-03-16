import { completeFromList } from '@codemirror/autocomplete';
import mathjaxSnippetDefinitions from './mathjax.snippet.json';

// A collection of MathJax snippets for autocompletion.
export const mathjaxCompletionSource = completeFromList(mathjaxSnippetDefinitions);
