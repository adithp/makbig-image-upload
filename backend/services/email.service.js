const { Resend } = require('resend');

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP email using Resend
 */
async function sendOTPEmail(email, otp, userName = 'User') {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }

        const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Makbig Academy - Email Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Makbig Academy!</h2>
            <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
            
            <p style="color: #666; font-size: 14px;">
              Thank you for signing up. To complete your email verification, please use the following code:
            </p>
            
            <div style="
              background-color: #4f46e5;
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
            ">
              <p style="margin: 0; font-size: 12px; opacity: 0.9;">Verification Code</p>
              <p style="
                margin: 10px 0 0 0;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 4px;
              ">${otp}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This code will expire in <strong>5 minutes</strong>.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you didn't sign up for Makbig Academy, please ignore this email.
            </p>
            
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 Makbig Academy. All rights reserved.
            </p>
          </div>
        </div>
      `,
            text: `Your Makbig Academy email verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you didn't sign up for Makbig Academy, please ignore this email.`
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
 * Send welcome email after verification
 */
async function sendWelcomeEmail(email, userName = 'User') {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }

        const response = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to Makbig Academy!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to Makbig Academy!</h2>
            <p style="color: #666; font-size: 16px;">Hi ${userName},</p>
            
            <p style="color: #666; font-size: 14px;">
              Your email has been successfully verified! You can now log in to your account and start your learning journey.
            </p>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              <strong>Getting Started:</strong>
            </p>
            <ul style="color: #666; font-size: 14px;">
              <li>Complete your profile information</li>
              <li>Explore available courses and domains</li>
              <li>Start submitting your weekly assignments</li>
            </ul>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              If you have any questions, please contact our support team.
            </p>
            
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 Makbig Academy. All rights reserved.
            </p>
          </div>
        </div>
      `,
            text: `Welcome to Makbig Academy!\n\nYour email has been successfully verified. You can now log in to your account and start your learning journey.`
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

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
};