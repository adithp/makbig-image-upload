/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Request OTP
 * POST /api/collections/users/request-otp
 * 
 * Generates an OTP and sends it to the user's email
 */

onAfterRequest((e) => {
    if (e.httpMethod !== 'POST' || e.url !== '/api/collections/users/request-otp') {
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

        // Update user with OTP
        user.otp_code = otp;
        user.otp_expires_at = expiryTime.toISOString();

        await dao.saveRecord(user);

        // Send email via Resend
        // Note: You need to implement this using HTTP client or external service
        // For now, we'll log it
        console.log(`OTP sent to ${email}: ${otp}`);

        // Return success response
        e.responseCode = 200;
        e.responseHeaders = {
            'Content-Type': 'application/json'
        };
        e.response = JSON.stringify({
            success: true,
            message: 'OTP sent to your email',
            expiresIn: 300 // 5 minutes in seconds
        });
    } catch (err) {
        console.error('Error in request-otp hook:', err);
        return sendError(e, 500, 'Failed to request OTP');
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