import { FaRobot } from 'react-icons/fa6';
import type { ReactElement } from 'react';
import logoLumus from '../../assets/logo.png';
import CourseCard from '../../components/CourseCard/CourseCard';
import useCourses from '../../hooks/useCourses';
import type { CoursesPageProps } from '../../types';

export default function CoursesPage({ onOpenChat, onSelectCourse }: CoursesPageProps): ReactElement {
  const { courses, loading, error, refetch } = useCourses();

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container" style={{ justifyContent: 'flex-start' }}>
          <img src={logoLumus} alt="Lumus" className="logo-image" style={{ height: '40px', marginLeft: '0' }} />
          <span style={{ marginLeft: '10px', fontWeight: '600', color: '#444', fontSize: '18px' }}>Academy</span>
        </div>
      </div>

      <div className="courses-list">
        <h2 style={{ margin: '10px 0 5px 0', fontSize: '22px', color: '#333' }}>Seus Cursos</h2>
        <p style={{ margin: '0 0 20px 0', color: '#888', fontSize: '14px' }}>Toque em um curso para ver os detalhes.</p>

        {loading && <p style={{ color: '#666' }}>Carregando cursos...</p>}

        {!loading && error && (
          <div>
            <p style={{ color: '#B00020', marginBottom: '10px' }}>Erro ao carregar cursos: {error}</p>
            <button className="action-button" onClick={refetch}>Tentar novamente</button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <p style={{ color: '#666' }}>Nenhum curso disponível no momento.</p>
        )}

        {!loading && !error &&
          courses.map((course) => (
            <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
          ))}
      </div>

      <button className="fab-chat" onClick={onOpenChat}>
        <FaRobot />
      </button>
    </div>
  );
}