const fs = require("node:fs");
const path = require("node:path");

let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(require.resolve("sharp", {
    paths: [path.dirname(require.resolve("next/package.json"))]
  }));
}

async function sync() {
  const folder = "public/images/graphics";
  const detailsFile = "src/data/graphics-details.json";
  fs.mkdirSync(folder, { recursive: true });

  const details = fs.existsSync(detailsFile)
    ? JSON.parse(fs.readFileSync(detailsFile, "utf8"))
    : {};

  const names = fs.readdirSync(folder, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(entry.name))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const photos = [];

  for (const name of names) {
    const info = await sharp(path.join(folder, name)).metadata();
    const swapped = [5, 6, 7, 8].includes(info.orientation);
    const width = swapped ? info.height : info.width;
    const height = swapped ? info.width : info.height;

    if (!width || !height) {
      throw new Error("Could not read dimensions: " + name);
    }

    const src = "/images/graphics/" + encodeURIComponent(name);
    const title = path.parse(name).name.replace(/[-_]+/g, " ");

    photos.push({ src, width, height, title });

    if (!details[src]) {
      details[src] = {
        title,
        year: null,
        category: "Graphic Design"
      };
    }
  }

  fs.mkdirSync("src/data", { recursive: true });
  fs.writeFileSync(
    "src/data/graphics-gallery.json",
    JSON.stringify(photos, null, 2) + "\n"
  );
  fs.writeFileSync(detailsFile, JSON.stringify(details, null, 2) + "\n");
  console.log("Graphics gallery updated: " + photos.length + " images.");
}

sync().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
