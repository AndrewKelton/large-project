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

  const handleSubmit = () => {
    setErrorMessage("");
    setSuccessMessage("");

    // Check course answers
    const courseValues = Object.values(courseAnswers);
    if (courseValues.some((val) => val === 0)) {
      setErrorMessage("Please answer all course questions.");
      return;
    }

    // If professor rating is enabled
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

    setSuccessMessage("Rating Submitted! Thank you for your feedback!");

    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div>
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

        {Object.entries(COURSE_QUESTIONS).map(([key, questionText]) => (
          <div key={key}>
            <label>
              {questionText} (1–5)
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
                {questionText} (1–5)
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

      <button type="button" onClick={handleSubmit}>
        Submit Rating
      </button>
    </div>
  );
};

export default CreateRating;
