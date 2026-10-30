import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = join(rootDirectory, "public");
const localOrigin = "https://portfolio-check.invalid";
const startMarker = "<!-- shared-navigation:start -->";
const endMarker = "<!-- shared-navigation:end -->";
const pageFiles = (await readdir(publicDirectory)).filter((fileName) =>
  fileName.endsWith(".html"),
);
const errors = [];

for (const fileName of pageFiles) {
  const source = await readFile(join(publicDirectory, fileName), "utf8");
  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);

  if (
    source.split(startMarker).length - 1 !== 1 ||
    source.split(endMarker).length - 1 !== 1 ||
    startIndex === -1 ||
    endIndex < startIndex
  ) {
    errors.push(`${fileName}: expected one ordered shared navigation region`);
  }

  if (!source.includes('src="/firebase-init.js"')) {
    errors.push(`${fileName}: missing Firebase initialization module`);
  }

  const ids = new Set();
  for (const [, , id] of source.matchAll(/\bid\s*=\s*(["'])(.*?)\1/g)) {
    if (ids.has(id)) {
      errors.push(`${fileName}: duplicate id "${id}"`);
    }
    ids.add(id);
  }

  for (const [, , reference] of source.matchAll(
    /\b(?:src|href)\s*=\s*(["'])(.*?)\1/g,
  )) {
    let url;
    try {
      url = new URL(reference, `${localOrigin}/${fileName}`);
    } catch {
      errors.push(`${fileName}: invalid URL "${reference}"`);
      continue;
    }

    if (url.origin !== localOrigin || !url.pathname.startsWith("/images/")) {
      continue;
    }

    let imagePath;
    try {
      imagePath = decodeURIComponent(url.pathname.slice(1));
    } catch {
      errors.push(`${fileName}: invalid image URL encoding "${reference}"`);
      continue;
    }

    const resolvedPath = resolve(publicDirectory, imagePath);
    if (!resolvedPath.startsWith(`${publicDirectory}${sep}`)) {
      errors.push(
        `${fileName}: image URL escapes public directory "${reference}"`,
      );
      continue;
    }

    try {
      await access(resolvedPath);
    } catch {
      errors.push(`${fileName}: missing image "${reference}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pageFiles.length} pages and their local image links.`);
}
