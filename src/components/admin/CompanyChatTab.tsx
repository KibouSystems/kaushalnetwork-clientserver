/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  CheckCircle,
  Clock,
  ChevronDown,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Smile,
  Image,
  X,
  Info,
} from 'lucide-react';

// Mock data for demonstration
const CONTACTS = [
  {
    id: 1,
    name: 'Acme Corporation',
    avatar: null,
    message: 'I wanted to discuss our recent proposal',
    time: '2 min ago',
    unread: 3,
    online: true,
    verified: true,
  },
  {
    id: 2,
    name: 'TechnoGlobe Inc.',
    avatar: null,
    message: 'Thanks for your quick response!',
    time: '1 hour ago',
    unread: 0,
    online: true,
    verified: true,
  },
  {
    id: 3,
    name: 'InnovateSoft',
    avatar: null,
    message: 'When can we schedule a demo?',
    time: '2 hours ago',
    unread: 1,
    online: false,
    verified: false,
  },
  {
    id: 4,
    name: 'Global Ventures Ltd',
    avatar: null,
    message: 'Looking forward to our partnership',
    time: 'Yesterday',
    unread: 0,
    online: false,
    verified: true,
  },
  {
    id: 5,
    name: 'NextGen Solutions',
    avatar: null,
    message: 'Please send the technical specifications',
    time: 'Yesterday',
    unread: 0,
    online: false,
    verified: false,
  },
];

const MESSAGES = [
  {
    id: 1,
    text: "Hello! I'm interested in your services.",
    sender: 'them',
    time: '10:30 AM',
    status: 'read',
  },
  {
    id: 2,
    text: 'Hi there! Thank you for reaching out. How can I help you today?',
    sender: 'me',
    time: '10:32 AM',
    status: 'read',
  },
  {
    id: 3,
    text: 'I wanted to inquire about your pricing for enterprise solutions.',
    sender: 'them',
    time: '10:33 AM',
    status: 'read',
  },
  {
    id: 4,
    text: 'Of course! Our enterprise solutions start at $499/month. Would you like me to send over a detailed pricing sheet?',
    sender: 'me',
    time: '10:35 AM',
    status: 'sent',
  },
  {
    id: 5,
    text: 'That would be great! Please include information about the features included in each tier.',
    sender: 'them',
    time: '10:36 AM',
    status: 'read',
  },
  {
    id: 6,
    text: "I've just emailed the comprehensive pricing information to you. Let me know if you have any questions after reviewing it!",
    sender: 'me',
    time: '10:40 AM',
    status: 'sent',
  },
  {
    id: 7,
    text: "Thank you! I'll take a look and get back to you soon.",
    sender: 'them',
    time: '10:41 AM',
    status: 'read',
  },
];

