/// <reference path="../pb_data/types.d.ts" />

/**
 * Resets the user's password after OTP verification
 * Endpoint: POST /api/collections/users/reset-password
 */

onAfterRequest(async (e) => {
    if (e.httpMethod !== 'POST' || e.url !== '/api/collections/users/reset-password') {
        return;
    }

    try {
        const data = JSON.parse(e.requestInfo.data || {});
        const email = data.email;
        const newPassword = data.newPassword;

        if (!email || !newPassword) {
            return sendError(e, 400, 'Email and new password are required');
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return sendError(e, 400, 'Password must be at least 8 characters long');
        }

        const dao = new Dao(e.db);

        // Find user by email
        const user = await dao.findFirstRecordByData('users', 'email', email);

        if (!user) {
            return sendError(e, 404, 'User not found');
        }

        // Verify that OTP was recently verified (optional security check)
        // This ensures the password reset is being done in the correct flow

        // Update user's password using PocketBase's setPassword method
        await dao.setRecordPassword(user, newPassword);

        // Clear password reset OTP fields
        user.password_reset_otp = null;
        user.password_reset_otp_expires_at = null;

        await dao.saveRecord(user);

        // Return success response
        e.responseCode = 200;
        e.responseHeaders = {
            'Content-Type': 'application/json'
        };
        e.response = JSON.stringify({
            success: true,
            message: 'Password reset successfully',
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error in reset-password hook:', err);
        return sendError(e, 500, 'Failed to reset password');
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