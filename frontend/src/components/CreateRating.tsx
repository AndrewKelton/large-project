import { useState, useEffect } from "react";
import type { Course, Professor } from "../types/index.ts";
import {
  COURSE_QUESTIONS,
  PROFESSOR_QUESTIONS,
} from "../constants/ratingQuestions.ts";

interface CreateRatingProps {
  course: Course;
  professor?: Professor | null;
  onSuccess: () => void;
}

const CreateRating = ({
  course,
  professor = null,
  onSuccess,
}: CreateRatingProps) => {
  const [wantsProfessorRating, setWantsProfessorRating] = useState(!!professor);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    professor,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [professors, setProfessors] = useState<Professor[]>([]);

  const resetProfessorAnswers = () => {
    setProfessorAnswers({
      averageQ6: 0,
      averageQ7: 0,
      averageQ8: 0,
      averageQ9: 0,
      averageQ10: 0,
    });
  };

  const [courseAnswers, setCourseAnswers] = useState({
    averageQ1: 0,
    averageQ2: 0,
    averageQ3: 0,
    averageQ4: 0,
    averageQ5: 0,
  });

  const [professorAnswers, setProfessorAnswers] = useState({
    averageQ6: 0,
    averageQ7: 0,
    averageQ8: 0,
    averageQ9: 0,
    averageQ10: 0,
  });

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch(`/api/professors`);
        const data = await response.json();
        setProfessors(data);
        console.log("professors returned:", data);
        console.log("course object:", course);
        console.log("fetching:", `/api/professors/course/${course._id}`);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, [course]);

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const courseValues = Object.values(courseAnswers);
    if (courseValues.some((val) => val === 0)) {
      setErrorMessage("Please answer all course questions.");
      return;
    }

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

    const userId = "69c33e0eb4992405512df29f";

    const payload = {
      User: userId,
      Course: course._id,
      Professor:
        wantsProfessorRating && selectedProfessor
          ? selectedProfessor._id
          : null,

      Option_A_Count: courseAnswers.averageQ1,
      Option_B_Count: courseAnswers.averageQ2,
      Option_C_Count: courseAnswers.averageQ3,
      Option_D_Count: courseAnswers.averageQ4,
      Option_E_Count: courseAnswers.averageQ5,

      Professor_Rated: wantsProfessorRating,

      Option_F_Count: wantsProfessorRating ? professorAnswers.averageQ6 : 1,
      Option_G_Count: wantsProfessorRating ? professorAnswers.averageQ7 : 1,
      Option_H_Count: wantsProfessorRating ? professorAnswers.averageQ8 : 1,
      Option_I_Count: wantsProfessorRating ? professorAnswers.averageQ9 : 1,
      Option_J_Count: wantsProfessorRating ? professorAnswers.averageQ10 : 1,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to submit rating.");
        return;
      }

      setSuccessMessage(
        "Rating submitted successfully! Thank you for your feedback!",
      );

      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      setErrorMessage("An error occurred while submitting the rating.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {wantsProfessorRating && (
        <p>
          <strong>Professor:</strong>{" "}
          {selectedProfessor
            ? `${selectedProfessor.First_Name} ${selectedProfessor.Last_Name}`
            : "Not Selected"}
        </p>
      )}

      <div>
        <h4>Course Rating Questions</h4>
        <h5>Please answer your responses on a scale of 1-5, with 1 being the lowest rating, and 5 being the highest rating</h5>

        {Object.entries(COURSE_QUESTIONS).map(([key, questionText]) => (
          <div key={key}>
            <label>
              {questionText}
              <select
                value={courseAnswers[key as keyof typeof courseAnswers]}
                onChange={(e) => {
                  setCourseAnswers({
                    ...courseAnswers,
                    [key]: Number(e.target.value),
                  });
                }}
              >
                <option value="">Select a rating</option>
                <option value="1"> 1 - Very Poor</option>
                <option value="2"> 2 - Poor</option>
                <option value="3"> 3 - Average</option>
                <option value="4"> 4 - Good</option>
                <option value="5"> 5 - Excellent</option>
              </select>
            </label>
          </div>
        ))}
      </div>

        <br></br>
       <label>
        <input
          type="checkbox"
          checked={wantsProfessorRating}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setWantsProfessorRating(isChecked);

            if (!isChecked) {
              setSelectedProfessor(null);
              setProfessorAnswers({
                averageQ6: 0,
                averageQ7: 0,
                averageQ8: 0,
                averageQ9: 0,
                averageQ10: 0,
              });
            }
          }}
        />
        Would you like to also rate a professor?
      </label>
      <br></br>


      {wantsProfessorRating && (
        <div>
          <h4>Professor Rating</h4>

          <label>
            Select Professor:
            <select
              value={selectedProfessor?._id ?? ""}
              onChange={(e) => {
                const selectedId = e.target.value;

                if (!selectedId) {
                  setSelectedProfessor(null);
                  resetProfessorAnswers();
                  return;
                }

                const matchedProfessor =
                  professors.find((prof) => prof._id === selectedId) ?? null;

                setSelectedProfessor(matchedProfessor);
              }}
            >
              <option value="">Select a professor</option>

              {professors.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.First_Name} {prof.Last_Name}
                </option>
              ))}
            </select>
          </label>

          <h4>Professor Rating Questions</h4>

          {Object.entries(PROFESSOR_QUESTIONS).map(([key, questionText]) => (
            <div key={key}>
              <label>
                {questionText}
                <select
                  value={professorAnswers[key as keyof typeof professorAnswers]}
                  onChange={(e) => {
                    setProfessorAnswers({
                      ...professorAnswers,
                      [key]: Number(e.target.value),
                    });
                  }}
                >
                  <option value="">Select a rating</option>
                  <option value="1"> 1 - Very Poor</option>
                  <option value="2"> 2 - Poor</option>
                  <option value="3"> 3 - Average</option>
                  <option value="4"> 4 - Good</option>
                  <option value="5"> 5 - Excellent</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
};

export default CreateRating;
