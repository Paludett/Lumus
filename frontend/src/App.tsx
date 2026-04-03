import './App.css';
import { useState } from 'react';
import type { ReactElement } from 'react';
import ChatPage from './pages/ChatPage/ChatPage';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage';
import CoursesPage from './pages/CoursesPage/CoursesPage';

// --- APP PRINCIPAL (Gerenciador de Telas) ---
type Screen = 'list' | 'details' | 'chat';

function App(): ReactElement {
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Funções de navegação
  const handleOpenCourse = (courseId: number): void => {
    setSelectedCourseId(courseId);
    setCurrentScreen('details');
  };

  const handleBackToHome = (): void => {
    setSelectedCourseId(null);
    setCurrentScreen('list');
  };

  const handleOpenChat = (): void => {
    setCurrentScreen('chat');
  };

  if (currentScreen === 'chat') {
    const handleBack = selectedCourseId ? () => setCurrentScreen('details') : handleBackToHome;
    return <ChatPage onBack={handleBack} />;
  }

  if (currentScreen === 'details') {
    return (
      <CourseDetailPage
        courseId={selectedCourseId}
        onBack={handleBackToHome} 
        onOpenChat={handleOpenChat}
      />
    );
  }

  return <CoursesPage onOpenChat={handleOpenChat} onSelectCourse={handleOpenCourse} />;
}

export default App;