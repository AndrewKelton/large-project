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

    //Ensure all required components are entered (using trim for easier checking)
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
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>

      {/* ── Question & Answers Section ───────────────────────────────── */}
      <div className="section-card">
        <div className="section-card__header">
          ❓ Question
        </div>
        <div style={{ marginBottom: '1.1rem' }}>
          <label htmlFor="q-text" style={{ fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
            What's your question?
          </label>
          <input
            id="q-text"
            type="text"
            value={question}
            required
            placeholder="Enter your question here…"
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div className="section-card__header" style={{ margin: '0 -1.5rem 1rem', borderRadius: 0 }}>
          🔤 Answer Choices
        </div>

        <div className="section-card__body">
          {[
            { id: 'opt-a', label: 'Option A', value: optionA, setter: setOptionA, required: true },
            { id: 'opt-b', label: 'Option B', value: optionB, setter: setOptionB, required: true },
            { id: 'opt-c', label: 'Option C', value: optionC, setter: setOptionC, required: false },
            { id: 'opt-d', label: 'Option D', value: optionD, setter: setOptionD, required: false },
          ].map(({ id, label, value, setter, required }) => (
            <div key={id} className="section-card__row" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label htmlFor={id} style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                {label}
                {!required && <span style={{ fontWeight: 400, color: '#666', fontSize: '0.85rem' }}> (optional)</span>}
              </label>
              <input
                id={id}
                type="text"
                value={value}
                required={required}
                placeholder={`Enter ${label}…`}
                onChange={(e) => setter(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Feedback & submit ─────────────────────────────────────────── */}
      {errorMessage && (
        <p style={{ color: 'var(--error)', fontSize: '0.9rem', marginTop: '0.75rem' }}>⚠ {errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: '#2e7d32', fontSize: '0.9rem', marginTop: '0.75rem' }}>✔ {successMessage}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{ marginTop: '1rem' }}
      >
        {isSubmitting ? "Submitting…" : "Submit Questionnaire"}
      </button>
    </div>
  );
};

export default CreateQuestionaire;
