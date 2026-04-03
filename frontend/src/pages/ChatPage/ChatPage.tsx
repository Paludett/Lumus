import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoArrowBack, IoSend, IoTrashOutline } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';
import logoLumus from '../../assets/logo.png';
import { sendChatMessage } from '../../api/chatApi';
import type { ChatMessage, ChatPageProps } from '../../types';

const createMessageId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const initialMessage: ChatMessage = {
  id: createMessageId(),
  text: 'Olá! Sou o Lumus. Ficou com alguma dúvida sobre o conteúdo do curso?',
  sender: 'ai',
};

export default function ChatPage({ onBack }: ChatPageProps): ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearHistory = (): void => {
    if (window.confirm('Deseja apagar todo o histórico da conversa?')) {
      setMessages([initialMessage]);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { id: createMessageId(), text: input, sender: 'user' };
    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage.text);
      const aiText = typeof response?.response === 'string' ? response.response : 'Sem resposta no momento.';
      setMessages((previousMessages) => [...previousMessages, { id: createMessageId(), text: aiText, sender: 'ai' }]);
    } catch {
      setMessages((previousMessages) => [...previousMessages, { id: createMessageId(), text: 'Erro de conexão.', sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="icon-button back-button" onClick={onBack}>
          <IoArrowBack size={24} />
        </button>
        <div className="logo-container">
          <img src={logoLumus} alt="Lumus" className="logo-image" />
        </div>
        <button className="icon-button" onClick={clearHistory} title="Limpar conversa">
          <IoTrashOutline size={22} color="#4a4a4a" />
        </button>
      </div>

      <div className="chat-box">
        {messages.map((message) => (
          <div key={message.id} className={`message-wrapper ${message.sender}`}>
            {message.sender === 'ai' && (
              <div className="avatar-circle">
                <FaRobot size={20} color="#5a4a00" />
              </div>
            )}
            <div className={`message ${message.sender}`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper ai">
            <div className="avatar-circle">
              <FaRobot size={20} />
            </div>
            <div className="message ai typing">Digitando...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Digite sua pergunta..."
          disabled={loading}
        />
        <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}