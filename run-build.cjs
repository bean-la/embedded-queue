#!/usr/bin/env node
/**
 * Run build steps in sequence (cross-platform). Exits on first failure.
 * Used so package.json build script works in cmd and PowerShell.
 */
const { execSync } = require("child_process");
const commands = [
  "pnpm exec tsc -p tsconfig.json",
  "pnpm exec tsc -p tsconfig.cjs.json",
  "node rename-cjs.cjs",
];
for (const cmd of commands) {
  execSync(cmd, { stdio: "inherit", shell: true });
}
