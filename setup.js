
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log("\n🚀 Tour Admin - Automatic Project Setup 🚀\n");
console.log("This script will configure your project for a new client/environment.");
console.log("Press Ctrl+C at any time to cancel.\n");

const config = {};

async function main() {
    try {
        // --- Phase 1: Firebase Configuration ---
        console.log("--- 1. Firebase Configuration ---");
        console.log("Go to Firebase Console > Project Settings > General > Your Apps > Web App\n");

        config.VITE_FIREBASE_API_KEY = await question("Enter API Key (apiKey): ");
        config.VITE_FIREBASE_AUTH_DOMAIN = await question("Enter Auth Domain (authDomain): ");
        config.VITE_FIREBASE_PROJECT_ID = await question("Enter Project ID (projectId): ");
        config.VITE_FIREBASE_STORAGE_BUCKET = await question("Enter Storage Bucket (storageBucket): ");
        config.VITE_FIREBASE_MESSAGING_SENDER_ID = await question("Enter Messaging Sender ID (messagingSenderId): ");
        config.VITE_FIREBASE_APP_ID = await question("Enter App ID (appId): ");
        console.log("");

        // --- Phase 2: Cloudflare Worker Configuration ---
        console.log("--- 2. Cloudflare Worker Configuration ---");

        const workerName = await question("Enter a Name for your Cloudflare Worker (default: backend-worker): ") || "backend-worker";
        const bucketName = await question("Enter your R2 Bucket Name: ");
        const accountId = await question("Enter your Cloudflare Account ID: ");
        const publicDomain = await question("Enter your R2 Public Domain (e.g., https://pub-xxx.r2.dev): ");

        // Construct Worker URL (Approximation, user might need to adjust if using custom domains)
        // Default format: https://<worker-name>.<subdomain>.workers.dev
        // We will ask for the full URL to be safe, or just the subdomain.
        const workerUrl = await question("Enter the full URL where your worker will be deployed (e.g., https://backend-worker.subdomain.workers.dev): ");
        config.VITE_WORKER_URL = workerUrl;

        console.log("\n--- Generating Configurations... ---\n");

        // 1. Write .env file
        const envContent = Object.entries(config)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        fs.writeFileSync(path.join(__dirname, '.env'), envContent);
        console.log("✅ .env file created successfully!");

        // 2. Write backend-worker/wrangler.toml
        const wranglerContent = `name = "${workerName}"
main = "src/index.js"
compatibility_date = "2024-01-05"

[vars]
ACCOUNT_ID = "${accountId}"
R2_BUCKET_NAME = "${bucketName}"
R2_PUBLIC_DOMAIN = "${publicDomain}"

# Secrets (Set these manually via: npx wrangler secret put R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)
`;

        fs.writeFileSync(path.join(__dirname, 'backend-worker', 'wrangler.toml'), wranglerContent);
        console.log("✅ backend-worker/wrangler.toml file created successfully!");

        console.log("\n🎉 Setup Complete! 🎉\n");
        console.log("Next Steps:");
        console.log("1. Deploy the Backend Worker:");
        console.log("   cd backend-worker");
        console.log("   npx wrangler secret put R2_ACCESS_KEY_ID");
        console.log("   npx wrangler secret put R2_SECRET_ACCESS_KEY");
        console.log("   npx wrangler deploy");
        console.log("\n2. Deploy the Frontend:");
        console.log("   npm run build");
        console.log("   npx wrangler pages deploy dist");

    } catch (err) {
        console.error("Error during setup:", err);
    } finally {
        rl.close();
    }
}

main();
