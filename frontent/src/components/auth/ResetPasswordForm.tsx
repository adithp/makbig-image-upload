import React, { useState } from "react";
import { useAuth } from "../../contexts/PocketBaseAuthContext";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

interface ResetPasswordFormProps {
  email: string;
  onSuccess: (newPassword: string) => void;
  onCancel: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      setError(
        "Password is too weak. Use uppercase, numbers, and special characters"
      );
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, password);
      onSuccess(password);
    } catch (error: any) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle
            size={18}
            className="text-red-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* New Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition ${
                    level <= passwordStrength
                      ? level === 1
                        ? "bg-red-500"
                        : level === 2
                        ? "bg-yellow-500"
                        : level === 3
                        ? "bg-blue-500"
                        : "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {passwordStrength === 0 && "Very weak"}
              {passwordStrength === 1 && "Weak"}
              {passwordStrength === 2 && "Fair"}
              {passwordStrength === 3 && "Good"}
              {passwordStrength === 4 && "Strong"}
            </p>
          </div>
        )}

        {/* Password Requirements */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                password.length >= 8 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {password.length >= 8 && (
                <CheckCircle size={14} className="text-white" />
              )}
            </div>
            <span className="text-xs text-gray-600">At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {/[A-Z]/.test(password) && (
                <CheckCircle size={14} className="text-white" />
              )}
            </div>
            <span className="text-xs text-gray-600">One uppercase letter</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                /[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {/[0-9]/.test(password) && (
                <CheckCircle size={14} className="text-white" />
              )}
            </div>
            <span className="text-xs text-gray-600">One number</span>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
        )}
        {confirmPassword && password === confirmPassword && (
          <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
            <CheckCircle size={12} /> Passwords match
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            loading || password.length < 8 || password !== confirmPassword
          }
          className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
