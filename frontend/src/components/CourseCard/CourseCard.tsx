import { IoBookOutline, IoTimeOutline } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa6';
import type { ReactElement } from 'react';
import { formatDuration } from '../../utils/formatters';
import type { CourseCardProps } from '../../types';

export default function CourseCard({ course, onSelect }: CourseCardProps): ReactElement {
  const modulesCount = Array.isArray(course?.modules) ? course.modules.length : 0;

  return (
    <button
      type="button"
      className="course-card"
      onClick={() => onSelect(course.id)}
      aria-label={`Abrir curso ${course.title}`}
    >
      <div className="course-header">
        <span className="course-tag">{course.category}</span>
        <FaStar color="#EEDD5B" size={14} />
      </div>
      <h3 className="course-title">{course.title}</h3>
      <p className="course-desc">{course.description}</p>
      <div className="course-footer">
        <div className="footer-item">
          <IoTimeOutline size={16} /> {formatDuration(course.duration_text)}
        </div>
        <div className="footer-item">
          <IoBookOutline size={16} /> {modulesCount} Módulos
        </div>
      </div>
    </button>
  );
}