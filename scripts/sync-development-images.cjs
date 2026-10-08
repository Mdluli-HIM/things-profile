const fs = require("node:fs");
const ts = require("typescript");
function readDevelopmentImages() {
  const root = "public/images/development";
  const tree = ts.createSourceFile(
    "projects.ts", fs.readFileSync("src/data/work-projects.ts", "utf8"),
    ts.ScriptTarget.Latest, true
  );

  const declaration = tree.statements.filter(ts.isVariableStatement)
    .flatMap(node => [...node.declarationList.declarations])
    .find(node => node.name.getText(tree) === "workProjects");

  if (!declaration?.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new Error("Could not read project IDs. No image list changed.");
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

  const entries = fs.existsSync(root)
    ? fs.readdirSync(root, { withFileTypes: true })
    : [];

  const names = entries.filter(entry => entry.isFile()).map(entry => entry.name);
  const images = {};

  for (const id of ids) {
    const name = ["jpg", "jpeg", "png", "webp", "avif"]
      .map(extension => names.find(name =>
        name.toLowerCase() === id.toLowerCase() + "." + extension
      ))
      .find(Boolean);

    if (name) images[id] = "/images/development/" + encodeURIComponent(name);
  }

  return images;
}
const images = readDevelopmentImages();
fs.mkdirSync("public/images/development", { recursive: true });
fs.writeFileSync("src/data/development-images.json", JSON.stringify(images, null, 2) + "\n");
console.log(Object.keys(images).length + " Development images connected. Existing work thumbnails remain the fallback.");
