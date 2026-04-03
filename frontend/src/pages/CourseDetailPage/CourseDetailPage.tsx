import { IoArrowBack, IoTimeOutline } from 'react-icons/io5';
import { FaRobot, FaStar } from 'react-icons/fa6';
import type { ReactElement } from 'react';
import useCourse from '../../hooks/useCourse';
import { formatDuration, formatRating, getOrderedModules } from '../../utils/formatters';
import type { CourseDetailPageProps } from '../../types';

export default function CourseDetailPage({ courseId, onBack, onOpenChat }: CourseDetailPageProps): ReactElement {
  const { course, loading, error } = useCourse(courseId);

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <button className="icon-button back-button" onClick={onBack}>
            <IoArrowBack size={24} />
          </button>
          <span style={{ fontWeight: '600', color: '#444' }}>Detalhes</span>
          <div style={{ width: 24 }}></div>
        </div>
        <div className="sections-list">
          <p style={{ color: '#666' }}>Carregando detalhes do curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container">
        <div className="header">
          <button className="icon-button back-button" onClick={onBack}>
            <IoArrowBack size={24} />
          </button>
          <span style={{ fontWeight: '600', color: '#444' }}>Detalhes</span>
          <div style={{ width: 24 }}></div>
        </div>
        <div className="sections-list">
          <p style={{ color: '#B00020' }}>Erro ao carregar o curso: {error || 'Curso não encontrado.'}</p>
        </div>
      </div>
    );
  }

  const modules = getOrderedModules(course);

  return (
    <div className="container">
      <div className="header">
        <button className="icon-button back-button" onClick={onBack}>
          <IoArrowBack size={24} />
        </button>
        <span style={{ fontWeight: '600', color: '#444' }}>Detalhes</span>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="course-hero">
        <span className="hero-tag">{course.category}</span>
        <h1 className="hero-title">{course.title}</h1>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <IoTimeOutline /> {formatDuration(course.duration_text)}
          </div>
          <div className="hero-stat-item">
            <FaStar color="#f5c518" /> {formatRating(course.rating)}
          </div>
        </div>
      </div>

      <div className="sections-list">
        <div className="section-label">Conteúdo do Curso</div>

        {modules.map((module, index) => (
          <div key={module.id} className="section-card">
            <div className="section-header">
              <div className="section-number">{index + 1}</div>
              <div className="section-title">{module.title}</div>
            </div>
            <p className="section-text">{module.content}</p>
          </div>
        ))}

        <button className="action-button" onClick={onOpenChat}>
          <FaRobot size={18} />
          Tirar dúvida com Lumus
        </button>
        <div style={{ height: 20 }}></div>
      </div>
    </div>
  );
}