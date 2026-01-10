
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, 
  Settings, LogOut, Search, 
  Bell, Navigation, AlertCircle, DollarSign,
  Timer, ShoppingCart, MapPin, ClipboardList, CheckCircle2,
  X, Trash2, CreditCard, Smartphone, ChevronRight
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';

interface DriverDashboardProps { user: User; }

interface CartItem {
  id: string;
  name: string;
  price: number;
  priceStr: string;
  img: string;
  quantity: number;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [marketFilter, setMarketFilter] = useState('All');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'success'>('review');

  const marketItems = [
    { id: 'd1', name: 'Long-Life Tires (Pair)', cat: 'Hardware', price: 180000, priceStr: 'MWK 180K', img: 'https://images.unsplash.com/photo-1549438345-4202860d5b12?auto=format&fit=crop&q=80&w=400' },
    { id: 'd2', name: 'GPS Navigator Pro', cat: 'Tech', price: 55000, priceStr: 'MWK 55K', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400' },
    { id: 'd3', name: 'Universal Spanner Set', cat: 'Tools', price: 25000, priceStr: 'MWK 25K', img: 'https://images.unsplash.com/photo-1586864387917-f5a0ae8d44c0?auto=format&fit=crop&q=80&w=400' },
    { id: 'd4', name: 'Heavy Duty Oil Filter', cat: 'Spares', price: 12000, priceStr: 'MWK 12K', img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=400' },
  ];

  const addToCart = (item: typeof marketItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) return { ...i, quantity: Math.max(1, i.quantity + delta) };
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const menuSections = {
    MAIN: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
      { id: 'Market', icon: <ShoppingCart size={20} />, label: 'Marketplace' },
      { id: 'Mission', icon: <Navigation size={20} />, label: 'Active Trip' },
      { id: 'History', icon: <Activity size={20} />, label: 'My Logbook' },
      { id: 'Earnings', icon: <DollarSign size={20} />, label: 'Wallet' },
    ],
    SAFETY: [
      { id: 'SOS', icon: <AlertCircle size={20} />, label: 'Panic Button' },
    ],
    OTHERS: [
      { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
      { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
    ]
  };

  const renderContent = () => {
    switch(activeMenu) {
      case 'Market':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
             {/* Floating Cart Badge */}
             <div className="fixed bottom-32 right-8 z-[60]">
               <button onClick={() => setIsCartOpen(true)} className="h-20 w-20 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
                  <ShoppingCart size={32} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-white">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
               </button>
            </div>

             <div className="max-w-4xl mx-auto bg-white p-3 rounded-[32px] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2">
              <div className="flex-grow flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="h-6 w-6 text-indigo-600 mr-4" />
                <input type="text" placeholder="Find spares, tires, or logistics gear..." className="w-full outline-none text-slate-800 font-bold placeholder:text-slate-300 text-lg" />
              </div>
              <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm uppercase tracking-widest">
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {['All', 'Hardware', 'Spares', 'Tools', 'Tech'].map(cat => (
                <button key={cat} onClick={() => setMarketFilter(cat)} className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${marketFilter === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {marketItems.filter(i => marketFilter === 'All' || i.cat === marketFilter).map((item, idx) => (
                <div key={idx} className="bg-white rounded-[32px] p-3 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
                   <div className="h-48 rounded-[24px] overflow-hidden mb-6 relative">
                      <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.cat}</div>
                   </div>
                   <div className="px-3 pb-3">
                      <h4 className="font-black text-slate-900 mb-1">{item.name}</h4>
                      <p className="text-xl font-black text-indigo-600 mb-6">{item.priceStr}</p>
                      <button onClick={() => addToCart(item)} className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all">Buy Now</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Overview':
      default:
        return (
          <div className="grid grid-cols-12 gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="col-span-12 lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Trip Earnings</h3>
               <div className="flex items-end space-x-4 mb-8"><span className="text-4xl font-black tracking-tighter">MWK 320K</span><span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 12%</span></div>
               <div className="h-24 w-full flex items-end space-x-1">{[30, 50, 40, 70, 45, 80, 60].map((h, i) => (<div key={i} className="flex-1 bg-indigo-50 rounded-t-lg hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>))}</div>
            </div>
            <div className="col-span-12 lg:col-span-8 bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col md:flex-row justify-between h-full">
                  <div className="mb-6 md:mb-0"><h3 className="text-2xl font-black leading-tight mb-4">Manual Manifest #KW-900224</h3><p className="text-indigo-100 text-sm font-medium mb-8">Lilongwe Hub → Blantyre Port</p><div className="flex items-center gap-6"><div className="flex items-center gap-2"><Box size={18} className="text-indigo-400" /><span className="text-sm font-bold">Cargo: Fertilizer</span></div><div className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400" /><span className="text-sm font-bold">Route: M1 Highway</span></div></div></div>
                  <div className="flex items-end"><button onClick={() => setActiveMenu('Mission')} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Update Progress</button></div>
               </div>
               <Truck size={200} className="absolute right-[-40px] bottom-[-40px] opacity-[0.05]" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 font-['Inter'] relative">
      
      {/* KWIKCART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
           <div className="w-full max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3"><ShoppingCart className="text-indigo-600" /> {isCheckingOut ? 'Checkout' : 'Your KwikCart'}</h2>
                 <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><X size={20} /></button>
              </div>

              {!isCheckingOut ? (
                <div className="flex-grow flex flex-col overflow-hidden">
                   <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                      {cart.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30"><ShoppingCart size={80} strokeWidth={1} /><p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p></div>) : (
                        cart.map(item => (
                          <div key={item.id} className="flex gap-4 group">
                             <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0"><img src={item.img} className="w-full h-full object-cover" alt={item.name} /></div>
                             <div className="flex-grow">
                                <div className="flex justify-between items-start"><h4 className="font-black text-slate-900 text-sm">{item.name}</h4><button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button></div>
                                <p className="text-indigo-600 font-black text-sm mt-1">{item.priceStr}</p>
                                <div className="flex items-center gap-3 mt-4"><button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">-</button><span className="text-sm font-black w-4 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">+</button></div>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                   {cart.length > 0 && (
                     <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center"><span className="text-sm font-bold text-slate-500">Subtotal</span><span className="text-lg font-black text-slate-900">MWK {cartTotal.toLocaleString()}</span></div>
                        <button onClick={() => setIsCheckingOut(true)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Proceed to Payment</button>
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex-grow flex flex-col overflow-hidden">
                   <div className="flex-grow overflow-y-auto p-8 space-y-10 scrollbar-hide">
                      {checkoutStep === 'review' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                           <div><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Order Summary</h3><div className="space-y-3">
                              {cart.map(item => (<div key={item.id} className="flex justify-between text-sm"><span className="font-bold text-slate-700">{item.name} (x{item.quantity})</span><span className="font-black text-slate-900">MWK {(item.price * item.quantity).toLocaleString()}</span></div>))}
                              <div className="h-px bg-slate-200 my-4"></div>
                              <div className="flex justify-between text-xl pt-4"><span className="font-black text-slate-900">Total</span><span className="font-black text-indigo-600">MWK {cartTotal.toLocaleString()}</span></div>
                           </div></div>
                           <button onClick={() => setCheckoutStep('payment')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Pay Now</button>
                        </div>
                      )}
                      {checkoutStep === 'payment' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Method</h3>
                           <div className="space-y-4">
                              <button onClick={() => setCheckoutStep('success')} className="w-full flex items-center justify-between p-6 bg-white border-2 border-indigo-600 rounded-[32px] shadow-xl group hover:-translate-y-1 transition-all"><div className="flex items-center gap-4"><div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><CreditCard size={24} /></div><div className="text-left"><p className="font-black text-slate-900 text-sm leading-none">Wallet Balance</p><p className="text-[10px] font-bold text-indigo-400 mt-1">MWK 45,200</p></div></div><ChevronRight size={20} className="text-indigo-600" /></button>
                              <button onClick={() => setCheckoutStep('success')} className="w-full flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] group hover:bg-white hover:border-indigo-600 transition-all"><div className="flex items-center gap-4"><div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-400"><Smartphone size={24} /></div><div className="text-left"><p className="font-black text-slate-900 text-sm leading-none">Mobile Money</p></div></div><ChevronRight size={20} className="text-slate-300" /></button>
                           </div>
                        </div>
                      )}
                      {checkoutStep === 'success' && (
                        <div className="space-y-10 animate-in zoom-in-95 duration-500 text-center flex flex-col items-center py-20">
                           <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl mb-8 scale-110"><CheckCircle2 size={48} /></div>
                           <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Order Placed</h3>
                           <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); setCart([]); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Done</button>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 shrink-0 h-screen sticky top-0 overflow-hidden">
        <div className="flex items-center justify-center mb-14 shrink-0 px-2"><div className="bg-indigo-600 p-3 rounded-[20px] shadow-xl"><Truck className="text-white" size={28} /></div></div>
        <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(menuSections).map(([title, items]) => (
            <div key={title}>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title}</p>
              <div className="space-y-2">
                {items.map(item => (
                  <button key={item.id} onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)} className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-x-2' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className="flex items-center space-x-5"><span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'}>{item.icon}</span><span className="text-sm font-black tracking-tight">{item.label}</span></div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-10 border-t border-slate-50 mt-10 shrink-0">
           <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
              <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" /></div>
              <div className="min-w-0"><p className="text-xs font-black text-slate-900 truncate">{user.name}</p><p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Verified Driver</p></div>
           </div>
        </div>
      </aside>

      <main className="flex-grow min-w-0 flex flex-col p-10 lg:p-14 overflow-visible pt-16">
        <div className="flex-grow pb-20 overflow-y-auto scrollbar-hide">
           {renderContent()}
        </div>
      </main>
      <ChatWidget user={user} />
    </div>
  );
};

export default DriverDashboard;
