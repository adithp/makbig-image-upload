import React, { useState } from "react";
import { useAuth } from "../../contexts/PocketBaseAuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import OTPVerification from "./OTPVerification";
import ForgetPasswordForm from "./ForgetPasswordForm";

const LoginFormNew: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const { login, verifyOTP, requestOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.requiresOTP) {
        setVerificationEmail(email);
        setRequiresOTP(true);

        try {
          await requestOTP(email);
        } catch (err: any) {
          setError(err.message || "Failed to send OTP. Please try again.");
          setRequiresOTP(false);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode: string) => {
    try {
      await verifyOTP(verificationEmail, otpCode);
      setRequiresOTP(false);
    } catch (error: any) {
      throw new Error(error.message || "Invalid OTP code");
    }
  };

  const handleOTPResend = async () => {
    try {
      await requestOTP(verificationEmail);
    } catch (error: any) {
      throw new Error(error.message || "Failed to resend OTP");
    }
  };

  const handleOTPCancel = () => {
    setRequiresOTP(false);
    setVerificationEmail("");
    setError("");
  };

  // Show forget password form
  if (showForgetPassword) {
    return <ForgetPasswordForm onBack={() => setShowForgetPassword(false)} />;
  }

  // Show OTP verification form
  if (requiresOTP) {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-light text-gray-900 mb-2">
            Verify Email
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-900">
              {verificationEmail}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <OTPVerification
          email={verificationEmail}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onCancel={handleOTPCancel}
          errorMessage={error}
        />
      </div>
    );
  }

  // Main login form
  return (
    <div className="w-full max-w-md mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-gray-600 text-sm">
          Sign in to your Makbig Academy account
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="email"
              type="email"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forget Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowForgetPassword(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-xs text-gray-500 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginFormNew;
