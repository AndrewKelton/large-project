import { useState, useEffect } from 'react';
import type { Course } from '../types/index.ts';

function CourseDropdown() {

  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadCourses = async() => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCoursesList(data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []); // empty array = run once when component mounts

  function handleSelectedCourse(e: any) : void {
    setSelectedCourseId(e.target.value);
  }

  // get full selected course
  const selectedCourse = coursesList.find(course => course._id === selectedCourseId) ?? null;

  return (
    <div>
      {loading && <p>Loading...</p>}

      <h3>Course Dropdown</h3>

      <select value={selectedCourseId} onChange={handleSelectedCourse}>
        <option value="">Select Course</option>
        {coursesList.map(course => (
          <option key={course._id} value={course._id}>
            {course.Code} - {course.Title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseDropdown;
