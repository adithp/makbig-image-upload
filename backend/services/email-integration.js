/**
 * Email Integration Module
 * 
 * This module provides functions to integrate with PocketBase and send emails
 * Can be used in:
 * 1. PocketBase hooks (JavaScript runtime)
 * 2. External Node.js service
 * 3. Serverless functions (AWS Lambda, Vercel, etc.)
 */

// Ensure resend is installed: npm install resend
let Resend;
try {
    const resendModule = require('resend');
    Resend = resendModule.Resend;
} catch (e) {
    console.warn('Resend module not available. Email sending will be mocked.');
}

/**
 * Initialize Resend client
 */
function initializeResend() {
    if (!Resend) {
        console.warn('Resend not initialized. Make sure resend package is installed.');
        return null;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set');
    }

    return new Resend(apiKey);
}

/**
 * Send OTP email for verification
 * @param {string} email - User's email address
 * @param {string} otp - The OTP code (6 digits)
 * @param {string} userName - User's name for personalization
 */
async function sendOTPEmail(email, otp, userName = 'User') {
    try {
        const resend = initializeResend();

        if (!resend) {
            console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);
            return {
                success: true,
                isMocked: true,
                message: 'Email would be sent (mocked mode)'
            };
        }

        const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Makbig Academy - Email Verification Code',
            html: getOTPEmailTemplate(otp, userName),
            text: `Your Makbig Academy email verification code is: ${otp}\n\nThis code will expire in 5 minutes.`
        });

        return {
            success: true,
            messageId: response.id,
            email: email
        };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}

/**
 * Send welcome email after email verification
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 */
async function sendWelcomeEmail(email, userName = 'User') {
    try {
        const resend = initializeResend();

        if (!resend) {
            console.log(`[MOCK EMAIL] Welcome email sent to ${email}`);
            return {
                success: true,
                isMocked: true,
                message: 'Welcome email would be sent (mocked mode)'
            };
        }

        const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to Makbig Academy!',
            html: getWelcomeEmailTemplate(userName),
            text: `Welcome to Makbig Academy!\n\nYour email has been successfully verified.`
        });

        return {
            success: true,
            messageId: response.id,
            email: email
        };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
}

/**
 * Get OTP email HTML template
 */
function getOTPEmailTemplate(otp, userName = 'User') {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; }
          .footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none; }
          .otp-box {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .otp-label { font-size: 12px; opacity: 0.9; margin-bottom: 10px; }
          .expiry-info { color: #666; font-size: 14px; margin: 20px 0; }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
          h2 { color: #333; margin-top: 0; }
          .footer-text { font-size: 12px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Makbig Academy!</h2>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Thank you for signing up. To complete your email verification, please use the following code:</p>
            
            <div class="otp-box">
              <div class="otp-label">Verification Code</div>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry-info">
              ⏱️ This code will expire in <strong>5 minutes</strong>.
            </div>
            
            <p>If you didn't sign up for Makbig Academy, please ignore this email or reply to let us know.</p>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              <strong>Makbig Academy</strong><br>
              © 2024 Makbig Academy. All rights reserved.<br>
              <br>
              This is an automated message. Please do not reply to this email.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Get welcome email HTML template
 */
function getWelcomeEmailTemplate(userName = 'User') {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #e0e0e0; }
          .footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none; }
          .success-box {
            background-color: #ecfdf5;
            border: 1px solid #6ee7b7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .success-box strong { color: #047857; }
          h2 { color: #333; margin-top: 0; }
          ul { color: #666; }
          .footer-text { font-size: 12px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Makbig Academy! 🎉</h2>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <div class="success-box">
              <strong>✓ Your email has been successfully verified!</strong>
            </div>
            
            <p>You can now log in to your account and start your learning journey.</p>
            
            <p><strong>Getting Started:</strong></p>
            <ul>
              <li>Complete your profile information</li>
              <li>Explore available courses and domains</li>
              <li>Start submitting your weekly assignments</li>
              <li>Connect with other students</li>
            </ul>
            
            <p>If you have any questions or need support, don't hesitate to reach out to our team.</p>
            
            <p>Happy learning!</p>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              <strong>Makbig Academy</strong><br>
              © 2024 Makbig Academy. All rights reserved.<br>
              <br>
              This is an automated message. Please do not reply to this email.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * For use in PocketBase hooks
 * Export functions that can be called from hooks
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendOTPEmail,
        sendWelcomeEmail,
        getOTPEmailTemplate,
        getWelcomeEmailTemplate,
        initializeResend
    };
}

// For browser/frontend use (if bundled)
if (typeof window !== 'undefined') {
    window.emailIntegration = {
        sendOTPEmail,
        sendWelcomeEmail
    };
}