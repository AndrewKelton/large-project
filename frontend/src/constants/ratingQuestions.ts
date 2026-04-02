// Static rating questions — these are course/professor agnostic and fixed on the frontend.
// Q1–Q5 are course-level; Q6–Q10 are professor-level.
// Scores are 1–5 (1 = Strongly Disagree / Very Poor, 5 = Strongly Agree / Excellent).

export const COURSE_QUESTIONS: Record<keyof { averageQ1: number; averageQ2: number; averageQ3: number; averageQ4: number; averageQ5: number }, string> = {
  averageQ1: 'Overall, how would you rate this course? (1–5)',
  averageQ2: 'How would you rate the course difficulty? (1–5)',
  averageQ3: 'How manageable was the course workload? (1–5)',
  averageQ4: 'Do you feel that you will retain the material from the course? (1–5)',
  averageQ5: 'Would you recommend this course to others? (1–5)',
};

export const PROFESSOR_QUESTIONS: Record<keyof { averageQ6: number; averageQ7: number; averageQ8: number; averageQ9: number; averageQ10: number }, string> = {
  averageQ6: 'Overall, how would you rate this professor? (1–5)',
  averageQ7: 'How clearly did the professor explain the material? (1–5)',
  averageQ8: 'How available was the professor outside of class? (1–5)',
  averageQ9: 'How fairly did the professor grade assignments? (1–5)',
  averageQ10: 'Would you recommend this professor to others? (1–5)',
};
