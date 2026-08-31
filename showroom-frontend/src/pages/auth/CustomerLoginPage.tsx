import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Phone, Lock, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, KeyRound } from "lucide-react";
import customerAuthService from "../../services/customerAuthService";

const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/service";

  const [authMode, setAuthMode] = useState<"otp" | "password">("otp");

  // OTP Login State
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState("");
  const [otp, setOtp] = useState("");

  // Password Login State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await customerAuthService.sendOtp(phone);
      setOtpSent(true);
      setSuccessMsg(res.message);
      if (res.otp) {
        setDemoOtpHint(res.otp);
        setOtp(res.otp); // Pre-fill for instant seamless testing!
      }
    } catch (err: unknown) {
      console.error("Send OTP error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await customerAuthService.verifyOtp(phone, otp);
      navigate(redirectUrl, { replace: true });
    } catch (err: unknown) {
      console.error("Verify OTP error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter mobile/email and password.");
      return;
    }

    try {
      setLoading(true);
      await customerAuthService.login({ identifier, password });
      navigate(redirectUrl, { replace: true });
    } catch (err: unknown) {
      console.error("Password login error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Invalid credentials. Please check password or login via OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-auth-page" style={{ minHeight: "80vh", padding: "4rem 1rem", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 12px 36px rgba(0,0,0,0.06)", maxWidth: "460px", width: "100%", padding: "2.5rem" }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "#eaf2ff", color: "#003b8f", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Customer Sign In</h1>
          <p style={{ fontSize: "0.92rem", color: "#64748b", margin: 0 }}>
            Sign in to book vehicle service & track appointments
          </p>
        </div>

        {/* AUTH MODE TABS */}
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "10px", padding: "4px", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => { setAuthMode("otp"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: authMode === "otp" ? "#ffffff" : "transparent",
              color: authMode === "otp" ? "#003b8f" : "#64748b",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.88rem",
              boxShadow: authMode === "otp" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Mobile OTP Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode("password"); setError(""); }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: authMode === "password" ? "#ffffff" : "transparent",
              color: authMode === "password" ? "#003b8f" : "#64748b",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.88rem",
              boxShadow: authMode === "password" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Password Login
          </button>
        </div>

        {/* ERROR / SUCCESS ALERTS */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "10px 14px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
            {successMsg}
          </div>
        )}

        {/* MODE 1: MOBILE OTP FORM */}
        {authMode === "otp" && (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Mobile Number *
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                      type="tel"
                      placeholder="e.g., 9826012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={10}
                      required
                      style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #00275f 0%, #003b8f 100%)", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {loading ? <RefreshCw size={18} className="spin" /> : <>Send OTP <ArrowRight size={18} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {demoOtpHint && (
                  <div style={{ background: "#eef2ff", border: "1px dashed #6366f1", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", color: "#4338ca", textAlign: "center" }}>
                    🔒 Demo OTP Code: <strong>{demoOtpHint}</strong>
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                    Enter 6-Digit OTP *
                  </label>
                  <div style={{ position: "relative" }}>
                    <KeyRound size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "1.1rem", letterSpacing: "2px", fontWeight: 700 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "12px", background: "#10b981", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
                >
                  {loading ? "Verifying..." : "Verify OTP & Log In"}
                </button>

                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
                >
                  ← Change Mobile Number
                </button>
              </form>
            )}
          </>
        )}

        {/* MODE 2: PASSWORD LOGIN FORM */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Mobile Number or Email *
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="e.g. 9826012345 or customer@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #00275f 0%, #003b8f 100%)", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
            >
              {loading ? "Logging in..." : "Sign In with Password"}
            </button>
          </form>
        )}

        {/* FOOTER LINK */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#64748b" }}>
          Don't have an account?{" "}
          <Link to={`/register?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: "#003b8f", fontWeight: 700, textDecoration: "none" }}>
            Register New Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CustomerLoginPage;
