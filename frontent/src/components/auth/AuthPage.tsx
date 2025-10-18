import React, { useState } from "react";
import LoginFormNew from "./LoginFormNew";
import RegisterForm from "./RegisterForm";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLogin ? <LoginFormNew /> : <RegisterForm />}

      {/* Simple footer toggle for register */}
      {!isLogin && (
        <div className="text-center mt-8">
          <button
            onClick={() => setIsLogin(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
