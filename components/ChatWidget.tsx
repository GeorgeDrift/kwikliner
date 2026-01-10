import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Minus, Maximize2 } from 'lucide-react';
import { User } from '../types';
import { sendMessageToAssistant } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWidgetProps {
  user: User;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Hello ${user.name}! I'm your KwikLiner Assistant. How can I help you manage your ${user.role.toLowerCase()} operations today?`,
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToAssistant(user.id, user.role, input);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText || "I couldn't get a response. Please try again.",
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-[110] bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center space-x-3 border-4 border-white"
      >
        <MessageSquare className="h-7 w-7" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-sm whitespace-nowrap">
          Kwik Assistant
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-8 left-8 z-[110] bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 ${
        isMinimized ? 'h-20 w-80' : 'h-[600px] w-[400px]'
      }`}
    >
      {/* Header */}
      <div className="p-6 bg-slate-900 rounded-t-[40px] flex justify-between items-center text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Bot size={20} />
          </div>
          <div>
            <p className="text-sm font-black leading-tight">Kwik Assistant</p>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AI Logistics Expert</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    msg.sender === 'user' ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'
                  }`}>
                    {msg.sender === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-4 rounded-[24px] text-sm font-medium leading-relaxed ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-100' 
                    : 'bg-slate-50 text-slate-800 rounded-bl-none border border-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="flex items-end space-x-2">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[24px] rounded-bl-none border border-slate-100">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 border-t border-slate-50 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your fleet..."
                className="w-full pl-6 pr-16 py-4 bg-slate-50 rounded-[28px] text-sm font-bold border-2 border-transparent focus:border-blue-600 focus:bg-white transition-all outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-200 transition-all shadow-lg shadow-blue-200 active:scale-90"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
