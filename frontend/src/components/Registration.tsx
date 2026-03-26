import { useState } from "react";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <span>{firstName}</span>
      <br></br>
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <span>{lastName}</span>
      <br></br>

      <input
        type="text"
        id="username"
        placeholder="Username"
        onChange={handleSetUsername}
      />
      <span>{username}</span>
      <br></br>

      <input
        type="password"
        id="password"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <span>{password}</span>
      <br></br>
      <input type="submit" id="registerButton" value="Sign Me Up!" onClick={doRegistration} />
      <br></br>
    </div>
  );
}

export default Register;
