import type { ApiErrorPayload } from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const maybePayload = payload as Record<string, unknown>;
  return typeof maybePayload.detail === 'string' || typeof maybePayload.message === 'string';
}

function getErrorMessage(payload: unknown, status: number): string {
  if (isApiErrorPayload(payload) && typeof payload.detail === 'string') {
    return payload.detail;
  }

  if (isApiErrorPayload(payload) && typeof payload.message === 'string') {
    return payload.message;
  }

  return `Erro na requisição (${status}).`;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const hasJsonBody = contentType.includes('application/json');
  const payload = hasJsonBody ? await response.json() : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload as T;
}

export { BASE_URL };