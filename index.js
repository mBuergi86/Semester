import { serve } from "bun";
import { join, resolve } from "path";
import { existsSync } from "fs";

const server = serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    
    // Standardmässig index.html servieren
    if (path === "/" || path === "") {
      path = "/index.html";
    }

    // Entferne führendes "./" wenn vorhanden
    if (path.startsWith("./")) {
      path = path.slice(2);
    }

    // Dateityp bestimmen
    const extension = path.split('.').pop().toLowerCase();
    const mimeTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'ico': 'image/x-icon'
    };

    // Mögliche Pfade für die Datei
    const possiblePaths = [
      join("public", path),
      join(process.cwd(), path),
      path.startsWith('/') ? path.slice(1) : path
    ];

    for (const filePath of possiblePaths) {
      const fullPath = resolve(filePath);
      if (existsSync(fullPath)) {
        try {
          const file = Bun.file(fullPath);
          return new Response(file, {
            headers: {
              "Content-Type": mimeTypes[extension] || "application/octet-stream"
            }
          });
        } catch (error) {
          console.error(`Fehler beim Laden der Datei ${fullPath}:`, error);
        }
      }
    }

    console.error(`Datei nicht gefunden: ${path}`);
    console.error(`Gesuchte Pfade:`, possiblePaths.map(p => resolve(p)));
    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`Server läuft auf http://localhost:${server.port}`);