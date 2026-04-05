import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle.tsx";
import WelcomeMessage from "../components/WelcomeMessage.tsx";
import Logout from "../components/Logout.tsx";
import CourseDropdown from "../components/CourseDropdown.tsx";
import ProfessorDropdown from "../components/ProfessorDropdown.tsx";
import CourseSummary from "../components/CourseSummary.tsx";
import ProfessorSummary from "../components/ProfessorSummary.tsx";
import CourseQuestionnaireResults from "../components/CourseQuestionnaireResults.tsx";
import ProfessorQuestionnaireResults from "../components/ProfessorQuestionnaireResults.tsx";
import type { Course, Professor } from "../types/index.ts";

const HomePage = () => {
  const token = localStorage.getItem("token"); // save token
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null,
  );
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [rateError, setRateError] = useState("");
  const navigate = useNavigate();

  const handleRateClick = async () => {
    if (!token) {
      setLoginPrompt(true);
      setRateError("");
      return;
    }

    setLoginPrompt(false);
    setRateError("");

    if (!selectedCourse) {
      setRateError("Please select a course first.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setRateError("You must be logged in to create a rating.");
      return;
    }

    try {
      const response = await fetch(`/api/ratings/course/${selectedCourse._id}`);
      const data = await response.json();

      if (!response.ok) {
        setRateError(data.message || "Failed to check existing ratings.");
        return;
      }

      const alreadyRated = data.some(
        (rating: any) => rating.User?.toString() === userId,
      );

      if (alreadyRated) {
        setRateError("You have already rated this course.");
        return;
      }

      navigate("/create-rating", {
        state: {
          course: selectedCourse,
          professor: selectedProfessor,
        },
      });
    } catch (error) {
      console.error("Error checking ratings:", error);
      setRateError("An error occurred while checking your rating.");
    }
  };

  const handleQuestionnaireClick = () => {
    if (!token) {
      setLoginPrompt(true);
      return;
    }
    setLoginPrompt(false);
    navigate("/create-questionnaire", {
      state: {
        course: selectedCourse,
        professor: selectedProfessor,
      },
    });
  };

  return (
    <div>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        {!token && <Link to="/auth">Login / Sign Up</Link>}
        {token && <Logout />}
      </div>

      <PageTitle />
      <WelcomeMessage />

      <CourseDropdown onSelect={(course) => setSelectedCourse(course)} />
      <ProfessorDropdown
        onSelect={(professor) => setSelectedProfessor(professor)}
      />

      {selectedCourse && (
        <div>
          <button onClick={handleRateClick}>
            {selectedProfessor
              ? `Rate ${selectedCourse.Code} with ${selectedProfessor.First_Name} ${selectedProfessor.Last_Name}`
              : `Rate ${selectedCourse.Code}`}
          </button>
        </div>
      )}

      {selectedCourse && (
        <div>
          <button onClick={handleQuestionnaireClick}>
            {selectedProfessor
              ? `Create Questionnaire for ${selectedCourse.Code} with ${selectedProfessor.First_Name} ${selectedProfessor.Last_Name}`
              : `Create Questionnaire for ${selectedCourse.Code}`}
          </button>
        </div>
      )}

      {loginPrompt && (
        <p>
          Please <Link to="/auth">log in</Link> to create a rating or
          questionnaire.
        </p>
      )}

      {rateError && <p style={{ color: "red" }}>{rateError}</p>}

      <CourseSummary course={selectedCourse} />
      <CourseQuestionnaireResults course={selectedCourse} />

      <ProfessorSummary professor={selectedProfessor} course={selectedCourse} />
      <ProfessorQuestionnaireResults
        course={selectedCourse}
        professor={selectedProfessor}
      />
    </div>
  );
};
export default HomePage;
