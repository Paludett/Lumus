import type { Course, Module } from '../types';

export function formatDuration(durationText: unknown): string {
  if (typeof durationText !== 'string' || !durationText.trim()) {
    return 'Sem duração';
  }

  return durationText;
}

export function formatRating(rating: unknown): string {
  if (rating === null || rating === undefined || rating === '') {
    return 'N/A';
  }

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating)) {
    return String(rating);
  }

  return numericRating.toFixed(1);
}

export function getOrderedModules(course: Pick<Course, 'modules'> | null | undefined): Module[] {
  const modules = Array.isArray(course?.modules) ? course.modules : [];

  return [...modules].sort((firstModule, secondModule) => {
    const firstPosition = firstModule?.position ?? 0;
    const secondPosition = secondModule?.position ?? 0;

    return firstPosition - secondPosition;
  });
}