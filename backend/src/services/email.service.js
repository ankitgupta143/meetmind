/**
 * Transactional Email Service for MeetMind
 * Supports Resend API (via native fetch) with local development console fallback.
 */

function printDevFallback(email, resetToken, resetLink, reason = null) {
  console.log("\n=======================================================");
  console.log("       📧 [DEV EMAIL SIMULATOR] PASSWORD RESET          ");
  console.log("=======================================================");
  if (reason) {
    console.log(`ℹ️  Notice:    ${reason}`);
  }
  console.log(`Recipient:   ${email}`);
  console.log(`Reset Token: ${resetToken}`);
  console.log(`Reset Link:  ${resetLink}`);
  console.log("=======================================================\n");
}

export async function sendPasswordResetEmail({ email, name, resetToken }) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
  const userDisplayName = name ? name.trim() : "there";

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your MeetMind Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 24px; }
        .container { max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .logo { font-size: 20px; font-weight: 800; color: #818cf8; margin-bottom: 24px; display: inline-block; text-decoration: none; }
        h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; }
        p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); }
        .notice { font-size: 12px; color: #64748b; margin-top: 28px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
        .link-text { word-break: break-all; color: #818cf8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">✨ MeetMind</div>
        <h1>Password Reset Request</h1>
        <p>Hi ${userDisplayName},</p>
        <p>We received a request to reset the password for your MeetMind account (<strong>${email}</strong>). Click the button below to choose a new password:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" class="button" target="_blank">Reset Password</a>
        </p>
        <p>This password reset link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your account remains completely secure.</p>
        <div class="notice">
          If the button above does not work, copy and paste this URL into your browser:<br>
          <span class="link-text">${resetLink}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. If Resend API key is configured, send via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "MeetMind <onboarding@resend.dev>",
          to: [email],
          subject: "Reset your MeetMind password",
          html: emailHtml,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.warn(`[EmailService] Resend Notice: ${responseData?.message || "Delivery rejected"}`);
        // If Resend blocked because recipient is not the Resend account owner in free tier sandbox,
        // provide the dev simulator fallback link in terminal so developer is never blocked
        printDevFallback(email, resetToken, resetLink, responseData?.message);
        return false;
      }

      console.log(`[EmailService] Password reset email sent to ${email} via Resend (ID: ${responseData?.id}).`);
      return true;
    } catch (err) {
      console.error("[EmailService] Failed to send via Resend:", err.message);
      printDevFallback(email, resetToken, resetLink, err.message);
      return false;
    }
  }

  // 2. Development Mode Fallback: Log directly to terminal
  printDevFallback(email, resetToken, resetLink, "RESEND_API_KEY is not configured.");
  return true;
}
