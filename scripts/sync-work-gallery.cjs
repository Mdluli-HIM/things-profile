const fs = require("node:fs");
const path = require("node:path");
let sharp;
try { sharp = require("sharp"); }
catch {
  try { sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] })); }
  catch { throw new Error("Image metadata reader missing. Run npm install sharp, then retry."); }
}
async function sync() {
  const folder = "public/images/work-gallery";
  fs.mkdirSync(folder, { recursive: true });
  const names = fs.readdirSync(folder).filter(name => /\.(jpe?g|png|webp|avif)$/i.test(name) &&
    fs.statSync(path.join(folder, name)).isFile()).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const photos = [];
  for (const name of names) {
    const info = await sharp(path.join(folder, name)).metadata();
    const swapped = [5, 6, 7, 8].includes(info.orientation);
    const width = swapped ? info.height : info.width;
    const height = swapped ? info.width : info.height;
    if (!width || !height) throw new Error("Could not read dimensions: " + name);
    photos.push({ src: "/images/work-gallery/" + encodeURIComponent(name), width, height,
      title: path.parse(name).name.replace(/[-_]+/g, " ") });
  }
  fs.writeFileSync("src/data/work-gallery.json", JSON.stringify(photos, null, 2) + "\n");
  console.log("Work gallery updated: " + photos.length + " images.");
}
sync().catch(error => { console.error(error.message); process.exitCode = 1; });
