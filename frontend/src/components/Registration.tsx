import { useState } from "react";

function Register() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState('');

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

  function handleConfirmPassword(e: any): void {
    setConfirmPassword(e.target.value);
  }


  function doRegistration(): void {
    if (FirstName === "" || LastName === "" || Username === "" || Password === "" || ConfirmPassword === "")
    {
      setMessage("Please fill out all fields.");
      return;
    }

    if(Password !== ConfirmPassword)
    {
      setMessage("Inputted passwords do not match.");
      return;
    }

    setMessage("Account created!");
  }

  return (
    <div id="registerDiv">
      <span id="inner-title">REGISTER</span>
      <br />
      <input
        type="text"
        id="FirstName"
        placeholder="First Name"
        onChange={handleSetFirstName}
      />
      <br></br>
      <input
        type="text"
        id="LastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <br></br>

      <input
        type="text"
        id="Username"
        placeholder="Username"
        onChange={handleSetUsername}
      />
      <br></br>

      <input
        type="password"
        id="Password"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br></br>
      <input type = "password" id = "Confirmpassword" placeholder = "Re-enter your password" onChange={handleConfirmPassword}></input>
      <br></br>
      <input
        type="submit"
        id="registerButton"
        value="Sign Me Up!"
        onClick={doRegistration}
      />
      <br></br>
      <span id="registerResult">{Message}</span>
    </div>
  );
}

export default Register;
