import React from 'react';
import { Search, Plus, MoreHorizontal, CheckCircle2, Truck, Lock, ChevronRight, Paperclip, Send } from 'lucide-react';

interface MessageTabProps {
    activeChatId: number | null;
    setActiveChatId: (id: number | null) => void;
    chatMessages: any[];
    chatInput: string;
    setChatInput: (input: string) => void;
    handleSendChatMessage: (e: React.FormEvent) => void;
}

const MessageTab: React.FC<MessageTabProps> = ({
    activeChatId,
    setActiveChatId,
    chatMessages,
    chatInput,
    setChatInput,
    handleSendChatMessage
}) => {
    return (
        <div className="flex h-[calc(100vh-10rem)] md:h-[calc(100vh-10rem)] bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in duration-500 relative">
            {/* Conversations Sidebar (Left) */}
            <div className={`${activeChatId !== null ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[400px] border-r border-slate-100 flex-col shrink-0 bg-white`}>
                {/* Sidebar Header */}
                <div className="p-6 pb-2 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h3>
                        <div className="flex items-center gap-2">
                            <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                <Plus size={20} />
                            </button>
                            <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Search Bar - Precise Pill Shape */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input className="w-full bg-slate-100/80 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600/20 transition-all border border-transparent" placeholder="Search or start new chat" />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-grow overflow-y-auto scrollbar-hide">
                    {[
                        { id: 0, name: 'Musa Banda', last: 'Shipment manifest #900224 is confirmed.', time: '7:03 pm', unread: true, verified: true },
                        { id: 1, name: '+265 881 52 24 74', last: 'Payment details received, thanks!', time: '7:01 pm', unread: false, verified: false },
                        { id: 2, name: 'Dunamis Adoro', last: 'ETA for the fertilizer load is 2pm.', time: '5:44 pm', unread: true, verified: true },
                        { id: 3, name: 'Ridex Technologies', last: 'Order #OD-550 has been dispatched.', time: '4:12 pm', unread: false, verified: true },
                        { id: 4, name: '_iam Cryptic', last: 'Is the truck available for Salima route?', time: '3:52 pm', unread: false, verified: false },
                        { id: 5, name: 'John Banda', last: 'Copy that, manifest attached.', time: '3:37 pm', unread: false, verified: false },
                        { id: 6, name: 'KwikIntel', last: 'Automated fleet report for May 24th.', time: '3:06 pm', unread: true, verified: true, isMe: true },
                    ].map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors relative border-b border-slate-50/50 ${activeChatId === chat.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                        >
                            <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} alt="avatar" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{chat.name}</h4>
                                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{chat.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    {chat.verified && (
                                        <span className="shrink-0 flex items-center text-blue-500">
                                            <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                                            <CheckCircle2 size={12} className="-ml-2.5" />
                                        </span>
                                    )}
                                    <p className="text-[12px] font-medium text-slate-500 truncate leading-tight">
                                        {chat.isMe && <span className="text-blue-600 mr-1 italic">You:</span>}
                                        {chat.last}
                                    </p>
                                </div>
                            </div>
                            {chat.unread && !chat.isMe && activeChatId !== chat.id && (
                                <div className="absolute right-6 bottom-5 h-2 w-2 bg-blue-600 rounded-full shadow-sm shadow-blue-200"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area (Right) */}
            <div className={`${activeChatId === null ? 'hidden md:flex' : 'flex'} flex-grow flex flex-col bg-[#F0F2F5] relative overflow-hidden`}>
                {activeChatId === null ? (
                    /* High-Fidelity Splash Screen (Empty State) */
                    <div className="flex-grow flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700">
                        <div className="h-40 w-40 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/20 mb-10">
                            <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center shadow-inner">
                                <Truck className="h-14 w-14 text-slate-300" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-light text-slate-700 mb-4 tracking-tight">KwikLiner for Web</h2>
                        <p className="text-slate-500 font-normal text-sm max-w-sm leading-relaxed mb-1">
                            Send and receive messages without keeping your phone online.
                        </p>
                        <p className="text-slate-400 font-normal text-sm max-w-sm leading-relaxed">
                            Use KwikLiner on up to 4 linked devices at the same time.
                        </p>

                        {/* Encrypted Footer */}
                        <div className="absolute bottom-12 flex items-center gap-2 text-slate-400 font-medium text-[11px] uppercase tracking-widest opacity-60">
                            <Lock size={12} /> Your personal messages are end-to-end encrypted
                        </div>
                    </div>
                ) : (
                    /* Active Chat Redesign */
                    <>
                        {/* Chat Header */}
                        <div className="h-16 bg-[#F0F2F5] px-6 flex items-center justify-between border-b border-slate-200 shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveChatId(null)} className="md:hidden h-10 w-10 flex items-center justify-center text-slate-500">
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                                <div className="h-10 w-10 rounded-full bg-white overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${['Musa Banda', 'Isaac Ngoma', 'Dunamis Adoro', 'Ridex', 'Cryptic', 'John', 'KwikIntel'][activeChatId]}`} alt="avatar" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none truncate max-w-[120px] sm:max-w-none">
                                        {['Musa Banda', 'Isaac Ngoma', 'Dunamis Adoro', 'Ridex Technologies', '_iam Cryptic', 'John Banda', 'KwikIntel'][activeChatId]}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-5 text-slate-500">
                                <Search size={18} className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:block" />
                                <MoreHorizontal size={20} className="cursor-pointer hover:text-blue-600 transition-colors" />
                            </div>
                        </div>

                        {/* Messages List Area */}
                        <div className="flex-grow p-10 space-y-4 overflow-y-auto flex flex-col scrollbar-hide bg-[#F0F2F5]">
                            <div className="flex justify-center mb-8">
                                <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Today</span>
                            </div>

                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.sender === 'me' ? 'bg-blue-600 text-white shadow-md rounded-tr-none' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'} p-4 rounded-2xl text-[13px] font-bold max-w-[70%] leading-relaxed`}>
                                        {msg.text}
                                        <div className="flex justify-end items-center gap-1 mt-2">
                                            <p className={`text-[9px] font-bold uppercase ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                                            {msg.sender === 'me' && <CheckCircle2 size={12} className="text-blue-300" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Area (Pill-like Input) */}
                        <form onSubmit={handleSendChatMessage} className="bg-[#F0F2F5] px-6 py-4 flex items-center gap-4 shrink-0">
                            <button type="button" className="text-slate-500 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                            <div className="flex-grow bg-white rounded-xl flex items-center px-4 py-2 border border-slate-200 shadow-sm">
                                <input
                                    className="w-full bg-transparent text-sm font-semibold outline-none py-1.5 text-slate-800 placeholder:text-slate-300"
                                    placeholder="Type a message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                />
                            </div>
                            <button type="submit" disabled={!chatInput.trim()} className="h-11 w-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50">
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageTab;
