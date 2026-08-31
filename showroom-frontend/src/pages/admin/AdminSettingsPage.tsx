import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Save,
  UserCheck,
} from "lucide-react";

import adminService, {
  type AdminUser,
  type ShowroomSettings,
} from "../../services/adminService";
import { getErrorMessage } from "../../utils/errorUtils";
import authService from "../../services/authService";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<
    "security" | "profile" | "showroom" | "notifications"
  >("security");

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form
  const [adminName, setAdminName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Showroom Settings Form
  const [settings, setSettings] = useState<ShowroomSettings>({
    showroomName: "Shri Hari Suzuki",
    phone: "+91 98765 43210",
    email: "info@shriharisuzuki.com",
    address:
      "Hotel The Sara, AB Road, near Kushmoda Chauki, Gaushala Mahaveerpura, Guna, Madhya Pradesh 473001",
    openingHours: "Monday - Saturday: 9:00 AM - 8:00 PM | Sunday: Closed",
    emailAlertsEnquiries: true,
    emailAlertsTestRides: true,
    autoApprovalTestRides: false,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const currentAdmin = await adminService.getCurrentAdmin();
        setAdmin(currentAdmin);
        setAdminName(currentAdmin.name);

        const loadedSettings = await adminService.getSettings();
        if (loadedSettings) {
          setSettings(loadedSettings);
        }
      } catch (err) {
        console.error("Load Admin Settings Error:", err);
        const storedAdmin = authService.getAdmin();
        if (storedAdmin) {
          setAdminName(storedAdmin.name || "Administrator");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /* ================= HANDLE PROFILE SUBMIT ================= */
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!adminName.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await adminService.updateProfile(adminName.trim());
      setAdmin(updated);
      setProfileSuccess("Admin name updated successfully.");
    } catch (err) {
      console.error("Update Profile Error:", err);
      setProfileError(getErrorMessage(err, "Unable to update profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  /* ================= HANDLE PASSWORD SUBMIT ================= */
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password cannot be the same as current password.");
      return;
    }

    try {
      setSavingPassword(true);
      await adminService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change Password Error:", err);
      setPasswordError(getErrorMessage(err, "Unable to change password."));
    } finally {
      setSavingPassword(false);
    }
  };

  /* ================= HANDLE SETTINGS SUBMIT ================= */
  const handleSettingsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSettingsSuccess("");
    setSettingsError("");

    try {
      setSavingSettings(true);
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      setSettingsSuccess("Showroom preferences updated successfully.");
    } catch (err) {
      console.error("Update Settings Error:", err);
      setSettingsError(getErrorMessage(err, "Unable to save preferences."));
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-state-card">
          <Loader2 size={38} className="spin" />
          <h2>Loading Settings</h2>
          <p>Fetching admin profile and system preferences...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page admin-settings-page">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">SYSTEM CONFIGURATION</span>
          <h1>Admin Settings & Security</h1>
          <p>
            Manage your admin password, profile credentials, showroom details,
            and system notifications.
          </p>
        </div>
      </div>

      {/* SETTINGS TABS */}
      <div className="admin-settings-tabs">
        <button
          type="button"
          className={`admin-settings-tab ${
            activeTab === "security" ? "active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <KeyRound size={17} />
          Password & Security
        </button>

        <button
          type="button"
          className={`admin-settings-tab ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <UserCheck size={17} />
          Admin Profile
        </button>

        <button
          type="button"
          className={`admin-settings-tab ${
            activeTab === "showroom" ? "active" : ""
          }`}
          onClick={() => setActiveTab("showroom")}
        >
          <Building2 size={17} />
          Showroom Details
        </button>

        <button
          type="button"
          className={`admin-settings-tab ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell size={17} />
          Alerts & Preferences
        </button>
      </div>

      {/* ================= TAB 1: PASSWORD & SECURITY ================= */}
      {activeTab === "security" && (
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Lock size={20} />
            </div>
            <div>
              <h2>Change Password</h2>
              <p>
                Update your admin login password to keep your dashboard secure.
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="admin-form-success">
              <CheckCircle2 size={18} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="admin-form-error">
              <AlertCircle size={18} style={{ marginRight: "8px", flexShrink: 0 }} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ marginTop: "1rem" }}>
            <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr" }}>
              {/* CURRENT PASSWORD */}
              <div className="admin-form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="currentPassword"
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="admin-form-group">
                <label htmlFor="newPassword">New Password * (Min 6 characters)</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="newPassword"
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="admin-form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-form-actions" style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB 2: ADMIN PROFILE ================= */}
      {activeTab === "profile" && (
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <UserCheck size={20} />
            </div>
            <div>
              <h2>Administrator Profile</h2>
              <p>Manage your account name and view login credentials.</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="admin-form-success">
              <CheckCircle2 size={18} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="admin-form-error">
              <AlertCircle size={18} style={{ marginRight: "8px", flexShrink: 0 }} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ marginTop: "1rem" }}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="adminName">Full Name *</label>
                <input
                  id="adminName"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Showroom Admin"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Admin Email (Primary Login)</label>
                <input
                  type="email"
                  value={admin?.email || "admin@showroom.com"}
                  disabled
                  style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>

              <div className="admin-form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={admin?.role || "ADMIN"}
                  disabled
                  style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="admin-form-actions" style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Saving Name...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB 3: SHOWROOM DETAILS ================= */}
      {activeTab === "showroom" && (
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Building2 size={20} />
            </div>
            <div>
              <h2>Showroom Business Information</h2>
              <p>Configure public contact information displayed across your website.</p>
            </div>
          </div>

          {settingsSuccess && (
            <div className="admin-form-success">
              <CheckCircle2 size={18} />
              <span>{settingsSuccess}</span>
            </div>
          )}

          {settingsError && (
            <div className="admin-form-error">
              <AlertCircle size={18} style={{ marginRight: "8px", flexShrink: 0 }} />
              <span>{settingsError}</span>
            </div>
          )}

          <form onSubmit={handleSettingsSubmit} style={{ marginTop: "1rem" }}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="showroomName">Showroom Name</label>
                <input
                  id="showroomName"
                  type="text"
                  value={settings.showroomName}
                  onChange={(e) =>
                    setSettings({ ...settings, showroomName: e.target.value })
                  }
                  placeholder="e.g. Shri Hari Suzuki"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="phone">Contact Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="email">Customer Support Email</label>
                <input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  placeholder="e.g. info@shriharisuzuki.com"
                />
              </div>

              <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="address">Showroom Full Address</label>
                <input
                  id="address"
                  type="text"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  placeholder="Enter full showroom address"
                />
              </div>

              <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="openingHours">Opening Hours</label>
                <input
                  id="openingHours"
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) =>
                    setSettings({ ...settings, openingHours: e.target.value })
                  }
                  placeholder="e.g. Mon - Sat: 9am - 8pm"
                />
              </div>
            </div>

            <div className="admin-form-actions" style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={savingSettings}
              >
                {savingSettings ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Saving Details...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Showroom Info
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= TAB 4: ALERTS & PREFERENCES ================= */}
      {activeTab === "notifications" && (
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Bell size={20} />
            </div>
            <div>
              <h2>System Notifications & Preferences</h2>
              <p>Configure automated email notifications for enquiries and test ride requests.</p>
            </div>
          </div>

          {settingsSuccess && (
            <div className="admin-form-success">
              <CheckCircle2 size={18} />
              <span>{settingsSuccess}</span>
            </div>
          )}

          {settingsError && (
            <div className="admin-form-error">
              <AlertCircle size={18} style={{ marginRight: "8px", flexShrink: 0 }} />
              <span>{settingsError}</span>
            </div>
          )}

          <form onSubmit={handleSettingsSubmit} style={{ marginTop: "1rem" }}>
            <div className="admin-form-checkboxes">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={settings.emailAlertsEnquiries}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailAlertsEnquiries: e.target.checked,
                    })
                  }
                />
                <span>Email Alerts for New Customer Enquiries</span>
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={settings.emailAlertsTestRides}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailAlertsTestRides: e.target.checked,
                    })
                  }
                />
                <span>Email Notifications for Test Ride Bookings</span>
              </label>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={settings.autoApprovalTestRides}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoApprovalTestRides: e.target.checked,
                    })
                  }
                />
                <span>Auto-Confirm Incoming Test Ride Slots</span>
              </label>
            </div>

            <div className="admin-form-actions" style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="admin-primary-btn"
                disabled={savingSettings}
              >
                {savingSettings ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Saving Preferences...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
};

export default AdminSettingsPage;
