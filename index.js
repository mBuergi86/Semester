import { serve } from "bun";
import { join, resolve } from "path";
import { existsSync } from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const RETRY_INTERVAL = 5000; // 5 seconds

const mimeTypes = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  ico: "image/x-icon",
};

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const startServer = () => {
  try {
    const server = serve({
      port: PORT,
      async fetch(req) {
        const url = new URL(req.url);
        let path = decodeURIComponent(url.pathname);

        if (req.method === "POST" && path === "/contact") {
          try {
            const body = await req.json();
            const { name, email, subject, message } = body;

            await transporter.sendMail({
              from: `"${name}" <${email}>`, // Sender's name and email from the form
              to: process.env.EMAIL_TO, // Your email address
              replyTo: email,
              subject: `New Contact Form Submission: ${subject}`,
              text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
              html: `
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p> 
                    <p>${message}</p>
                  `,
            });

            return new Response(
              JSON.stringify({ message: "Email sent successfully." }),
              {
                headers: {
                  "Content-Type": "application/json",
                  status: 200,
                },
              },
            );
          } catch (error) {
            console.error("Error sending email:", error);
            return new Response(
              JSON.stringify({ message: "Failed to send email." }),
              {
                headers: {
                  "Content-Type": "application/json",
                  status: 500,
                },
              },
            );
          }
        }

        if (path === "/" || path === "") {
          path = "/index.html";
        }

        path = path.startsWith("./") ? path.slice(2) : path;

        const extension = path.split(".").pop().toLowerCase();

        const possiblePaths = [
          join("public", path),
          join(process.cwd(), path),
          path.startsWith("/") ? path.slice(1) : path,
        ];

        for (const filePath of possiblePaths) {
          const fullPath = resolve(filePath);
          if (existsSync(fullPath)) {
            try {
              const file = Bun.file(fullPath);
              return new Response(file, {
                headers: {
                  "Content-Type":
                    mimeTypes[extension] || "application/octet-stream",
                },
              });
            } catch (error) {
              console.error(`Error loading file ${fullPath}:`, error);
            }
          }
        }

        console.error(`File not found: ${path}`);
        console.error(
          `Searched paths:`,
          possiblePaths.map((p) => resolve(p)),
        );
        return new Response("404 Not Found", { status: 404 });
      },
    });

    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Retrying in ${
          RETRY_INTERVAL / 1000
        } seconds...`,
      );
      setTimeout(startServer, RETRY_INTERVAL);
    } else {
      console.error("Failed to start server:", error);
      setTimeout(startServer, RETRY_INTERVAL);
    }
  }
};

console.log(`Attempting to start server on port ${PORT}...`);
startServer();
