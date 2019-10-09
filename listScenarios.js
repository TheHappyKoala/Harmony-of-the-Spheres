const path = require(`path`);
const fs = require("fs");

const extractJSON = file =>
  JSON.parse(
    fs.readFileSync(file, {
      encoding: "utf-8"
    })
  );

const hooverDir = dir => {
  const data = [];
  fs.readdirSync(dir).forEach(file => {
    if (path.extname(file) === ".json")
      data.push({fileName: file, ...extractJSON(dir.concat(file))});
  });

  return data;
};

fs.writeFileSync(
  "./src/data/list.json",
  JSON.stringify(
    hooverDir("./src/data/scenarios/").map(scenario => ({
      name: scenario.name,
      type: scenario.type,
      fileName: scenario.fileName,
      scenarioWikiUrl: scenario.scenarioWikiUrl
    }))
  )
);
