<?php
// Metaspace Consulting Limited - Unified Web Portal (cPanel Production Release)
// Fully dynamic PHP+Tailwind+VanillaJS portal with zero Node.js dependencies.

error_reporting(0);
require_once __DIR__ . '/config.php';

// Fetch dynamic site config
$configPath = __DIR__ . '/data/site_config.json';
if (file_exists($configPath)) {
    $config = json_decode(file_get_contents($configPath), true);
} else {
    $config = [];
}

// Configuration retrieve helpers
function get_cfg($key, $default = '') {
    global $config;
    return isset($config[$key]) ? $config[$key] : $default;
}

$ventures = get_cfg('ventures', []);
$services = get_cfg('services', []);
$whatsapp = get_cfg('whatsapp_number', '+2348123456789');
$cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);
?>
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metaspace Consulting | Building Systems. Empowering People.</title>
    
    <!-- Premium Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        brand: {
                            navy: '#141b77',
                            red: '#ef4444',
                            dark: '#0f172a',
                            slate: '#f8fafc',
                        }
                    }
                }
            }
        }
    </script>
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
        }
        .font-display {
            font-family: 'Space Grotesk', sans-serif;
        }
        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }
        /* Fade transition */
        .tab-content {
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .tab-content.active {
            display: block;
            opacity: 1;
        }
        .loader-fadeout {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-out;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-red-500 selection:text-white">

    <!-- 1. Preloader -->
    <div id="preloader" class="fixed inset-0 bg-slate-900 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
        <div class="flex flex-col items-center max-w-sm px-6 text-center">
            <div class="flex items-center gap-3 mb-6">
                <!-- Metaspace Custom Logo -->
                <div class="h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-t-4 border-red-500">
                    <span class="text-slate-900 font-display font-bold text-2xl tracking-tighter">M<span class="text-red-500">S</span></span>
                </div>
                <div class="text-left">
                    <span class="text-white font-display font-bold text-xl tracking-tight block">METASPACE</span>
                    <span class="text-slate-400 font-mono text-[9px] tracking-widest block uppercase">Venture Builders</span>
                </div>
            </div>
            
            <div class="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden relative mb-4 border border-slate-700">
                <div class="bg-gradient-to-r from-red-500 to-indigo-500 h-full w-2/3 rounded-full absolute left-0 top-0 animate-pulse"></div>
            </div>
            <p class="text-slate-400 text-xs font-mono">Initializing System Foundations...</p>
        </div>
    </div>

    <!-- 2. Sticky Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <!-- Brand Logo -->
            <a href="#" onclick="switchTab('home')" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div class="h-10 w-10 bg-slate-950 rounded-lg flex items-center justify-center border-t-2 border-red-500">
                    <span class="text-white font-display font-bold text-lg tracking-tighter">M<span class="text-red-500">S</span></span>
                </div>
                <div class="hidden sm:block text-left">
                    <span class="text-slate-900 font-display font-bold text-lg tracking-tight block leading-none">METASPACE</span>
                    <span class="text-slate-400 font-mono text-[8px] tracking-widest block uppercase mt-0.5">Consulting Limited</span>
                </div>
            </a>

            <!-- Desktop Nav Links -->
            <nav class="hidden lg:flex items-center gap-8">
                <button onclick="switchTab('home')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="home">Home</button>
                <button onclick="switchTab('about')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="about">About Us</button>
                <button onclick="switchTab('what-we-do')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="what-we-do">What We Do</button>
                <button onclick="switchTab('ventures')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="ventures">Our Ventures</button>
                <button onclick="switchTab('insights')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="insights">Insights</button>
                <button onclick="switchTab('contact')" class="nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors" data-tab-target="contact">Contact Us</button>
                <button onclick="switchTab('admin')" class="nav-btn font-medium text-slate-500 hover:text-red-500 transition-colors font-mono text-xs flex items-center gap-1" data-tab-target="admin">
                    <i data-lucide="shield-check" class="h-3.5 w-3.5"></i> Admin
                </button>
            </nav>

            <!-- Booking CTA and Mobile Menu Toggle -->
            <div class="flex items-center gap-4">
                <button onclick="openBookModal()" class="hidden md:flex items-center gap-2 bg-[#141b77] hover:bg-[#0d1252] text-white px-5 h-11 rounded-lg font-medium shadow-md shadow-indigo-200 transition-all text-sm font-display">
                    <i data-lucide="calendar" class="h-4 w-4 text-red-400"></i> Book Consultation
                </button>
                
                <button onclick="toggleMobileMenu()" class="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-50 border border-slate-100 transition-colors">
                    <i id="menu-icon" data-lucide="menu" class="h-5 w-5"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
            <div class="px-4 py-6 space-y-3">
                <button onclick="switchTab('home')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Home</button>
                <button onclick="switchTab('about')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">About Us</button>
                <button onclick="switchTab('what-we-do')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">What We Do</button>
                <button onclick="switchTab('ventures')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Our Ventures</button>
                <button onclick="switchTab('insights')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Insights</button>
                <button onclick="switchTab('contact')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Contact Us</button>
                <button onclick="switchTab('admin')" class="block w-full text-left py-2 px-3 rounded-lg text-slate-500 hover:bg-slate-50 font-mono text-xs"><i data-lucide="shield-check" class="inline h-3.5 w-3.5 mr-1"></i> Admin Portal</button>
                <hr class="border-slate-100">
                <button onclick="openBookModal(); toggleMobileMenu();" class="w-full flex items-center justify-center gap-2 bg-[#141b77] text-white py-3 rounded-lg font-medium text-sm font-display shadow">
                    <i data-lucide="calendar" class="h-4 w-4"></i> Book Consultation
                </button>
            </div>
        </div>
    </header>

    <!-- 3. Main Portal Body -->
    <main class="flex-grow">
        
        <!-- ================= HOME TAB ================= -->
        <section id="tab-home" class="tab-content active animate-fade-in">
            <!-- Hero Banner -->
            <div class="relative overflow-hidden bg-white border-b border-slate-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div class="lg:col-span-7 space-y-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#141b77] text-xs font-semibold font-mono tracking-wider uppercase">
                            <i data-lucide="sparkles" class="h-3 w-3 text-red-500"></i> Corporate Venture Builder
                        </span>
                        
                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight text-slate-900">
                            <span id="hero_title_text" style="color: <?php echo get_cfg('home_hero_title_color', '#141b77'); ?>"><?php echo get_cfg('home_hero_title', 'Transforming Africa.'); ?></span>
                        </h1>
                        
                        <h2 class="text-xl sm:text-2xl font-display font-medium text-slate-600">
                            <?php echo get_cfg('home_hero_subtitle', 'Building Systems. Empowering People.'); ?>
                        </h2>
                        
                        <p class="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                            <?php echo get_cfg('home_hero_desc', 'We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.'); ?>
                        </p>
                        
                        <div class="flex flex-wrap gap-4 pt-4">
                            <button onclick="switchTab('ventures')" class="px-6 h-12 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white font-medium shadow-md shadow-red-200 hover:-translate-y-0.5 transition-all text-sm font-display flex items-center gap-2">
                                Explore Our Ventures <i data-lucide="arrow-right" class="h-4 w-4"></i>
                            </button>
                            <button onclick="openBookModal()" class="px-6 h-12 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2">
                                <i data-lucide="calendar" class="h-4 w-4 text-[#141b77]"></i> Schedule Consultation
                            </button>
                        </div>
                    </div>
                    
                    <div class="lg:col-span-5 relative">
                        <!-- Hero Art/Image Frame -->
                        <div class="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                            <img src="<?php echo get_cfg('lagosBridgeUrl', 'https://images.unsplash.com/photo-1599839352727-4c749b5c2253?q=80&w=1200&auto=format&fit=crop'); ?>" alt="Lagos City Landscape" class="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"></div>
                            
                            <!-- Floater Info Box -->
                            <div class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-slate-100 shadow-lg flex items-center gap-4">
                                <div class="h-10 w-10 bg-indigo-50 text-[#141b77] rounded-lg flex items-center justify-center shrink-0">
                                    <i data-lucide="graduation-cap" class="h-5 w-5"></i>
                                </div>
                                <div class="min-w-0">
                                    <span class="block text-slate-900 font-semibold text-xs font-display">Flagship Venture Scale</span>
                                    <span class="block text-slate-500 text-[10px] truncate leading-normal">Co-founded Ugbekun Smart Platforms</span>
                                </div>
                                <span class="ml-auto bg-red-50 text-red-600 font-mono font-bold text-xs px-2.5 py-1 rounded-md shrink-0">45+ Schools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats/Credibility section -->
            <div class="bg-slate-50 border-b border-slate-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span class="block text-3xl font-display font-bold text-[#141b77] mb-1">4+</span>
                            <span class="block text-slate-500 text-xs font-mono tracking-wider uppercase">Active Ventures</span>
                        </div>
                        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span class="block text-3xl font-display font-bold text-red-500 mb-1">12K+</span>
                            <span class="block text-slate-500 text-xs font-mono tracking-wider uppercase">Lives Impacted</span>
                        </div>
                        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span class="block text-3xl font-display font-bold text-[#141b77] mb-1">45+</span>
                            <span class="block text-slate-500 text-xs font-mono tracking-wider uppercase">Schools Enrolled</span>
                        </div>
                        <div class="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span class="block text-3xl font-display font-bold text-red-500 mb-1">$1.8M</span>
                            <span class="block text-slate-500 text-xs font-mono tracking-wider uppercase">Seed Funding Raised</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Focus block introduction -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div class="bg-white rounded-2xl border border-slate-100 p-8 lg:p-12 shadow-sm grid lg:grid-cols-12 gap-10 items-center">
                    <div class="lg:col-span-5 space-y-4">
                        <span class="text-red-500 font-mono text-xs font-semibold tracking-widest block uppercase">THE METASPACE DIFFERENCE</span>
                        <h2 class="text-3xl font-display font-bold text-slate-900 leading-tight">We build the scaffolds that support emerging markets.</h2>
                        <p class="text-slate-600 text-sm leading-relaxed">
                            We operate at the crucial intersection of software engineering, regulatory compliance, policy advisory, and seed capital routing. This multi-layered approach removes structural friction for organizations, letting technology thrive from day one.
                        </p>
                    </div>
                    <div class="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center">
                                <i data-lucide="globe" class="h-4 w-4"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900 text-sm">Pan-African Vision</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Designing digital products focused completely on local demographics, low connectivity, and high mobile adoption.</p>
                        </div>
                        <div class="space-y-2">
                            <div class="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                <i data-lucide="cpu" class="h-4 w-4"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900 text-sm">Industrial Software</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Building cloud architectures that map paper-based registries safely to cloud servers with 100% data fidelity.</p>
                        </div>
                        <div class="space-y-2">
                            <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center">
                                <i data-lucide="network" class="h-4 w-4"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900 text-sm">Ecosystem Cohesion</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Constructing accelerator frameworks and incubator parks that bridge tech founders with high-volume investors.</p>
                        </div>
                        <div class="space-y-2">
                            <div class="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                <i data-lucide="award" class="h-4 w-4"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900 text-sm">Policy Infrastructure</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Compiling policy advisory papers and briefs to support startup acts and clear regulatory environments.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= ABOUT US TAB ================= -->
        <section id="tab-about" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <!-- About Hero -->
                <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span class="text-[#141b77] font-mono text-xs font-semibold tracking-widest uppercase">OUR IDENTITY</span>
                    <h1 class="text-4xl sm:text-5xl font-display font-bold text-slate-900"><?php echo get_cfg('about_hero_title', 'Empowering Innovation, Driving Impact.'); ?></h1>
                    <p class="text-slate-600 text-base sm:text-lg"><?php echo get_cfg('about_hero_desc', 'We are a dedicated venture builder and digital transformation architect driving industrial-strength technology ecosystems.'); ?></p>
                </div>

                <!-- Mission block -->
                <div class="grid lg:grid-cols-12 gap-12 items-center bg-white rounded-2xl border border-slate-100 p-8 lg:p-12 mb-16 shadow-sm">
                    <div class="lg:col-span-5 relative">
                        <div class="aspect-square rounded-xl overflow-hidden shadow-lg border border-slate-100">
                            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" alt="Collaborative Workshop" class="object-cover w-full h-full">
                        </div>
                    </div>
                    <div class="lg:col-span-7 space-y-6">
                        <span class="text-red-500 font-mono text-xs font-semibold tracking-widest uppercase block"><?php echo get_cfg('about_mission_title', 'Our Core Mission'); ?></span>
                        <div class="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                            <?php echo get_cfg('about_mission_text', "Across Africa, the challenge is rarely a lack of ideas or raw entrepreneurial talent. It is the deep friction of execution—regulatory compliance, high software engineering costs, and the absence of proven templates for corporate digital modernization.\n\nMetaspace Consulting was founded to serve as that foundational scaffold. Whether we are co-founding spin-offs like Ugbekun in education or advising public offices on startup policies, our methodologies are rigorous, evidence-based, and focused entirely on measurable, lasting outcomes."); ?>
                        </div>
                    </div>
                </div>

                <!-- Core Values -->
                <div class="space-y-8">
                    <div class="text-center max-w-xl mx-auto space-y-2">
                        <span class="text-[#141b77] font-mono text-xs font-semibold tracking-widest uppercase">OPERATIONAL TENETS</span>
                        <h2 class="text-3xl font-display font-bold text-slate-900">What keeps us focused</h2>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-3">
                            <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center">
                                <i data-lucide="shield-check" class="h-5 w-5"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900">Absolute Integrity</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">We maintain the highest professional standards in software craftsmanship, data security, regulatory alignments, and financial advisory.</p>
                        </div>
                        <div class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-3">
                            <div class="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-5 w-5"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900">Value Density</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">No bloat or vanity metrics. Every line of code, strategic document, and mentorship workshop must deliver tangible, direct commercial utility.</p>
                        </div>
                        <div class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-3">
                            <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center">
                                <i data-lucide="users" class="h-5 w-5"></i>
                            </div>
                            <h3 class="font-display font-semibold text-slate-900">Grassroots Empathy</h3>
                            <p class="text-slate-500 text-xs leading-relaxed">We work directly in the communities where our ventures operate—verifying student records in Benin City classrooms or riding with drivers to refine commuter transit apps.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= WHAT WE DO TAB ================= -->
        <section id="tab-what-we-do" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <!-- Header -->
                <div class="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span class="text-red-500 font-mono text-xs font-semibold tracking-widest uppercase">OUR SERVICES</span>
                    <h1 class="text-4xl sm:text-5xl font-display font-bold text-slate-900"><?php echo get_cfg('what_we_do_title', 'Architecting African Technology Infrastructure.'); ?></h1>
                    <p class="text-slate-600 text-base sm:text-lg"><?php echo get_cfg('what_we_do_desc', 'We design and support long-term systems to empower organizations and communities. Explore our 4 main corporate pillars.'); ?></p>
                </div>

                <!-- 4 Pillars Staggered Grid -->
                <div class="space-y-12">
                    <?php 
                    $icons = [
                        'studio' => 'rocket',
                        'transform' => 'cpu',
                        'ecosystem' => 'network',
                        'advisory' => 'shield-check'
                    ];
                    foreach ($services as $s): 
                        $iconClass = isset($icons[$s['id']]) ? $icons[$s['id']] : 'briefcase';
                    ?>
                    <div class="bg-white border border-slate-100 rounded-2xl p-8 lg:p-12 shadow-sm grid lg:grid-cols-12 gap-8 items-center">
                        <div class="lg:col-span-8 space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 bg-indigo-50 text-[#141b77] rounded-lg flex items-center justify-center">
                                    <i data-lucide="<?php echo $iconClass; ?>" class="h-5 w-5"></i>
                                </div>
                                <h3 class="text-2xl font-display font-bold text-slate-900"><?php echo $s['title']; ?></h3>
                            </div>
                            <p class="text-[#141b77] font-medium text-sm"><?php echo $s['shortDesc']; ?></p>
                            <p class="text-slate-600 text-sm leading-relaxed"><?php echo $s['longDesc']; ?></p>
                            
                            <div class="pt-2">
                                <h4 class="font-display font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">Core Competencies:</h4>
                                <ul class="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
                                    <?php foreach ($s['keyFeatures'] as $kf): ?>
                                    <li class="flex items-start gap-1.5"><i data-lucide="check-circle" class="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5"></i> <?php echo $kf; ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Case study block -->
                        <div class="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-4">
                            <div class="flex justify-between items-center border-b border-slate-200/60 pb-3">
                                <span class="text-[10px] font-mono tracking-widest text-slate-400 uppercase">CASE IMPACT</span>
                                <span class="bg-red-50 text-red-600 font-mono text-[10px] px-2 py-0.5 rounded font-bold"><?php echo $s['caseStudy']['metric']; ?></span>
                            </div>
                            <h4 class="font-display font-semibold text-slate-900 text-sm"><?php echo $s['caseStudy']['title']; ?></h4>
                            <p class="text-slate-500 text-xs leading-relaxed"><?php echo $s['caseStudy']['description']; ?></p>
                            <button onclick="openBookModal()" class="w-full h-10 rounded-lg border border-[#141b77] text-[#141b77] hover:bg-[#141b77] hover:text-white transition-all text-xs font-medium font-display">
                                Consult On This Pillar
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- ================= OUR VENTURES TAB ================= -->
        <section id="tab-ventures" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <!-- Header -->
                <div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <span class="text-[#141b77] font-mono text-xs font-semibold tracking-widest uppercase">OUR VENTURE HOUSE</span>
                    <h1 class="text-4xl font-display font-bold text-slate-900">Co-founded & Accelerated Ventures</h1>
                    <p class="text-slate-600 text-sm">We take co-founder responsibilities on digital systems solving core problems in education, commerce, mobility, and healthcare across emerging markets.</p>
                </div>

                <!-- Grid of Ventures -->
                <div class="grid md:grid-cols-2 gap-8">
                    <?php 
                    $vIcons = [
                        'ugbekun' => 'graduation-cap',
                        'oghowa' => 'rocket',
                        'eduride' => 'bus',
                        'cyona' => 'heart'
                    ];
                    foreach ($ventures as $v): 
                        $vIcon = isset($vIcons[$v['id']]) ? $vIcons[$v['id']] : 'globe';
                    ?>
                    <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
                        <div class="p-8 space-y-4 flex-grow">
                            <!-- Venture Header -->
                            <div class="flex items-start justify-between">
                                <div class="h-12 w-12 bg-indigo-50 text-[#141b77] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i data-lucide="<?php echo $vIcon; ?>" class="h-6 w-6"></i>
                                </div>
                                <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2.5 py-1 rounded">FLAGSHIP VENTURE</span>
                            </div>
                            
                            <!-- Venture details -->
                            <div class="space-y-1">
                                <h3 class="text-2xl font-display font-bold text-slate-900"><?php echo $v['name']; ?></h3>
                                <p class="text-[#141b77] text-xs font-semibold uppercase tracking-wider font-display"><?php echo $v['tagline']; ?></p>
                            </div>
                            
                            <p class="text-slate-600 text-sm leading-relaxed"><?php echo $v['description']; ?></p>
                            
                            <!-- Venture stats -->
                            <div class="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-4 my-4">
                                <?php foreach ($v['stats'] as $st): ?>
                                <div class="text-center">
                                    <span class="block font-mono text-sm font-bold text-slate-900"><?php echo $st['value']; ?></span>
                                    <span class="block text-[9px] text-slate-400 font-display mt-0.5"><?php echo $st['label']; ?></span>
                                </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        
                        <!-- CTA button -->
                        <div class="p-6 bg-slate-50 border-t border-slate-100">
                            <button onclick="openVentureModal('<?php echo $v['id']; ?>')" class="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs font-display flex items-center justify-center gap-2 group-hover:bg-red-500 group-hover:text-white transition-all">
                                View Case Analysis & Metrics <i data-lucide="arrow-up-right" class="h-3.5 w-3.5"></i>
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- ================= INSIGHTS TAB ================= -->
        <section id="tab-insights" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <!-- Header -->
                <div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
                    <span class="text-[#141b77] font-mono text-xs font-semibold tracking-widest uppercase font-bold">METASPACE INTEL</span>
                    <h1 class="text-4xl font-display font-bold text-slate-900">Industry Insights & Publications</h1>
                    <p class="text-slate-600 text-sm">Read strategic analyses, legal briefs on local tech laws, and academic reviews formulated by our policy advisory board.</p>
                </div>

                <!-- Insights grid -->
                <div id="insights-grid" class="grid md:grid-cols-3 gap-8">
                    <!-- Static Articles loaded directly -->
                    <div class="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                        <div class="p-6 space-y-3 flex-grow">
                            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                <span class="bg-indigo-50 text-[#141b77] font-bold px-2 py-0.5 rounded uppercase">Policy advisory</span>
                                <span>5 min read</span>
                            </div>
                            <h3 class="text-lg font-display font-bold text-slate-900 hover:text-[#141b77] transition-colors"><a href="#" onclick="openInsight(1)">Unlocking South-South Startup Ecosystems</a></h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Analyzing how state-level legal provisions are accelerating capital flow and infrastructure building across secondary markets in West Africa.</p>
                        </div>
                        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-[10px] font-mono text-slate-400">October 14, 2025</span>
                            <button onclick="openInsight(1)" class="text-xs font-semibold text-red-500 flex items-center gap-1 hover:text-red-600 transition-colors">Read Brief <i data-lucide="chevron-right" class="h-3.5 w-3.5"></i></button>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                        <div class="p-6 space-y-3 flex-grow">
                            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                <span class="bg-indigo-50 text-[#141b77] font-bold px-2 py-0.5 rounded uppercase">Education tech</span>
                                <span>8 min read</span>
                            </div>
                            <h3 class="text-lg font-display font-bold text-slate-900 hover:text-[#141b77] transition-colors"><a href="#" onclick="openInsight(2)">Modernizing Classroom Accounts</a></h3>
                            <p class="text-slate-500 text-xs leading-relaxed">A systematic review of automated cash flow trackers in sub-Saharan public school systems, focusing on leak containment and tracking fees.</p>
                        </div>
                        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-[10px] font-mono text-slate-400">September 22, 2025</span>
                            <button onclick="openInsight(2)" class="text-xs font-semibold text-red-500 flex items-center gap-1 hover:text-red-600 transition-colors">Read Brief <i data-lucide="chevron-right" class="h-3.5 w-3.5"></i></button>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                        <div class="p-6 space-y-3 flex-grow">
                            <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                <span class="bg-indigo-50 text-[#141b77] font-bold px-2 py-0.5 rounded uppercase">Digital Modernization</span>
                                <span>6 min read</span>
                            </div>
                            <h3 class="text-lg font-display font-bold text-slate-900 hover:text-[#141b77] transition-colors"><a href="#" onclick="openInsight(3)">Enterprise Cloud Migration Frameworks</a></h3>
                            <p class="text-slate-500 text-xs leading-relaxed">Analyzing high-security migration models from absolute hardware configurations to highly secure hybrid cloud clusters in financial services.</p>
                        </div>
                        <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <span class="text-[10px] font-mono text-slate-400">August 05, 2025</span>
                            <button onclick="openInsight(3)" class="text-xs font-semibold text-red-500 flex items-center gap-1 hover:text-red-600 transition-colors">Read Brief <i data-lucide="chevron-right" class="h-3.5 w-3.5"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= CONTACT US TAB ================= -->
        <section id="tab-contact" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div class="grid lg:grid-cols-12 gap-12">
                    
                    <!-- Left Column Contact Info -->
                    <div class="lg:col-span-5 space-y-8">
                        <div class="space-y-4">
                            <span class="text-red-500 font-mono text-xs font-semibold tracking-widest uppercase block">GET IN TOUCH</span>
                            <h1 class="text-4xl font-display font-bold text-slate-900">Establish Connection</h1>
                            <p class="text-slate-600 text-sm">Reach out to our core operational offices. Whether you represent a sovereign group seeking legal advisory or a founder pitching seed-ventures, our coordinators will respond promptly.</p>
                        </div>
                        
                        <div class="space-y-4 text-sm text-slate-700">
                            <div class="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center shrink-0">
                                    <i data-lucide="map-pin" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <span class="block font-display font-semibold text-slate-900 text-xs">Primary Headquarters</span>
                                    <span class="block text-slate-500 mt-1"><?php echo get_cfg('footer_address', 'Benin City, Edo State, Nigeria'); ?></span>
                                </div>
                            </div>
                            
                            <div class="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div class="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <i data-lucide="mail" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <span class="block font-display font-semibold text-slate-900 text-xs">Email Correspondence</span>
                                    <a href="mailto:<?php echo get_cfg('footer_email', 'info@metaspaceconsulting.com'); ?>" class="block text-slate-500 mt-1 hover:text-[#141b77] transition-colors"><?php echo get_cfg('footer_email', 'info@metaspaceconsulting.com'); ?></a>
                                </div>
                            </div>

                            <div class="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div class="h-9 w-9 rounded-lg bg-indigo-50 text-[#141b77] flex items-center justify-center shrink-0">
                                    <i data-lucide="phone" class="h-4 w-4"></i>
                                </div>
                                <div>
                                    <span class="block font-display font-semibold text-slate-900 text-xs">Telephony Hotline</span>
                                    <span class="block text-slate-500 mt-1"><?php echo get_cfg('footer_phone', '+234 812 345 6789'); ?></span>
                                </div>
                            </div>
                        </div>

                        <!-- Active WhatsApp Widget -->
                        <div class="p-6 bg-[#25d366]/10 border border-[#25d366]/30 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                            <div class="h-12 w-12 rounded-full bg-[#25d366] text-white flex items-center justify-center text-2xl shrink-0">
                                <i data-lucide="message-square" class="h-6 w-6"></i>
                            </div>
                            <div class="text-center sm:text-left">
                                <h3 class="font-display font-bold text-slate-900 text-sm">Direct WhatsApp Hotline</h3>
                                <p class="text-slate-500 text-xs mt-0.5">Secure instant live support from our coordinators in Benin City.</p>
                            </div>
                            <a href="https://wa.me/<?php echo $cleanWa; ?>" target="_blank" class="w-full sm:w-auto bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-semibold px-5 py-3 rounded-lg text-center font-display shadow-md shadow-[#25d366]/20 shrink-0">
                                Chat Now
                            </a>
                        </div>
                    </div>

                    <!-- Right Column Contact Form -->
                    <div class="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                        <h2 class="text-2xl font-display font-bold text-slate-900 mb-6">Send Direct Inquiry</h2>
                        
                        <div id="contact-success-alert" class="hidden mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3">
                            <i data-lucide="check-circle" class="h-5 w-5 text-emerald-500 shrink-0 mt-0.5"></i>
                            <div>
                                <span class="block font-semibold text-sm">Inquiry Transmitted Successfully</span>
                                <span class="block text-xs mt-0.5">Thank you! Your message has been recorded. Our administrators will verify and respond shortly.</span>
                            </div>
                        </div>

                        <div id="contact-error-alert" class="hidden mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3">
                            <i data-lucide="shield-check" class="h-5 w-5 text-red-500 shrink-0 mt-0.5"></i>
                            <div id="contact-error-txt" class="text-xs"></div>
                        </div>

                        <form id="contact-form" onsubmit="submitContactForm(event)" class="space-y-5">
                            <div class="grid sm:grid-cols-2 gap-5">
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Your Full Name *</label>
                                    <input type="text" id="contact_name" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:border-[#141b77] focus:bg-white rounded-lg outline-none text-sm transition-all">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Email Address *</label>
                                    <input type="email" id="contact_email" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:border-[#141b77] focus:bg-white rounded-lg outline-none text-sm transition-all">
                                </div>
                            </div>
                            
                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700">Subject of Consultation *</label>
                                <input type="text" id="contact_subject" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 focus:border-[#141b77] focus:bg-white rounded-lg outline-none text-sm transition-all" placeholder="e.g. Venture Design or Legacy Audit">
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700">Detailed Message *</label>
                                <textarea id="contact_message" required rows="5" class="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#141b77] focus:bg-white rounded-lg outline-none text-sm transition-all placeholder:text-slate-400" placeholder="Please type in your organizational pain-points..."></textarea>
                            </div>

                            <button type="submit" id="contact_submit_btn" class="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg font-display text-sm transition-colors flex items-center justify-center gap-2">
                                <i data-lucide="send" class="h-4 w-4"></i> Transmit Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- ================= ADMIN PORTAL TAB ================= -->
        <section id="tab-admin" class="tab-content animate-fade-in">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <!-- UNLOGGED IN PANEL -->
                <div id="admin-login-panel" class="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl p-8 shadow-md">
                    <div class="text-center space-y-3 mb-8">
                        <div class="h-12 w-12 bg-slate-950 text-white rounded-xl mx-auto flex items-center justify-center border-t-2 border-red-500">
                            <i data-lucide="shield-check" class="h-6 w-6"></i>
                        </div>
                        <h1 class="text-2xl font-display font-bold text-slate-900">Administrator Vault</h1>
                        <p class="text-slate-500 text-xs leading-relaxed">Enter security password to access dynamic client ledger, custom site editor, and backup archives.</p>
                    </div>

                    <div id="admin-login-error" class="hidden mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs flex items-center gap-2">
                        <i data-lucide="shield-check" class="h-4 w-4 shrink-0"></i>
                        <span id="admin-login-error-txt">Incorrect credentials.</span>
                    </div>

                    <form onsubmit="adminLogin(event)" class="space-y-4">
                        <div class="space-y-1.5">
                            <label class="text-xs font-semibold text-slate-700">Vault Password</label>
                            <input type="password" id="admin_pwd_field" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-slate-900 focus:bg-white transition-all" placeholder="Enter password (default: admin)">
                        </div>
                        <button type="submit" class="w-full h-11 bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs font-display flex items-center justify-center gap-2">
                            Unlock Security Portal <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i>
                        </button>
                    </form>
                </div>

                <!-- LOGGED IN VIEW PANEL -->
                <div id="admin-main-panel" class="hidden space-y-8">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-display font-bold text-slate-900">Security Command Console</h1>
                            <p class="text-slate-500 text-xs font-mono">Status: Authenticated Session (Secure Local Database System)</p>
                        </div>
                        <button onclick="adminLogout()" class="px-4 h-10 border border-slate-200 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2">
                            <i data-lucide="shield-check" class="h-4 w-4"></i> Lock Vault
                        </button>
                    </div>

                    <!-- Inner tab navigation -->
                    <div class="flex border-b border-slate-200 gap-6">
                        <button onclick="switchAdminTab('submissions')" id="admin-tab-btn-submissions" class="admin-tab-btn border-b-2 border-red-500 text-slate-900 font-semibold text-sm pb-3">
                            Submissions Log
                        </button>
                        <button onclick="switchAdminTab('editor')" id="admin-tab-btn-editor" class="admin-tab-btn text-slate-500 font-medium text-sm pb-3">
                            Dynamic Site Editor
                        </button>
                    </div>

                    <!-- SUBMISSIONS LOG PANEL -->
                    <div id="admin-panel-submissions" class="grid lg:grid-cols-12 gap-8">
                        <!-- Consultations List -->
                        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 class="font-display font-bold text-slate-900 flex items-center gap-2"><i data-lucide="calendar" class="h-4 w-4 text-indigo-500"></i> Booked Consultations</h3>
                                <span id="consult-count" class="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">0 Records</span>
                            </div>
                            
                            <div id="consultations-container" class="space-y-4 max-h-[500px] overflow-y-auto">
                                <p class="text-slate-400 text-xs text-center py-8">Loading booking ledger...</p>
                            </div>
                        </div>

                        <!-- Contact Inquiries List -->
                        <div class="lg:col-span-5 bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 class="font-display font-bold text-slate-900 flex items-center gap-2"><i data-lucide="mail" class="h-4 w-4 text-red-500"></i> Contact Inquiries</h3>
                                <span id="inquiry-count" class="bg-red-50 text-red-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">0 Records</span>
                            </div>

                            <div id="inquiries-container" class="space-y-4 max-h-[500px] overflow-y-auto">
                                <p class="text-slate-400 text-xs text-center py-8">Loading message ledger...</p>
                            </div>
                        </div>
                    </div>

                    <!-- DYNAMIC SITE EDITOR PANEL -->
                    <div id="admin-panel-editor" class="hidden bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
                        <h3 class="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                            <i data-lucide="sparkles" class="h-5 w-5 text-red-500"></i> Content Configuration Canvas
                        </h3>

                        <div id="editor-status-alert" class="hidden mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs"></div>

                        <form onsubmit="saveDynamicConfig(event)" class="space-y-6">
                            <div class="grid sm:grid-cols-2 gap-6">
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Home Hero Title</label>
                                    <input type="text" id="edit_home_title" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Home Hero Subtitle</label>
                                    <input type="text" id="edit_home_subtitle" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700">Home Hero Description</label>
                                <textarea id="edit_home_desc" rows="3" required class="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all"></textarea>
                            </div>

                            <div class="grid sm:grid-cols-3 gap-6">
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">WhatsApp Support Hotline</label>
                                    <input type="text" id="edit_whatsapp" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Lagos Bridge Hero Image URL</label>
                                    <input type="url" id="edit_hero_image_url" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">Footer Email Correspondences</label>
                                    <input type="email" id="edit_footer_email" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                            </div>

                            <div class="grid sm:grid-cols-2 gap-6">
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">About Hero Title</label>
                                    <input type="text" id="edit_about_title" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-xs font-semibold text-slate-700">About Hero Description</label>
                                    <input type="text" id="edit_about_desc" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all">
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700">About Core Mission Statement</label>
                                <textarea id="edit_about_mission" rows="4" required class="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:bg-white focus:border-red-500 transition-all"></textarea>
                            </div>

                            <button type="submit" class="px-6 h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-xs font-display flex items-center justify-center gap-2">
                                <i data-lucide="shield-check" class="h-4 w-4"></i> Deploy Content Updates
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- 4. Modular Footer -->
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs sm:text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
            <!-- Brand Column -->
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 bg-white rounded-lg flex items-center justify-center border-t-2 border-red-500">
                        <span class="text-slate-900 font-display font-bold text-sm tracking-tighter">M<span class="text-red-500">S</span></span>
                    </div>
                    <span class="text-white font-display font-bold text-base tracking-tight block">METASPACE</span>
                </div>
                <p class="text-slate-400 leading-relaxed text-xs">
                    <?php echo get_cfg('footer_desc', 'We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.'); ?>
                </p>
                <div class="flex items-center gap-3 pt-2">
                    <a href="https://linkedin.com/company/metaspace" target="_blank" class="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center hover:text-white transition-all"><i data-lucide="linkedin" class="h-4 w-4"></i></a>
                    <a href="https://twitter.com/metaspace" target="_blank" class="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center hover:text-white transition-all"><i data-lucide="twitter" class="h-4 w-4"></i></a>
                    <a href="https://facebook.com/metaspace" target="_blank" class="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center hover:text-white transition-all"><i data-lucide="facebook" class="h-4 w-4"></i></a>
                </div>
            </div>

            <!-- Quick Navigation Links -->
            <div class="space-y-4">
                <h4 class="text-white font-display font-semibold text-xs uppercase tracking-widest">Navigation</h4>
                <ul class="space-y-2 text-xs">
                    <li><button onclick="switchTab('about')" class="hover:text-white transition-colors">About Corporate</button></li>
                    <li><button onclick="switchTab('what-we-do')" class="hover:text-white transition-colors">Four Corporate Pillars</button></li>
                    <li><button onclick="switchTab('ventures')" class="hover:text-white transition-colors">Portfolio House</button></li>
                    <li><button onclick="switchTab('insights')" class="hover:text-white transition-colors">Policy Publications</button></li>
                    <li><button onclick="switchTab('contact')" class="hover:text-white transition-colors">Connect Offices</button></li>
                </ul>
            </div>

            <!-- Ventures Portfolio Shortcuts -->
            <div class="space-y-4">
                <h4 class="text-white font-display font-semibold text-xs uppercase tracking-widest">Co-Built Ventures</h4>
                <ul class="space-y-2 text-xs">
                    <li><button onclick="switchTab('ventures'); openVentureModal('ugbekun');" class="hover:text-white transition-colors">Ugbekun Platform</button></li>
                    <li><button onclick="switchTab('ventures'); openVentureModal('oghowa');" class="hover:text-white transition-colors">Oghowa Accelerator</button></li>
                    <li><button onclick="switchTab('ventures'); openVentureModal('eduride');" class="hover:text-white transition-colors">EduRide Logistics</button></li>
                    <li><button onclick="switchTab('ventures'); openVentureModal('cyona');" class="hover:text-white transition-colors">Cyona Medicare</button></li>
                </ul>
            </div>

            <!-- Contacts Info Column -->
            <div class="space-y-4">
                <h4 class="text-white font-display font-semibold text-xs uppercase tracking-widest">African Headquarters</h4>
                <ul class="space-y-2.5 text-xs">
                    <li class="flex items-start gap-2"><i data-lucide="map-pin" class="h-4 w-4 text-red-500 shrink-0 mt-0.5"></i> <span><?php echo get_cfg('footer_address', 'Benin City, Edo State, Nigeria'); ?></span></li>
                    <li class="flex items-center gap-2"><i data-lucide="mail" class="h-4 w-4 text-indigo-400 shrink-0"></i> <a href="mailto:<?php echo get_cfg('footer_email', 'info@metaspaceconsulting.com'); ?>" class="hover:text-white truncate"><?php echo get_cfg('footer_email', 'info@metaspaceconsulting.com'); ?></a></li>
                    <li class="flex items-center gap-2"><i data-lucide="phone" class="h-4 w-4 text-indigo-400 shrink-0"></i> <span><?php echo get_cfg('footer_phone', '+234 812 345 6789'); ?></span></li>
                </ul>
            </div>
        </div>
        
        <div class="border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>&copy; <?php echo date('Y'); ?> Metaspace Consulting Limited. All sovereign rights reserved.</p>
                <p class="font-mono text-[10px]">Built Systems. Empowering People. Transforming Africa.</p>
            </div>
        </div>
    </footer>

    <!-- ================= FLOATING CHATBOT WIDGET ================= -->
    <div id="companion-bot" class="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        <!-- Chat Bubble (Initially Hidden) -->
        <div id="companion-chat-window" class="hidden w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl flex flex-col h-[480px] overflow-hidden mb-4 animate-scale-up">
            <!-- Header -->
            <div class="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
                <div class="flex items-center gap-2.5">
                    <div class="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <i data-lucide="sparkles" class="h-4 w-4 text-red-400"></i>
                    </div>
                    <div>
                        <h4 class="font-display font-semibold text-xs text-white">Companion AI</h4>
                        <span class="text-[9px] font-mono text-slate-400 block leading-none">Official Metaspace Assistant</span>
                    </div>
                </div>
                <button onclick="toggleCompanionChat()" class="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/15 text-slate-400 hover:text-white transition-all">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>

            <!-- Messages Area -->
            <div id="chat-messages-container" class="flex-grow p-4 space-y-3 overflow-y-auto bg-slate-50">
                <!-- Companion Welcome Message -->
                <div class="flex gap-2.5 items-start">
                    <div class="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">
                        <i data-lucide="sparkles" class="h-3 w-3 text-red-400"></i>
                    </div>
                    <div class="p-3 bg-white border border-slate-100 rounded-xl text-slate-700 text-xs shadow-sm max-w-[80%]">
                        Greetings! I'm Companion. I can give you precise metrics about our ventures (Ugbekun, Oghowa, EduRide, Cyona), tell you about our core pillars, or guide you to book a consultation session. How is your organization doing today?
                    </div>
                </div>
            </div>

            <!-- Footer Chat Input -->
            <form onsubmit="sendCompanionMessage(event)" class="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
                <input type="text" id="chat-user-input" required class="flex-grow h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded-lg outline-none text-xs transition-all" placeholder="Ask Companion about our ventures...">
                <button type="submit" class="h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors shadow">
                    <i data-lucide="send" class="h-4 w-4"></i>
                </button>
            </form>
        </div>

        <!-- Chat Bubble Button -->
        <button onclick="toggleCompanionChat()" class="h-14 w-14 rounded-full bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-950/20 hover:scale-105 transition-all relative border border-slate-800">
            <i id="bot-button-icon" data-lucide="message-square" class="h-6 w-6"></i>
            <span class="absolute top-0 right-0 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
            <span class="absolute top-0 right-0 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
    </div>

    <!-- ================= MODAL: BOOK CONSULTATION ================= -->
    <div id="book-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div class="bg-white border border-slate-100 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
            <div class="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
                <div class="flex items-center gap-2.5">
                    <div class="h-9 w-9 bg-white/10 text-white rounded-lg flex items-center justify-center">
                        <i data-lucide="calendar" class="h-4 w-4 text-red-400"></i>
                    </div>
                    <div>
                        <h3 class="font-display font-bold text-base text-white">Book System Consultation</h3>
                        <span class="text-[10px] font-mono text-slate-400 block mt-0.5">Metaspace Strategic Advisory Desk</span>
                    </div>
                </div>
                <button onclick="closeBookModal()" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                    <i data-lucide="x" class="h-5 w-5"></i>
                </button>
            </div>

            <div class="p-6">
                <div id="book-success-panel" class="hidden space-y-4 text-center py-6">
                    <div class="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                        <i data-lucide="check-circle" class="h-10 w-10"></i>
                    </div>
                    <div class="space-y-1">
                        <h4 class="font-display font-bold text-lg text-slate-900">Consultation Request Logged</h4>
                        <p class="text-slate-500 text-xs">Your system briefing has been securely stored. Our directorate coordinators will contact you within 24 hours.</p>
                    </div>
                    <button onclick="closeBookModal()" class="px-5 h-10 bg-[#141b77] text-white text-xs font-semibold rounded-lg font-display transition-colors">
                        Close Panel
                    </button>
                </div>

                <form id="book-form" onsubmit="submitBookForm(event)" class="space-y-4">
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-semibold text-slate-700">Your Full Name *</label>
                            <input type="text" id="book_name" required class="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-semibold text-slate-700">Official Email *</label>
                            <input type="email" id="book_email" required class="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all">
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-semibold text-slate-700">Organization Name *</label>
                            <input type="text" id="book_org" required class="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[11px] font-semibold text-slate-700">Corporate Sector *</label>
                            <select id="book_sector" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all">
                                <option>Education Management</option>
                                <option>Logistics & Mobility</option>
                                <option>Healthcare Services</option>
                                <option>Venture Incubation</option>
                                <option>Sovereign & Public Advisory</option>
                                <option>Corporate Expansion</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[11px] font-semibold text-slate-700">Target Core Pillar *</label>
                        <select id="book_pillar" class="w-full h-10 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all">
                            <option>Venture Design Studio</option>
                            <option>Digital Transformation Audit</option>
                            <option>Innovation Ecosystem Building</option>
                            <option>Sovereign Policy & Strategy</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[11px] font-semibold text-slate-700">Brief Operational pain-point *</label>
                        <textarea id="book_message" rows="3" required class="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#141b77] rounded-lg outline-none text-xs transition-all placeholder:text-slate-400" placeholder="e.g. Seeking cashless fee collection system audits..."></textarea>
                    </div>

                    <button type="submit" class="w-full h-11 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg font-display text-xs transition-colors flex items-center justify-center gap-2">
                        Transmit Booking <i data-lucide="send" class="h-3.5 w-3.5"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- ================= MODAL: VENTURE ANALYSIS ================= -->
    <div id="venture-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
        <div class="bg-white border border-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div id="venture-modal-banner" class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
                <button onclick="closeVentureModal()" class="absolute top-6 right-6 h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <i data-lucide="x" class="h-5 w-5"></i>
                </button>
                <div class="space-y-1 pr-12">
                    <span class="text-[9px] font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded uppercase">Metaspace Co-founded Venture</span>
                    <h3 id="v_modal_title" class="text-3xl font-display font-bold leading-none">Ugbekun</h3>
                    <p id="v_modal_tagline" class="text-white/80 text-xs font-semibold uppercase tracking-wider font-display mt-1">Smart School Management System</p>
                </div>
            </div>

            <div class="p-6 space-y-6">
                <!-- Case review -->
                <div class="space-y-2">
                    <h4 class="font-display font-bold text-slate-900 text-xs uppercase tracking-widest text-[#141b77]">VENTURE METRICS ANALYSIS</h4>
                    <p id="v_modal_details" class="text-slate-600 text-xs leading-relaxed">Full text goes here...</p>
                </div>

                <!-- Highlight stats -->
                <div id="v_modal_stats_grid" class="grid grid-cols-3 gap-4 border-t border-b border-slate-100 py-4">
                    <!-- Stats values injected via JS -->
                </div>

                <!-- Strategic highlights -->
                <div class="space-y-2.5">
                    <h4 class="font-display font-bold text-slate-900 text-xs uppercase tracking-widest text-red-500">OPERATIONAL MILESTONES</h4>
                    <ul id="v_modal_bullets" class="space-y-1.5 text-xs text-slate-600">
                        <!-- Bullet list items injected via JS -->
                    </ul>
                </div>

                <!-- Bottom quote -->
                <div class="p-4 bg-slate-50 border-l-4 border-red-500 rounded-r-xl">
                    <p id="v_modal_quote" class="text-slate-500 italic text-xs leading-relaxed">Quote here...</p>
                </div>
            </div>
        </div>
    </div>


    <!-- ================= JAVASCRIPT STATE ENGINE ================= -->
    <script>
        // Global Metaspace Database Store
        const VENTURES = <?php echo json_encode($ventures); ?>;
        let siteConfig = <?php echo json_encode($config); ?>;

        // 1. Preloader Fade Out
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            setTimeout(() => {
                preloader.classList.add('loader-fadeout');
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 600);
        });

        // 2. Tab Switching Controller
        function switchTab(tabId) {
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
            
            // Set nav button active styling
            document.querySelectorAll('.nav-btn').forEach(btn => {
                if (btn.getAttribute('data-tab-target') === tabId) {
                    btn.className = 'nav-btn font-semibold text-red-500 border-b-2 border-red-500 pb-1.5 transition-colors font-display text-sm';
                } else {
                    btn.className = 'nav-btn font-medium text-slate-600 hover:text-slate-950 transition-colors text-sm';
                }
            });

            // Toggle Content Panels
            document.querySelectorAll('.tab-content').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const activePanel = document.getElementById('tab-' + tabId);
            if (activePanel) {
                activePanel.classList.add('active');
            }

            // Scroll to Top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 3. Header Menu Collapser
        function toggleMobileMenu() {
            const mm = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');
            if (mm.classList.contains('hidden')) {
                mm.classList.remove('hidden');
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                mm.classList.add('hidden');
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        }

        // 4. Modal Interactions
        function openBookModal() {
            document.getElementById('book-success-panel').classList.add('hidden');
            document.getElementById('book-form').classList.remove('hidden');
            document.getElementById('book-modal').classList.remove('hidden');
        }
        function closeBookModal() {
            document.getElementById('book-modal').classList.add('hidden');
        }

        function openVentureModal(vId) {
            const venture = VENTURES.find(v => v.id === vId);
            if (!venture) return;

            document.getElementById('v_modal_title').innerText = venture.name;
            document.getElementById('v_modal_tagline').innerText = venture.tagline;
            document.getElementById('v_modal_details').innerText = venture.fullDetails;
            document.getElementById('v_modal_quote').innerText = `"${venture.founderQuote}"`;

            // Set dynamic banner gradient colors
            const banner = document.getElementById('venture-modal-banner');
            banner.className = `bg-gradient-to-r ${venture.color || 'from-blue-600 to-indigo-700'} text-white p-6 relative`;

            // Inject Stats
            const statsContainer = document.getElementById('v_modal_stats_grid');
            statsContainer.innerHTML = '';
            venture.stats.forEach(st => {
                statsContainer.innerHTML += `
                    <div class="text-center">
                        <span class="block font-mono text-base font-bold text-slate-900">${st.value}</span>
                        <span class="block text-[9px] text-slate-400 font-display mt-0.5">${st.label}</span>
                    </div>
                `;
            });

            // Inject Milestones/Bullet points
            const bulletContainer = document.getElementById('v_modal_bullets');
            bulletContainer.innerHTML = '';
            venture.impactPoints.forEach(pt => {
                bulletContainer.innerHTML += `
                    <li class="flex items-start gap-2"><i data-lucide="check-circle" class="h-4 w-4 text-emerald-500 shrink-0 mt-0.5"></i> ${pt}</li>
                `;
            });

            document.getElementById('venture-modal').classList.remove('hidden');
            lucide.createIcons();
        }
        function closeVentureModal() {
            document.getElementById('venture-modal').classList.add('hidden');
        }

        // 5. Booking & Form Ingest Submission Handlers
        function submitBookForm(event) {
            event.preventDefault();
            const payload = {
                name: document.getElementById('book_name').value,
                email: document.getElementById('book_email').value,
                organization: document.getElementById('book_org').value,
                sector: document.getElementById('book_sector').value,
                service: document.getElementById('book_pillar').value,
                message: document.getElementById('book_message').value
            };

            fetch('api.php?action=book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('book-form').reset();
                    document.getElementById('book-form').classList.add('hidden');
                    document.getElementById('book-success-panel').classList.remove('hidden');
                } else {
                    alert(data.error || "Failed to transmit booking request.");
                }
            })
            .catch(err => {
                alert("Database server sync interrupted. Try again.");
            });
        }

        function submitContactForm(event) {
            event.preventDefault();
            const payload = {
                name: document.getElementById('contact_name').value,
                email: document.getElementById('contact_email').value,
                subject: document.getElementById('contact_subject').value,
                message: document.getElementById('contact_message').value
            };

            const successAlert = document.getElementById('contact-success-alert');
            const errorAlert = document.getElementById('contact-error-alert');
            successAlert.classList.add('hidden');
            errorAlert.classList.add('hidden');

            fetch('api.php?action=contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('contact-form').reset();
                    successAlert.classList.remove('hidden');
                    window.scrollTo({ top: successAlert.offsetTop - 120, behavior: 'smooth' });
                } else {
                    document.getElementById('contact-error-txt').innerText = data.error || "Inquiry transmission rejected.";
                    errorAlert.classList.remove('hidden');
                }
            })
            .catch(err => {
                document.getElementById('contact-error-txt').innerText = "Network transmission interrupted.";
                errorAlert.classList.remove('hidden');
            });
        }

        // 6. Gemini Companion Bot Interactions
        let chatHistory = [];
        function toggleCompanionChat() {
            const chatWin = document.getElementById('companion-chat-window');
            const botBtnIcon = document.getElementById('bot-button-icon');
            if (chatWin.classList.contains('hidden')) {
                chatWin.classList.remove('hidden');
                botBtnIcon.setAttribute('data-lucide', 'message-square');
            } else {
                chatWin.classList.add('hidden');
                botBtnIcon.setAttribute('data-lucide', 'message-square');
            }
            lucide.createIcons();
        }

        function sendCompanionMessage(event) {
            event.preventDefault();
            const inputField = document.getElementById('chat-user-input');
            const text = inputField.value.trim();
            if (!text) return;

            inputField.value = '';
            
            const msgContainer = document.getElementById('chat-messages-container');
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // 1. Add User message to layout
            msgContainer.innerHTML += `
                <div class="flex gap-2.5 items-start justify-end">
                    <div class="p-3 bg-red-500 text-white rounded-xl text-xs shadow-sm max-w-[80%]">
                        ${text}
                    </div>
                    <div class="h-6 w-6 rounded-full bg-[#141b77] text-white flex items-center justify-center text-[10px] shrink-0 font-display font-semibold">
                        U
                    </div>
                </div>
            `;
            msgContainer.scrollTop = msgContainer.scrollHeight;

            // 2. Add Typing indicator loader
            const tempId = 'loader-' + Date.now();
            msgContainer.innerHTML += `
                <div id="${tempId}" class="flex gap-2.5 items-start">
                    <div class="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">
                        <i data-lucide="sparkles" class="h-3 w-3 text-red-400"></i>
                    </div>
                    <div class="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 text-xs shadow-sm flex items-center gap-1">
                        <span class="animate-bounce">●</span>
                        <span class="animate-bounce delay-75">●</span>
                        <span class="animate-bounce delay-150">●</span>
                    </div>
                </div>
            `;
            msgContainer.scrollTop = msgContainer.scrollHeight;
            lucide.createIcons();

            // 3. Send payload to API PHP
            fetch('api.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory })
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById(tempId).remove();
                
                chatHistory.push({ role: "user", parts: [{ text: text }] });
                chatHistory.push({ role: "model", parts: [{ text: data.text }] });

                msgContainer.innerHTML += `
                    <div class="flex gap-2.5 items-start">
                        <div class="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">
                            <i data-lucide="sparkles" class="h-3 w-3 text-red-400"></i>
                        </div>
                        <div class="p-3 bg-white border border-slate-100 rounded-xl text-slate-700 text-xs shadow-sm max-w-[80%] leading-relaxed">
                            ${data.text}
                        </div>
                    </div>
                `;
                msgContainer.scrollTop = msgContainer.scrollHeight;
                lucide.createIcons();
            })
            .catch(err => {
                document.getElementById(tempId).remove();
                msgContainer.innerHTML += `
                    <div class="flex gap-2.5 items-start">
                        <div class="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0">
                            <i data-lucide="sparkles" class="h-3 w-3 text-red-400"></i>
                        </div>
                        <div class="p-3 bg-white border border-red-100 rounded-xl text-red-700 text-xs shadow-sm">
                            I am experiencing heavy traffic. Let us chat over WhatsApp: <a href="https://wa.me/2348123456789" class="underline font-bold">WhatsApp Direct</a>
                        </div>
                    </div>
                `;
                msgContainer.scrollTop = msgContainer.scrollHeight;
                lucide.createIcons();
            });
        }

        // 7. Security Admin Dashboard Engine
        let adminPwd = '';

        function adminLogin(event) {
            event.preventDefault();
            const pwd = document.getElementById('admin_pwd_field').value;
            const errAlert = document.getElementById('admin-login-error');
            errAlert.classList.add('hidden');

            fetch('api.php?action=admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwd })
            })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                adminPwd = pwd;
                localStorage.setItem('admin_session_pwd', pwd);
                
                document.getElementById('admin-login-panel').classList.add('hidden');
                document.getElementById('admin-main-panel').classList.remove('hidden');
                
                // Initialize admin fields
                loadAdminConsoleData();
            })
            .catch(err => {
                document.getElementById('admin-login-error-txt').innerText = "Incorrect security password.";
                errAlert.classList.remove('hidden');
            });
        }

        // Auto-login from localStorage if present
        window.addEventListener('DOMContentLoaded', () => {
            const savedPwd = localStorage.getItem('admin_session_pwd');
            if (savedPwd) {
                document.getElementById('admin_pwd_field').value = savedPwd;
                // Auto login silently
                fetch('api.php?action=admin-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: savedPwd })
                })
                .then(res => {
                    if (res.ok) {
                        adminPwd = savedPwd;
                        document.getElementById('admin-login-panel').classList.add('hidden');
                        document.getElementById('admin-main-panel').classList.remove('hidden');
                        loadAdminConsoleData();
                    } else {
                        localStorage.removeItem('admin_session_pwd');
                    }
                });
            }
            lucide.createIcons();
        });

        function adminLogout() {
            adminPwd = '';
            localStorage.removeItem('admin_session_pwd');
            document.getElementById('admin_pwd_field').value = '';
            document.getElementById('admin-login-panel').classList.remove('hidden');
            document.getElementById('admin-main-panel').classList.add('hidden');
        }

        function switchAdminTab(subTab) {
            document.querySelectorAll('.admin-tab-btn').forEach(btn => {
                btn.className = 'admin-tab-btn text-slate-500 font-medium text-sm pb-3';
            });
            document.getElementById('admin-tab-btn-' + subTab).className = 'admin-tab-btn border-b-2 border-red-500 text-slate-900 font-semibold text-sm pb-3';

            if (subTab === 'submissions') {
                document.getElementById('admin-panel-submissions').classList.remove('hidden');
                document.getElementById('admin-panel-editor').classList.add('hidden');
            } else {
                document.getElementById('admin-panel-submissions').classList.add('hidden');
                document.getElementById('admin-panel-editor').classList.remove('hidden');
            }
        }

        function loadAdminConsoleData() {
            // Load submissions log
            fetch('api.php?action=get-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: adminPwd })
            })
            .then(res => res.json())
            .then(data => {
                // Ingest consultations
                const consultsBox = document.getElementById('consultations-container');
                document.getElementById('consult-count').innerText = `${data.consultations.length} Records`;
                if (data.consultations.length === 0) {
                    consultsBox.innerHTML = '<p class="text-slate-400 text-xs text-center py-8">No consultations scheduled yet.</p>';
                } else {
                    consultsBox.innerHTML = '';
                    data.consultations.forEach(c => {
                        const formattedDate = new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                        consultsBox.innerHTML += `
                            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 relative">
                                <span class="absolute top-4 right-4 bg-yellow-50 text-yellow-700 font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold">${c.status || 'pending'}</span>
                                <div class="space-y-0.5">
                                    <h4 class="font-display font-bold text-slate-900 text-sm">${c.name}</h4>
                                    <p class="text-slate-500 text-xs">${c.organization} (${c.sector})</p>
                                    <p class="text-[10px] font-mono text-slate-400">${c.email} | ${formattedDate}</p>
                                </div>
                                <p class="text-slate-700 text-xs border-t border-slate-200/60 pt-2"><strong class="text-indigo-600 font-display">Pillar:</strong> ${c.service}</p>
                                <p class="text-slate-600 italic text-xs leading-relaxed bg-white border border-slate-100 p-2.5 rounded-lg">${c.message}</p>
                            </div>
                        `;
                    });
                }

                // Ingest contact inquiries
                const inquiriesBox = document.getElementById('inquiries-container');
                document.getElementById('inquiry-count').innerText = `${data.inquiries.length} Records`;
                if (data.inquiries.length === 0) {
                    inquiriesBox.innerHTML = '<p class="text-slate-400 text-xs text-center py-8">No contact inquiries made yet.</p>';
                } else {
                    inquiriesBox.innerHTML = '';
                    data.inquiries.forEach(i => {
                        const formattedDate = new Date(i.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
                        inquiriesBox.innerHTML += `
                            <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                                <div class="flex items-start justify-between">
                                    <h4 class="font-display font-bold text-slate-900 text-xs">${i.name}</h4>
                                    <span class="text-[9px] font-mono text-slate-400 shrink-0">${formattedDate}</span>
                                </div>
                                <p class="text-slate-500 text-[10px] font-mono leading-none">${i.email}</p>
                                <p class="text-slate-900 font-semibold text-xs pt-1">${i.subject}</p>
                                <p class="text-slate-600 text-xs leading-relaxed bg-white p-2.5 border border-slate-100 rounded-lg">${i.message}</p>
                            </div>
                        `;
                    });
                }
            });

            // Pre-fill Editor configs
            document.getElementById('edit_home_title').value = siteConfig.home_hero_title || '';
            document.getElementById('edit_home_subtitle').value = siteConfig.home_hero_subtitle || '';
            document.getElementById('edit_home_desc').value = siteConfig.home_hero_desc || '';
            document.getElementById('edit_whatsapp').value = siteConfig.whatsapp_number || '';
            document.getElementById('edit_hero_image_url').value = siteConfig.lagosBridgeUrl || '';
            document.getElementById('edit_footer_email').value = siteConfig.footer_email || '';
            document.getElementById('edit_about_title').value = siteConfig.about_hero_title || '';
            document.getElementById('edit_about_desc').value = siteConfig.about_hero_desc || '';
            document.getElementById('edit_about_mission').value = siteConfig.about_mission_text || '';
        }

        function saveDynamicConfig(event) {
            event.preventDefault();
            const updates = {
                home_hero_title: document.getElementById('edit_home_title').value,
                home_hero_subtitle: document.getElementById('edit_home_subtitle').value,
                home_hero_desc: document.getElementById('edit_home_desc').value,
                whatsapp_number: document.getElementById('edit_whatsapp').value,
                lagosBridgeUrl: document.getElementById('edit_hero_image_url').value,
                footer_email: document.getElementById('edit_footer_email').value,
                about_hero_title: document.getElementById('edit_about_title').value,
                about_hero_desc: document.getElementById('edit_about_desc').value,
                about_mission_text: document.getElementById('edit_about_mission').value
            };

            const statusAlert = document.getElementById('editor-status-alert');
            statusAlert.classList.add('hidden');

            fetch('api.php?action=save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: adminPwd, updates })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Update current local state
                    siteConfig = { ...siteConfig, ...updates };
                    
                    // Update visual home title instantly
                    document.getElementById('hero_title_text').innerText = updates.home_hero_title;

                    statusAlert.innerText = "Dynamic content deployed and saved successfully!";
                    statusAlert.className = "mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold";
                    statusAlert.classList.remove('hidden');
                } else {
                    statusAlert.innerText = "Deployment failed: " + (data.error || "Unknown error");
                    statusAlert.className = "mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold";
                    statusAlert.classList.remove('hidden');
                }
            })
            .catch(err => {
                statusAlert.innerText = "Server connection interrupted.";
                statusAlert.className = "mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold";
                statusAlert.classList.remove('hidden');
            });
        }

        // Static Insights display modal triggers (Parity with React fallback)
        function openInsight(id) {
            const articles = [
                {
                    title: "Unlocking South-South Startup Ecosystems",
                    desc: "State-level legislative reforms are rapidly bridging investment gaps across sub-Saharan West Africa. By formalizing early seed guarantees, simplifying licensing procedures for technological clusters, and allowing public-private infrastructure investments, policy drafting boards are helping co-founding venture houses de-risk expansion."
                },
                {
                    title: "Modernizing Classroom Accounts",
                    desc: "Traditional paper-ledger bookkeeping has long hampered operational efficiencies in secondary schools. Introducing secure, digital fee collection channels maps invoicing structures directly to parents' phones. Case analyses on flagship portals like Ugbekun reveal administrative hour savings of up to 45% and reduced outstanding tuition dues by 30%."
                },
                {
                    title: "Enterprise Cloud Migration Frameworks",
                    desc: "Transitioning high-security financial archives requires robust security standards. Rather than complete immediate hardware replacements, modernizing organizations are leveraging hybrid cloud topologies. Staging database transfers across secure multi-zone structures secures continuous operational availability during complex legacy migrations."
                }
            ];
            const a = articles[id - 1];
            if (a) {
                alert(`[METASPACE BRIEF] \n\n${a.title}\n\n${a.desc}`);
            }
        }
    </script>
</body>
</html>
