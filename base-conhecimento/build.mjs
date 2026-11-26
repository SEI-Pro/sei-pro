import { build } from "esbuild";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const comum = {
  bundle: true,
  minify: true,
  target: ["chrome116", "firefox115"],
  charset: "ascii",
  legalComments: "none",
  loader: { ".css": "text" },
  banner: { js: "/* GERADO por base-conhecimento/build.mjs. NAO EDITE. Rode: npm run build */" },
};

const conteudo = fileURLToPath(new URL("../dist/js/init_base_conhecimento.js", import.meta.url));
await build({ ...comum, entryPoints: [fileURLToPath(new URL("src/main.ts", import.meta.url))], outfile: conteudo, format: "iife" });

// Página da aba "Conhecimento" do painel lateral (ESM, como as outras abas).
const pagina = fileURLToPath(new URL("../dist/js/base-conhecimento/painel.js", import.meta.url));
await mkdir(fileURLToPath(new URL("../dist/js/base-conhecimento/", import.meta.url)), { recursive: true });
await build({ ...comum, entryPoints: [fileURLToPath(new URL("src/painel/main.ts", import.meta.url))], outfile: pagina, format: "esm" });

await mkdir(fileURLToPath(new URL("../dist/html/", import.meta.url)), { recursive: true });
await copyFile(
  fileURLToPath(new URL("estatico/painel.html", import.meta.url)),
  fileURLToPath(new URL("../dist/html/base-conhecimento.html", import.meta.url)),
);

const css = await Promise.all([
  readFile(fileURLToPath(new URL("../sei-comum/src/ui/base.css", import.meta.url)), "utf8"),
  readFile(fileURLToPath(new URL("estatico/painel.css", import.meta.url)), "utf8"),
]);
await mkdir(fileURLToPath(new URL("../dist/css/", import.meta.url)), { recursive: true });
await writeFile(
  fileURLToPath(new URL("../dist/css/base-conhecimento.css", import.meta.url)),
  `/* GERADO por base-conhecimento/build.mjs. NAO EDITE ESTE ARQUIVO. */\n${css.join("\n")}`,
);

// Regra do projeto: JS da extensao so com ASCII (conferencia byte a byte).
for (const arquivo of [conteudo, pagina]) {
  const bytes = await readFile(arquivo);
  const i = bytes.findIndex((byte) => byte > 127);
  if (i >= 0) throw new Error(`Bundle contem byte nao ASCII em ${arquivo} na posicao ${i}`);
}

console.log("Base de Conhecimento: bundle gerado.");
