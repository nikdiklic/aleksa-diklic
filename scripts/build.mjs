import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = join(rootDirectory, "public");
const startMarker = "<!-- shared-navigation:start -->";
const endMarker = "<!-- shared-navigation:end -->";
const navigation = (
  await readFile(join(rootDirectory, "templates", "navigation.html"), "utf8")
).trimEnd();
const pageFiles = (await readdir(publicDirectory)).filter((fileName) =>
  fileName.endsWith(".html"),
);

for (const fileName of pageFiles) {
  const filePath = join(publicDirectory, fileName);
  let source = await readFile(filePath, "utf8");
  const inlineModuleScripts = [
    ...source.matchAll(/<script type="module">[\s\S]*?<\/script>/g),
  ];

  if (inlineModuleScripts.length > 1) {
    throw new Error(`Expected at most one inline module script in ${fileName}`);
  }

  if (inlineModuleScripts.length === 1) {
    if (!inlineModuleScripts[0][0].includes("const firebaseConfig")) {
      throw new Error(`Unexpected inline module script in ${fileName}`);
    }
    source = source.replace(
      inlineModuleScripts[0][0],
      '  <script type="module" src="/firebase-init.js"></script>',
    );
  }

  if (!source.includes('src="/firebase-init.js"')) {
    throw new Error(`Missing shared Firebase module in ${fileName}`);
  }

  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);

  if (
    startIndex === -1 ||
    endIndex < startIndex ||
    source.indexOf(startMarker, startIndex + startMarker.length) !== -1 ||
    source.indexOf(endMarker, endIndex + endMarker.length) !== -1
  ) {
    throw new Error(
      `Expected exactly one shared navigation region in ${fileName}`,
    );
  }

  const markerLineStart = source.lastIndexOf("\n", startIndex) + 1;
  const indentation = source.slice(markerLineStart, startIndex);
  const indentedNavigation = navigation
    .split("\n")
    .map((line) => (line ? `${indentation}${line}` : line))
    .join("\n");
  const replacement = `${startMarker}\n${indentedNavigation}\n${indentation}${endMarker}`;
  const updated =
    source.slice(0, startIndex) +
    replacement +
    source.slice(endIndex + endMarker.length);

  if (updated !== source) {
    await writeFile(filePath, updated);
  }
}

console.log(`Synchronized shared navigation in ${pageFiles.length} pages.`);
