// Code Primairily Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Import required libraries and custom declarations
import { useState } from "react";
import type { Course, Professor } from "../types/index.ts";

// Declare the interface for each rating: A course (required), a professor (not required), and onSuccess, resets it
interface CreateQuestionaireProps {
  course: Course;
  professor?: Professor | null;
  onSuccess: () => void;
}

// Main function to create a rating. Takes in a object of the create rating interface
const CreateQuestionaire = ({
  course,
  professor = null,
  onSuccess,
}: CreateQuestionaireProps) => {
  // Declare useState variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to handle submitting a rating
  const handleSubmit = async () => {
    // Initalize success messages to be empty
    setErrorMessage("");
    setSuccessMessage("");

    // If the user wants to rate a professor, follow similar logic for the courses, but always ensure a specific professor is selected too

    // Get the current user ID for the API when submitting a rating. This also ensures a user is logged in, which is required for a rating
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setErrorMessage("You must be logged in to submit a rating.");
      return;
    }

    // Payload object for each rating
    const payload = {
      // Add in the user ID, course ID, and professor information (dependent on a user)
      User: userId,
      Course: course._id,
    };

    // Portion to submit the new rating to the backend
    try {
      // Set flag variable to true
      setIsSubmitting(true);

      // Try to submit a POST request to the API
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Await the response from the API
      const data = await response.json();

      // If the POST request failed, display the error and return
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to generate questionaire.");
        return;
      }

      // If the POST succeded, notify the user
      setSuccessMessage(
        "Questionaire generated successfully! Redirecting to home page...",
      );

      // Wait 2 seconds to redirect
      setTimeout(() => {
        onSuccess();
      }, 2000);

      // If any unknown errors, tell the user. If no errors, set the submit flag to false (as now done)
    } catch (error) {
      setErrorMessage("An error occurred while generating the questionaire.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Main headers */}
      <h4>Step right up and make a questionaire!</h4>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {/*Display submit button, and then update when clicked */}

      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default CreateQuestionaire;
