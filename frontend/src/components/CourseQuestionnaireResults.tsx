import { useState, useEffect, useCallback, useRef } from 'react';
import type { Course, CourseQuestionnaireResults, QuestionnaireEntry } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

const PAGE_SIZE = 3;
const SEARCH_DEBOUNCE_MS = 400;

// Decode the userId from the stored JWT
function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

interface CourseQuestionnaireResultsProps {
  course: Course | null;
}

function CourseQuestionnaireResultsComponent({ course }: CourseQuestionnaireResultsProps) {
  const [results, setResults] = useState<CourseQuestionnaireResults | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QuestionnaireEntry[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch the full questionnaire results
  const fetchResults = useCallback(async () => {
    if (course === null) {
      setResults(null);
      return;
    }
    try {
      const response = await fetch(`/api/fetchCO/course/${course._id}`);
      if (!response.ok) {
        setResults(null);
        return;
      }
      const data: CourseQuestionnaireResults = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error(error);
      setResults(null);
    }
  }, [course]);

  // Search questionnaires by query
  const runSearch = useCallback(async (query: string) => {
    if (!course || !query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(`/api/searchCO/search?query=${encodeURIComponent(query.trim())}&courseId=${course._id}`);
      if (!response.ok) {
        setSearchResults([]);
        return;
      }
      const data = await response.json();
      setSearchResults(data.results ?? []);
    } catch (error: any) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [course]);

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(0);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!value.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      runSearch(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    setCurrentPage(0);
    setSearchQuery('');
    setSearchResults(null);
    fetchResults();
  }, [fetchResults]);

  // Fetch the logged-in user's answered questionnaire IDs
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const fetchAnswered = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/answered-questionnaires`);
        if (!response.ok) return;
        const data = await response.json();
        setAnsweredIds(new Set(data.answeredQuestionnaires.map((id: any) => id.toString())));
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchAnswered();
  }, []);

  if (!course) {
    return null;
  }

  // Use search results when a query is active, otherwise use all results
  const isSearchActive = searchQuery.trim().length > 0;
  const questionnaires = isSearchActive
    ? (searchResults ?? [])
    : (results?.Questionnaires ?? []);
  const totalPages = Math.ceil(questionnaires.length / PAGE_SIZE);
  const pageSlice = questionnaires.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div>
      <h4>Course Questionnaire Results</h4>

      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="Search course questions…"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '0.4rem 0.6rem',
            fontSize: '0.9rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {isSearching && <p style={{ fontSize: '0.85rem', color: '#666' }}>Searching…</p>}

      {!isSearching && isSearchActive && questionnaires.length === 0 && (
        <p style={{ fontSize: '0.85rem', color: '#888' }}>No questions match &ldquo;{searchQuery}&rdquo;</p>
      )}

      {!isSearching && questionnaires.length > 0 && (
        <>
          {pageSlice.map((entry, idx) => (
            <QuestionnaireEntryCard
              key={idx}
              entry={entry}
              courseId={course._id}
              professorId={null}
              alreadyAnswered={answeredIds.has(entry._id)}
              onAnswered={fetchResults}
            />
          ))}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 0}
                aria-label="Previous page"
                style={{ fontSize: '1.2rem', padding: '0.25rem 0.75rem', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
              >
                &#8592;
              </button>
              <span style={{ fontSize: '0.9rem' }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
                style={{ fontSize: '1.2rem', padding: '0.25rem 0.75rem', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
              >
                &#8594;
              </button>
            </div>
          )}
        </>
      )}

      {!isSearching && !isSearchActive && questionnaires.length === 0 && (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default CourseQuestionnaireResultsComponent;
