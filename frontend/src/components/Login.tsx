import { useState } from "react";

interface LoginProps {
  onSwitchToRegister?: () => void;
}

function Login({ onSwitchToRegister }: LoginProps) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userPassword, setPassword] = useState("");

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();

    var obj = { Username: username, Password: userPassword };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());

      if (!res.token) {
        setMessage("User/Password combination incorrect");
      } else {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId); //Added storing the user ID for when creating a rating
        setMessage("");
        window.location.href = '/HomePage';
      }
    } catch (error: any) {
      setMessage("Network error — please try again.");
      return;
    }
  }

  // set user's login name
  function handleSetUsername(e: any): void {
    setUsername(e.target.value);
  }

  // set user's password
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  // return form
  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span>
      <br />
      <input
        type="text"
        id="username"
        placeholder="Username"
        onChange={handleSetUsername}
      />
      <br></br>
      <input
        type="password"
        id="userPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br></br>
      <input
        type="submit"
        id="loginButton"
        className="buttons"
        value="Login"
        onClick={doLogin}
      />
      {message && (
        <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '0.5rem' }}>⚠ {message}</p>
      )}
      <br />
      <p style={{ display: "inline" }}>Don't have an account? Click </p>
      <button className="link-button" onClick={onSwitchToRegister}>
        here
      </button>
      <p style={{ display: "inline" }}> to make one! </p>
    </div>
  );
}
export default Login;
