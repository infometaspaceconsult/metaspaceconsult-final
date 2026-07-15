<?php
// Metaspace Consulting - cPanel API Router
// This file acts as the backend server on standard cPanel PHP environments.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Helper to read JSON files safely
function read_json_db($filename) {
    $path = __DIR__ . '/data/' . $filename;
    if (!file_exists($path)) {
        return [];
    }
    $content = file_get_contents($path);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Helper to write JSON files safely
function write_json_db($filename, $data) {
    $path = __DIR__ . '/data/' . $filename;
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Get raw JSON body input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = [];
}

switch ($action) {
    case 'site-config':
        $configPath = __DIR__ . '/data/site_config.json';
        if (file_exists($configPath)) {
            echo file_get_contents($configPath);
        } else {
            echo json_encode(["error" => "Configuration database not found."]);
        }
        break;

    case 'book':
        $name = isset($input['name']) ? trim($input['name']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $organization = isset($input['organization']) ? trim($input['organization']) : 'Independent';
        $sector = isset($input['sector']) ? trim($input['sector']) : 'Not Specified';
        $service = isset($input['service']) ? trim($input['service']) : '';
        $message = isset($input['message']) ? trim($input['message']) : '';

        if (empty($name) || empty($email) || empty($service) || empty($message)) {
            http_response_code(400);
            echo json_encode(["error" => "Please fill out all required fields (Name, Email, Service, and Message)."]);
            exit;
        }

        $consultations = read_json_db('consultations.json');
        $newBooking = [
            "id" => "const-" . uniqid() . rand(100, 999),
            "name" => $name,
            "email" => $email,
            "organization" => $organization,
            "sector" => $sector,
            "service" => $service,
            "message" => $message,
            "createdAt" => date('c'),
            "status" => "pending"
        ];
        array_unshift($consultations, $newBooking);
        write_json_db('consultations.json', $consultations);

        echo json_encode(["success" => true, "consultation" => $newBooking]);
        break;

    case 'contact':
        $name = isset($input['name']) ? trim($input['name']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $subject = isset($input['subject']) ? trim($input['subject']) : '';
        $message = isset($input['message']) ? trim($input['message']) : '';

        if (empty($name) || empty($email) || empty($subject) || empty($message)) {
            http_response_code(400);
            echo json_encode(["error" => "All contact fields are required."]);
            exit;
        }

        $inquiries = read_json_db('inquiries.json');
        $newInquiry = [
            "id" => "inq-" . uniqid(),
            "name" => $name,
            "email" => $email,
            "subject" => $subject,
            "message" => $message,
            "createdAt" => date('c')
        ];
        array_unshift($inquiries, $newInquiry);
        write_json_db('inquiries.json', $inquiries);

        echo json_encode(["success" => true, "inquiry" => $newInquiry]);
        break;

    case 'admin-login':
        $password = isset($input['password']) ? $input['password'] : '';
        if ($password === ADMIN_PASSWORD) {
            echo json_encode([
                "success" => true, 
                "token" => "metaspace-cpanel-auth-token-" . bin2hex(random_bytes(16))
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Incorrect administrator password."]);
        }
        break;

    case 'get-submissions':
        $password = isset($input['password']) ? $input['password'] : '';
        if ($password !== ADMIN_PASSWORD) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized access."]);
            exit;
        }

        $consultations = read_json_db('consultations.json');
        $inquiries = read_json_db('inquiries.json');

        echo json_encode([
            "consultations" => $consultations,
            "inquiries" => $inquiries
        ]);
        break;

    case 'save-config':
        $password = isset($input['password']) ? $input['password'] : '';
        $updates = isset($input['updates']) ? $input['updates'] : null;

        if ($password !== ADMIN_PASSWORD) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized access."]);
            exit;
        }

        if (!$updates || !is_array($updates)) {
            http_response_code(400);
            echo json_encode(["error" => "No updates payload provided."]);
            exit;
        }

        $siteConfig = read_json_db('site_config.json');
        foreach ($updates as $key => $val) {
            $siteConfig[$key] = $val;
        }
        write_json_db('site_config.json', $siteConfig);

        echo json_encode(["success" => true]);
        break;

    case 'chat':
        $message = isset($input['message']) ? trim($input['message']) : '';
        $history = isset($input['history']) ? $input['history'] : [];

        if (empty($message)) {
            http_response_code(400);
            echo json_encode(["error" => "Message payload is required."]);
            exit;
        }

        $siteConfig = read_json_db('site_config.json');
        $whatsapp = isset($siteConfig['whatsapp_number']) ? $siteConfig['whatsapp_number'] : '+2348123456789';
        $cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);

        // 1. Try real Google Gemini API if key is set
        $apiKey = GEMINI_API_KEY;
        if (!empty($apiKey)) {
            $venturesContext = "";
            if (isset($siteConfig['ventures']) && is_array($siteConfig['ventures'])) {
                foreach ($siteConfig['ventures'] as $v) {
                    $venturesContext .= "- " . $v['name'] . ": " . $v['tagline'] . ". " . $v['description'] . "\n";
                }
            }
            $servicesContext = "";
            if (isset($siteConfig['services']) && is_array($siteConfig['services'])) {
                foreach ($siteConfig['services'] as $s) {
                    $servicesContext .= "- " . $s['title'] . ": " . $s['shortDesc'] . "\n";
                }
            }
            $address = isset($siteConfig['footer_address']) ? $siteConfig['footer_address'] : 'Benin City, Edo State, Nigeria';

            $systemInstruction = "Your name is 'Companion'. You are the official AI representative for 'Metaspace Consulting Limited', a premium venture design studio and digital transformation company operating across Africa. Your goal is to be professional, welcoming, highly knowledgeable, and helpful.\n\nCRITICAL REQUIREMENT:\nYou must answer questions based ONLY on the official site information provided below. You are strictly forbidden from answering general inquiries, programming questions, external trivia, or anything outside of Metaspace Consulting Limited's profile.\n\nIf a user asks a question that is not directly answered or supported by the site details below, or if you do not have the answer based on this context, you must politely inform them that you do not have that information and direct them to connect with our WhatsApp helpdesk by outputting a link in this format: 'Please connect with our WhatsApp helpdesk for support: [WhatsApp Helpdesk](https://wa.me/{$cleanWa})'.\n\nHere is the exact information about Metaspace Consulting Limited:\n- Tagline: 'Building Systems. Empowering People. Transforming Africa.'\n- Location: {$address}. Operating across Africa.\n- Mission: Designing, building, and scaling innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.\n\nCore Pillars/Offerings:\n{$servicesContext}\n\nFlagship Ventures:\n{$venturesContext}\n\nKey Stats:\n- 4+ Flagship Ventures\n- 30+ Partners\n- 1000+ Lives Impacted\n- Multiple sectors (Edu-tech, transport, health-tech, incubator, advisory)\n\nTone and Style:\n- Professional, confident, elegant, and warm.\n- Grounded in African context, highlighting local opportunities and high-impact solutions.\n- Keep responses relatively concise and focused on how Metaspace can help.\n- If a user expresses interest in partnering or booking a consultation, direct them to use the 'Book a Consultation' form on the website!";

            // Convert chat history format for Gemini API
            $contents = [];
            if (is_array($history)) {
                foreach ($history as $m) {
                    $role = (isset($m['role']) && $m['role'] === 'model') ? 'model' : 'user';
                    $text = isset($m['parts'][0]['text']) ? $m['parts'][0]['text'] : '';
                    if (!empty($text)) {
                        $contents[] = [
                            "role" => $role,
                            "parts" => [["text" => $text]]
                        ];
                    }
                }
            }
            // Append current message
            $contents[] = [
                "role" => "user",
                "parts" => [["text" => $message]]
            ];

            // Setup Curl for Gemini REST endpoint
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . urlencode($apiKey);
            $payload = [
                "contents" => $contents,
                "systemInstruction" => [
                    "parts" => [["text" => $systemInstruction]]
                ],
                "generationConfig" => [
                    "temperature" => 0.7
                ]
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $response) {
                $respData = json_decode($response, true);
                if (isset($respData['candidates'][0]['content']['parts'][0]['text'])) {
                    echo json_encode(["text" => $respData['candidates'][0]['content']['parts'][0]['text']]);
                    exit;
                }
            }
        }

        // 2. Local Fallback Engine if Gemini API is empty or failing
        $msg = strtolower($message);
        $reply = "";

        if (strpos($msg, 'ugbekun') !== false || strpos($msg, 'school') !== false || strpos($msg, 'student') !== false) {
            $reply = "Ugbekun is our flagship smart school management system. It integrates school accounts, payment tracking, parent portals, and student reports. It manages 12,000+ students across 45+ schools, automating cashless transactions securely. If you want a live demo, we would love to configure a custom portal for your institution!";
        } elseif (strpos($msg, 'oghowa') !== false || strpos($msg, 'accelerator') !== false || strpos($msg, 'incub') !== false || strpos($msg, 'cohort') !== false) {
            $reply = "Oghowa Accelerator is our South-South tech seedbed. Over 12-week cohorts, startups receive expert software advisory, legal structure design, and investor pitches. Our cohorts have raised over $1.8M and graduated 24 top-tier regional ventures. Applications run bi-annually; let us know if you want to apply!";
        } elseif (strpos($msg, 'eduride') !== false || strpos($msg, 'commute') !== false || strpos($msg, 'transit') !== false || strpos($msg, 'transport') !== false) {
            $reply = "EduRide is our high-efficiency micro-logistics platform for university campuses. Operating eco-friendly commuter transport and low-carbon light vehicles, it manages 5,500+ daily riders. It leverages proprietary smart routing algorithms to reduce student transit time by 50%.";
        } elseif (strpos($msg, 'cyona') !== false || strpos($msg, 'medical') !== false || strpos($msg, 'health') !== false || strpos($msg, 'parent') !== false || strpos($msg, 'elder') !== false) {
            $reply = "Cyona Medicare is our specialized eldercare and emergency tele-health platform. We provide 24/7 dedicated dispatch services, professional home-nurse routing, and electronic medical record hosting, ensuring your loved ones are tracked by clinical professionals at all times.";
        } elseif (strpos($msg, 'consult') !== false || strpos($msg, 'book') !== false || strpos($msg, 'appointment') !== false || strpos($msg, 'meet') !== false) {
            $reply = "To book a consultation session with our lead system architects, click the 'Book Consultation' button in our header navigation. You can fill out your contact details and topic, and our coordinators will verify and sync it instantly.";
        } elseif (strpos($msg, 'service') !== false || strpos($msg, 'do you do') !== false || strpos($msg, 'capabilities') !== false) {
            $reply = "Metaspace operates across 4 central pillars: 1) Venture Design Studio (building spin-offs from MVP to scale), 2) Digital Transformation (modernizing enterprise/legacy setups), 3) Innovation Ecosystem Builder (accelerators & technology hubs), and 4) Strategy & Advisory. What specific pillar can I explain in detail for you?";
        } elseif (strpos($msg, 'contact') !== false || strpos($msg, 'location') !== false || strpos($msg, 'address') !== false || strpos($msg, 'phone') !== false || strpos($msg, 'email') !== false) {
            $address = isset($siteConfig['footer_address']) ? $siteConfig['footer_address'] : 'Benin City, Edo State, Nigeria';
            $email = isset($siteConfig['footer_email']) ? $siteConfig['footer_email'] : 'info@metaspaceconsulting.com';
            $phone = isset($siteConfig['footer_phone']) ? $siteConfig['footer_phone'] : '+234 812 345 6789';
            $reply = "You can email us at {$email}, call us on {$phone}, or visit our primary offices in {$address}. We also have a responsive WhatsApp helpdesk: https://wa.me/{$cleanWa}";
        } elseif (strpos($msg, 'hello') !== false || strpos($msg, 'hi') !== false || strpos($msg, 'hey') !== false) {
            $reply = "Greetings! I'm Metaspace Companion. I can give you detailed metrics about our spin-offs (Ugbekun, Oghowa Accelerator, EduRide, Cyona), guide you through scheduling consultations, or connect you directly with our Benin City leadership team. How can I assist you today?";
        } else {
            $reply = "Thank you for asking! Metaspace Consulting Limited is a premium venture builder and corporate digital architect based in Benin City, Nigeria. I can explain our platforms (Ugbekun, Oghowa, EduRide, Cyona) or corporate service capabilities. Feel free to ask a question, or contact our WhatsApp helpdesk: https://wa.me/{$cleanWa}";
        }

        echo json_encode(["text" => $reply, "isFallback" => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "API endpoint action not found."]);
        break;
}
