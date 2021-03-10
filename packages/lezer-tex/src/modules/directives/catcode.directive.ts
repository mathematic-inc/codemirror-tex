import Directive from './directive';

const directiveTemplate = /^Change category code for code point ((?:0(?:o[0-8]+|b[01]+|x[a-z0-9]+))|[0-9]+) to ((?:0(?:o[0-8]+|b[01]+|x[a-z0-9]+))|[0-9]+)/i;

export default new Directive<[number, number]>({
  test(directive) {
    const match = directiveTemplate.exec(directive);
    if (match) {
      const [, cp, cc] = match;
      // eslint-disable-next-line radix
      return [parseInt(cp), parseInt(cc)];
    }
    return undefined;
  },
  run(context, codepoint, catcode) {
    context.setCatCode(codepoint, catcode);
    return context;
  },
});
