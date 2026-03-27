// Code Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Import required helper libraries
import { useState } from "react";

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

// Main function for completing the registration
function Register({ onSwitchToLogin }: RegisterProps) {

  // Declare and initialize useState variables to keep track of user inputs
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Email, setEmail] = useState("");

  // Handler functions to handle input from the user and update the respective variables
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

    if (FirstName === "" || LastName === "" || Username === "" || Password === "" || ConfirmPassword === "" ||Email === "") {
      setMessage("Please fill out all fields.");
      return;
    }

    if (Password !== ConfirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Make object variable and stringify for the API
    var obj = {
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      Username: Username,
      Password: Password,
    };

    var js = JSON.stringify(obj);

    // Try to send the JSON object to the API
    try {
      const response = await fetch("http://leandrovivares.com/api/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      // Await response from the API
      var res = JSON.parse(await response.text());

      // If the API gives an error, display the message properly
      if (!response.ok) {
        if (res.errors && res.errors.length > 0) {
          setMessage(res.errors[0].msg);
        } else if (res.message) {
          setMessage(res.message);
        } else {
          setMessage("ERROR! Registration failed for unknown reason.");
        }
        
      // If here, the API was successful  
      } else {

        // Print the success message
        setMessage(res.message);

        // Wait two seconds and clear the text boxes. Show user going to Login screen
        setTimeout(() => {
          setFirstName("");
          setLastName("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setEmail("");
          setMessage("Redirecting to Login Screen...");
        }, 2000);

        
        // After another 1.5 seconds, switch to login tab
        setTimeout(() => {
          onSwitchToLogin?.();
        }, 3500);
      }

    // Catch any errors and display  
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

   //Visual elements. For each variable, display it's respective element, and update based on user actions
  return (
    <div id="registerDiv">
      <span id="inner-title">REGISTER</span>
      <br></br>
      <input
        type="text"
        id="FirstName"
        placeholder="First Name"
        value = {FirstName}
        onChange={handleSetFirstName}
      />
      <br></br>
      <input
        type="text"
        id="LastName"
        placeholder="Last Name"
        value = {LastName}
        onChange={handleSetLastName}
      />
      <br></br>
      <input
        type="text"
        id="Email"
        placeholder="Email Address"
        value = {Email}
        onChange={handleSetEmail}
      />
      <br></br>
      <input
        type="text"
        id="Username"
        placeholder="Username"
        value = {Username}
        onChange={handleSetUsername}
      />
      <br></br>
      <input
        type="password"
        id="Password"
        placeholder="Password"
        value = {Password}
        onChange={handleSetPassword}
      />
      <br></br>
      <input
        type="password"
        id="Confirmpassword"
        placeholder="Re-enter your password"
        value = {ConfirmPassword}
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
      <br />
      <p style = {{display: 'inline'}}>Already have an account? Click </p>
      <button className="link-button" onClick={onSwitchToLogin}>here</button>
      <p style = {{display: 'inline'}}> to Login. </p>
      <br></br>
    </div>
  );
}

export default Register; //Return to use in other files
