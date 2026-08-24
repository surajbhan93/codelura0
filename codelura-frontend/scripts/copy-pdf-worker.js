// scripts/copy-pdf-worker.js
// Runs automatically after `npm install` (see "postinstall" in package.json).
// Copies the pdf.js worker file into public/ so it can be served as a plain
// static asset at /pdf.worker.min.mjs — this avoids webpack ever trying to
// parse/bundle the already-minified worker file, which breaks the build.
const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.mjs"
);
const destDir = path.join(__dirname, "..", "public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

try {
  if (!fs.existsSync(src)) {
    console.warn("[copy-pdf-worker] pdfjs-dist worker not found at", src, "- skipping.");
    process.exit(0);
  }
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log("[copy-pdf-worker] Copied pdf.worker.min.mjs to public/");
} catch (err) {
  console.error("[copy-pdf-worker] Failed to copy worker file:", err);
  process.exit(0); // don't fail the whole install/build over this
}