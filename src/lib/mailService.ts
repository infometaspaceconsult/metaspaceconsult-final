import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
  fromName?: string;
  fromEmail?: string;
  notificationEmail?: string;
  service?: string;
}

export interface MailSendOptions {
  to?: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  priority?: "high" | "normal" | "low";
  headers?: Record<string, string>;
  overrideConfig?: Partial<SmtpConfig>;
}

export interface MailSendResult {
  success: boolean;
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
  response?: string;
  attempts: number;
  message?: string;
  error?: string;
  details?: any;
}

// In-memory cache for active pooled transporters to reuse open socket pools
interface CachedTransporter {
  signature: string;
  transporter: Transporter;
  createdAt: number;
}

let cachedTransporter: CachedTransporter | null = null;

/**
 * Generate unique signature for SMTP configuration to detect credential/server changes
 */
function getSmtpSignature(config: SmtpConfig): string {
  return `${config.host}:${config.port}:${config.user}:${config.secure ? "ssl" : "tls"}`;
}

/**
 * Helper to strip HTML tags and produce clean, legible Plaintext content
 * Essential for spam filter reputation (anti-spam spamassassin scores) and accessibility
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, " | ")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n=== $1 ===\n")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Creates or retrieves a pooled, robust standard Nodemailer transport instance
 */
export function getOrCreateTransporter(config: SmtpConfig, forceFresh = false): Transporter {
  const signature = getSmtpSignature(config);

  // Return cached connection pool if configuration has not changed
  if (!forceFresh && cachedTransporter && cachedTransporter.signature === signature) {
    // Refresh pool if older than 1 hour to prevent stale socket decay
    if (Date.now() - cachedTransporter.createdAt < 3600000) {
      return cachedTransporter.transporter;
    }
    try {
      cachedTransporter.transporter.close();
    } catch {
      // Ignored
    }
  }

  // Determine implicit SSL (port 465) vs STARTTLS (port 587 or 25)
  const isSecure = config.secure !== undefined 
    ? Boolean(config.secure) 
    : (Number(config.port) === 465);

  const cleanHost = (config.host || "").trim();
  const cleanUser = (config.user || "").trim();
  const cleanPass = (config.pass || "").trim();

  // Create standard Node-based mail transport with connection pooling and hardened socket timeouts
  const transportOptions: any = {
    host: cleanHost,
    port: Number(config.port) || 465,
    secure: isSecure,
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
    // Robust connection & network timeouts to prevent worker hanging
    connectionTimeout: 12000, // 12 seconds connection timeout
    greetingTimeout: 10000,   // 10 seconds greeting timeout
    socketTimeout: 15000,     // 15 seconds socket timeout
    // Connection pooling for high performance and socket reuse
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    tls: {
      rejectUnauthorized: false, // Broad compatibility with enterprise cPanel/Plesk and self-hosted SMTP
      minVersion: "TLSv1.2",
    },
  };

  // If user configured a well-known service (e.g. gmail, sendgrid), attach it
  if (config.service && config.service.trim() !== "") {
    transportOptions.service = config.service.trim();
  }

  const transporter = nodemailer.createTransport(transportOptions);

  cachedTransporter = {
    signature,
    transporter,
    createdAt: Date.now(),
  };

  return transporter;
}

/**
 * Creates a direct, non-pooled fallback transporter
 * Useful if the destination SMTP server forbids pooled persistent connections
 */
