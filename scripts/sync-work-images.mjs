import fs from "node:fs";

const ids = [
  "xibelani",
  "noir-faces",
  "meroe-group",
  "upcoming-project"
];

const extensions = ["jpg", "jpeg", "png", "webp", "avif"];
const thumbnails = {};

for (const id of ids) {
  const extension = extensions.find(ext =>
    fs.existsSync(`public/images/work/${id}.${ext}`)
  );

  if (extension) {
    thumbnails[id] = `/images/work/${id}.${extension}`;
  }
}

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/work-thumbnails.json",
  JSON.stringify(thumbnails, null, 2) + "\n"
);

console.log(
  `${Object.keys(thumbnails).length} work thumbnails connected.`
);
