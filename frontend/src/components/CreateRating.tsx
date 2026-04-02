import { useState } from "react";
import type { Course, Professor } from "../types/index.ts";
import {COURSE_QUESTIONS, PROFESSOR_QUESTIONS,} from "../constants/ratingQuestions.ts";

interface CreateRatingProps {
  course: Course;
  professor?: Professor | null;
}

const CreateRating = ({ course, professor = null }: CreateRatingProps) => {
  const [wantsProfessorRating, setWantsProfessorRating] = useState(!!professor);

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(professor);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
          <select value="">
            <option value="">Selection</option>
            {professor && (
              <option value={`${professor.First_Name} ${professor.Last_Name}`}>
                {professor.First_Name} {professor.Last_Name}
              </option>
            )}
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

    <button type="button">Submit Rating</button>
  </div>
);
};

export default CreateRating;