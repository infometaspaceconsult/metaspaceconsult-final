<?php
/**
 * Metaspace Consulting Limited - Home Page
 * Deployed from AI Studio cPanel Deployment Export
 */
require_once 'db.php';

// Fetch active ventures from database
$ventures = [];
try {
    if ($pdo) {
        $stmt = $pdo->query("SELECT * FROM ventures ORDER BY id ASC");
        $ventures = $stmt->fetchAll();
    }
} catch (PDOException $e) {
    // Fallback if table doesn't exist yet or is empty
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metaspace Consulting - Transforming Africa</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'deep-navy': '#141B77',
                        'innovation-red': '#E63946',
                        'surface-ice': '#F0F8FF',
                        'slate-gray': '#4A5568',
                        'surface': '#f5faff',
                        'on-surface': '#151d22',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f5faff;
            color: #151d22;
        }
        .glass-nav {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .card-shadow {
            box-shadow: 0 8px 24px -8px rgba(20, 27, 119, 0.08);
        }
        .hero-bg-pattern {
            background-image: radial-gradient(#141B77 1px, transparent 1px);
            background-size: 24px 24px;
            opacity: 0.05;
        }
    </style>
</head>
<body class="bg-[#f5faff] text-[#151d22] antialiased overflow-x-hidden min-h-screen">

    <!-- Top Navigation (Desktop) -->
    <nav class="bg-white/80 glass-nav top-0 sticky z-50 border-b border-[#F0F8FF] shadow-sm hidden md:block">
        <div class="flex justify-between items-center w-full px-12 py-4 max-w-7xl mx-auto">
            <!-- Brand -->
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-[#E63946] text-3xl" style="font-variation-settings: 'FILL' 1;">
                    language
                </span>
                <div>
                    <div class="font-bold text-lg text-[#141B77] leading-none uppercase tracking-tight">METASPACE</div>
                    <div class="text-[8px] font-bold text-[#E63946] tracking-widest uppercase mt-0.5">Consulting Limited</div>
                </div>
            </div>
            <!-- Links -->
            <div class="flex gap-8">
                <a class="font-semibold text-[#E63946] border-b-2 border-[#E63946] pb-1 transition-all" href="#home">Home</a>
                <a class="font-semibold text-[#141B77] hover:text-[#E63946] transition-colors pb-1" href="#about">About</a>
                <a class="font-semibold text-[#141B77] hover:text-[#E63946] transition-colors pb-1" href="#services">What We Do</a>
                <a class="font-semibold text-[#141B77] hover:text-[#E63946] transition-colors pb-1" href="#ventures">Our Ventures</a>
                <a class="font-semibold text-[#141B77] hover:text-[#E63946] transition-colors pb-1" href="#contact">Contact</a>
            </div>
            <!-- Action -->
            <a href="#contact" class="bg-[#141B77] text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm">
                Partner With Us
            </a>
        </div>
    </nav>

    <!-- Mobile Header -->
    <header class="bg-white/90 backdrop-blur-md border-b border-[#F0F8FF] shadow-sm sticky top-0 z-50 px-4 py-4 flex justify-between items-center md:hidden">
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#E63946] text-2xl" style="font-variation-settings: 'FILL' 1;">
                language
            </span>
            <span class="font-bold text-[#141B77] tracking-tight">METASPACE</span>
        </div>
        <a href="#contact" class="bg-[#141B77] text-white text-xs font-semibold px-4 py-2 rounded-lg">
            Connect
        </a>
    </header>

    <!-- Hero Section -->
    <section id="home" class="relative min-h-[80vh] flex items-center pt-12 md:pt-0 overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3e4azAGUiyLmHkcYq3MXXy2uq4kgU0dVDFXB-rCSWcakzrU7rkJV_m63h2d2rixCTEhqBHmTaabsZYjZS3x0QJTD5Sjalf3ldqfbhFolRnlUjJtZxeSS7u_siP967QzYI39fWjL6AjrTdu4Njhz4y1BuJojpnH1OBmW15851fYlTn0OjziyMMs6qQaMXPD2akUaZ5dHKkqSDni3PpgFhFW2clFdsRNj4QD8yG1e6_IwffEqtlWI10-7_L2dkMwOP5c7vltWbCBaE')"></div>
        <!-- Overlays -->
        <div class="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div class="absolute inset-0 z-10 hero-bg-pattern"></div>
        <div class="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div class="max-w-3xl">
                <h1 class="text-4xl md:text-6xl font-extrabold text-[#141B77] mb-6 font-display leading-tight">
                    Building Systems.<br>
                    Empowering People.<br>
                    <span class="text-[#E63946]">Transforming Africa.</span>
                </h1>
                <p class="text-lg md:text-xl text-[#4A5568] mb-10 max-w-xl leading-relaxed">
                    We design, build and scale innovative ventures and digital solutions that solve real problems and drive sustainable economic transformation across Africa.
                </p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="#ventures" class="bg-[#E63946] text-white font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group">
                        Explore Our Ventures
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                    <a href="#contact" class="bg-transparent border border-[#141B77] text-[#141B77] font-semibold px-8 py-4 rounded-lg hover:bg-[#F0F8FF] transition-all flex items-center justify-center gap-2">
                        Partner With Us
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Bar -->
    <section id="services" class="bg-[#141B77] text-white py-12">
        <div class="max-w-7xl mx-auto px-6 md:px-12">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/10">
                <div class="p-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <span class="material-symbols-outlined text-3xl text-white mb-3">tips_and_updates</span>
                    <h3 class="font-semibold text-lg">Venture Design</h3>
                </div>
                <div class="p-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <span class="material-symbols-outlined text-3xl text-white mb-3">integration_instructions</span>
                    <h3 class="font-semibold text-lg">Digital Transformation</h3>
                </div>
                <div class="p-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <span class="material-symbols-outlined text-3xl text-white mb-3">hub</span>
                    <h3 class="font-semibold text-lg">Ecosystem Building</h3>
                </div>
                <div class="p-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <span class="material-symbols-outlined text-3xl text-white mb-3">moving</span>
                    <h3 class="font-semibold text-lg">Strategy & Advisory</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 px-6 md:px-12 bg-white">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <div class="border-l-4 border-[#E63946] pl-4 mb-4">
                    <span class="font-semibold tracking-wider text-[#E63946] uppercase text-sm">Who We Are</span>
                </div>
                <h2 class="text-3xl md:text-4xl font-bold text-[#141B77] mb-6">Empowering Ecosystems and Ventures</h2>
                <p class="text-[#4A5568] text-lg leading-relaxed mb-6">
                    Metaspace Consulting Limited is a premier venture design studio and digital transformation company committed to building scalable solutions, enterprises and ecosystems that create lasting impact across Africa.
                </p>
                <p class="text-[#4A5568] mb-8 leading-relaxed">
                    By merging localized insights with international standards, we co-create frameworks in key sectors including EdTech, HealthTech, logistics, and startup acceleration.
                </p>
                <div class="grid grid-cols-2 gap-6">
                    <div class="p-4 bg-[#f5faff] rounded-lg">
                        <div class="font-bold text-3xl text-[#141B77] mb-1">4+</div>
                        <div class="text-[#4A5568] text-sm">Flagship Ventures</div>
                    </div>
                    <div class="p-4 bg-[#f5faff] rounded-lg">
                        <div class="font-bold text-3xl text-[#141B77] mb-1">30+</div>
                        <div class="text-[#4A5568] text-sm">Ecosystem Partners</div>
                    </div>
                </div>
            </div>
            <div class="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAL7OJMxnWrhYk22_U9QC6M9BGmtALO1Lih9ivNYp0RRnlDMyIOzvT85xewlZA6LIKb4bWvAkEly_tBmi2txGyGnEPTN7_1nK-23G1xIc8AQzfD0lo5nMAtlI5mpldLX-WPxBn4qgjTu4y15WUQjcrqP2s2dJatHZLNY8cRjPXu5sk00axUVJqO6ZVtPcp2qa9ONHGeoMd4Opj4HGVTI1iDwrBaYClxJmrr5aT70oGDINkn_5lKAWv6tJsG2b2wYznNYMrSJYcGHiI')"></div>
            </div>
        </div>
    </section>

    <!-- Ventures Portfolio (Dynamic from MySQL) -->
    <section id="ventures" class="py-24 px-6 md:px-12 bg-[#f5faff]">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-[#141B77] mb-4">Our Ventures Portfolio</h2>
                <p class="text-lg text-[#4A5568] max-w-2xl mx-auto">Discover the purpose-built ventures built, scaled, and managed by Metaspace.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <?php if (empty($ventures)): ?>
                    <!-- Fallback default cards if database is not seeded yet -->
                    <div class="bg-white p-8 rounded-xl card-shadow border border-slate-100 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
                        <div>
                            <span class="material-symbols-outlined text-[#141B77] text-4xl mb-4">school</span>
                            <h3 class="font-bold text-xl text-[#141B77] mb-2">Ugbekun</h3>
                            <p class="text-[#4A5568] text-sm mb-4">A smart school management platform that streamlines operations and enhances learning outcomes.</p>
                        </div>
                        <span class="text-xs font-bold text-[#E63946] mt-4">EdTech</span>
                    </div>
                    <div class="bg-white p-8 rounded-xl card-shadow border border-slate-100 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
                        <div>
                            <span class="material-symbols-outlined text-[#E63946] text-4xl mb-4">rocket_launch</span>
                            <h3 class="font-bold text-xl text-[#141B77] mb-2">Oghowa Accelerator</h3>
                            <p class="text-[#4A5568] text-sm mb-4">Empowering startups through intensive incubation, expert mentorship, and critical funding access.</p>
                        </div>
                        <span class="text-xs font-bold text-[#E63946] mt-4">Incubator</span>
                    </div>
                    <div class="bg-white p-8 rounded-xl card-shadow border border-slate-100 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
                        <div>
                            <span class="material-symbols-outlined text-[#141B77] text-4xl mb-4">directions_bus</span>
                            <h3 class="font-bold text-xl text-[#141B77] mb-2">EduRide</h3>
                            <p class="text-[#4A5568] text-sm mb-4">Improving student transportation and school logistics with innovative tracking technology.</p>
                        </div>
                        <span class="text-xs font-bold text-[#E63946] mt-4">Logistics</span>
                    </div>
                    <div class="bg-white p-8 rounded-xl card-shadow border border-slate-100 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
                        <div>
                            <span class="material-symbols-outlined text-[#E63946] text-4xl mb-4">favorite</span>
                            <h3 class="font-bold text-xl text-[#141B77] mb-2">Cyona Medicare</h3>
                            <p class="text-[#4A5568] text-sm mb-4">Enhancing elderly care services and making quality healthcare accessible to demographics.</p>
                        </div>
                        <span class="text-xs font-bold text-[#E63946] mt-4">HealthTech</span>
                    </div>
                <?php else: ?>
                    <?php foreach ($ventures as $v): ?>
                        <div class="bg-white p-8 rounded-xl card-shadow border border-slate-100 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
                            <div>
                                <div class="w-12 h-12 bg-[#F0F8FF] rounded-lg flex items-center justify-center text-[#141B77] mb-4">
                                    <span class="material-symbols-outlined text-2xl"><?php echo htmlspecialchars($v['icon']); ?></span>
                                </div>
                                <h3 class="font-bold text-xl text-[#141B77] mb-2"><?php echo htmlspecialchars($v['name']); ?></h3>
                                <p class="text-[#4A5568] text-sm mb-4"><?php echo htmlspecialchars($v['description']); ?></p>
                            </div>
                            <div class="flex justify-between items-center mt-4 border-t border-slate-50 pt-3">
                                <span class="text-xs font-bold bg-[#F0F8FF] text-[#141B77] px-2.5 py-1 rounded"><?php echo htmlspecialchars($v['category']); ?></span>
                                <span class="text-xs text-slate-400">ID: <?php echo $v['id']; ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Interactive Contact Form -->
    <section id="contact" class="py-24 px-6 md:px-12 bg-white">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-[#141B77] mb-4">Partner With Us</h2>
                <p class="text-[#4A5568]">Fill out the form below, and we'll record your proposal directly in our system.</p>
            </div>

            <div class="bg-white border border-[#F0F8FF] rounded-2xl p-8 card-shadow">
                <form action="contact.php" method="POST" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-[#141B77] mb-2">Full Name</label>
                            <input type="text" name="name" required class="w-full rounded-lg border-slate-200 focus:border-[#141B77] focus:ring-[#141B77] text-sm py-3 px-4 border" placeholder="John Doe">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-[#141B77] mb-2">Email Address</label>
                            <input type="email" name="email" required class="w-full rounded-lg border-slate-200 focus:border-[#141B77] focus:ring-[#141B77] text-sm py-3 px-4 border" placeholder="john@example.com">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-[#141B77] mb-2">Subject</label>
                        <input type="text" name="subject" required class="w-full rounded-lg border-slate-200 focus:border-[#141B77] focus:ring-[#141B77] text-sm py-3 px-4 border" placeholder="Partnership / Consulting / Other">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-[#141B77] mb-2">Your Message</label>
                        <textarea name="message" rows="5" required class="w-full rounded-lg border-slate-200 focus:border-[#141B77] focus:ring-[#141B77] text-sm py-3 px-4 border" placeholder="Tell us about your venture or organizational needs..."></textarea>
                    </div>
                    <button type="submit" class="w-full bg-[#E63946] text-white py-4 rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm uppercase tracking-wider">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#141B77] text-white py-16 px-6">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
            <div>
                <h3 class="font-bold text-xl mb-4">METASPACE</h3>
                <p class="text-white/70 text-sm leading-relaxed max-w-sm">
                    Designing, building, and scaling systems and ecosystems that create lasting digital impact across Africa.
                </p>
            </div>
            <div>
                <h4 class="font-bold text-sm mb-4 uppercase tracking-wider text-[#E63946]">Quick Navigation</h4>
                <ul class="space-y-2 text-sm text-white/70">
                    <li><a href="#home" class="hover:text-white">Home</a></li>
                    <li><a href="#about" class="hover:text-white">About Us</a></li>
                    <li><a href="#services" class="hover:text-white">What We Do</a></li>
                    <li><a href="#ventures" class="hover:text-white">Our Ventures</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-sm mb-4 uppercase tracking-wider text-[#E63946]">Contact Info</h4>
                <p class="text-sm text-white/70 mb-2">Email: info@metaspaceconsulting.com</p>
                <p class="text-sm text-white/70 mb-2">Location: Benin City, Edo State, Nigeria</p>
            </div>
        </div>
        <div class="max-w-7xl mx-auto pt-8 text-center text-xs text-white/40">
            © 2026 Metaspace Consulting Limited. All rights reserved. Deployed with cPanel Exporter.
        </div>
    </footer>

</body>
</html>
