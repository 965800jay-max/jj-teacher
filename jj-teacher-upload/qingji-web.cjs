"use strict";

// server/web.cjs
var fs = require("node:fs");
var path = require("node:path");
function redirectBookingHome(request, response) {
  const hostname = String(request.headers.host || "").split(":")[0].toLowerCase();
  if (!["3628newyork.com", "www.3628newyork.com"].includes(hostname)) return false;
  let url;
  try {
    url = new URL(request.url, "http://localhost");
  } catch {
    return false;
  }
  if (!["/", "/index.html"].includes(url.pathname)) return false;
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return true;
  }
  response.writeHead(308, { Location: `/3628/book/${url.search}`, "Cache-Control": "no-store" });
  response.end();
  return true;
}
function createWebHandler(directory, options = {}) {
  const root = path.resolve(directory);
  return async function handle(request, response) {
    const reply = (status, message) => {
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(message);
    };
    if (!["GET", "HEAD"].includes(request.method)) {
      response.setHeader("Allow", "GET, HEAD");
      reply(405, "Method not allowed");
      return;
    }
    let url;
    let pathname;
    try {
      url = new URL(request.url, "http://localhost");
      pathname = decodeURIComponent(url.pathname);
    } catch {
      reply(400, "Invalid path");
      return;
    }
    if (pathname === "/3628") {
      response.writeHead(308, { Location: `/3628/${url.search}` });
      response.end();
      return;
    }
    if (!pathname.startsWith("/3628/")) {
      reply(404, "Not found");
      return;
    }
    const publicPage = pathname === "/3628/book" || pathname === "/3628/book/";
    const bookingPath = publicPage || pathname.startsWith("/3628/book/");
    const fileRoot = bookingPath && options.bookingDirectory ? path.resolve(options.bookingDirectory) : root;
    const relative = bookingPath && options.bookingDirectory ? publicPage ? "index.html" : pathname.slice("/3628/book/".length) : publicPage ? "book/index.html" : pathname.slice("/3628/".length) || "index.html";
    const file = path.resolve(fileRoot, relative);
    if (!file.startsWith(`${fileRoot}${path.sep}`)) {
      reply(403, "Forbidden");
      return;
    }
    try {
      const data = await fs.promises.readFile(file);
      const extension = path.extname(file);
      const types = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".ttf": "font/ttf", ".css": "text/css; charset=utf-8" };
      const immutable = /[.-][a-f0-9]{20,}\./.test(path.basename(file));
      const headers = { "Content-Type": types[extension] || "application/octet-stream", "Content-Length": data.length, "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "no-cache", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "same-origin" };
      if (file === path.join(root, "service-worker.js")) headers["Service-Worker-Allowed"] = "/3628/";
      if (pathname.startsWith("/3628/book")) {
        headers["Referrer-Policy"] = "no-referrer";
        headers["Cache-Control"] = "no-store";
        headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";
      }
      response.writeHead(200, headers);
      response.end(request.method === "HEAD" ? void 0 : data);
    } catch {
      reply(404, "Not found");
    }
  };
}
module.exports = { createWebHandler, redirectBookingHome, handle: createWebHandler(process.env.QINGJI_WEB_DIR || path.join(__dirname, "qingji-web")) };
