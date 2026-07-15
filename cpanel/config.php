<?php
// Metaspace Consulting - cPanel Deployment Configuration
// You can edit these values directly in your cPanel file manager!

// 1. Admin Security Credentials
define('ADMIN_PASSWORD', 'admin');

// 2. Gemini Artificial Intelligence Integration
// To enable the real AI Chatbot, enter your Google Gemini API Key below.
// If empty, the chatbot will automatically run on a high-fidelity local response engine.
define('GEMINI_API_KEY', '');

// 3. System Directory Protection
if (!file_exists(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}
