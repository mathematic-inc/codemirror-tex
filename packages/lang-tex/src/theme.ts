import { TeXTagSystem } from "./highlight";

const defaultStyles = {
  "deleted": { textDecoration: "line-through" },
  "inserted": { textDecoration: "underline" },
  "link": { textDecoration: "underline" },
  "strong": { fontWeight: "bold" },
  "emphasis": { fontStyle: "italic" },
  "invalid": { color: "#f00" },
  "keyword": { color: "#708" },
  "atom, bool": { color: "#219" },
  "number": { color: "#164" },
  "string": { color: "#a11" },
  "regexp, escape": { color: "#e40" },
  "variableName definition": { color: "#00f" },
  "typeName": { color: "#085" },
  "className": { color: "#167" },
  "propertyName definition": { color: "#00c" },
  "comment": { color: "#940" },
  "meta": { color: "#555" },
};

const newStyles = {
  "atom, bool": { color: "rgb(0, 92, 197)" },
  "docString": { color: "rgb(3, 47, 98)" },
  "comment": { color: "rgb(106, 115, 125)" },
  "invalid": { backgroundColor: "#f00", color: "white!important", padding: "1px 2px" },
  "variableName definition": { color: "rgb(111, 66, 193)" },
  "variableName": { color: "#e36209" },
  "operator": { color: "#d73a49" },
  "namespace": { color: "#28a745", textDecoration: "underline" },
  "keyword": { color: "rgb(0, 92, 197)" },
};

export const texLightTheme = TeXTagSystem.highlighter(
  Object.assign(defaultStyles, newStyles, {
    underline: { textDecoration: "underline" },
    semistrong: { fontWeight: "500" },
    noemphasis: { fontStyle: "normal" },
    normal: {
      fontStyle: "unset",
      fontWeight: "unset",
      fontVariant: "unset!important",
    },
    smallcap: { fontVariant: "small-caps" },
  })
);
