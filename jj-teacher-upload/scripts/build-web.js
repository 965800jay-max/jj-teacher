const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const nextRoot = path.join(root, "next-ui");
const outDir = path.join(nextRoot, "out");
const files = ["index.html", "styles.css", "app.js", "preview.png", "version.json"];

loadLocalEnv(path.join(root, ".env"));

if (fs.existsSync(path.join(nextRoot, "package.json"))) {
  execFileSync("npm", ["--prefix", nextRoot, "run", "build"], {
    cwd: root,
    stdio: "inherit",
  });

  const versionSource = path.join(root, "version.json");
  if (fs.existsSync(versionSource)) {
    fs.copyFileSync(versionSource, path.join(outDir, "version.json"));
  }

  const aiEndpoint = process.env.APP_AI_ENDPOINT || process.env.SENTENCE_READER_AI_ENDPOINT || "";
  fs.writeFileSync(
    path.join(outDir, "config.js"),
    `window.SENTENCE_READER_AI_ENDPOINT = ${JSON.stringify(aiEndpoint)};\n`
  );

  console.log(`Built Next.js export in ${outDir}`);
} else {
  const legacyOutDir = path.join(root, "www");
  fs.rmSync(legacyOutDir, { recursive: true, force: true });
  fs.mkdirSync(legacyOutDir, { recursive: true });

  for (const file of files) {
    const source = path.join(root, file);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, path.join(legacyOutDir, file));
    }
  }

  const aiEndpoint = process.env.APP_AI_ENDPOINT || process.env.SENTENCE_READER_AI_ENDPOINT || "";
  fs.writeFileSync(
    path.join(legacyOutDir, "config.js"),
    `window.SENTENCE_READER_AI_ENDPOINT = ${JSON.stringify(aiEndpoint)};\n`
  );

  console.log(`Built legacy web assets in ${legacyOutDir}`);
}

function loadLocalEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    if (!key || process.env[key]) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}
