import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Phone, Mail, Lock, MapPin, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, KeyRound } from "lucide-react";
import customerAuthService from "../../services/customerAuthService";

const CustomerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/service";

  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");

  const [demoOtpHint, setDemoOtpHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await customerAuthService.sendOtp(phone);
      if (res.otp) {
        setDemoOtpHint(res.otp);
        setOtp(res.otp);
      }
      setStep(2);
    } catch (err: unknown) {
      console.error("Send OTP error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!otp || otp.length !== 6) {
      setError("Please enter 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      await customerAuthService.register({
        name,
        phone,
        email: email.trim() || undefined,
        password: password.trim() || undefined,
        address: address.trim() || undefined,
        otp,
      });
      navigate(redirectUrl, { replace: true });
    } catch (err: unknown) {
      console.error("Register error:", err);
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || "Registration failed. Mobile/Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-auth-page" style={{ minHeight: "80vh", padding: "4rem 1rem", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-card" style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 12px 36px rgba(0,0,0,0.06)", maxWidth: "500px", width: "100%", padding: "2.5rem" }}>
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "#eaf2ff", color: "#003b8f", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Create Customer Account</h1>
          <p style={{ fontSize: "0.92rem", color: "#64748b", margin: 0 }}>
            Register to book vehicle service slots & view history
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
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
              {loading ? <RefreshCw size={18} className="spin" /> : <>Verify Mobile with OTP <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {demoOtpHint && (
              <div style={{ background: "#eef2ff", border: "1px dashed #6366f1", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", color: "#4338ca", textAlign: "center" }}>
                🔒 Demo OTP Code: <strong>{demoOtpHint}</strong>
              </div>
            )}

            {/* OTP Field */}
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                OTP Sent to {phone} *
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
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "1rem", letterSpacing: "2px", fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Full Name *
              </label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Email Address (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="email"
                  placeholder="e.g. rajesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Create Password (Optional for OTP Users)
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="password"
                  placeholder="Set a password for password login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                City / Address (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <MapPin size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="e.g. Guna, Madhya Pradesh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "12px", background: "#10b981", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
            >
              {loading ? "Creating Account..." : "Create Account & Proceed"}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#64748b" }}>
          Already have an account?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: "#003b8f", fontWeight: 700, textDecoration: "none" }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CustomerRegisterPage;
