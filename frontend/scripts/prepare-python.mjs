import { cp, mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const from = resolve(root, "node_modules/pyodide");
const to = resolve(root, "public/python");
await mkdir(to, { recursive: true });
for (const name of await readdir(from)) {
  if (
    /^(pyodide\.(js|asm\.js|asm\.wasm|mjs)|python_stdlib\.zip|pyodide-lock\.json|LICENSE)$/.test(
      name,
    )
  ) {
    const source = await readFile(resolve(from, name));
    const existing = await readFile(resolve(to, name)).catch(() => null);
    if (!existing || !source.equals(existing))
      await cp(resolve(from, name), resolve(to, name));
  }
}
console.log(
  "Pinned Pyodide 0.27.7 copied for same-origin, credential-free execution.",
);
