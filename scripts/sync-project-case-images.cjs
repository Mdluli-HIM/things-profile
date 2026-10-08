
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
let sharp;
try { sharp = require("sharp"); }
catch {
  sharp = require(require.resolve("sharp", {
    paths: [path.dirname(require.resolve("next/package.json"))]
  }));
}

async function readCaseImages() {
  const tree = ts.createSourceFile(
    "projects.ts", fs.readFileSync("src/data/work-projects.ts", "utf8"),
    ts.ScriptTarget.Latest, true
  );
  const declaration = tree.statements.filter(ts.isVariableStatement)
    .flatMap(node => [...node.declarationList.declarations])
    .find(node => node.name.getText(tree) === "workProjects");

  if (!declaration?.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new Error("Could not read the project list.");
  }

  const ids = declaration.initializer.elements.filter(ts.isObjectLiteralExpression)
    .map(node => node.properties.find(property =>
      ts.isPropertyAssignment(property) && property.name.getText(tree) === "id"
    ))
    .filter(Boolean)
    .map(property => property.initializer.text);

  if (ids.some(id => typeof id !== "string")) {
    throw new Error("Project IDs must be strings.");
  }

  const readMap = file => fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

  const covers = {
    ...readMap("src/data/work-thumbnails.json"),
    ...readMap("src/data/development-images.json")
  };
  const result = {};

  async function photo(file, src, label) {
    const info = await sharp(file).metadata();
    const swap = [5, 6, 7, 8].includes(info.orientation);
    const width = swap ? info.height : info.width;
    const height = swap ? info.width : info.height;

    if (!width || !height) {
      throw new Error("Could not read image dimensions: " + file);
    }
    return { src, width, height, label };
  }

  for (const id of ids) {
    const folder = path.join("public/images/development", id);
    const names = fs.existsSync(folder)
      ? fs.readdirSync(folder, { withFileTypes: true })
          .filter(entry => entry.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(entry.name))
          .map(entry => entry.name)
          .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      : [];

    result[id] = [];

    for (const name of names) {
      const label = path.parse(name).name
        .replace(/^\d+[-_\s]*/, "").replace(/[-_]+/g, " ");

      result[id].push(await photo(
        path.join(folder, name),
        "/images/development/" + encodeURIComponent(id) + "/" + encodeURIComponent(name),
        label || "Website detail"
      ));
    }

    if (!names.length && typeof covers[id] === "string" &&
        covers[id].startsWith("/images/")) {
      const file = path.resolve("public", "." + decodeURIComponent(covers[id]));
      if (file.startsWith(path.resolve("public") + path.sep) &&
          fs.existsSync(file) && fs.statSync(file).isFile()) {
        result[id].push(await photo(file, covers[id], "Project overview"));
      }
    }
  }
  return result;
}

module.exports = readCaseImages;

if (require.main === module) {
  readCaseImages().then(images => {
    fs.writeFileSync("src/data/project-case-images.json",
      JSON.stringify(images, null, 2) + "\n");
    console.log(Object.values(images).reduce(
      (total, photos) => total + photos.length, 0
    ) + " project screenshots connected.");
  }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}