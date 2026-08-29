import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(repositoryRoot, "site");
const mime = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".png": "image/png",
	".webm": "video/webm"
};

createServer(async (request, response) => {
	try {
		let pathname = new URL(request.url, "http://127.0.0.1").pathname;
		if (pathname === "/") pathname = "/index.html";
		const filePath = resolve(root, `.${decodeURIComponent(pathname)}`);
		if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) throw new Error("Forbidden");
		const body = await readFile(filePath);
		response.writeHead(200, {
			"Content-Type": mime[extname(filePath)] || "application/octet-stream",
			"Cache-Control": "no-store"
		});
		response.end(body);
	} catch {
		response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		response.end("Not found");
	}
}).listen(4180, "127.0.0.1");
