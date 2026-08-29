import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const siteRoot = join(repositoryRoot, "site");
const appSource = await readFile(join(siteRoot, "app.js"), "utf8");
const webmcpSource = await readFile(join(siteRoot, "webmcp.js"), "utf8");
const html = await readFile(join(siteRoot, "index.html"), "utf8");

const expectedTools = [
	"get_dream_realm_state",
	"start_dream_realm_route",
	"submit_dance_signal",
	"resolve_murk_doubt",
	"set_creator_choices",
	"prepare_performance",
	"send_output_to_tower",
	"return_to_hub"
];

assert.match(appSource, /window\.DreamRealmChallenge\s*=\s*DreamRealmChallenge/);
assert.match(webmcpSource, /document\.modelContext\?\.registerTool/);
assert.doesNotMatch(webmcpSource, /\.click\s*\(/, "WebMCP must not simulate UI clicks");

for (const errorCode of [
	"INVALID_STATE",
	"HUB_NOT_READY",
	"INVALID_INPUT",
	"INPUT_NOT_READY",
	"LOCKED_CHOICE",
	"VIDEO_NOT_READY"
]) {
	assert.ok(appSource.includes(`"${errorCode}"`), `${errorCode} guard is required`);
}

for (const tool of expectedTools) {
	const matches = webmcpSource.match(new RegExp(`name: ["']${tool}["']`, "g")) || [];
	assert.equal(matches.length, 1, `${tool} should be registered exactly once`);
}

assert.ok(
	html.indexOf('<script src="app.js"></script>') < html.indexOf('<script src="webmcp.js"></script>'),
	"The shared controller must load before the WebMCP adapter"
);

async function walk(directory) {
	const output = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) output.push(...await walk(path));
		else output.push(path);
	}
	return output;
}

const files = await walk(repositoryRoot);
const forbiddenExtensions = new Set([".c3p", ".uproject", ".uasset", ".umap", ".zip"]);
const forbidden = files.filter(path => forbiddenExtensions.has(extname(path).toLowerCase()));
assert.deepEqual(forbidden, [], `Private project files found: ${forbidden.map(path => relative(repositoryRoot, path)).join(", ")}`);

const mediaFiles = (await walk(join(siteRoot, "assets"))).filter(path => extname(path).toLowerCase() === ".png");
assert.equal(mediaFiles.length, 1318, "The minimal approved-local media set should contain 1,318 PNG files");

const totalBytes = (await Promise.all(mediaFiles.map(async path => (await stat(path)).size))).reduce((sum, size) => sum + size, 0);
assert.equal(totalBytes, 138293862, "The selected media byte total must match BASELINE.md and NOTICE.md");

console.log(`Static verification passed: ${expectedTools.length} tools, ${mediaFiles.length} media files, ${totalBytes} media bytes.`);
