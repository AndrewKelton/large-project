// Static rating questions — these are course/professor agnostic and fixed on the frontend.
// Q1–Q5 are course-level; Q6–Q10 are professor-level.
// Scores are 1–5 (1 = Strongly Disagree / Very Poor, 5 = Strongly Agree / Excellent).

export const COURSE_QUESTIONS: Record<keyof { averageQ1: number; averageQ2: number; averageQ3: number; averageQ4: number; averageQ5: number }, string> = {
  averageQ1: 'Overall, how would you rate this course?',
  averageQ2: 'How would you rate the course difficulty?',
  averageQ3: 'How manageable was the course workload?',
  averageQ4: 'Do you feel that you will retain the material from the course?',
  averageQ5: 'Would you recommend this course to others?',
};

export const PROFESSOR_QUESTIONS: Record<keyof { averageQ6: number; averageQ7: number; averageQ8: number; averageQ9: number; averageQ10: number }, string> = {
  averageQ6: 'Overall, how would you rate this professor?',
  averageQ7: 'How clearly did the professor explain the material?',
  averageQ8: 'How available was the professor outside of class?',
  averageQ9: 'How fairly did the professor grade assignments?',
  averageQ10: 'Would you recommend this professor to others?',
};
