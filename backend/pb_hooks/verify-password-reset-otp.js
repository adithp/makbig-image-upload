/// <reference path="../pb_data/types.d.ts" />

/**
 * Verifies the password reset OTP code
 * Endpoint: POST /api/collections/users/verify-password-reset-otp
 */

onAfterRequest((e) => {
    if (e.httpMethod !== 'POST' || e.url !== '/api/collections/users/verify-password-reset-otp') {
        return;
    }

    try {
        const data = JSON.parse(e.requestInfo.data || {});
        const email = data.email;
        const otp = data.otp;

        if (!email || !otp) {
            return sendError(e, 400, 'Email and OTP are required');
        }

        const dao = new Dao(e.db);

        // Find user by email
        const user = await dao.findFirstRecordByData('users', 'email', email);

        if (!user) {
            return sendError(e, 404, 'User not found');
        }

        // Check if OTP is valid
        if (!user.password_reset_otp || user.password_reset_otp !== otp) {
            return sendError(e, 400, 'Invalid OTP code');
        }

        // Check if OTP has expired
        const now = new Date();
        const expiryTime = new Date(user.password_reset_otp_expires_at);

        if (now > expiryTime) {
            return sendError(e, 400, 'OTP has expired. Please request a new one');
        }

        // OTP is valid, return success with temporary token for password reset
        e.responseCode = 200;
        e.responseHeaders = {
            'Content-Type': 'application/json'
        };
        e.response = JSON.stringify({
            success: true,
            message: 'OTP verified successfully',
            userId: user.id,
            resetToken: $generateResetToken(user.id) // This would be implemented based on your needs
        });
    } catch (err) {
        console.error('Error in verify-password-reset-otp hook:', err);
        return sendError(e, 500, 'Failed to verify OTP');
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