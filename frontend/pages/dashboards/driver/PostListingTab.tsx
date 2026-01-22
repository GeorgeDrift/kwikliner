import React from 'react';
import { ImageIcon, Plus, Zap } from 'lucide-react';

interface PostListingTabProps {
    handlePostAvailability: () => void;
}

const PostListingTab: React.FC<PostListingTabProps> = ({ handlePostAvailability }) => {
    return (
        <div className="max-w-[1920px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-center">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Broadcast Availability</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm sm:text-base">Let shippers find you by posting your current route and capacity.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-2xl dark:shadow-none space-y-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Hub</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all" placeholder="e.g. Lilongwe" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Headed To (Optional)</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all" placeholder="e.g. Blantyre" />
                    </div>
                    <div className="space-y-3 md:col-span-1">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Free Capacity (Tons)</label>
                        <input type="number" className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all" placeholder="e.g. 15" />
                    </div>
                    <div className="space-y-3 md:col-span-1">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Base Price (Trip)</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-900 rounded-[20px] sm:rounded-[28px] px-6 py-5 sm:py-6 font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 border border-transparent dark:border-slate-700 transition-all" placeholder="e.g. MWK 350,000" />
                    </div>

                    {/* Vehicle Image Gallery Selection */}
                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Vehicle Image Gallery (3 Images Required)</label>
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">Gallery Preview</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="group relative aspect-video bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all overflow-hidden">
                                    <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
                                        <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <ImageIcon size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Image {num}</span>
                                    </div>
                                    <div className="absolute top-2 right-2 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={handlePostAvailability} className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[24px] sm:rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-100 dark:shadow-none text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95">
                    <Zap size={18} fill="currentColor" /> Publish Availability
                </button>
            </div>
        </div>
    );
};

export default PostListingTab;
