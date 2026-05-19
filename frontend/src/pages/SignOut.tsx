import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/logout";

export const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await logout();
      } catch (err) {
        console.error("Logout API failed:", err);
      }
      navigate("/signin", { replace: true });
    };

    handleSignOut();
  }, [navigate]);

  return (
    <main>
      <title>Signing out — ATS</title>
      <div>Signing out...</div>
    </main>
  );
};
