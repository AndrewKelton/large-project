import { useState } from "react";

function Register() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Email, setEmail] = useState("");

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

  function handleSetEmail(e: any): void {
    setEmail(e.target.value);
  }

  async function doRegistration(event: any): Promise<void> {
    event.preventDefault();

    if (
      FirstName === "" ||
      LastName === "" ||
      Username === "" ||
      Password === "" ||
      ConfirmPassword === "" ||
      Email === ""
    ) {
      setMessage("Please fill out all fields.");
      return;
    }

    if (Password !== ConfirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    var obj = {
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      Username: Username,
      Password: Password,
    };
    var js = JSON.stringify(obj);

    console.log(obj);

    try {
      const response = await fetch("http://leandrovivares.com/api/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());
      console.log(res);

      if (!response.ok) {
        if (res.errors && res.errors.length > 0) {
          setMessage(res.errors[0].msg);
        } else if (res.message) {
          setMessage(res.message);
        } else {
          setMessage("ERROR! Registration failed.");
        }
      } else {
        setMessage(res.message || "Account created! Yay! :)");

        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
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
        id="Email"
        placeholder="Email Address"
        onChange={handleSetEmail}
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
      <input
        type="password"
        id="Confirmpassword"
        placeholder="Re-enter your password"
        onChange={handleConfirmPassword}
      ></input>
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
