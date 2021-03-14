import Directive from './directive';

const binNumTemplate = /0b[01]+/.source;
const hexNumTemplate = /0x[a-z0-9]+/.source;
const octNumTemplate = /0o[0-8]+/.source;
const intTemplate = `${binNumTemplate}|${hexNumTemplate}|${octNumTemplate}`;
const directiveTemplate = new RegExp(
  `change category code for code point (${intTemplate}) to (${intTemplate})`,
  'i'
);

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
    context.define(codepoint, catcode);
    return context;
  },
});
