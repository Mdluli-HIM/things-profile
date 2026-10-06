const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const ts = require("typescript");

const folder = "public/images/menu";
const file = "src/components/layout/menu-content.tsx";

fs.mkdirSync(folder, { recursive: true });
const names = fs.readdirSync(folder).sort();

const photos = [1, 2].map(number => {
  const pattern = new RegExp(
    "^menu-0" + number + "\\.(jpg|jpeg|png|webp|avif)$", "i"
  );
  const name = names.find(name =>
    pattern.test(name) &&
    fs.statSync(path.join(folder, name)).isFile()
  );
  return name ? "/images/menu/" + name : null;
}).filter(Boolean);

const source = fs.readFileSync(file, "utf8");
const ast = ts.createSourceFile(
  file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX
);
const edits = [];
let found = false;

function visit(node) {
  if (
    ts.isImportDeclaration(node) &&
    ts.isStringLiteral(node.moduleSpecifier) &&
    node.moduleSpecifier.text === "@/data/work-thumbnails.json"
  ) {
    edits.push({
      start: node.getStart(ast), end: node.end, text: ""
    });
  }

  if (
    ts.isVariableStatement(node) &&
    node.declarationList.declarations.length === 1
  ) {
    const name = node.declarationList.declarations[0].name.getText(ast);

    if (name === "thumbnails") {
      edits.push({
        start: node.getStart(ast), end: node.end, text: ""
      });
    }

    if (name === "photos") {
      found = true;
      edits.push({
        start: node.getStart(ast),
        end: node.end,
        text: "const photos: string[] = " + JSON.stringify(photos) + ";"
      });
    }
  }

  ts.forEachChild(node, visit);
}

visit(ast);

if (!found) {
  throw new Error("Could not find the menu photos. No component changes written.");
}

const updated = edits.sort((a, b) => b.start - a.start).reduce(
  (text, item) =>
    text.slice(0, item.start) + item.text + text.slice(item.end),
  source
);

if (updated !== source) {
  const backup = path.join(
    os.homedir(), "things-backups", "menu-images-" + Date.now()
  );
  fs.mkdirSync(backup, { recursive: true });
  fs.writeFileSync(path.join(backup, "menu-content.tsx"), source);
  fs.writeFileSync(file, updated);
  console.log("Backup: " + backup);
}

console.log("Menu images updated: " + photos.length + "/2.");
