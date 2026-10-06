import fs from "node:fs";

const manifest = "src/data/hero-images.json";
const extensions = ["jpg", "jpeg", "png", "webp", "avif"];

const previous = fs.existsSync(manifest)
  ? JSON.parse(fs.readFileSync(manifest, "utf8"))
  : [];

const images = Array.from({ length: 5 }, (_, index) => {
  const slot = index + 1;
  const name = "hero-" + String(slot).padStart(2, "0");

  const extension = extensions.find(extension =>
    fs.existsSync("public/images/hero/" + name + "." + extension)
  );

  if (!extension) return null;

  return {
    slot,
    src: "/images/hero/" + name + "." + extension,
    alt: previous.find(image => image.slot === slot)?.alt ?? ""
  };
}).filter(Boolean);

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(manifest, JSON.stringify(images, null, 2) + "\n");

console.log(images.length + " hero images connected.");
