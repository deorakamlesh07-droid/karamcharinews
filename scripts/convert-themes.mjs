import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const userDir = "C:/Users/kamle/.gemini/antigravity/brain/663fa726-7051-43ca-95a9-769409244b9d/.user_uploaded";
const outDir = "d:/kchnws/public/images/themes";

const files = [
  {
    theme: "8thcpc",
    src: resolve(userDir, "media_1795682176951_4455f362.jpg"),
    width: 682,
    height: 1024,
  },
  {
    theme: "growth",
    src: resolve(userDir, "media_1795682171356_43fbc502.jpg"),
    width: 682,
    height: 1024,
  },
  {
    theme: "money",
    src: resolve(userDir, "media_1795682147363_1dad4fa3.jpg"),
    width: 682,
    height: 1024,
  },
];

for (const { theme, src, width, height } of files) {
  // 1. Copy original JPG
  const jpgDest = resolve(outDir, `${theme}.jpg`);
  copyFileSync(src, jpgDest);

  // 2. Read bytes and convert to embedded SVG
  const bytes = readFileSync(src);
  const base64 = bytes.toString("base64");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <image width="${width}" height="${height}" href="data:image/jpeg;base64,${base64}" />
</svg>
`;

  const svgDest = resolve(outDir, `${theme}.svg`);
  writeFileSync(svgDest, svg, "utf8");
  console.log(`Converted ${theme} to SVG (${width}x${height}): ${svgDest}`);
}
