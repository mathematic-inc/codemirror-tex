import { completeFromList } from '@codemirror/autocomplete';
import { texLanguage } from '../../tex';
import mathjaxSnippetDefinitions from './mathjax.snippet.json';

// A collection of MathJax snippets for autocompletion.
export const mathjaxCompletion = texLanguage.data.of({
  autocomplete: completeFromList(mathjaxSnippetDefinitions),
});
