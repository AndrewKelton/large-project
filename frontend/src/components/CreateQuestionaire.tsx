// Code Primairily Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Import required libraries and custom declarations
import { useState } from "react";
import type { Course, Professor } from "../types/index.ts";

// Declare the interface for each Questionaie: A course (required), a professor (not required), and onSuccess, resets it
interface CreateQuestionaireProps {
  course: Course;
  professor?: Professor | null;
  onSuccess: () => void;
}

// Main function to create a Questionaire. Takes in a object of the create rating interface
const CreateQuestionaire = ({
  course,
  professor = null,
  onSuccess,
}: CreateQuestionaireProps) => {

  // Declare useState variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  // Function to handle submitting a Questionaire
  const handleSubmit = async () => {
    // Initalize success messages to be empty
    setErrorMessage("");
    setSuccessMessage("");

    // Get the current user ID for the API when submitting a rating. This also ensures a user is logged in, which is required for a rating
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setErrorMessage("You must be logged in to submit a rating.");
      return;
    }

    //E Ensure all required components are entered (using trim for easier checking)
    if (question.trim() === "" || optionA.trim() === "" || optionB.trim() === "") {
      setErrorMessage("You didn't fill in all required components!");
      return;
    }

    // Check to see if the user entered 3 answer options out of order. If so, order it properly
    const optionalOptions = [optionC.trim(), optionD.trim()].filter(
      (option) => option !== "",
    );

    const normalizedOptionC = optionalOptions[0] || null;
    const normalizedOptionD = optionalOptions[1] || null;

    // Payload object for each questionaire
    const payload = {
      // Add in the user ID, course ID, questionaire materials and professor information (dependent on choice)
      User: userId,
      Course: course._id,
      Professor: professor ? professor._id : null,
      Question: question,
      Option_A: optionA,
      Option_B: optionB,
      Option_C: normalizedOptionC,
      Option_D: normalizedOptionD,
    };

    // Portion to submit the new questionaires to the backend
    try {
      // Set flag variable to true
      setIsSubmitting(true);

      // Try to submit a POST request to the API
      const response = await fetch("/api/createQuestionnaire", {
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
      <strong>Professor:</strong>{" "}
      {professor
        ? `${professor.First_Name} ${professor.Last_Name}`
        : "Not Selected"}
      <h4>Step on up and make a questionaire!</h4>
      <h4>
        We currently only support one question per questionaire. <br></br>If you
        want to add more than one question, please make each one in its own
        questionaire.
      </h4>
      <label>
        {/*Question textbox*/}
        <p>What's your Question?</p>
        <input
          type="text"
          value={question}
          required={true}
          placeholder="Enter a Question"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br></br>
        {/*Option A textbox*/}
        <p>Enter Your First Answer Choice (Required)</p>
        <input
          type="text"
          value={optionA}
          required={true}
          placeholder="Option A"
          onChange={(e) => setOptionA(e.target.value)}
        />
        <br></br>
        {/*Option B textbox*/}
        <p>Enter Your Second Answer Choice (Required)</p>

        <input
          type="text"
          value={optionB}
          required={true}
          placeholder="Option B"
          onChange={(e) => setOptionB(e.target.value)}
        />
        <br></br>
        <p>Enter Your Third Answer Choice (Optional)</p>

        {/*Option C textbox*/}
        <input
          type="text"
          value={optionC}
          placeholder="Option C"
          onChange={(e) => setOptionC(e.target.value)}
        />
        <br></br>
        {/*Option D textbox*/}
     
        <p>Enter Your Fourth Answer Choice (Optional)</p>

        <input
          type="text"
          value={optionD}
          placeholder="Option D"
          onChange={(e) => setOptionD(e.target.value)}
        />
        <br></br>
      </label>
      {/*Display approrpiate submit message*/}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {/*Display submit button, and then update when clicked */}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Questionaire"}
      </button>
    </div>
  );
};

export default CreateQuestionaire;
