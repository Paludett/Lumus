import { request } from './httpClient';
import type { ChatRequest, ChatResponse } from '../types';

export async function sendChatMessage(message: ChatRequest['message']): Promise<ChatResponse> {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}