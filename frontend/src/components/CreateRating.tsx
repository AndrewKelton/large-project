// Code Primairily Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Import required libraries and custom declarations
import { useState, useEffect } from "react";
import type { Course, Professor } from "../types/index.ts";
import { COURSE_QUESTIONS, PROFESSOR_QUESTIONS} from "../constants/ratingQuestions.ts";

// Declare the interface for each rating: A course (required), a professor (not required), and onSuccess, resets it
interface CreateRatingProps {
  course: Course;
  professor?: Professor | null;
  onSuccess: () => void;
}

// Main function to create a rating. Takes in a object of the create rating interface
const CreateRating = ({course, professor = null, onSuccess,}: CreateRatingProps) => {
  const [wantsProfessorRating, setWantsProfessorRating] = useState(!!professor);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    professor,
  );

  // Declare useState variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [professors, setProfessors] = useState<Professor[]>([]);

  // Function to reset the professor answers if the user leaves the page or chooses to not rate a professor
  const resetProfessorAnswers = () => {
    setProfessorAnswers({
      averageQ6: 0,
      averageQ7: 0,
      averageQ8: 0,
      averageQ9: 0,
      averageQ10: 0,
    });
  };

  // Use state object of responses for the course questions. Initialized to 0.
  const [courseAnswers, setCourseAnswers] = useState({
    averageQ1: 0,
    averageQ2: 0,
    averageQ3: 0,
    averageQ4: 0,
    averageQ5: 0,
  });

  // Use state object of responses for the professor questions. Initialized to 0.
  const [professorAnswers, setProfessorAnswers] = useState({
    averageQ6: 0,
    averageQ7: 0,
    averageQ8: 0,
    averageQ9: 0,
    averageQ10: 0,
  });


  // Function to get all of the professors in the database, only runs if the user has the professor option selected
  useEffect(() => {
    const fetchProfessors = async () => {

      // Try getting the professors, and if so, set the returned profesors appropriately. If not, error out
      try {
        const response = await fetch(`/api/professors`);
        const data = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, [course]);

  // Function to handle submitting a rating
  const handleSubmit = async () => {

    // Initalize success messages to be empty
    setErrorMessage("");
    setSuccessMessage("");

    // Declare object for course answers, and check if full. if not, tell the user and error
    const courseValues = Object.values(courseAnswers);
    if (courseValues.some((val) => val === 0)) {
      setErrorMessage("Please answer all course questions.");
      return;
    }

    // If the user wants to rate a professor, follow similar logic for the courses, but always ensure a specific professor is selected too
    if (wantsProfessorRating) {
      if (!selectedProfessor) {
        setErrorMessage("Please select a professor.");
        return;
      }

      const professorValues = Object.values(professorAnswers);
      if (professorValues.some((val) => val === 0)) {
        setErrorMessage("Please answer all professor questions.");
        return;
      }
    }

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
      Professor: wantsProfessorRating && selectedProfessor ? selectedProfessor._id : null,

      // Store the user's responses to the class questions
      Option_A_Count: courseAnswers.averageQ1,
      Option_B_Count: courseAnswers.averageQ2,
      Option_C_Count: courseAnswers.averageQ3,
      Option_D_Count: courseAnswers.averageQ4,
      Option_E_Count: courseAnswers.averageQ5,

      // Store the user's response to rating a professor
      Professor_Rated: wantsProfessorRating,

      // Store the user's responses to the professor questions (if applicable). If no professor rated, store 1 to satisfy the API requirements
      Option_F_Count: wantsProfessorRating ? professorAnswers.averageQ6 : 1,
      Option_G_Count: wantsProfessorRating ? professorAnswers.averageQ7 : 1,
      Option_H_Count: wantsProfessorRating ? professorAnswers.averageQ8 : 1,
      Option_I_Count: wantsProfessorRating ? professorAnswers.averageQ9 : 1,
      Option_J_Count: wantsProfessorRating ? professorAnswers.averageQ10 : 1,
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
        setErrorMessage(data.message || "Failed to submit rating.");
        return;
      }

      // If the POST succeded, notify the user
      setSuccessMessage(
        "Rating submitted successfully! Redirecting to home page...",
      );

      // Wait 2 seconds to redirect
      setTimeout(() => {
        onSuccess();
      }, 2000);

    // If any unknown errors, tell the user. If no errors, set the submit flag to false (as now done)
    } catch (error) {
      setErrorMessage("An error occurred while submitting the rating.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* ── Course Rating Section ─────────────────────────────────────── */}
      <div className="section-card">
        <div className="section-card__header">
          📋 Course Rating Questions
        </div>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#444' }}>
          Rate each item from <strong>1 (Very Poor)</strong> to <strong>5 (Excellent)</strong>.
        </p>
        <div className="section-card__body">
          {Object.entries(COURSE_QUESTIONS).map(([key, questionText], idx) => (
            <div key={key} className="section-card__row" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label htmlFor={`course-q-${key}`} style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                {idx + 1}. {questionText}
              </label>
              <select
                id={`course-q-${key}`}
                value={courseAnswers[key as keyof typeof courseAnswers]}
                onChange={(e) =>
                  setCourseAnswers({ ...courseAnswers, [key]: Number(e.target.value) })
                }
                style={{ maxWidth: '260px' }}
              >
                <option value="">Select a rating</option>
                <option value="1">1 – Very Poor</option>
                <option value="2">2 – Poor</option>
                <option value="3">3 – Average</option>
                <option value="4">4 – Good</option>
                <option value="5">5 – Excellent</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* ── Professor toggle ──────────────────────────────────────────── */}
      <div className="selection-chip-row" style={{ marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={wantsProfessorRating}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setWantsProfessorRating(isChecked);
              if (!isChecked) {
                setSelectedProfessor(null);
                setProfessorAnswers({ averageQ6: 0, averageQ7: 0, averageQ8: 0, averageQ9: 0, averageQ10: 0 });
              }
            }}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          Would you also like to rate a professor?
        </label>
      </div>

      {/* ── Professor Rating Section ──────────────────────────────────── */}
      {wantsProfessorRating && (
        <div className="section-card">
          <div className="section-card__header">
            🎓 Professor Rating Questions
          </div>

          {/* Professor selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="professor-select" style={{ fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
              Select Professor:
            </label>
            <select
              id="professor-select"
              value={selectedProfessor?._id ?? ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                if (!selectedId) { setSelectedProfessor(null); resetProfessorAnswers(); return; }
                setSelectedProfessor(professors.find((p) => p._id === selectedId) ?? null);
              }}
              style={{ maxWidth: '320px' }}
            >
              <option value="">Select a professor</option>
              {professors.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.First_Name} {prof.Last_Name}
                </option>
              ))}
            </select>
          </div>

          <div className="section-card__body">
            {Object.entries(PROFESSOR_QUESTIONS).map(([key, questionText], idx) => (
              <div key={key} className="section-card__row" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label htmlFor={`prof-q-${key}`} style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                  {idx + 1}. {questionText}
                </label>
                <select
                  id={`prof-q-${key}`}
                  value={professorAnswers[key as keyof typeof professorAnswers]}
                  onChange={(e) =>
                    setProfessorAnswers({ ...professorAnswers, [key]: Number(e.target.value) })
                  }
                  style={{ maxWidth: '260px' }}
                >
                  <option value="">Select a rating</option>
                  <option value="1">1 – Very Poor</option>
                  <option value="2">2 – Poor</option>
                  <option value="3">3 – Average</option>
                  <option value="4">4 – Good</option>
                  <option value="5">5 – Excellent</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

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
        {isSubmitting ? "Submitting…" : "Submit Rating"}
      </button>
    </div>
  );
};

export default CreateRating;
