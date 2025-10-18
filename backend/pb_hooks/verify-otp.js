/// <reference path="../pb_data/types.d.ts" />

/**
 * PocketBase Hook: Verify OTP
 * POST /api/collections/users/verify-otp
 * 
 * Verifies the OTP code and marks email as verified
 */

onAfterRequest((e) => {
    if (e.httpMethod !== 'POST' || e.url !== '/api/collections/users/verify-otp') {
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
        if (!user.otp_code || user.otp_code !== otp) {
            return sendError(e, 400, 'Invalid OTP code');
        }

        // Check if OTP has expired
        const now = new Date();
        const expiryTime = new Date(user.otp_expires_at);

        if (now > expiryTime) {
            return sendError(e, 400, 'OTP has expired. Please request a new one');
        }

        // Mark email as verified and clear OTP
        user.email_verified = true;
        user.otp_code = null;
        user.otp_expires_at = null;

        await dao.saveRecord(user);

        // Return success response
        e.responseCode = 200;
        e.responseHeaders = {
            'Content-Type': 'application/json'
        };
        e.response = JSON.stringify({
            success: true,
            message: 'Email verified successfully',
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error in verify-otp hook:', err);
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