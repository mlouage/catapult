import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Navigate } from "react-router-dom";

import Logo from '../assets/logo.svg'

export default function Login() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (account) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <img
          alt="XPRTZ.net"
          src={Logo}
          className="h-8 mx-auto mb-6"
        />
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Sign in to your account
        </h2>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700"
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
