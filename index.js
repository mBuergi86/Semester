import { serve } from "bun";
import { join, resolve } from "path";
import { existsSync } from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { info } from "console";

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
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection failed", error);
  } else {
    console.log("Server is ready to take our messages", success);
  }
});

async function sendAutoReply(recipientEmail, recipientName) {
  try {
    const replySubject = "Vielen Dank für Ihre Nachricht";
    const replyText = `Sehr geehrte/r ${recipientName}

    Vielen Dank für Ihre Anfrage. Wir melden uns so bald wie möglich bei Ihnen.

    Freundliche Grüsse
    Ihr Team`;

    const replyHtml = `
    <p>Sehr geehrte/r ${recipientName}</p>
    <p>Vielen Danke für Ihre Anfrage. Wir melden uns so bald wie möglich bei Ihnen.</p>
    <p>Freundliche Grüsse<br>Ihr Team</p>
  `;

    await transporter.sendMail({
      from: `Ihr Team <${process.env.MAIL_USER}>`,
      to: recipientEmail,
      subject: replySubject,
      text: replyText,
      html: replyHtml,
    });

    console.log("Auto-reply sent to:", recipientEmail);
  } catch (error) {
    console.error("Error sending auto-reply:", error);
  }
}

const sendEmail = async (
  recipientEmail,
  recipientName,
  subject,
  text,
  html,
) => {
  try {
    await transporter.sendMail({
      from: `Kontaktformular <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: subject,
      text: `Name: ${recipientName}\nEmail: ${recipientEmail}\n\n${text}`,
      html: `
        <p><strong>Name:</strong> ${recipientName}</p>
        <p><strong>Email:</strong> ${recipientEmail}</p>
        <p><strong>Betreff:</strong> ${subject}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${html}</p>
      `,
    });

    console.log("Email sent to:", process.env.MAIL_TO);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

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

            // Check if recipient email is set
            if (!email) {
              throw new Error(
                "Recipient email (MAIL_TO) is not set in environment variables",
              );
            }

            await sendAutoReply(email, name);
            console.log("Auto-reply sent successfully");

            await sendEmail(
              email,
              name,
              `${subject}`,
              message,
              message.replace(/\n/g, "<br>"),
            );
            console.log("Email sent successfully");

            return new Response(
              JSON.stringify({ message: "Email sent successfully.", redirect: "/thanks.html" }),
              {
                headers: { "Content-Type": "application/json" },
                status: 200,
              },
            );
          } catch (error) {
            console.error("Error sending email:", error);
            return new Response(
              JSON.stringify({
                message: "Failed to send email: " + error.message,
              }),
              {
                headers: { "Content-Type": "application/json" },
                status: 500,
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
