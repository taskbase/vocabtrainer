const scssToJson = require("scss-to-json");
const fs = require("fs");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Requires two arguments: inputPath and outputPath");
} else {
  const scssVariables = scssToJson(inputPath);

  function buildEnum() {
    const keyValueEnumPairs = Object.keys(scssVariables)
      .map(
        (key) =>
          `  ${key
            .replace(/-/g, "_")
            .replace("$", "")
            .toUpperCase()} = '${key}',`
      )
      .join("\n");
    return `export enum ScssVariable {
${keyValueEnumPairs}
}`;
  }

  function buildFile() {
    const variableEnum = buildEnum();
    return `${variableEnum}

const scssVariables = ${JSON.stringify(scssVariables, null, 2).replace(
      /"/g,
      "'"
    )};

export function getScssVariable(variableKey: ScssVariable) {
  return scssVariables[variableKey];
}
`;
  }

  fs.writeFileSync(outputPath, buildFile());

  console.log("Successfully generated file.");
}
