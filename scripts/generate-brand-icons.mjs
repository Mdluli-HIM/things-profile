import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const source = new URL("../public/images/brand/things-logo.png", import.meta.url);
const app = new URL("../src/app/", import.meta.url);

// Use the original red t: the complete wordmark is too wide for a browser tab.
const { data, info } = await sharp(source.pathname)
  .extract({ left: 350, top: 191, width: 281, height: 307 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// The adjacent black h overlaps the crop; retain only the red letter's pixels.
for (let i = 0; i < data.length; i += 4) {
  if (data[i] < 80 || data[i] <= data[i + 1] * 2 || data[i] <= data[i + 2] * 2) {
    data[i + 3] = 0;
  }
}

async function icon(size) {
  const markSize = Math.round(size * 0.78);
  const mark = await sharp(data, { raw: info })
    .resize(markSize, markSize, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}

await writeFile(new URL("icon.png", app), await icon(512));
await writeFile(new URL("apple-icon.png", app), await icon(180));

const sizes = [16, 32, 48, 64, 256];
const images = await Promise.all(sizes.map(icon));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2); // ICO image type.
directory.writeUInt16LE(sizes.length, 4);

let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index] === 256 ? 0 : sizes[index];
  directory[entry + 1] = directory[entry];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});

await writeFile(new URL("favicon.ico", app), Buffer.concat([directory, ...images]));
console.log("Generated Things favicon, site icon and Apple touch icon.");
