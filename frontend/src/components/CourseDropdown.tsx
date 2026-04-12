import { useState, useEffect } from 'react';
import type { Course } from '../types/index.ts';
import './Dropdown.css';

interface CourseDropdownProps {
  onSelect: (course: Course | null) => void;
}

function CourseDropdown({ onSelect }: CourseDropdownProps) {

  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
    const id = e.target.value;
    setSelectedCourseId(id);

    // update course selected
    const course = coursesList.find(c => c._id === id) ?? null;
    onSelect(course);
  }

  return (
    <div className="dropdown-wrapper">
      {loading && <p>Loading...</p>}

      <label className="dropdown-label">Course Dropdown</label>

      <select className="dropdown-select" value={selectedCourseId} onChange={handleSelectedCourse}>
        <option value="">Select Course</option>
        {coursesList.map(course => (
          <option key={course._id} value={course._id}>
            {course.Code} - {course.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseDropdown;
