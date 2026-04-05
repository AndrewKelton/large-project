
// Course interface, stores what's in a course
export interface Course {
  _id: string;
  Code: string;
  Name: string;
}

// Professor interface, stores what's in a professor
export interface Professor {
  _id: string;
  First_Name: string;
  Last_Name: string;
}

// CourseRatings interface, matches GET /api/fetchRatings/course/:courseId response
export interface CourseRatings {
  totalRatings: number;
  averageQ1: number;
  averageQ2: number;
  averageQ3: number;
  averageQ4: number;
  averageQ5: number;
}

// ProfessorRatings interface, matches GET /api/fetchRatings/course/:courseId/professor/:professorId response
export interface ProfessorRatings {
  totalProfessorRatings: number;
  averageQ6: number;
  averageQ7: number;
  averageQ8: number;
  averageQ9: number;
  averageQ10: number;
}

// A single questionnaire entry as returned by the API
export interface QuestionnaireEntry {
  _id: string;
  Question: string;
  Options: {
    A: string | null;
    B: string | null;
    C: string | null;
    D: string | null;
  };
  Counts: {
    A: number | null;
    B: number | null;
    C: number | null;
    D: number | null;
  };
}

// CourseQuestionnaireResults interface, matches GET /api/fetchCO/course/:courseId
export interface CourseQuestionnaireResults {
  Course: Course;
  Questionnaires: QuestionnaireEntry[];
}

// ProfessorQuestionnaireResults interface, matches GET /api/fetchCAP/course/:courseId/professor/:professorId
export interface ProfessorQuestionnaireResults {
  Course: Course;
  Professor: Professor;
  Questionnaires: QuestionnaireEntry[];
}
