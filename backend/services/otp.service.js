const crypto = require('crypto');

/**
 * Generate a random OTP code (6 digits)
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry time (5 minutes from now)
 */
function getOTPExpiryTime() {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    return expiryTime;
}

/**
 * Validate if OTP is still valid
 */
function isOTPValid(expiryTime) {
    const now = new Date();
    return now < new Date(expiryTime);
}

/**
 * Verify OTP code
 */
function verifyOTP(storedOTP, providedOTP, expiryTime) {
    if (!isOTPValid(expiryTime)) {
        return {
            valid: false,
            message: 'OTP has expired. Please request a new one.'
        };
    }

    if (storedOTP !== providedOTP) {
        return {
            valid: false,
            message: 'Invalid OTP code. Please try again.'
        };
    }

    return {
        valid: true,
        message: 'OTP verified successfully'
    };
}

module.exports = {
    generateOTP,
    getOTPExpiryTime,
    isOTPValid,
    verifyOTP
};