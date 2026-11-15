#!/usr/bin/env node
// Headless email review. Usage: node scripts/review.mjs <campaign-folder>
// Runs Claude Code with read-only tools, saves findings to review/findings.json,
// prints a one-line summary, and exits 1 if any finding is high severity.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const folderArg = process.argv[2];
if (!folderArg) {
  console.error("Usage: node scripts/review.mjs <campaign-folder>");
  process.exit(2);
}
// Normalise so "campaigns/x", "campaigns\x" and "campaigns/x/" all match.
const folder = folderArg.replace(/\\/g, "/").replace(/\/+$/, "");
if (!existsSync(resolve(root, folder))) {
  console.error(`Folder not found: ${folder}`);
  process.exit(2);
}

const findingsPath = resolve(root, "review/findings.json");

const schema = readFileSync(resolve(root, "review/findings.schema.json"), "utf8");
let prompt =
  `Review every email in ${folder} against brand/voice.md and .claude/rules/emails.md. ` +
  `Report only real problems.`;

// If the last review was of this same folder, pass its findings in so this
// review doesn't repeat problems that have already been fixed.
let previous = null;
if (existsSync(findingsPath)) {
  try {
    const saved = JSON.parse(readFileSync(findingsPath, "utf8"));
    if (saved.folder === folder && Array.isArray(saved.findings)) previous = saved.findings;
  } catch {
    // Unreadable file: treat it as no earlier review.
  }
}
if (previous && previous.length > 0) {
  prompt +=
    "\n\nThese are findings from the last review. Report only problems that are new or still not fixed. " +
    "Don't repeat ones that have been fixed.\n\n" +
    JSON.stringify(previous, null, 2);
}

const result = spawnSync(
  process.env.CLAUDE_BIN || "claude",
  [
    "-p", prompt,
    "--output-format", "json",
    "--json-schema", schema,
    "--allowedTools", "Read,Glob,Grep",
  ],
  { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "inherit"] }
);

if (result.error) {
  console.error(`Could not start claude: ${result.error.message}`);
  process.exit(2);
}
if (result.status !== 0) {
  console.error(`claude exited with code ${result.status}`);
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch {
  console.error("claude did not return valid JSON:\n" + result.stdout.slice(0, 2000));
  process.exit(2);
}

// The output is either one result object, or a list whose last item is the result.
const final = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
const output = final?.structured_output;
if (!output || !Array.isArray(output.findings)) {
  console.error("No structured_output.findings in claude's result:\n" + JSON.stringify(final, null, 2).slice(0, 2000));
  process.exit(2);
}

writeFileSync(findingsPath, JSON.stringify({ folder, findings: output.findings }, null, 2) + "\n");

const count = { high: 0, medium: 0, low: 0 };
for (const f of output.findings) count[f.severity] = (count[f.severity] || 0) + 1;
console.log(
  `Reviewed ${folder}: ${output.findings.length} finding(s) ` +
  `(${count.high} high, ${count.medium} medium, ${count.low} low)` +
  (previous ? `, checked against ${previous.length} earlier finding(s)` : "") +
  `. Saved to review/findings.json.`
);

process.exit(count.high > 0 ? 1 : 0);
