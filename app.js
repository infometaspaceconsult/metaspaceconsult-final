// cPanel / Phusion Passenger Startup Entry Point
// This file runs the compiled production bundle.

const path = require('path');
const fs = require('fs');

// Ensure correct production environment is flagged
process.env.NODE_ENV = 'production';

// Load environmental variables if .env exists
const dotenvPath = path.join(__dirname, '.env');
if (fs.existsSync(dotenvPath)) {
  try {
    require('dotenv').config();
  } catch (err) {
    console.warn("Could not load dotenv, make sure it is installed if using local .env variables");
  }
}

// Locate the production bundle
const prodServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(prodServerPath)) {
  console.log("Starting Metaspace Production Server...");
  require(prodServerPath);
} else {
  console.error("=========================================================");
  console.error("PRODUCTION BUNDLE NOT FOUND!");
  console.error("Please run: npm run build");
  console.error("to compile your TypeScript files into 'dist/server.cjs'.");
  console.error("=========================================================");
  process.exit(1);
}
