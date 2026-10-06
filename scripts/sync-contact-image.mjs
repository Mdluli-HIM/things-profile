import fs from "node:fs";

const extensions = ["jpg", "jpeg", "png", "webp", "avif"];
const extension = extensions.find(ext =>
  fs.existsSync(`public/images/contact/contact.${ext}`)
);

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/contact-image.json",
  JSON.stringify({
    src: extension ? `/images/contact/contact.${extension}` : null
  }, null, 2) + "\n"
);

console.log(
  extension
    ? "Contact image connected."
    : "Image area ready. Add your image, then run this script again."
);
