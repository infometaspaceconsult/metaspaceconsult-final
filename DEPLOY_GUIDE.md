# Metaspace Consulting - Linux PHP Server / cPanel Deployment Guide

Since your Linux server is not launching the Node.js/Vite dev server, you can leverage the **pre-built, high-performance PHP engine** already included in your codebase. 

This PHP engine is designed to run on standard Apache/Nginx Linux stacks (including cPanel, Bluehost, Namecheap, Hostinger, AWS, DigitalOcean, LAMP, etc.) with **zero Node.js dependencies, zero compiler steps, and zero configuration friction**. It preserves 100% of the visual design, animations, preloader, chatbot widget, contact forms, and admin dashboard portal.

---

## 📂 1. The Core Files to Export

To deploy the website to your Linux server, you only need to copy the following files from your codebase root to your server's root directory (typically `public_html` or `/var/www/html`):

| File/Folder | Purpose | Description |
| :--- | :--- | :--- |
| 📄 `index.php` | **Core Website & UI** | Main landing page containing the preloader, corporate sections, venture milestones, companion chatbot interface, and admin console dashboard. |
| 📄 `api.php` | **API Router** | Handles chat requests (integrating Google Gemini with offline local fallbacks), consultations booking, and site updates. |
| 📄 `config.php` | **System Credentials** | Allows you to change the Admin Password and enter your Google Gemini API Key. |
| 📄 `db.php` | **DB Connection** | Supports optional MySQL connections. |
| 📄 `contact.php` | **Contact Action** | Standalone fallback processor for form inquiry transmissions. |
| 📁 `data/` | **Database Storage** | Contains flat-file databases to ensure data persists without MySQL: |
| &nbsp;&nbsp;&nbsp;&nbsp; 📄 `site_config.json` | *Configuration* | Stores all editable text, headings, and lists. |
| &nbsp;&nbsp;&nbsp;&nbsp; 📄 `consultations.json` | *Bookings* | Stores all consultation bookings securely. |
| &nbsp;&nbsp;&nbsp;&nbsp; 📄 `inquiries.json` | *Messages* | Stores all contact form inquiries safely. |
| &nbsp;&nbsp;&nbsp;&nbsp; 📄 `.htaccess` | *Security Guard* | Blocks public web users from downloading your JSON database files. |
| 📄 `.htaccess` | **Apache Configurations**| Optimizes page loading priority and GZIP compression on Linux servers. |

---

## 🚀 2. Standard Upload Steps (e.g. cPanel or FTP)

1. **Compress the Files**: Select the files and folders listed above (`index.php`, `api.php`, `config.php`, `db.php`, `contact.php`, `.htaccess`, and the `data/` folder) and compress them into a single `zip` file.
2. **Access your File Manager**: Log into your cPanel or connect via an FTP client (e.g. FileZilla).
3. **Upload the ZIP**: Upload the `zip` file directly into your primary web folder (usually `public_html`).
4. **Extract**: Extract the file content directly in that folder.
5. **Set Folder Permissions (Crucial)**: 
   - Ensure the `/data` folder has write permissions set to **`755`** (or `777` if required by your web host). This permits PHP to securely store bookings and site updates in `consultations.json` and `site_config.json`.

---

## 🔑 3. Customizing Your Credentials

Open the **`config.php`** file directly in your server's File Manager to customize:

```php
<?php
// 1. Admin Security Credentials
define('ADMIN_PASSWORD', 'admin'); // <-- Change 'admin' to your chosen login password

// 2. Gemini Artificial Intelligence Integration
// Paste your Google Gemini API Key below. If left empty, the chatbot runs on its highly detailed local fallback engine.
define('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE'); 
```

---

## ✨ 4. How the Systems Interact (No Node Required)

- **Presentation / Design**: Styled via **Tailwind CSS (CDN)** and **Lucide Icons (CDN)**, meaning it displays with flawless typography, responsive widths, and fast loading speeds.
- **Client interactions**: When a client types a message to the Chatbot or books a consultation, vanilla Javascript sends an AJAX fetch request directly to `api.php`. 
- **Administrative Control**: Going to `yoursite.com/?tab=admin` (or clicking Admin in the header) opens the secure vault. Enter your password to view, delete, or manage bookings and edit any text/content on the fly.
