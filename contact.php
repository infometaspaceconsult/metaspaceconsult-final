<?php
/**
 * Metaspace Consulting Limited - Inquiry Processor
 * Deployed from AI Studio cPanel Deployment Export
 */

require_once 'db.php';

$success = false;
$errorMsg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Sanitize Inputs
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $subject = isset($_POST['subject']) ? htmlspecialchars(trim($_POST['subject']), ENT_QUOTES, 'UTF-8') : '';
    $message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8') : '';

    // Validate
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $errorMsg = 'Please complete all required fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMsg = 'Please provide a valid email address.';
    } else {
        // 2. Try MySQL insertion
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, subject, message) VALUES (:name, :email, :subject, :message)");
                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':subject' => $subject,
                    ':message' => $message
                ]);
                $success = true;
            } catch (PDOException $e) {
                // Database failed, trigger flat-file backup
                $pdo = null;
            }
        }

        // 3. Fallback: Save to JSON file so inquiries are never lost
        if (!$success) {
            try {
                $dataDir = __DIR__ . '/data';
                if (!file_exists($dataDir)) {
                    mkdir($dataDir, 0755, true);
                }
                
                $filePath = $dataDir . '/inquiries.json';
                $existing = [];
                if (file_exists($filePath)) {
                    $jsonContent = file_get_contents($filePath);
                    $existing = json_decode($jsonContent, true);
                    if (!is_array($existing)) {
                        $existing = [];
                    }
                }

                $newInquiry = [
                    'id' => 'inq_' . uniqid(),
                    'name' => $name,
                    'email' => $email,
                    'subject' => $subject,
                    'message' => $message,
                    'submitted_at' => date('Y-m-d H:i:s')
                ];

                array_unshift($existing, $newInquiry);
                file_put_contents($filePath, json_encode($existing, JSON_PRETTY_PRINT));
                $success = true;
            } catch (Exception $e) {
                $errorMsg = 'Unable to save your inquiry. Please try again later.';
            }
        }
    }
} else {
    // If accessed directly without POST
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry Status - Metaspace Consulting</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'deep-navy': '#141B77',
                        'innovation-red': '#E63946',
                        'surface-ice': '#F0F8FF',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#f5faff] text-[#151d22] antialiased min-h-screen flex items-center justify-center p-6">

    <div class="max-w-md w-full bg-white rounded-2xl border border-[#F0F8FF] p-8 shadow-xl text-center">
        <!-- Brand Header -->
        <div class="flex items-center justify-center gap-2 mb-8">
            <span class="material-symbols-outlined text-innovation-red text-3xl">
                language
            </span>
            <div>
                <span class="font-bold text-lg text-deep-navy uppercase tracking-tight block leading-none">METASPACE</span>
                <span class="text-[8px] font-bold text-innovation-red tracking-widest uppercase block mt-0.5">Consulting Limited</span>
            </div>
        </div>

        <?php if ($success): ?>
            <!-- Success Icon -->
            <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            
            <h1 class="text-2xl font-bold text-deep-navy mb-3">Thank You, <?php echo htmlspecialchars($name); ?>!</h1>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">
                Your partnership proposal has been securely logged in our systems. Our directors in Benin City will analyze your message and follow up shortly.
            </p>
        <?php else: ?>
            <!-- Error Icon -->
            <div class="w-16 h-16 bg-red-50 text-innovation-red rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-4xl">error</span>
            </div>
            
            <h1 class="text-2xl font-bold text-deep-navy mb-3">Transmission Failed</h1>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">
                <?php echo $errorMsg ?: 'We encountered an error processing your request. Please ensure all inputs are correct.'; ?>
            </p>
        <?php endif; ?>

        <!-- CTAs -->
        <div class="space-y-3">
            <a href="index.php" class="w-full bg-deep-navy text-white h-12 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 text-sm">
                <span class="material-symbols-outlined text-sm">arrow_back</span> Return to Home
            </a>
            <p class="text-[10px] text-slate-400 mt-4">
                Redirecting automatically in <span id="countdown">10</span> seconds...
            </p>
        </div>
    </div>

    <script>
        let seconds = 10;
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            const interval = setInterval(() => {
                seconds--;
                countdownEl.textContent = seconds;
                if (seconds <= 0) {
                    clearInterval(interval);
                    window.location.href = 'index.php';
                }
            }, 1000);
        }
    </script>
</body>
</html>
