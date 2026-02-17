#!/usr/bin/env node

/**
 * Doc-lint: checks repository documentation structure and cross-links.
 *
 * Verifies:
 * 1. Required index files exist in each docs subtree.
 * 2. Markdown links within docs/ resolve to existing files.
 * 3. No plan docs are orphaned outside active/ or completed/.
 * 4. No stray doc files at the repo root (except AGENTS.md, README.md, ARCHITECTURE.md).
 */

import { readdirSync, existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DOCS = join(ROOT, "docs");

let errors = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  errors++;
}

function info(msg) {
  console.log(`  OK: ${msg}`);
}

// 1. Required indexes
console.log("\n--- Required indexes ---");
const requiredIndexes = [
  "docs/product-specs/index.md",
  "docs/design-docs/index.md",
  "docs/exec-plans/index.md",
  "docs/generated/index.md",
];

for (const idx of requiredIndexes) {
  const full = join(ROOT, idx);
  if (existsSync(full)) {
    info(idx);
  } else {
    fail(`Missing required index: ${idx}`);
  }
}

// 2. Check markdown links within docs/
console.log("\n--- Cross-link check ---");
const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;

function walkDir(dir) {
  const entries = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...walkDir(full));
    } else if (extname(entry.name) === ".md") {
      entries.push(full);
    }
  }
  return entries;
}

const mdFiles = walkDir(DOCS);
let linkCount = 0;

for (const file of mdFiles) {
  const content = readFileSync(file, "utf-8");
  let match;
  while ((match = linkRe.exec(content)) !== null) {
    const href = match[2];
    // Skip external links and anchors
    if (href.startsWith("http") || href.startsWith("#")) continue;
    const target = resolve(dirname(file), href.split("#")[0]);
    linkCount++;
    if (!existsSync(target)) {
      fail(`Broken link in ${file.replace(ROOT + "/", "")}: ${href}`);
    }
  }
}
info(`Checked ${linkCount} internal links across ${mdFiles.length} files`);

// 3. Plan docs placement
console.log("\n--- Plan docs placement ---");
const execPlans = join(DOCS, "exec-plans");
if (existsSync(execPlans)) {
  for (const entry of readdirSync(execPlans, { withFileTypes: true })) {
    if (entry.isFile() && extname(entry.name) === ".md") {
      const allowed = ["index.md", "tech-debt-tracker.md"];
      if (!allowed.includes(entry.name)) {
        fail(
          `Plan doc "${entry.name}" is outside active/ or completed/ in exec-plans/`
        );
      }
    }
  }
  info("Plan docs correctly placed");
}

// 4. Stray docs at root
console.log("\n--- Root-level doc check ---");
const allowedRoot = [
  "AGENTS.md",
  "README.md",
  "ARCHITECTURE.md",
  "CHANGELOG.md",
  "LICENSE",
  "LICENSE.md",
];
for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
  if (
    entry.isFile() &&
    extname(entry.name) === ".md" &&
    !allowedRoot.includes(entry.name)
  ) {
    fail(
      `Stray doc at repo root: ${entry.name} (move to docs/ or remove)`
    );
  }
}
info("Root-level docs check complete");

// Summary
console.log(`\n${errors === 0 ? "All checks passed." : `${errors} error(s) found.`}\n`);
process.exit(errors > 0 ? 1 : 0);
