/**
 * Builds a self-contained bundle for cPanel / Passenger hosting (hoster.pk).
 *
 * Shared hosting usually can't run `next build` itself (memory limits), so the
 * build happens here and the finished server is uploaded. Produces `deploy/`,
 * which is what goes into the Node.js app's Application root.
 *
 *   npm run build:cpanel
 */
import { cp, rm, mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "deploy");
const standalone = path.join(root, ".next", "standalone");

const step = (msg) => console.log(`\n▸ ${msg}`);

step("Building Next.js in standalone mode");
execSync("npx prisma generate && npx next build", {
  stdio: "inherit",
  env: { ...process.env, BUILD_STANDALONE: "1" },
});

if (!existsSync(standalone)) {
  console.error("\n✗ .next/standalone was not produced — is output:'standalone' active?");
  process.exit(1);
}

step("Assembling deploy/");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// The standalone server plus the two folders it expects alongside it.
await cp(standalone, out, { recursive: true });
await cp(path.join(root, ".next", "static"), path.join(out, ".next", "static"), {
  recursive: true,
});
if (existsSync(path.join(root, "public"))) {
  await cp(path.join(root, "public"), path.join(out, "public"), { recursive: true });
}

// Prisma's query engine lives in node_modules and must ship with the bundle.
const prismaClient = path.join(root, "node_modules", ".prisma");
if (existsSync(prismaClient)) {
  await cp(prismaClient, path.join(out, "node_modules", ".prisma"), { recursive: true });
}

// Passenger looks for a start script; standalone's server.js is the entry point.
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
await writeFile(
  path.join(out, "package.json"),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      private: true,
      scripts: { start: "node server.js" },
    },
    null,
    2,
  ) + "\n",
);

step("Done");
console.log(`
Upload the CONTENTS of:  ${out}
into your cPanel Node.js "Application root" folder, then set:

  Node.js version        20.x or newer  (REQUIRED — 10.x will not run this)
  Application mode       Production
  Application root       zamirastore          (or whatever folder you upload to)
  Application URL        zamirastore.com      (leave the path box empty)
  Application startup    server.js

Add every environment variable from .env in the cPanel panel, plus:
  PORT=3000  (only if cPanel does not inject one)
`);
