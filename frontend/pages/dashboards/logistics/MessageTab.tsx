import React from 'react';
import { Plus, MoreHorizontal, Search, ChevronRight, Truck, CheckCircle2, Paperclip, Send, User } from 'lucide-react';

interface MessageTabProps {
    activeChatId: number | null;
    setActiveChatId: (id: number | null) => void;
    chatMessages: any[];
    chatInput: string;
    setChatInput: (input: string) => void;
    handleSendChatMessage: (e: React.FormEvent) => void;
    conversations: any[];
}

const MessageTab: React.FC<MessageTabProps> = ({
    activeChatId,
    setActiveChatId,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendChatMessage,
    conversations
}) => {
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] bg-white rounded-[32px] md:rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in duration-500 relative">
            {/* Conversations Sidebar */}
            <div className={`${activeChatId !== null ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[400px] border-r border-slate-100 flex-col shrink-0 bg-white`}>
                <div className="p-6 pb-2 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h3>
                        <div className="flex items-center gap-2">
                            <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><Plus size={20} /></button>
                            <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><MoreHorizontal size={20} /></button>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input className="w-full bg-slate-100/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600/20 transition-all border border-transparent" placeholder="Search chats..." />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar-hide">
                    {conversations.map((chat, idx) => (
                        <div key={idx} onClick={() => setActiveChatId(idx)} className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-slate-50/50 ${activeChatId === idx ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                            <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-100 overflow-hidden flex items-center justify-center text-slate-300 relative">
                                {chat.img ? (
                                    <img src={chat.img} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={24} />
                                )}
                                {chat.unread && <div className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{chat.name}</h4>
                                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{chat.time || 'Just now'}</span>
                                </div>
                                <p className={`text-[12px] font-medium truncate leading-tight ${chat.unread ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>
                                    {chat.lastMessage || 'Click to view conversation'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Chat Area */}
            <div className={`${activeChatId === null ? 'hidden md:flex' : 'flex'} flex-grow flex-col bg-[#F0F2F5] relative overflow-hidden`}>
                {activeChatId !== null && (
                    <div className="md:hidden absolute top-4 left-4 z-50">
                        <button
                            onClick={() => setActiveChatId(null)}
                            className="h-10 w-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-600 shadow-lg"
                        >
                            <ChevronRight size={24} className="rotate-180" />
                        </button>
                    </div>
                )}
                {activeChatId === null ? (
                    <div className="flex-grow flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="h-40 w-40 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mb-10 shadow-sm border border-white/20">
                            <Truck className="h-14 w-14 text-slate-300" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-light text-slate-700 mb-4 tracking-tight">Communications Hub</h2>
                        <p className="text-slate-500 font-normal text-sm max-w-sm">Manage communications with your drivers and shippers in one secure place.</p>
                    </div>
                ) : (
                    <>
                        <div className="h-20 bg-[#F0F2F5] px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                            <div className="flex items-center gap-4 pl-12 md:pl-0">
                                <div className="h-10 w-10 rounded-full bg-white overflow-hidden shadow-sm flex items-center justify-center text-slate-300">
                                    {conversations[activeChatId]?.img ? (
                                        <img src={conversations[activeChatId].img} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{conversations[activeChatId]?.name}</h4>
                                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="flex-grow p-6 md:p-10 space-y-4 overflow-y-auto flex flex-col scrollbar-hide">
                            <div className="flex justify-center mb-4">
                                <span className="bg-white/50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                            </div>
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.sender === 'me' ? 'bg-blue-600 text-white shadow-md rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'} p-4 rounded-2xl text-[13px] font-medium max-w-[80%] md:max-w-[70%] leading-relaxed`}>
                                        {msg.text}
                                        <div className="flex justify-end items-center gap-1 mt-2">
                                            <p className={`text-[9px] font-bold uppercase ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                                            {msg.sender === 'me' && <CheckCircle2 size={12} className="text-blue-300" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendChatMessage} className="bg-[#F0F2F5] px-6 py-4 flex items-center gap-4 shrink-0">
                            <button type="button" className="text-slate-500 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                            <div className="flex-grow bg-white rounded-xl flex items-center px-4 py-3 border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
                                <input
                                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-800 placeholder:text-slate-300"
                                    placeholder="Type a message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                />
                            </div>
                            <button type="submit" disabled={!chatInput.trim()} className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform"><Send size={20} /></button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageTab;
