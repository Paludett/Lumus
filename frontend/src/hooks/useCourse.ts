import { useEffect, useState } from 'react';
import { getCourse } from '../api/coursesApi';
import type { Course, UseCourseReturn } from '../types';

export default function useCourse(courseId: number | null): UseCourseReturn {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async (): Promise<void> => {
      if (!courseId) {
        setCourse(null);
        setLoading(false);
        setError('Curso inválido.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await getCourse(courseId);
        if (!isMounted) return;
        setCourse(response || null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o curso.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  return { course, loading, error };
}