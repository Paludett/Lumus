import { request } from './httpClient';
import type { Course, CourseCreate, CourseUpdate } from '../types';

export async function getCourses(): Promise<Course[]> {
  return request<Course[]>('/courses');
}

export async function getCourse(id: number): Promise<Course> {
  return request<Course>(`/courses/${id}`);
}

export async function createCourse(data: CourseCreate): Promise<Course> {
  return request<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: number, data: CourseUpdate): Promise<Course> {
  return request<Course>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(id: number): Promise<void> {
  await request<unknown>(`/courses/${id}`, {
    method: 'DELETE',
  });
}