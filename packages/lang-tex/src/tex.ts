import { TagSystem } from "@codemirror/next/highlight";
import {
  delimitedIndent,
  foldNodeProp,
  indentNodeProp,
  LezerSyntax,
} from "@codemirror/next/syntax";
import { parser } from "lezer-tex";
import { TeXTagSystem } from "./highlight";

interface Options {
  tagSystem?: TagSystem;
}

const defaultTags = {
  // Specific tokens
  "{ }": "brace",
  "[ ]": "squareBracket",
  "ReservedCharacter": "operator",
  "Parameter": "variableName",
  "Comment": "comment",

  // Control sequence
  "ControlSequenceName": "variableName definition",

  // Control sequences
  "ControlWord": "atom",
  "ControlSpace": "separator",
  "ControlLine": "keyword",

  // Environment
  "BeginEnvironment EndEnvironment EnvEndCommand": "atom",
  "MismatchedEnvEndCommand": "atom invalid",
  "EnvironmentName": "namespace",

  // Verbatim
  "VerbContent VerbatimContent": "docString monospace",

  // Commands
  "CommandName": "atom",

  // Text formatting commands
  "textmd": "+semistrong",
  "textbf": "+strong",
  "textit textsl": "+emphasis",
  "textup": "+noemphasis",
  "texttt": "+monospace",
  "textnormal": "+normal",
  "textsc": "+smallcap",
  "underline": "+underline",

  // Math formatting commands
  "mathbf/Argument": "strong",
  "mathit/Argument": "emphasis",
  "mathtt/Argument": "monospace",
  "MathBlock MathLine": "string",

  // Math block
  "MathContent": "string emphasis",
};

const specializedTags = {
  // Text formatting commands
  textmd: "+semistrong",
  textup: "+noemphasis",
  textnormal: "+normal",
  textsc: "+smallcap",
  underline: "+underline",
};

/// A syntax provider based on the Lezer TeX parser, extended with
/// highlighting and indentation information.
export function texSyntax(option?: Options): LezerSyntax {
  const tagPropSource =
    option && option.tagSystem
      ? option.tagSystem.add(defaultTags)
      : TeXTagSystem.add(Object.assign(defaultTags, specializedTags));

  const foldPropSource = foldNodeProp.add({
    MathBlock(tree) {
      return { from: tree.start + 2, to: tree.end - 2 };
    },
    Environment(tree) {
      return {
        from: tree.firstChild?.firstChild?.end as number,
        to: tree.lastChild?.lastChild?.start as number,
      };
    },
  });

  const indentPropSource = indentNodeProp.add((type) => {
    if (type.name === "MathBlock") return delimitedIndent({ closing: "$$", align: false });

    return undefined;
  });

  const languageData = {
    closeBrackets: {
      brackets: ["(", "[", "{"],
      before: ")]}",
    },
    commentTokens: { line: "%" },
  };

  return LezerSyntax.define(
    parser.configure({
      props: [indentPropSource, foldPropSource, tagPropSource],
    }),
    {
      languageData,
    }
  );
}
