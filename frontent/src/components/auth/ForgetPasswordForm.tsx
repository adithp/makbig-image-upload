import React, { useState } from "react";
import { useAuth } from "../../contexts/PocketBaseAuthContext";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import OTPVerification from "./OTPVerification";
import ResetPasswordForm from "./ResetPasswordForm";

interface ForgetPasswordFormProps {
  onBack: () => void;
}

const ForgetPasswordForm: React.FC<ForgetPasswordFormProps> = ({ onBack }) => {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">(
    "email"
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { requestPasswordReset, verifyPasswordResetOTP } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        throw new Error("Please enter your email address");
      }

      await requestPasswordReset(email);
      setStep("otp");
    } catch (error: any) {
      setError(error.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode: string) => {
    try {
      await verifyPasswordResetOTP(email, otpCode);
      setStep("reset");
    } catch (error: any) {
      throw new Error(error.message || "Invalid code. Please try again.");
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    setSuccessMessage("Password reset successfully!");
    setStep("success");
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleResend = async () => {
    setError("");
    try {
      await requestPasswordReset(email);
    } catch (error: any) {
      setError(error.message || "Failed to resend code");
    }
  };

  // Email Step
  if (step === "email") {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Login</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                id="email"
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    );
  }

  // OTP Step
  if (step === "otp") {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <button
          onClick={() => setStep("email")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Verify Code
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <OTPVerification
          email={email}
          onVerify={handleOTPVerify}
          onResend={handleResend}
          onCancel={() => setStep("email")}
          errorMessage={error}
        />
      </div>
    );
  }

  // Password Reset Step
  if (step === "reset") {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter a new password for your account. Make it strong and unique.
          </p>
        </div>

        <ResetPasswordForm
          email={email}
          onSuccess={handlePasswordReset}
          onCancel={onBack}
        />
      </div>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-96">
        <div className="mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-light text-gray-900 mb-2 text-center">
          Password Reset!
        </h2>
        <p className="text-gray-600 text-sm text-center mb-8">
          Your password has been successfully reset. Redirecting to login...
        </p>
      </div>
    );
  }

  return null;
};

export default ForgetPasswordForm;
