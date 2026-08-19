import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const source = "public/images/hero/hero1.webp";
const outDir = "public/images/hero";

const targets = [
  { name: "hero1-1920.webp", width: 1920, quality: 84 },
  { name: "hero1-1280.webp", width: 1280, quality: 82 },
  { name: "hero1-828.webp", width: 828, quality: 80 },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const image = sharp(source).rotate();
  const meta = await image.metadata();
  console.log("source", meta.width, meta.height, meta.format);

  for (const target of targets) {
    const path = `${outDir}/${target.name}`;
    await image
      .clone()
      .resize({ width: target.width, withoutEnlargement: true })
      .webp({ quality: target.quality, effort: 6 })
      .toFile(path);
    const info = await sharp(path).metadata();
    const bytes = (await stat(path)).size;
    console.log(target.name, info.width, info.height, `${Math.round(bytes / 1024)} KB`);
  }

  await image
    .clone()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toFile(`${outDir}/hero1-preview.jpg`);
}

main();
