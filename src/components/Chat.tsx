'use client'
import { useState, useEffect } from 'react';
import { WebSocketMessage } from '../../services/types';

interface ChatProps {
  ws: WebSocket | null;
}

export default function Chat({ ws }: ChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event: MessageEvent) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages(prev => [...prev, `${data.userId}: ${data.message}`]);
        }
      };
    }
  }, [ws]);

  const sendMessage = () => {
    if (ws && input) {
      ws.send(JSON.stringify({ type: 'chat', message: input }));
      setInput('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Group Chat</h2>
      <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">{msg}</p>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}