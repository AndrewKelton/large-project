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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      } catch {
        setErrorMessage("Network error — could not load account info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/updateUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Username: username, Email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to update account.");
        return;
      }

      setUserInfo(data);
      setUsername(data.Username);
      setEmail(data.Email);
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

            <div style={{ marginBottom: "1rem", textAlign: "left" }}>
              <label
                htmlFor="settings-username"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}
              >
                New Username
              </label>
              <input
                id="settings-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
              <label
                htmlFor="settings-email"
                style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}
              >
                New Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
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
