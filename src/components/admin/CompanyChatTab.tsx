import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import {
  Search,
  MessageSquare,
  ChevronRight,
  User,
  Calendar,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatConversation {
  id: number;
  recipientName: string;
  recipientId: number;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const CompanyChatTab: React.FC = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      // Replace with actual endpoint once backend is ready
      const response = await axios.get('http://localhost:3000/api/v0/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // This is a placeholder. Replace with actual response once backend is implemented
      const mockConversations: ChatConversation[] = [
        {
          id: 1,
          recipientName: 'ABC Corporation',
          recipientId: 101,
          lastMessage: 'Hello, we would like to discuss the proposal',
          timestamp: new Date().toISOString(),
          unreadCount: 2,
        },
        {
          id: 2,
          recipientName: 'XYZ Industries',
          recipientId: 102,
          lastMessage: 'Thanks for your quick response',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          unreadCount: 0,
        },
        {
          id: 3,
          recipientName: 'Tech Innovators Ltd',
          recipientId: 103,
          lastMessage: 'We are interested in your services',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          unreadCount: 1,
        },
      ];

      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load chat conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      setLoadingMessages(true);
      const token = Cookies.get('auth_token');

      // Replace with actual endpoint once backend is ready
      // const response = await axios.get(`http://localhost:3000/api/v0/chat/messages/${conversationId}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Mock messages for now
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          senderId: 101,
          senderName: 'ABC Corporation',
          recipientId: 0, // Admin ID
          recipientName: 'Admin',
          content:
            'Hello, we would like to discuss the proposal for the upcoming project. Is someone available to chat?',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: true,
        },
        {
          id: 2,
          senderId: 0, // Admin ID
          senderName: 'Admin',
          recipientId: 101,
          recipientName: 'ABC Corporation',
          content:
            'Hi there! Yes, I am available. What specific aspects of the proposal would you like to discuss?',
          timestamp: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
          isRead: true,
        },
        {
          id: 3,
          senderId: 101,
          senderName: 'ABC Corporation',
          recipientId: 0,
          recipientName: 'Admin',
          content:
            'We have a few questions about the timeline and budget allocation. Can we schedule a call tomorrow?',
          timestamp: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
          isRead: false,
        },
        {
          id: 4,
          senderId: 101,
          senderName: 'ABC Corporation',
          recipientId: 0,
          recipientName: 'Admin',
          content:
            'Also, we would need some clarification on the deliverables mentioned in section 3.2',
          timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
          isRead: false,
        },
      ];

      // Filter messages based on the selected conversation
      const filteredMessages = mockMessages.filter(
        message =>
          (message.senderId === conversationId && message.recipientId === 0) ||
          (message.recipientId === conversationId && message.senderId === 0)
      );

      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load chat messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.recipientId);
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Chat Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="grid md:grid-cols-3 h-[600px]">
          {/* Conversation List */}
          <div className="md:col-span-1 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(600px-65px)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-gray-500 text-sm">Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredConversations.map(conversation => (
                    <li key={conversation.id}>
                      <button
                        onClick={() => handleConversationClick(conversation)}
                        className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 flex items-center ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="mr-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                            {conversation.recipientName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.recipientName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.timestamp), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="ml-2 bg-blue-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages View */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                        {selectedConversation.recipientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.recipientName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {selectedConversation.recipientId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded-full">
                        <User className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded-full">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                            message.senderId === 0
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-800'
                          }`}
                        >
                          <div className="text-sm mb-1">{message.content}</div>
                          <div className="flex items-center justify-end text-xs mt-1">
                            <Clock className="w-3 h-3 mr-1 opacity-70" />
                            <span className="opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {message.senderId === 0 && (
                              <span className="ml-1">
                                {message.isRead ? (
                                  <ArrowDownLeft className="w-3 h-3 text-blue-200" />
                                ) : (
                                  <ArrowUpRight className="w-3 h-3 text-blue-200" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No messages in this conversation</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      disabled
                    />
                    <button
                      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    This is a read-only view of the conversation
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a conversation</h3>
                <p className="text-gray-500 text-sm text-center max-w-md">
                  Choose a conversation from the list on the left to view the chat history
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyChatTab;
