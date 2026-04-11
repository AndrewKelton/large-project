import { useState } from "react";

interface LoginProps {
  onSwitchToRegister?: () => void;
}

function Login({ onSwitchToRegister }: LoginProps) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userPassword, setPassword] = useState("");

  // Per-field error state
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");

    // Validate fields before sending
    const errors: typeof fieldErrors = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!userPassword) errors.password = "Password is required.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ Username: username, Password: userPassword }),
        headers: { "Content-Type": "application/json" },
      });

      const res = JSON.parse(await response.text());

      if (!res.token) {
        // Highlight both fields to indicate the combination is wrong
        setFieldErrors({ username: " ", password: " " });
        setMessage("Username / password combination incorrect.");
      } else {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        setMessage("");
        window.location.href = '/HomePage';
      }
    } catch {
      setMessage("Network error — please try again.");
    }
  }

  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span>
      <br />

      {/* Username */}
      <div style={{ marginTop: '0.75rem' }}>
        <input
          type="text"
          id="login-username"
          placeholder="Username"
          value={username}
          className={fieldErrors.username ? "input-error" : ""}
          onChange={(e) => { setUsername(e.target.value); setFieldErrors((f) => ({ ...f, username: undefined })); }}
          aria-label="Username"
          aria-describedby={fieldErrors.username ? "login-username-err" : undefined}
          aria-invalid={!!fieldErrors.username}
          autoComplete="username"
        />
        {fieldErrors.username && fieldErrors.username.trim() && (
          <p id="login-username-err" className="field-error-msg">⚠ {fieldErrors.username}</p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginTop: '0.75rem' }}>
        <input
          type="password"
          id="login-password"
          placeholder="Password"
          value={userPassword}
          className={fieldErrors.password ? "input-error" : ""}
          onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: undefined })); }}
          aria-label="Password"
          aria-describedby={fieldErrors.password ? "login-password-err" : undefined}
          aria-invalid={!!fieldErrors.password}
          autoComplete="current-password"
        />
        {fieldErrors.password && fieldErrors.password.trim() && (
          <p id="login-password-err" className="field-error-msg">⚠ {fieldErrors.password}</p>
        )}
      </div>

      <br />
      <input
        type="submit"
        id="loginButton"
        className="buttons"
        value="Login"
        onClick={doLogin}
        style={{ marginTop: '0.5rem' }}
      />

      {message && (
        <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem' }}>⚠ {message}</p>
      )}

      <br />
      <p style={{ display: "inline" }}>Don't have an account? Click </p>
      <button className="link-button" onClick={onSwitchToRegister}>here</button>
      <p style={{ display: "inline" }}> to make one!</p>
    </div>
  );
}
export default Login;
