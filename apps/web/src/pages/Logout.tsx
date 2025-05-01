import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";

export default function Logout() {
  const { instance } = useMsal();

  useEffect(() => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/login" });
  }, [instance]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-gray-700">Signing you out...</p>
    </div>
  );
}
