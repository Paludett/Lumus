export interface Module {
  id: number
  title: string
  content: string
  position: number
  created_at: string
  updated_at: string
}

export interface ModuleIn {
  title: string
  content: string
}

export interface Course {
  id: number
  title: string
  description: string
  duration_text: string
  category: string
  price: number | null
  rating: number | null
  modules: Module[]
  created_at: string
  updated_at: string
}

export interface CourseCreate {
  title: string
  description: string
  duration_text: string
  category: string
  price?: number | null
  rating?: number | null
  modules?: ModuleIn[]
}

export interface CourseUpdate extends Partial<CourseCreate> {}

export interface ApiErrorPayload {
  detail?: string
  message?: string
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
}

export type ChatSender = 'ai' | 'user'

export interface ChatMessage {
  id: string
  text: string
  sender: ChatSender
}

export interface CoursesPageProps {
  onOpenChat: () => void
  onSelectCourse: (courseId: number) => void
}

export interface CourseDetailPageProps {
  courseId: number | null
  onBack: () => void
  onOpenChat: () => void
}

export interface ChatPageProps {
  onBack: () => void
}

export interface CourseCardProps {
  course: Course
  onSelect: (courseId: number) => void
}

export interface UseCoursesReturn {
  courses: Course[]
  loading: boolean
  error: string
  refetch: () => void
}

export interface UseCourseReturn {
  course: Course | null
  loading: boolean
  error: string
}