function createDirectFallbackTransporter(config: SmtpConfig): Transporter {
  const isSecure = config.secure !== undefined 
    ? Boolean(config.secure) 
    : (Number(config.port) === 465);

  return nodemailer.createTransport({
    host: (config.host || "").trim(),
    port: Number(config.port) || 465,
    secure: isSecure,
    auth: {
      user: (config.user || "").trim(),
      pass: (config.pass || "").trim(),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 12000,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });
}

/**
 * Verify SMTP server handshake and credentials without sending an email
 */
export async function verifySmtpConnection(config: SmtpConfig): Promise<{
  success: boolean;
  message: string;
  code?: string;
  details?: any;
}> {
  try {
    if (!config.host || !config.user || !config.pass) {
      return {
        success: false,
        message: "Missing required SMTP parameters: host, username, and password are required.",
      };
    }

    const transporter = getOrCreateTransporter(config, true);
    await transporter.verify();

    return {
      success: true,
      message: `SMTP connection established & authenticated successfully on ${config.host}:${config.port} (${config.secure ? "SSL/TLS" : "STARTTLS"})!`,
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    return {
      success: false,
      message: `SMTP verification failed: ${errMsg}`,
      code: err?.code,
      details: err,
    };
  }
}

/**
 * Core Mail Sender with Intelligent Exponential-Backoff Retries
 * Ensures reliable delivery of inquiry notifications even through transient network blips
 */
export async function sendMailWithRobustTransport(
  config: SmtpConfig,
  options: MailSendOptions,
  maxRetries = 2
): Promise<MailSendResult> {
  if (!config.host || !config.user || !config.pass) {
    const errorMsg = "SMTP transport is not configured. Please supply SMTP Host, User/Email, and Password.";
    console.warn(`[MailService] ${errorMsg}`);
    return {
      success: false,
      attempts: 0,
      error: errorMsg,
    };
  }

  const fromName = options.fromName || config.fromName || "Metaspace Consulting";
  const fromEmail = options.fromEmail || config.fromEmail || config.user;
  const targetRecipient = options.to || config.notificationEmail || config.user || "info@metaspaceconsulting.com";
  
  // Format standard RFC 2822 sender string
  const formattedFrom = `"${fromName.replace(/"/g, "")}" <${fromEmail.trim()}>`;

  // Auto-generate plain-text representation if missing for anti-spam compliance
  const textContent = options.text || htmlToPlainText(options.html);

  // Generate unique standard Message-ID
  const domain = fromEmail.includes("@") ? fromEmail.split("@")[1] : "metaspaceconsulting.com";
  const customMessageId = `<ms-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@${domain}>`;

  const mailPayload: any = {
    from: formattedFrom,
    to: targetRecipient,
    subject: options.subject,
    text: textContent,
    html: options.html,
    messageId: customMessageId,
    date: new Date(),
    headers: {
      "X-Mailer": "Metaspace-Node-Mail-Transport/2.0",
      "X-Entity-Ref-ID": customMessageId,
      ...(options.priority === "high" ? { "X-Priority": "1 (Highest)", Importance: "High" } : {}),
      ...(options.headers || {}),
    },
  };

  // Important for inquiries: set Reply-To to the client's email so replying goes directly to them
  if (options.replyTo && options.replyTo.trim() !== "") {
    mailPayload.replyTo = options.replyTo.trim();
  }

  if (options.cc) mailPayload.cc = options.cc;
  if (options.bcc) mailPayload.bcc = options.bcc;

  let lastError: any = null;
  let attempts = 0;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    attempts = attempt;
    try {
      // First attempt uses the pooled transporter; subsequent retries fall back to direct if needed
      const transporter = attempt === 1 
        ? getOrCreateTransporter(config) 
        : createDirectFallbackTransporter(config);

      const info = await transporter.sendMail(mailPayload);

      console.log(`[MailService] Email delivered successfully (Attempt ${attempt}/${maxRetries + 1}). Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        accepted: (info.accepted as string[]) || [String(targetRecipient)],
        rejected: (info.rejected as string[]) || [],
        response: info.response,
        attempts: attempt,
        message: `Dispatched via SMTP to ${targetRecipient} (Message ID: ${info.messageId})`,
      };
    } catch (err: any) {
      lastError = err;
      const isAuthError = err?.responseCode === 535 || (err?.message && err.message.toLowerCase().includes("authentication"));
      const isPermanentReject = err?.responseCode === 550 || err?.responseCode === 553;

      console.warn(`[MailService] Attempt ${attempt} failed: ${err.message || String(err)}`);

      // Permanent authentication or mailbox errors should not be retried
      if (isAuthError || isPermanentReject || attempt > maxRetries) {
        break;
      }

      // Exponential backoff delay (1000ms, 2500ms) before retry
      const delayMs = attempt === 1 ? 1000 : 2500;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const finalErrorMessage = lastError?.message || String(lastError) || "Unknown SMTP delivery failure";
  console.error(`[MailService] All ${attempts} delivery attempts failed:`, finalErrorMessage);

  return {
    success: false,
    attempts,
    error: finalErrorMessage,
    details: lastError,
  };
}

/**
 * Branded HTML and Plaintext Email Templates for Metaspace Consulting
 */
export function renderMetaspaceInquiryEmail({
  title,
  badgeText = "NEW INCOMING TRANSMISSION",
  preheader,
  fields,
  message,
  clientEmail,
  clientName,
}: {
  title: string;
  badgeText?: string;
  preheader?: string;
  fields: { label: string; value: string }[];
  message?: string;
  clientEmail?: string;
  clientName?: string;
}): { html: string; text: string } {
  const fieldsHtml = fields
    .map(
      (f) => `
    <tr>
      <td style="padding: 11px 16px; font-weight: 700; color: #0A192F; font-size: 13px; border-bottom: 1px solid #edf2f7; width: 34%; background-color: #fcfdfe;">${f.label}</td>
      <td style="padding: 11px 16px; color: #2d3748; font-size: 13px; border-bottom: 1px solid #edf2f7; font-weight: 500;">${f.value}</td>
    </tr>
  `
    )
    .join("");

  const replyMailto = clientEmail
    ? `mailto:${clientEmail}?subject=${encodeURIComponent("Re: " + title + " - Metaspace Consulting")}`
    : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all;">${preheader}</div>` : ""}
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- TOP ACCENT BAR & BRAND HEADER -->
          <tr>
            <td style="background-color: #0A192F; padding: 28px 36px; text-align: left; border-bottom: 4px solid #D00024;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 2px; display: block; line-height: 1.1;">METASPACE</span>
                    <span style="font-size: 9px; font-weight: 800; color: #E61E3E; letter-spacing: 2.5px; text-transform: uppercase;">CONSULTING LIMITED</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(230, 30, 62, 0.18); border: 1px solid rgba(230, 30, 62, 0.35); border-radius: 9999px; font-size: 10px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                      ${badgeText}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="margin: 0 0 8px 0; color: #0A192F; font-size: 21px; font-weight: 800; letter-spacing: -0.3px; line-height: 1.3;">${title}</h1>
              <p style="margin: 0 0 24px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                A new client submission has been captured through the Metaspace digital web portal and verified via standard mail transport.
              </p>
              
              <!-- KEY ATTRIBUTES TABLE -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; border-collapse: separate; border-spacing: 0; overflow: hidden; margin-bottom: 24px;">
                ${fieldsHtml}
              </table>

              <!-- MESSAGE / SCOPE BOX -->
              ${
                message
                  ? `
                <div style="margin-top: 24px; margin-bottom: 28px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0A192F; letter-spacing: 1px;">Inquiry & Project Scope</span>
                  </div>
                  <div style="background-color: #f8fafc; border-left: 4px solid #D00024; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 18px 20px; border-radius: 0 8px 8px 0; color: #1e293b; font-size: 13.5px; line-height: 1.65; white-space: pre-line;">
                    ${message}
                  </div>
                </div>
              `
                  : ""
              }

              <!-- ACTION BUTTON -->
              ${
                replyMailto
                  ? `
                <div style="padding-top: 8px; text-align: left;">
                  <a href="${replyMailto}" style="display: inline-block; background-color: #D00024; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 10px rgba(208, 0, 36, 0.25);">
                    Reply to ${clientName || "Client"}
                  </a>
                  <span style="display: inline-block; margin-left: 12px; font-size: 11px; color: #64748b;">
                    or hit "Reply" in your email client
                  </span>
                </div>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #0A192F; padding: 24px 36px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #1e293b;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #f8fafc; font-size: 12px; letter-spacing: 0.5px;">Metaspace Consulting Limited</p>
              <p style="margin: 0 0 10px 0; color: #94a3b8; line-height: 1.4;">
                Building Systems. Empowering People. Transforming Africa.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 10px;">
                Transmitted securely via Node.js Standard SMTP Transport Service • Africa/Lagos Gateway
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = htmlToPlainText(html);

  return { html, text };
}

/**
 * Branded Client Courtesy Confirmation Email
 * Sent to prospective client confirming receipt of their inquiry
 */
export function renderClientConfirmationEmail({
  clientName,
  serviceOrSubject,
  isConsultation = true,
}: {
  clientName: string;
  serviceOrSubject: string;
  isConsultation?: boolean;
}): { html: string; text: string } {
  const title = isConsultation 
    ? "Consultation Request Received - Metaspace Consulting" 
    : "Inquiry Received - Metaspace Consulting";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05);">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color: #0A192F; padding: 26px 32px; text-align: left; border-bottom: 4px solid #D00024;">
              <span style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: 1.5px; display: block;">METASPACE</span>
              <span style="font-size: 9px; font-weight: 700; color: #E61E3E; letter-spacing: 2px; text-transform: uppercase;">CONSULTING LIMITED</span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; color: #0A192F; font-size: 20px; font-weight: 800;">
                Hello ${clientName},
              </h2>
              <p style="margin: 0 0 16px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                Thank you for reaching out to <strong>Metaspace Consulting Limited</strong>. We have received your inquiry regarding <strong>${serviceOrSubject}</strong>.
              </p>
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                Our advisory team is currently reviewing the scope and requirements of your submission. A senior consultant or partner will contact you directly within <strong>24 business hours</strong> to schedule our introductory alignment session.
              </p>

              <div style="background-color: #f1f5f9; border-left: 4px solid #0A192F; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #0A192F; text-transform: uppercase; letter-spacing: 0.5px;">Need immediate consultation?</p>
                <p style="margin: 0; font-size: 13px; color: #475569;">
                  You can connect directly with our operational helpdesk via WhatsApp: <a href="https://wa.me/2348123456789" style="color: #D00024; font-weight: 700; text-decoration: none;">Chat on WhatsApp &rarr;</a>
                </p>
              </div>

              <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                Warm regards,<br>
                <strong style="color: #0A192F;">The Metaspace Consulting Advisory Team</strong><br>
                Benin City, Edo State, Nigeria • Operating Across Africa
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #0A192F; padding: 18px 32px; text-align: center; color: #94a3b8; font-size: 11px;">
              Metaspace Consulting Limited • Building Systems. Empowering People. Transforming Africa.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { html, text: htmlToPlainText(html) };
}
