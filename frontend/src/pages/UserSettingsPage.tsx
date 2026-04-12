import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle.tsx";

interface UserInfo {
  _id: string;
  Username: string;
  Email: string;
  First_Name: string;
  Last_Name: string;
}

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string }>({});

  useEffect(() => {
    if (!token || !userId) {
      navigate("/auth");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/userSettings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message || "Failed to load user info.");
          return;
        }
        setUserInfo(data);
        setUsername(data.Username);
        setEmail(data.Email);
        setFirstName(data.First_Name);
        setLastName(data.Last_Name);
      } catch {
        setErrorMessage("Network error — could not load account info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token, navigate]);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Per-field validation
    const errors: { username?: string; email?: string } = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!email.trim())    errors.email    = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password && password.length < 5) {
      setErrorMessage("Password must be at least 5 characters.");
      return;
    }

    setSaving(true);

    try {
      const body: Record<string, string> = {
        Username: username,
        Email: email,
        First_Name: firstName,
        Last_Name: lastName,
      };
      if (password) body.Password = password;

      const response = await fetch(`/api/updateUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to update account.");
        return;
      }

      setUserInfo(data);
      setUsername(data.Username);
      setEmail(data.Email);
      setFirstName(data.First_Name);
      setLastName(data.Last_Name);
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage("Account updated successfully!");
    } catch {
      setErrorMessage("Network error — could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: 0,
          }}
        >
          ← Back to Home
        </button>
      </div>

      <PageTitle />

      <h2 style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>
        Account Settings
      </h2>

      {loading ? (
        <p>Loading your account info…</p>
      ) : (
        <>
          {/* Read-only account details */}
          <div
            style={{
              background: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
              marginBottom: "1.75rem",
              textAlign: "left",
            }}
          >
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "var(--text)" }}>
              Account Details
            </p>
            <p style={{ margin: "0.25rem 0", color: "var(--text-h)" }}>
              <strong>Name:</strong>{" "}
              {userInfo?.First_Name} {userInfo?.Last_Name}
            </p>
            <p style={{ margin: "0.25rem 0", color: "var(--text-h)" }}>
              <strong>Username:</strong> {userInfo?.Username}
            </p>
            <p style={{ margin: "0.25rem 0", color: "var(--text-h)" }}>
              <strong>Email:</strong> {userInfo?.Email}
            </p>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSave} noValidate>
            <h3 style={{ marginBottom: "1rem", fontWeight: 500 }}>
              Update Info
            </h3>

            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label
                  htmlFor="settings-firstname"
                  style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
                >
                  First Name
                </label>
                <input
                  id="settings-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label
                  htmlFor="settings-lastname"
                  style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
                >
                  Last Name
                </label>
                <input
                  id="settings-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label
                htmlFor="settings-username"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
              >
                Username
              </label>
              <input
                id="settings-username"
                type="text"
                value={username}
                className={fieldErrors.username ? "input-error" : ""}
                onChange={(e) => { setUsername(e.target.value); setFieldErrors((f) => ({ ...f, username: undefined })); }}
                placeholder="Username"
                aria-describedby={fieldErrors.username ? "settings-username-err" : undefined}
                aria-invalid={!!fieldErrors.username}
                autoComplete="username"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              {fieldErrors.username && (
                <p id="settings-username-err" className="field-error-msg">⚠ {fieldErrors.username}</p>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label
                htmlFor="settings-email"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
              >
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                className={fieldErrors.email ? "input-error" : ""}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: undefined })); }}
                placeholder="Email"
                aria-describedby={fieldErrors.email ? "settings-email-err" : undefined}
                aria-invalid={!!fieldErrors.email}
                autoComplete="email"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              {fieldErrors.email && (
                <p id="settings-email-err" className="field-error-msg">⚠ {fieldErrors.email}</p>
              )}
            </div>

            <h3 style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
              Change Password
            </h3>
            <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "var(--text)" }}>
              Leave blank to keep your current password.
            </p>

            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label
                htmlFor="settings-password"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
              >
                New Password
              </label>
              <input
                id="settings-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label
                htmlFor="settings-confirm-password"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 500 }}
              >
                Confirm New Password
              </label>
              <input
                id="settings-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {successMessage && (
              <p style={{ color: "#27ae60", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                ✓ {successMessage}
              </p>
            )}
            {errorMessage && (
              <p style={{ color: "#c0392b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                ⚠ {errorMessage}
              </p>
            )}

            <button type="submit" disabled={saving} style={{ width: "100%" }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UserSettingsPage;
