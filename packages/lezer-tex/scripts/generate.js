#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renameSync, readFileSync, writeFileSync } = require("fs");

renameSync("./src/index.terms.js", "./src/terms.ts");
renameSync("./src/index.js", "./src/index.ts");

writeFileSync(
  "./src/index.ts",
  `/* eslint-disable */ // @ts-nocheck
${readFileSync("./src/index.ts", { encoding: "utf-8" }).trim()} as Parser;
`
);
