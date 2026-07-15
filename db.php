<?php
/**
 * Metaspace Consulting Limited - Database Connection & Self-Healing Installer
 * Deployed from AI Studio cPanel Deployment Export
 */

// 1. MySQL Database Credentials (Edit these to match your cPanel MySQL details)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'metaspace');
define('DB_PORT', getenv('DB_PORT') ?: '3306');

$pdo = null;

try {
    // Attempt PDO Connection
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
    
    // Auto-migrate tables if they don't exist yet
    auto_migrate_tables($pdo);

} catch (PDOException $e) {
    // Graceful fallback - the site will run using static fallback card values instead of crashing!
    $pdo = null;
}

/**
 * Automatically creates and seeds the ventures and inquiries tables if empty
 */
function auto_migrate_tables($pdo) {
    try {
        // 1. Create ventures table
        $pdo->exec("CREATE TABLE IF NOT EXISTS ventures (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            tagline VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            icon VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 2. Create inquiries table
        $pdo->exec("CREATE TABLE IF NOT EXISTS inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 3. Seed ventures if completely empty
        $stmt = $pdo->query("SELECT COUNT(*) FROM ventures");
        if ($stmt->fetchColumn() == 0) {
            $defaultVentures = [
                [
                    'name' => 'Ugbekun',
                    'tagline' => 'Smart School Management System',
                    'description' => 'A smart school management platform that streamlines operations and enhances learning outcomes.',
                    'category' => 'EdTech',
                    'icon' => 'school'
                ],
                [
                    'name' => 'Oghowa Accelerator',
                    'tagline' => 'Empowering Startups',
                    'description' => 'Empowering startups through intensive incubation, expert mentorship, and critical funding access.',
                    'category' => 'Incubator',
                    'icon' => 'rocket_launch'
                ],
                [
                    'name' => 'EduRide',
                    'tagline' => 'Safe Student Logistics',
                    'description' => 'Improving student transportation and school logistics with innovative tracking technology.',
                    'category' => 'Logistics',
                    'icon' => 'directions_bus'
                ],
                [
                    'name' => 'Cyona Medicare',
                    'tagline' => 'Quality Elderly Care',
                    'description' => 'Enhancing elderly care services and making quality healthcare accessible to demographics.',
                    'category' => 'HealthTech',
                    'icon' => 'favorite'
                ]
            ];

            $insertStmt = $pdo->prepare("INSERT INTO ventures (name, tagline, description, category, icon) VALUES (:name, :tagline, :description, :category, :icon)");
            foreach ($defaultVentures as $venture) {
                $insertStmt->execute($venture);
            }
        }
    } catch (PDOException $ex) {
        // Suppress migration errors, fallback gracefully
    }
}
