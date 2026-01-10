
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { 
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText, 
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search, 
  Bell, Plus, ShoppingCart, DollarSign, Tag, Store, Ruler, Square,
  Trash2, TrendingUp, Package, Filter, MoreHorizontal, ArrowUpRight,
  CreditCard, PieChart, Image as ImageIcon, X, Edit, Save, CheckCircle2,
  ChevronRight
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';
import { api } from '../../services/api';

interface HardwareOwnerDashboardProps { user: User; }

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  seller: string;
}

const HardwareOwnerDashboard: React.FC<HardwareOwnerDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  
  // Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | 'success'>('review');

  // Inventory State (Now fetching from API)
  const [inventory, setInventory] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const products = await api.getProducts();
    // Separate My Inventory vs Marketplace based on logged in user ID or ownerId logic
    // For this demo, we match ownerId to user.id (or the demo-id)
    setAllProducts(products);
    setInventory(products.filter((p: any) => p.ownerId === user.id));
  };

  const deleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this item from your inventory?')) {
      await api.deleteProduct(id);
      loadProducts();
    }
  };

  const saveEditedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await api.updateProduct(editingItem.id, editingItem);
    setEditingItem(null);
    loadProducts();
  };

  const handleAddProduct = async (productData: any) => {
    await api.createProduct({
        ...productData,
        ownerId: user.id,
        seller: user.companyName || user.name
    });
    setIsAddProductOpen(false);
    loadProducts();
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity: 1, 
        seller: product.seller 
      }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const parsePrice = (priceStr: string) => Number(priceStr.replace(/[^0-9]/g, ''));
  const cartTotal = cart.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);

  const menuSections = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
      { id: 'Inventory', icon: <Box size={20} />, label: 'Manage Products' },
      { id: 'Market', icon: <Store size={20} />, label: 'Kwik Shop' },
    ],
    ANALYTICS: [
      { id: 'Report', icon: <FileText size={20} />, label: 'Revenue Report' },
      { id: 'Message', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: 5 },
    ],
    OTHERS: [
      { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
      { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
    ]
  };

  const [newItemData, setNewItemData] = useState({ name: '', price: '', stock: '', category: 'Hardware' });

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return (
          <div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Net Sales</h3>
               <div className="flex items-end space-x-4 mb-8">
                  <span className="text-4xl font-black tracking-tighter">MWK 3.2M</span>
                  <span className="text-xs font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">↑ 18%</span>
               </div>
               <div className="h-24 w-full flex items-end space-x-1">
                  {[50, 40, 60, 30, 85, 45, 90, 60, 40].map((h, i) => (
                    <div key={i} className="flex-grow bg-indigo-50 rounded-t-lg group-hover:bg-indigo-600 transition-all" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Inventory Health</h3>
               <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-4xl font-black tracking-tighter">{inventory.reduce((acc, item) => acc + Number(item.stock), 0)}</span>
                  <span className="text-xs font-black text-slate-300">Total Units</span>
               </div>
               <div className="flex space-x-1.5 h-16 items-end">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < 19 ? 'bg-[#14B8A6]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 20 + 80}%` }}></div>
                  ))}
               </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-[#6366F1] p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveMenu('Inventory')}>
               <div className="relative z-10">
                  <h3 className="text-2xl font-black leading-tight mb-4">List Equipment</h3>
                  <p className="text-indigo-100 text-sm font-medium mb-8">Post spare parts to the global shop.</p>
                  <button className="w-full py-4 bg-white text-[#6366F1] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                     <Plus size={20} /> Add New SKU
                  </button>
               </div>
               <Box size={200} className="absolute right-[-60px] top-[-60px] opacity-[0.05]" />
            </div>
            
            {/* ... keeping other widgets ... */}
          </div>
        );

      case 'Inventory':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Manage Inventory</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Add, remove, and track your shop's stock levels.</p>
              </div>
              <button 
                onClick={() => setIsAddProductOpen(true)}
                className="bg-[#6366F1] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory.map((item) => (
                <div key={item.id} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group relative">
                   <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        {item.category}
                      </div>
                   </div>
                   <div className="px-2 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                      </div>
                      <p className="text-lg font-black text-indigo-600 mb-4">MWK {Number(item.price).toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                           <Box size={14} /> {item.stock} in stock
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setEditingItem(item)}
                                className="h-10 w-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                            >
                                <Edit size={16} />
                            </button>
                            <button 
                                onClick={() => deleteItem(item.id)}
                                className="h-10 w-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Market':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
             <div className="fixed bottom-32 right-8 z-[60]">
               <button onClick={() => setIsCartOpen(true)} className="h-20 w-20 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
                  <ShoppingCart size={32} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center border-4 border-white">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
               </button>
             </div>

             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Kwik Shop</h3>
                  <p className="text-slate-500 font-medium mt-1 text-sm">Browse the global marketplace. Edit your items, buy from others.</p>
               </div>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                 <input className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#6366F1] outline-none w-64 shadow-sm" placeholder="Search Marketplace..." />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.map((item, idx) => {
                  const isMine = item.ownerId === user.id;
                  return (
                    <div key={idx} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                       <div className="h-40 rounded-[24px] overflow-hidden mb-4 relative">
                          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                          <div className={`absolute bottom-2 right-2 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${isMine ? 'bg-blue-600 text-white' : 'bg-slate-900/80 text-white'}`}>
                             {isMine ? 'Your Product' : item.seller || 'External Seller'}
                          </div>
                       </div>
                       <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                          <div>
                              <h4 className="font-black text-slate-900 text-sm mb-1">{item.name}</h4>
                              <p className="text-lg font-black text-[#6366F1]">MWK {Number(item.price).toLocaleString()}</p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-50">
                              {isMine ? (
                                  <button 
                                      onClick={() => setEditingItem(item)}
                                      className="w-full py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                  >
                                      <Edit size={14} /> Edit Listing
                                  </button>
                              ) : (
                                  <button 
                                      onClick={() => addToCart(item)}
                                      className="w-full py-3 bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                                  >
                                      <ShoppingCart size={14} /> Add to Cart
                                  </button>
                              )}
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen text-slate-900 overflow-hidden font-['Inter']">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 shrink-0 h-screen">
        <div className="flex items-center justify-center mb-10 px-2">
           <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Store className="text-white" size={24} />
           </div>
        </div>
        <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(menuSections).map(([title, items]) => (
            <div key={title}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => item.id === 'Logout' ? navigate('/') : setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                      activeMenu === item.id 
                      ? 'bg-[#6366F1]/5 text-[#6366F1]' 
                      : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={activeMenu === item.id ? 'text-[#6366F1]' : 'text-slate-400 group-hover:text-slate-600'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    {item.badge && <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto p-8 pt-16 relative">
        {renderContent()}

        {/* Add Product Modal */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddProductOpen(false)}></div>
            <div className="bg-white rounded-[40px] p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add New Product</h3>
                <button onClick={() => setIsAddProductOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="h-40 w-full rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50/10 transition-all cursor-pointer">
                   <ImageIcon size={32} />
                   <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Image</span>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                   <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="e.g. Solar Generator" 
                     value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (MWK)</label>
                     <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="0.00" 
                      value={newItemData.price} onChange={e => setNewItemData({...newItemData, price: e.target.value})}
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                     <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="0" 
                      value={newItemData.stock} onChange={e => setNewItemData({...newItemData, stock: e.target.value})}
                     />
                  </div>
                </div>
                <button 
                  onClick={() => handleAddProduct({
                    name: newItemData.name,
                    price: newItemData.price,
                    stock: newItemData.stock,
                    category: newItemData.category,
                    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
                  })}
                  className="w-full py-5 bg-[#6366F1] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 mt-4"
                >
                  Publish Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingItem(null)}></div>
            <div className="bg-white rounded-[40px] p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit Product</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={saveEditedItem} className="space-y-6">
                <div className="h-40 w-full rounded-[32px] overflow-hidden relative">
                    <img src={editingItem.image} className="w-full h-full object-cover" alt="Product" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="bg-white/90 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Change Image</span>
                    </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                   <input 
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                     <input 
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                     <input 
                        value={editingItem.stock}
                        onChange={(e) => setEditingItem({...editingItem, stock: e.target.value})}
                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" 
                     />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-[#6366F1] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 mt-4 flex items-center justify-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Shopping Cart Drawer */}
        {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
           <div className="w-full max-w-md bg-white h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                    <ShoppingCart className="text-blue-600" /> {isCheckingOut ? 'Checkout' : 'Your KwikCart'}
                 </h2>
                 <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }} className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                    <X size={20} />
                 </button>
              </div>

              {!isCheckingOut ? (
                <div className="flex-grow flex flex-col overflow-hidden">
                   <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                           <ShoppingCart size={80} strokeWidth={1} />
                           <p className="font-black uppercase tracking-widest text-xs">Your cart is empty</p>
                        </div>
                      ) : (
                        cart.map(item => (
                          <div key={item.id} className="flex gap-4 group">
                             <div className="h-24 w-24 rounded-2xl bg-slate-50 overflow-hidden shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                             </div>
                             <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                   <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                                   <button onClick={() => removeCartItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                                <p className="text-blue-600 font-black text-sm mt-1">MWK {Number(item.price).toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seller: {item.seller}</p>
                                <div className="flex items-center gap-3 mt-4">
                                   <button onClick={() => updateCartQty(item.id, -1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">-</button>
                                   <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                   <button onClick={() => updateCartQty(item.id, 1)} className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all">+</button>
                                </div>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                   {cart.length > 0 && (
                     <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-slate-500">Subtotal</span>
                           <span className="text-lg font-black text-slate-900">MWK {cartTotal.toLocaleString()}</span>
                        </div>
                        <button onClick={() => setIsCheckingOut(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                           Proceed to Payment
                        </button>
                     </div>
                   )}
                </div>
              ) : (
                <div className="flex-grow flex flex-col overflow-hidden">
                   <div className="flex-grow overflow-y-auto p-8 space-y-10 scrollbar-hide">
                      {checkoutStep === 'review' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                           <div>
                              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Order Summary</h3>
                              <div className="space-y-3">
                                 {cart.map(item => (
                                   <div key={item.id} className="flex justify-between text-sm">
                                      <span className="font-bold text-slate-700">{item.name} (x{item.quantity})</span>
                                      <span className="font-black text-slate-900">MWK {(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
                                   </div>
                                 ))}
                                 <div className="h-px bg-slate-200 my-4"></div>
                                 <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-500">Processing Fee</span>
                                    <span className="font-black text-slate-900">MWK 1,500</span>
                                 </div>
                                 <div className="flex justify-between text-xl pt-4">
                                    <span className="font-black text-slate-900">Total</span>
                                    <span className="font-black text-blue-600">MWK {(cartTotal + 1500).toLocaleString()}</span>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => setCheckoutStep('payment')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                              Select Payment Method
                           </button>
                        </div>
                      )}
                      {checkoutStep === 'payment' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Method</h3>
                           <div className="space-y-4">
                              <button onClick={() => setCheckoutStep('success')} className="w-full flex items-center justify-between p-6 bg-white border-2 border-blue-600 rounded-[32px] shadow-xl group hover:-translate-y-1 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CreditCard size={24} /></div>
                                    <div className="text-left">
                                       <p className="font-black text-slate-900 text-sm leading-none">KwikWallet Balance</p>
                                       <p className="text-[10px] font-bold text-blue-400 mt-1">Available: MWK 1.2M</p>
                                    </div>
                                 </div>
                                 <ChevronRight size={20} className="text-blue-600" />
                              </button>
                           </div>
                           <button onClick={() => setCheckoutStep('review')} className="w-full py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">Go Back</button>
                        </div>
                      )}
                      {checkoutStep === 'success' && (
                        <div className="space-y-10 animate-in zoom-in-95 duration-500 text-center flex flex-col items-center py-20">
                           <div className="h-24 w-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-100 mb-8 scale-110">
                              <CheckCircle2 size={48} />
                           </div>
                           <div>
                              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Payment Confirmed</h3>
                              <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-widest">Transaction ID: #KW-8821102</p>
                           </div>
                           <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); setCart([]); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                              Back to KwikShop
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
        )}

        <ChatWidget user={user} />
      </main>
    </div>
  );
};

export default HardwareOwnerDashboard;