const CompanyChatTab: React.FC = () => {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState(CONTACTS);
  const [messages, setMessages] = useState(MESSAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileContactsVisible, setIsMobileContactsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate message status change
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => (msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg))
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMobileContacts = () => {
    setIsMobileContactsVisible(!isMobileContactsVisible);
  };

  // Get active contact details
  const activeContactDetails = activeChat ? contacts.find(c => c.id === activeChat) : null;

  return (
    <div className="h-[calc(100vh-9rem)] max-h-[800px] flex flex-col bg-white rounded-xl overflow-hidden relative">
      {/* DEMO BANNER */}
      <div className="absolute top-0 left-0 w-full z-50">
        <div className="flex items-center justify-center bg-gradient-to-r from-yellow-100 to-yellow-50 border-b border-yellow-200 py-2 px-4 text-yellow-800 text-sm font-medium gap-2">
          <Info className="w-4 h-4 text-yellow-500" />
          <span>
            <span className="font-semibold">Demo Only:</span> Company chat is a preview and not
            functional yet. This feature is coming soon!
          </span>
        </div>
      </div>

      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between mt-10 sm:mt-0">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-lg"
            onClick={toggleMobileContacts}
          >
            {isMobileContactsVisible ? <X size={20} /> : <MessageSquare size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center">
            <MessageSquare size={20} className="mr-2 text-blue-600" />
            Company Chat
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Users size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Bell size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Contact List - Hidden on mobile when chat is active */}
        <AnimatePresence>
          {(isMobileContactsVisible ||
            !activeChat ||
            !window.matchMedia('(max-width: 768px)').matches) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="w-full md:w-80 h-full border-r border-gray-200 bg-white flex flex-col"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Contact List */}
              <div className="overflow-y-auto flex-1">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <motion.button
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      key={contact.id}
                      className={`w-full text-left px-3 py-3 border-b border-gray-100 flex items-start space-x-3 ${
                        activeChat === contact.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setActiveChat(contact.id);
                        if (window.matchMedia('(max-width: 768px)').matches) {
                          setIsMobileContactsVisible(false);
                        }
                      }}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-blue-500 to-indigo-600">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        {contact.online && (
                          <div className="absolute -right-0.5 -bottom-0.5 bg-green-500 border-2 border-white rounded-full w-3 h-3"></div>
                        )}
                        {contact.verified && (
                          <div className="absolute -right-0.5 top-0 bg-white rounded-full border border-white">
                            <CheckCircle size={10} className="text-blue-600" />
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 truncate pr-2">
                            {contact.name}
                          </h3>
                          <span className="text-xs text-gray-500">{contact.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{contact.message}</p>
                      </div>

                      {/* Unread Badge */}
                      {contact.unread > 0 && (
                        <div className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-8 px-4">
                    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No chats match your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Area */}
        <div
          className={`flex-1 flex flex-col ${!activeChat && !isMobileContactsVisible ? 'flex' : activeChat && !isMobileContactsVisible ? 'flex' : 'hidden md:flex'}`}
        >
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="py-3 px-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-3">
                  {/* Mobile back button */}
                  <button
                    className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg"
                    onClick={toggleMobileContacts}
                  >
                    <ChevronDown size={20} className="text-gray-600" />
                  </button>

                  {/* Contact Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-blue-500 to-indigo-600">
                      {activeContactDetails?.name.charAt(0).toUpperCase()}
                    </div>
                    {activeContactDetails?.online && (
                      <div className="absolute -right-0.5 -bottom-0.5 bg-green-500 border-2 border-white rounded-full w-3 h-3"></div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {activeContactDetails?.name}
                      {activeContactDetails?.verified && (
                        <CheckCircle size={14} className="ml-1 text-blue-600" />
                      )}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {activeContactDetails?.online ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <Video size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-white"
                id="messages-container"
              >
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'them' && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br from-blue-500 to-indigo-600 mr-2">
                        {activeContactDetails?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === 'me'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <div className="flex items-center mt-1 space-x-1">
                        <span className="text-xs text-gray-500">{msg.time}</span>
                        {msg.sender === 'me' &&
                          (msg.status === 'read' ? (
                            <CheckCircle size={12} className="text-blue-500" />
                          ) : msg.status === 'sent' ? (
                            <CheckCircle size={12} className="text-gray-400" />
                          ) : (
                            <Clock size={12} className="text-gray-400" />
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-end">
                  <div className="flex-1 mr-2 relative">
                    <textarea
                      placeholder="Type a message..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 resize-none"
                      style={{ maxHeight: '120px', minHeight: '40px' }}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      rows={1}
                    />
                    <button className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700">
                      <Smile size={18} />
                    </button>
                  </div>
                  <div className="flex">
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 mr-2">
                      <Paperclip size={20} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={`p-3 rounded-full ${
                        message.trim()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400'
                      } flex items-center justify-center`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                    <Image size={12} className="mr-1" /> Send Image
                  </button>
                  <button className="text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                    <Paperclip size={12} className="mr-1" /> Attach File
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Improved Empty state when no chat is selected
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md w-full">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <MessageSquare className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Company Chat (Demo)</h3>
                <p className="text-gray-600 mb-6">
                  This chat feature is a demo and will be available in a future update.
                  <br />
                  You will soon be able to communicate with your business partners here.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    disabled
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Find New Contacts
                  </button>
                  <span className="text-xs text-gray-400">Coming soon</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyChatTab;
