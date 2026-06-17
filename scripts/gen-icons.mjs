import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <rect width="512" height="512" rx="96" fill="#0e1117"/>
  <rect x="48" y="48" width="416" height="416" rx="72" fill="none" stroke="#21283f" stroke-width="6"/>
  <line x1="170" y1="110" x2="170" y2="420" stroke="#26a69a" stroke-width="20"/>
  <rect x="130" y="200" width="80" height="170" rx="10" fill="#26a69a"/>
  <line x1="342" y1="140" x2="342" y2="450" stroke="#ef5350" stroke-width="20"/>
  <rect x="302" y="180" width="80" height="150" rx="10" fill="#ef5350"/>
  <path d="M70 360 L180 250 L290 300 L440 130" fill="none" stroke="#2962ff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
</svg>`;

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg(size)))
    .png()
    .toFile(`public/icons/icon-${size}.png`);
  console.log(`generated icon-${size}.png`);
}
