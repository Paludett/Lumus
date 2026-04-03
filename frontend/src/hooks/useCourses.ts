import { useCallback, useEffect, useState } from 'react';
import { getCourses } from '../api/coursesApi';
import type { Course, UseCoursesReturn } from '../types';

export default function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [reloadCounter, setReloadCounter] = useState<number>(0);

  const refetch = useCallback((): void => {
    setReloadCounter((value) => value + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async (): Promise<void> => {
      setLoading(true);
      setError('');

      try {
        const response = await getCourses();
        if (!isMounted) return;
        setCourses(Array.isArray(response) ? response : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os cursos.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [reloadCounter]);

  return { courses, loading, error, refetch };
}