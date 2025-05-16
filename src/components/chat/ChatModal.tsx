import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: number;
}

export default function ChatModal({ isOpen, onClose, recipientName, recipientId }: ChatModalProps) {
  const [messages, setMessages] = useState<Array<{ text: string; isSent: boolean }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const token = Cookies.get('auth_token');
    if (!token) {
      toast.error('Please login to chat');
      onClose();
      return;
    }

    const newSocket = io('http://localhost:3001', {
      headers: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat');
      newSocket.emit('join chat', recipientId);
    });

    newSocket.on('chat message', (msg: string) => {
      setMessages(prev => [...prev, { text: msg, isSent: false }]);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [isOpen, onClose, recipientId]);

  const handleSendMessage = () => {
    if (!socket || !newMessage.trim()) return;
    socket.emit('chat message', newMessage);
    setMessages(prev => [...prev, { text: newMessage, isSent: true }]);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl mx-4">
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
              {recipientName[0].toUpperCase()}
            </div>
            <h3 className="font-semibold text-white">{recipientName}</h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'} mb-4`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  msg.isSent ? 'bg-blue-600 text-white' : 'bg-white shadow-sm text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
