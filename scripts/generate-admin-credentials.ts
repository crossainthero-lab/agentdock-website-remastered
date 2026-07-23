import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error("Usage: npm run admin:credentials -- \"your-long-admin-password\"");
  console.error("Use an admin password with at least 12 characters.");
  process.exit(1);
}

const iterations = 210_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const sessionSecret = randomBytes(32).toString("base64url");

console.log("ADMIN_PASSWORD_HASH=");
console.log(`pbkdf2-sha256$${iterations}$${salt.toString("base64url")}$${hash.toString("base64url")}`);
console.log("");
console.log("ADMIN_SESSION_SECRET=");
console.log(sessionSecret);
