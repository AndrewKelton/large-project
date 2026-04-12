// Code Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Import required helper libraries
import { useState } from "react";

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Defined outside Register so React sees a stable component type across renders.
// Defining it inside Register would cause it to be recreated on every render,
// unmounting/remounting the input and losing focus after each keystroke.
function Field({
  id, label, type = "text", value, onChange, error, placeholder, autoComplete,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
        onChange={onChange}
        aria-label={label}
        aria-describedby={error ? `${id}-err` : undefined}
        aria-invalid={!!error}
        autoComplete={autoComplete}
      />
      {error && (
        <p id={`${id}-err`} className="field-error-msg">⚠ {error}</p>
      )}
    </div>
  );
}

// Main function for completing the registration
function Register({ onSwitchToLogin }: RegisterProps) {

  // Declare and initialize useState variables to keep track of user inputs
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Helper: clear a single field's error when the user starts typing
  const clearField = (key: keyof FieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));

  async function doRegistration(event: any): Promise<void> {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    // Build per-field errors
    const errors: FieldErrors = {};
    if (!FirstName.trim())      errors.firstName      = "First name is required.";
    if (!LastName.trim())       errors.lastName       = "Last name is required.";
    if (!Username.trim())       errors.username       = "Username is required.";
    if (!Email.trim())          errors.email          = "Email is required.";
    else if (!isValidEmail(Email)) errors.email       = "Please enter a valid email address.";
    if (!Password)              errors.password       = "Password is required.";
    if (!ConfirmPassword)       errors.confirmPassword = "Please confirm your password.";
    else if (Password && Password !== ConfirmPassword)
                                errors.confirmPassword = "Passwords do not match.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsError(true);
      setMessage("Please fix the highlighted fields.");
      return;
    }
    setFieldErrors({});

    // Make object variable and stringify for the API
    var obj = {
      First_Name: FirstName,
      Last_Name: LastName,
      Email: Email,
      Username: Username,
      Password: Password,
    };

    var js = JSON.stringify(obj);

    // Try to send the JSON object to the API
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      // Await response from the API
      var res = JSON.parse(await response.text());

      // If the API gives an error, display the message properly
      if (!response.ok) {
        setIsError(true);
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
        setIsError(false);
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
      setIsError(true);
      setMessage("Network error — please try again.");
      return;
    }
  }

  //Visual elements. For each variable, display it's respective element, and update based on user actions
  return (
    <div id="registerDiv">
      <span id="inner-title">REGISTER</span>

      <Field id="reg-first" label="First Name" value={FirstName}
        placeholder="Enter your first name"
        error={fieldErrors.firstName}
        onChange={(e) => { setFirstName(e.target.value); clearField("firstName"); }}
        autoComplete="given-name"
      />
      <Field id="reg-last" label="Last Name" value={LastName}
        placeholder="Enter your last name"
        error={fieldErrors.lastName}
        onChange={(e) => { setLastName(e.target.value); clearField("lastName"); }}
        autoComplete="family-name"
      />
      <Field id="reg-email" label="Email Address" type="email" value={Email}
        placeholder="you@example.com"
        error={fieldErrors.email}
        onChange={(e) => { setEmail(e.target.value); clearField("email"); }}
        autoComplete="email"
      />
      <Field id="reg-username" label="Username" value={Username}
        placeholder="Choose a username"
        error={fieldErrors.username}
        onChange={(e) => { setUsername(e.target.value); clearField("username"); }}
        autoComplete="username"
      />
      <Field id="reg-password" label="Password" type="password" value={Password}
        placeholder="Create a password"
        error={fieldErrors.password}
        onChange={(e) => { setPassword(e.target.value); clearField("password"); }}
        autoComplete="new-password"
      />
      <Field id="reg-confirm" label="Confirm Password" type="password" value={ConfirmPassword}
        placeholder="Re-enter your password"
        error={fieldErrors.confirmPassword}
        onChange={(e) => { setConfirmPassword(e.target.value); clearField("confirmPassword"); }}
        autoComplete="new-password"
      />

      <input
        type="submit"
        id="registerButton"
        value="Register"
        onClick={doRegistration}
        style={{ marginTop: '1rem' }}
      />
      <br />
      {Message && (
        isError
          ? <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem' }}>⚠ {Message}</p>
          : <p style={{ color: '#27ae60', fontSize: '0.85rem', marginTop: '0.5rem' }}>{Message}</p>
      )}
      <br />
      <p style={{ display: 'inline' }}>Already have an account? Click </p>
      <button className="link-button" onClick={onSwitchToLogin}>here</button>
      <p style={{ display: 'inline' }}> to Login.</p>
      <br />
    </div>
  );
}

export default Register; //Return to use in other files
