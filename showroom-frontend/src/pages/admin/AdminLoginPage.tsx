import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  LogIn,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import authService from "../../services/authService";
import { getErrorMessage } from "../../utils/errorUtils";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If redirect message present in state or URL search params
    const stateMessage = location.state?.message;
    const urlParams = new URLSearchParams(window.location.search);

    if (stateMessage) {
      setError(stateMessage);
    } else if (urlParams.get("expired") === "true") {
      setError("Your session has expired. Please login again.");
    }
  }, [location]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await authService.login({
        email: email.trim(),
        password,
      });

      navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error("Admin login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          getErrorMessage(err, "Unable to login right now. Please try again.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-wrapper">
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <ShieldCheck size={32} />
          </div>

          <span>SHRI HARI SUZUKI</span>

          <h1>Admin Portal</h1>

          <p>
            Manage vehicles, enquiries, test rides and showroom operations from
            one place.
          </p>
        </div>

        <div className="admin-login-card">
          <div className="admin-login-heading">
            <h2>Welcome Back</h2>

            <p>Sign in to access the showroom administration panel.</p>
          </div>

          {error && (
            <div className="admin-login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email">Email Address</label>

              <div className="input-with-icon">
                <Mail size={18} />

                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>

              <div className="input-with-icon">
                <LockKeyhole size={18} />

                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <ShieldCheck size={15} />
            <span>Authorized showroom personnel only</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;
