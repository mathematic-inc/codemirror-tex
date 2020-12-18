import {
  factory,
  isNoSubstitutionTemplateLiteral,
  isTaggedTemplateExpression,
  Node,
  SourceFile,
  TransformationContext,
  visitEachChild,
  visitNode,
  Transformer,
  // eslint-disable-next-line import/no-extraneous-dependencies
} from 'typescript';

export const codepointTransformer = (ctx: TransformationContext): Transformer<SourceFile> => {
  const v = (n: Node): Node => {
    if (
      isTaggedTemplateExpression(n) &&
      n.tag.getText() === 'cp' &&
      isNoSubstitutionTemplateLiteral(n.template)
    ) {
      return factory.createNumericLiteral(n.template.text.codePointAt(0) as number);
    }

    return visitEachChild(n, v, ctx);
  };
  return (s) => visitNode(s, v);
};
