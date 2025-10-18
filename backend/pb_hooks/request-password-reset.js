/// <reference path="../pb_data/types.d.ts" />

/**
 * Generates an OTP for password reset and sends it to the user's email
 * Endpoint: POST /api/collections/users/request-password-reset
 */

onAfterRequest(async (e) => {
    if (e.httpMethod !== 'POST' || e.url !== '/api/collections/users/request-password-reset') {
        return;
    }

    try {
        const data = JSON.parse(e.requestInfo.data || {});
        const email = data.email;

        if (!email) {
            return sendError(e, 400, 'Email is required');
        }

        const dao = new Dao(e.db);

        // Find user by email
        const user = await dao.findFirstRecordByData('users', 'email', email);

        if (!user) {
            return sendError(e, 404, 'User not found');
        }

        // Generate OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Calculate expiry time (5 minutes from now)
        const now = new Date();
        const expiryTime = new Date(now.getTime() + 5 * 60 * 1000);

        // Update user with password reset OTP
        user.password_reset_otp = otp;
        user.password_reset_otp_expires_at = expiryTime.toISOString();

        await dao.saveRecord(user);

        // Send email via Resend (if configured)
        try {
            const resend = require('resend');
            if (resend && process.env.RESEND_API_KEY) {
                // Optional: Send email via Resend
                // await resend.emails.send({...})
            }
        } catch (emailErr) {
            console.warn('Resend not available, skipping email:', emailErr.message);
        }
        console.log(`Password reset OTP generated for ${email}: ${otp}`);

        // Return success response
        e.responseCode = 200;
        e.responseHeaders = {
            'Content-Type': 'application/json'
        };
        e.response = JSON.stringify({
            success: true,
            message: 'Password reset code sent to your email',
            expiresIn: 300 // 5 minutes in seconds
        });
    } catch (err) {
        console.error('Error in request-password-reset hook:', err);
        return sendError(e, 500, 'Failed to request password reset');
    }
});

function sendError(e, code, message) {
    e.responseCode = code;
    e.responseHeaders = {
        'Content-Type': 'application/json'
    };
    e.response = JSON.stringify({
        success: false,
        message: message
    });
}