import fs from "node:fs";

const folder = "public/images/categories";
const covers = {};

for (const id of ["strategy", "design", "development"]) {
  const names = ["jpg", "jpeg", "png", "webp", "avif"]
    .map(extension => id + "." + extension);
  const name = names.find(name => fs.existsSync(folder + "/" + name));
  if (name) covers[id] = "/images/categories/" + name;
}

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/category-images.json",
  JSON.stringify(covers, null, 2) + "\n"
);
console.log("Category images updated: " + Object.keys(covers).length + "/3.");
