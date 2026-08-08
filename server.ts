import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Local file storage fallback for site config & leads
const CONFIG_FILE = path.join(process.cwd(), 'site-config.json');
const LEADS_FILE = path.join(process.cwd(), 'leads-data.json');

// Initialize Gemini client lazy/safe
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Initialize Resend lazy
const getResendClient = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

// Initialize Supabase lazy
const getSupabaseClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

// Helper: load leads
const getStoredLeads = (): any[] => {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads file:', err);
  }
  return [];
};

// Helper: save leads
const saveStoredLeads = (leads: any[]) => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing leads file:', err);
  }
};

// --- API ENDPOINTS ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
    },
  });
});

// 2. Site Config GET & POST
app.get('/api/site-config', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      return res.json(JSON.parse(configData));
    }
  } catch (err) {
    console.error('Error reading site config file:', err);
  }
  res.json({ config: null });
});

app.post('/api/site-config', (req, res) => {
  try {
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ error: 'Config object required' });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    res.json({ success: true, message: 'Site configuration updated' });
  } catch (err) {
    console.error('Error saving site config:', err);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// 3. Superadmin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.SUPERADMIN_USERNAME || 'admin';
  const expectedPass = process.env.SUPERADMIN_PASSWORD || 'metaspace2026!';

  if (username === expectedUser && password === expectedPass) {
    return res.json({
      success: true,
      token: 'meta_admin_token_' + Date.now(),
      user: { username: expectedUser, role: 'superadmin' },
    });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

// 4. Companion Chatbot AI Endpoint (Gemini 3.6 Flash)
app.post('/api/companion', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are "Companion", the official AI assistant and instant support concierge for Metaspace Consulting Limited.
Metaspace Consulting Limited is a venture design studio and digital transformation company building systems, empowering people, and transforming Africa (https://www.metaspaceconsult.com).

Core Knowledge:
- Tagline: "Building Systems. Empowering People. Transforming Africa."
- Core Services:
  1. Venture Design Studio (ideation, rapid prototyping, venture scaling)
  2. Digital Transformation (enterprise modernization, AI integration)
  3. Innovation Ecosystem Builder (incubation, founder mentorship, capital access)
  4. Strategy & Advisory (market policy, venture strategy across Africa)
  5. Metagen Platform (Metaspace's flagship AI venture synthesis, automated lead generation & market intelligence engine)
- Our Ventures:
  - Ugbekun: Smart school management platform streamlining operations & learning outcomes.
  - Oghowa Accelerator: Startup incubation, mentorship, seed funding access & market connections.
  - EduRide: Improving student transportation & school logistics safely.
  - Cyona Medicare: Enhancing elderly care services & healthcare accessibility.
  - Metagen Engine: AI-powered ecosystem synthesizer for business growth.
- Contact Details:
  - Email: info@metaspaceconsulting.com
  - Location: Benin City, Edo State, Nigeria
  - Phone: +234 812 345 6789
  - WhatsApp Support Agent available for difficult, complex or in-person inquiries.

Your Goal:
- Be extremely polite, professional, concise, and helpful.
- Help website visitors learn about Metaspace, book consultations, and ask about ventures.
- Perform Automated Lead Generation: If the user expresses interest in partnering, investing, booking a consultation, or learning more, ask for their Name, Email, and Phone number.
- If the query is complex, custom, or requires human assistance, advise them to connect directly with our WhatsApp Support Agent.
- Keep your answers nicely formatted and under 150 words.`;

    let formattedHistory = '';
    if (Array.isArray(history)) {
      formattedHistory = history
        .map((h: any) => `${h.sender === 'user' ? 'User' : 'Companion'}: ${h.text}`)
        .slice(-6)
        .join('\n');
    }

    const promptText = `${systemPrompt}\n\nRecent Conversation History:\n${formattedHistory}\n\nUser Question: ${message}\nCompanion Response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
    });

    const replyText = response.text || "I'm here to help you explore Metaspace Consulting. How can I assist you today?";

    // Detect if user provided contact info in message to capture lead automatically
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{10,14})/;
    const emailMatch = message.match(emailRegex);
    const phoneMatch = message.match(phoneRegex);

    let leadCaptured = false;
    if (emailMatch || phoneMatch) {
      const newLead = {
        id: 'lead_' + Date.now(),
        name: 'Chatbot Visitor',
        email: emailMatch ? emailMatch[0] : 'Not provided',
        phone: phoneMatch ? phoneMatch[0] : 'Not provided',
        interest: 'Chatbot Inquiry',
        message: message,
        source: 'companion_chatbot',
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      const leads = getStoredLeads();
      leads.unshift(newLead);
      saveStoredLeads(leads);
      leadCaptured = true;

      // Save to Supabase if configured
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('leads').insert([newLead]);
        } catch (sErr) {
          console.error('Supabase lead insert error:', sErr);
        }
      }

      // Send email via Resend if configured
      const resend = getResendClient();
      if (resend) {
        try {
          await resend.emails.send({
            from: 'Metaspace AI Companion <leads@metaspaceconsulting.com>',
            to: ['info@metaspaceconsulting.com'],
            subject: '⚡ New Lead Captured by Companion Chatbot',
            html: `<p><strong>New Lead via Companion AI:</strong></p>
                   <p><strong>Email:</strong> ${newLead.email}</p>
                   <p><strong>Phone:</strong> ${newLead.phone}</p>
                   <p><strong>Message:</strong> ${newLead.message}</p>`,
          });
        } catch (rErr) {
          console.error('Resend email error:', rErr);
        }
      }
    }

    res.json({
      reply: replyText,
      leadCaptured,
    });
  } catch (error: any) {
    console.error('Companion Chatbot API Error:', error);
    res.status(500).json({
      reply: 'I am currently experiencing a momentary sync issue. Please try again or reach out to our WhatsApp agent directly!',
      error: error.message,
    });
  }
});

// 5. Contact Form / Lead Capture Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newLead = {
      id: 'lead_' + Date.now(),
      name,
      email,
      phone: phone || '',
      company: company || '',
      interest: interest || 'General Inquiry',
      message: message || '',
      source: 'contact_form',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save locally
    const leads = getStoredLeads();
    leads.unshift(newLead);
    saveStoredLeads(leads);

    // Save to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('leads').insert([newLead]);
      } catch (sErr) {
        console.error('Supabase error:', sErr);
      }
    }

    // Send email via Resend API
    let emailSent = false;
    const resend = getResendClient();
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Metaspace Website <onboarding@resend.dev>',
          to: ['info@metaspaceconsulting.com'],
          subject: `📩 New Consultation Request from ${name} (${interest || 'Metaspace'})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #141B77;">
              <h2>New Metaspace Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Company:</strong> ${company || 'N/A'}</p>
              <p><strong>Interest Area:</strong> ${interest || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <blockquote style="background: #f0f8ff; padding: 12px; border-left: 4px solid #E63946;">${message || 'No message provided.'}</blockquote>
            </div>
          `,
        });
        emailSent = true;
      } catch (rErr) {
        console.error('Resend dispatch error:', rErr);
      }
    }

    res.json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will contact you shortly.',
      lead: newLead,
      emailSent,
    });
  } catch (err: any) {
    console.error('Contact endpoint error:', err);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

// 6. Superadmin Get Leads
app.get('/api/leads', (req, res) => {
  const leads = getStoredLeads();
  res.json({ leads });
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
