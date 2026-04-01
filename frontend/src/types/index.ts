
// Course interface, stores what's in a course
export interface Course {
  _id: string;
  Code: string;
  Title: string;
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
