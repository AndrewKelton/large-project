import { useState } from "react";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSetFirstName(e: any): void {
    setFirstName(e.target.value);
  }

  function handleSetLastName(e: any): void {
    setLastName(e.target.value);
  }

  function handleSetUsername(e: any): void {
    setUsername(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  function doRegistration(): void {
    if (firstName === "" || lastName === "" || username === "" || password === "")
    {
      setMessage("Please fill out all fields.");
      return;
    }

    setMessage("");
    console.log(firstName, lastName, username, password);
  }

  return (
    <div id="registerDiv">
      <span id="inner-title">REGISTER</span>
      <br />
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        onChange={handleSetFirstName}
      />
      <br></br>
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <br></br>

      <input
        type="text"
        id="username"
        placeholder="Username"
        onChange={handleSetUsername}
      />
      <br></br>

      <input
        type="password"
        id="password"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br></br>
      <input
        type="submit"
        id="registerButton"
        value="Sign Me Up!"
        onClick={doRegistration}
      />
      <br></br>
      <span id="registerResult">{message}</span>
    </div>
  );
}

export default Register;
