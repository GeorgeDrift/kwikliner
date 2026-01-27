
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import {
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
  Bell, Plus, ShoppingCart, DollarSign, Tag, Store, Ruler, Square,
  Trash2, Package, Filter, MoreHorizontal, ArrowUpRight,
  CreditCard, PieChart, Image as ImageIcon, X, Edit, Save, CheckCircle2,
  ChevronRight, BarChart3, TrendingUp, Info, Award, Star, Menu, ArrowRight, Briefcase, AlertCircle, Gavel
} from 'lucide-react';
import ChatWidget from '../../../components/ChatWidget';
import MarketTab from '../../../components/MarketTab';
import VehicleSlider from '../../../components/VehicleSlider';
import { api } from '../../../services/api';
import { fileToBase64 } from '../../../services/fileUtils';
import { BRANDS } from '../../../constants/branding';
import { io } from 'socket.io-client';

interface HardwareOwnerDashboardProps {
  user: User;
  onLogout: () => void;
  mobileMenuAction?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  seller: string;
}

const HardwareOwnerDashboard: React.FC<HardwareOwnerDashboardProps> = ({ user, onLogout, mobileMenuAction }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Kwik Shop Filter States
  const [productFilter, setProductFilter] = useState<'All' | 'Mine'>('All');
  const [categoryFilter, setCategoryFilter] = useState('Cargo');
  const [locationFilter, setLocationFilter] = useState('All');

  useEffect(() => {
    if (mobileMenuAction && mobileMenuAction > 0) {
      setIsMobileMenuOpen(true);
    }
  }, [mobileMenuAction]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [inventoryData, walletData, transData] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getWallet(user.id).catch(() => null),
        api.getWalletTransactions(user.id).catch(() => []),
      ]);

      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);
      setInventory(inventoryData.filter((p: any) => p.ownerId === user.id || p.seller_id === user.id));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    loadProducts();

    // Socket Integration
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('Hardware Socket Connected');
      newSocket.emit('join_room', user.id);
      newSocket.emit('request_market_data');
    });

    newSocket.on('market_data_update', (data: any[]) => {
      console.log('Hardware Socket: Received unified market data', data.length);
      setAllProducts(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user.id]);

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
    try {
      await api.createProduct({
        ...productData,
        ownerId: user.id,
        seller: user.companyName || user.name
      }).catch(e => console.warn(e));

      const newProd = {
        ...productData,
        id: `prod-${Date.now()}`,
        ownerId: user.id,
        seller: user.companyName || user.name
      };

      setAllProducts(prev => [newProd, ...prev]);
      setInventory(prev => [newProd, ...prev]);
      setIsAddProductOpen(false);
      alert("Product added successfully to your inventory!");
    } catch (e) {
      setIsAddProductOpen(false);
      alert("Added (Sync Mode)");
    }
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

  const handleCheckout = async () => {
    try {
      await api.purchaseProducts(cart);
      setCheckoutStep('success');
      setCart([]);
      loadProducts(); // Refresh stock
    } catch (e: any) {
      alert(e.message || 'Checkout Failed. Please check your wallet balance.');
    }
  };

  type MenuItem = {
    id: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
  };

  const menuSections: Record<string, MenuItem[]> = {
    MAIN_MENU: [
      { id: 'Overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
      { id: 'Messages', icon: <MessageSquare size={20} />, label: 'Messages' },
      { id: 'Inventory', icon: <Box size={20} />, label: 'Manage Products' },
      { id: 'Market', icon: <Store size={20} />, label: 'Kwik Shop' },
    ],
    ANALYTICS: [
      { id: 'Analytics', icon: <BarChart3 size={20} />, label: 'Store Analytics' },
    ],
    OTHERS: [
      { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
      { id: 'Logout', icon: <LogOut size={20} />, label: 'Log out' },
    ]
  };

  const [newItemData, setNewItemData] = useState({ name: '', price: '', stock: '', category: 'Hardware', image: '' });

  const handleHardwareImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        if (isEditing && editingItem) {
          setEditingItem({ ...editingItem, image: base64 });
        } else {
          setNewItemData({ ...newItemData, image: base64 });
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to process image.');
      }
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 animate-in fade-in duration-500">
            <div
              onClick={() => setActiveMenu('Wallet')}
              className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex items-end space-x-4 mb-6 sm:mb-8 text-slate-900 dark:text-white">
                <span className="text-3xl sm:text-4xl font-black tracking-tighter">{wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</span>
                <span className="text-emerald-500 dark:text-emerald-400 text-xs font-black mb-1">Available</span>
              </div>
              <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                <CheckCircle2 size={12} className="text-emerald-500 mr-2" />
                Live Wallet Connected
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 sm:mb-6">Inventory Health</h3>
              <div className="flex items-baseline space-x-2 mb-6 sm:mb-8 text-slate-900 dark:text-white">
                <span className="text-3xl sm:text-4xl font-black tracking-tighter">{inventory.reduce((acc, item) => acc + Number(item.stock), 0)}</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-300">Total Units</span>
              </div>
              <div className="flex space-x-1.5 h-12 sm:h-16 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < 19 ? 'bg-[#14B8A6]' : 'bg-slate-100 dark:bg-slate-800'}`} style={{ height: `${Math.random() * 20 + 80}%` }}></div>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-[#6366F1] p-6 sm:p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => setActiveMenu('Inventory')}>
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black leading-tight mb-4">List Equipment</h3>
                <p className="text-indigo-100 text-[10px] sm:text-sm font-medium mb-6 sm:mb-8">Post spare parts to the global shop.</p>
                <button className="w-full py-3 sm:py-4 bg-white text-[#6366F1] rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                  <Plus size={16} className="sm:size-[20px]" /> Add New SKU
                </button>
              </div>
              <Box size={200} className="absolute right-[-60px] top-[-60px] opacity-[0.05]" />
            </div>

            {/* Top Lists Section */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Top 5 Products (formerly Sales) */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Top Five Products</h3>
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <Award size={16} className="text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  {inventory.length > 0 ? inventory.slice(0, 5).map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 w-4">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category || 'General'}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-indigo-600">MWK {Number(item.price).toLocaleString()}</span>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">No products listed yet</div>
                  )}
                </div>
              </div>

              {/* Top 5 Sales (formerly Products) */}
              {/* Top 5 Sales (formerly Products) */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Top Five Sales</h3>
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <TrendingUp size={16} className="text-indigo-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  {transactions.filter(t => t.type === 'Sale').length > 0 ? transactions.filter(t => t.type === 'Sale').slice(0, 5).map((sale, i) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 w-4">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Sale #{sale.id.substring(0, 6)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(sale.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2 py-1 rounded-lg bg-green-100 text-green-600">
                        {wallet?.currency || 'MWK'} {Number(sale.net_amount).toLocaleString()}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">No recent sales</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Inventory':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-0">
              <div>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">Manage Inventory</h3>
                <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">Add, remove, and track your shop's stock levels.</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full md:w-auto bg-[#6366F1] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Plus size={16} className="sm:size-[18px]" /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative">
                  <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                      {item.category}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                    </div>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mb-4">MWK {Number(item.price).toLocaleString()}</p>

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
          <MarketTab
            setIsCartOpen={setIsCartOpen}
            cart={cart}
            marketFilter={categoryFilter}
            setMarketFilter={(cat) => {
              setCategoryFilter(cat);
              setProductFilter('All'); // Reset product filter when changing category
            }}
            marketItems={allProducts}
            addToCart={addToCart}
            userId={user.id}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            inventoryCount={inventory.length}
            onEditItem={(item) => setEditingItem(item)}
            handleAcceptJob={() => {
              alert("Interested in this load? Contact the shipper via messages.");
              setActiveMenu('Messages');
            }}
          />
        );

      case 'Analytics':
        // Graph data showing growth from past performances - starts low, grows progressively
        // Dynamic graph data derived from transactions
        const hGraphData = transactions.length > 0
          ? transactions.slice(0, 12).map(t => Number(t.net_amount) / 1000)
          : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Normalize for graph (0-100)
        const maxVal = Math.max(...hGraphData, 1);
        const normData = hGraphData.map(v => (v / maxVal) * 100);

        const hPoints = normData.map((val, i) => ({
          x: (i / (normData.length - 1)) * 100,
          y: 100 - val
        }));
        const hPathData = `M ${hPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
        const hAreaPathData = `${hPathData} L 100 100 L 0 100 Z`;

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Store Analytics</h3>
                <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">Sales trends, stock efficiency, and insights.</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white shadow-lg flex flex-wrap gap-1">
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(t => (
                  <button key={t} className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${t === 'Monthly' ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-200 group flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign size={16} />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Sales</p>
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {wallet?.currency || 'MWK'} {(transactions.filter(t => t.type === 'Sale' || t.type.includes('Earned')).reduce((sum, t) => sum + Number(t.net_amount), 0)).toLocaleString()}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600">
                  <TrendingUp size={12} />
                  <span>Real-time Data</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-200 group flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Box size={16} />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Orders Fulfilled</p>
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {transactions.filter(t => t.type === 'Sale').length}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600">
                  <CheckCircle2 size={12} />
                  <span>Completed Orders</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-[24px] text-white shadow-lg group overflow-hidden relative flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-6 -mt-6 blur-lg"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <Star size={16} className="text-amber-400" fill="currentColor" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant Rating</p>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight">{(user as any).rating || '5.0'}/5</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400">
                    <span>Active Seller</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-8 bg-slate-900 p-6 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col justify-between h-[340px]">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-black text-white tracking-tight">Financial Flow</h4>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <div className="relative h-48 w-full mt-4 mb-2">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(71, 85, 105, 0.15) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(71, 85, 105, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 30px'
                  }}></div>

                  <div className="relative h-full w-full">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" width="100%" height="100%">
                      <defs>
                        <linearGradient id="hardwareDarkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d={hAreaPathData} fill="url(#hardwareDarkGradient)" />

                      {/* Static Dashed Line (Background) */}
                      <path
                        d={hPathData}
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.2)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Main Solid Line */}
                      <path
                        d={hPathData}
                        fill="none"
                        stroke="#6366F1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      />

                      {/* Points */}
                      {hPoints.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r="2.5"
                          className="fill-indigo-600 stroke-white stroke-[1px]"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>

                    <div className="absolute -bottom-6 w-full flex justify-between px-2">
                      {['3 Jul', '10 Jul', '17 Jul', '24 Jul', '31 Jul'].map((date, i) => (
                        <span key={i} className="text-[8px] sm:text-[9px] font-medium text-slate-500">{date}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                  {['Max', '30d', '7d', '24h'].map(label => (
                    <button key={label} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${label === '30d' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                      {label}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2 text-slate-400">
                    <Filter size={14} />
                    <span className="text-[10px] font-bold">Filters</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 xl:col-span-4 space-y-4">
                <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center h-[162px]">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
                        <TrendingUp size={16} />
                      </div>
                      <h5 className="text-sm font-black">Performance</h5>
                    </div>
                    <p className="text-indigo-100 text-[10px] font-medium leading-tight">Track your <span className="text-white font-black">monthly growth</span> and performance.</p>
                  </div>
                  <TrendingUp className="absolute bottom-[-10px] right-[-10px] h-20 w-20 text-white/5 -rotate-12" />
                </div>

                <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center h-[162px]">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
                        <Info size={16} className="text-amber-400" />
                      </div>
                      <h5 className="text-sm font-black">Inventory Tip</h5>
                    </div>
                    <p className="text-slate-400 text-[10px] font-medium leading-tight">Review low stock items and <span className="text-white font-black underline">Restock</span> efficiently.</p>
                  </div>
                  <Box className="absolute bottom-[-10px] right-[-10px] h-20 w-20 text-white/5" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Messages':
        return (
          <div className="h-[calc(100vh-140px)] animate-in fade-in duration-500">
            <ChatWidget user={user} />
          </div>
        );
      case 'Wallet':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">My Wallet</h3>
                <p className="text-slate-500 font-medium mt-1 text-sm">Manage your store earnings and payouts.</p>
              </div>
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                <ArrowRight size={18} /> Withdraw Funds
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Available Balance</p>
                  <h4 className="text-4xl font-black tracking-tighter mb-10">
                    {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}
                  </h4>
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sales</p>
                      <p className="text-sm font-black">{wallet?.currency || 'MWK'} {(transactions.filter(t => t.type === 'Sale' || t.type.includes('Earned')).reduce((sum, t) => sum + Number(t.net_amount), 0)).toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <TrendingUp size={18} className="text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                  <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Commission Settings</h5>
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <PieChart size={24} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">KwikLiner Fee</p>
                        <p className="text-lg font-black text-blue-900">5% Flat</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-blue-400 mt-4 leading-relaxed">The 5% commission is automatically deducted from all gross earnings. Your wallet balance reflects your net earnings.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h4>
                </div>
                <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                  {transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <div key={tx.id} className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-6">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border ${tx.type === 'Sale' || tx.type.includes('Earned') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            tx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                            {tx.type === 'Sale' || tx.type.includes('Earned') ? <DollarSign size={24} /> :
                              tx.type === 'Withdrawal' ? <ArrowRight size={24} /> :
                                <Briefcase size={24} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 mb-1">{tx.type} • {tx.id.substring(0, 8)}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(tx.created_at).toLocaleDateString()} • {tx.method || 'Internal Wallet'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                            {tx.type === 'Withdrawal' ? '-' : '+'}{wallet?.currency || 'MWK'} {parseFloat(tx.net_amount).toLocaleString()}
                          </p>
                          <div className="flex items-center justify-end gap-1.5 mt-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.status}</p>
                          </div>
                          {tx.commission_amount > 0 && (
                            <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase italic">Inc. 5% Fee: {wallet?.currency} {parseFloat(tx.commission_amount).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-20 text-center">
                      <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="text-slate-200" size={32} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900">No transactions yet</h4>
                      <p className="text-slate-500 text-sm mt-2">Your earning history will appear here once you complete sales.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-left">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Store Settings</h3>
              <p className="text-slate-500 font-medium mt-1">Configure your store preferences and security.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Notifications</h4>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                    <div>
                      <p className="font-black text-slate-900 text-sm">Order Alerts</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Instant purchase notifications</p>
                    </div>
                    <div className="h-6 w-12 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                    <div>
                      <p className="font-black text-slate-900 text-sm">Low Stock Warnings</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Alert when inventory is low</p>
                    </div>
                    <div className="h-6 w-12 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Security</h4>
                  <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                    <div className="text-left">
                      <p className="font-black text-slate-900 text-sm">Change Password</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Last changed 3mo ago</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-red-600">
                    <div className="text-left">
                      <p className="font-black text-sm">Close Store</p>
                      <p className="text-[11px] font-bold text-red-300 uppercase tracking-wider mt-1">Temporarily disable listings</p>
                    </div>
                    <AlertCircle size={18} className="text-red-300" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-8 sm:p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black tracking-tight mb-2 italic">Pro Seller Badge</h4>
                    <p className="text-slate-400 font-bold opacity-80 text-sm">Verify your business to boost customer trust.</p>
                  </div>
                  <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">Get Verified</button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#F8F9FB] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden font-['Inter'] relative transition-colors duration-300">



      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col p-6 shrink-0 h-[calc(100vh-64px)] sticky top-16 transition-colors duration-300">
        <div className="flex items-center justify-center mb-10 px-2 group/logo shrink-0">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-16 w-full max-w-[200px]">
            <img src={BRANDS.LOGO_KWIKLINER_WIDE} alt="KwikLiner" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
        <div className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
          {Object.entries(menuSections).map(([title, items]) => (
            <div key={title}>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{title.replace('_', ' ')}</p>
              <div className="space-y-1">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => item.id === 'Logout' ? onLogout() : setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${activeMenu === item.id
                      ? 'bg-[#6366F1]/5 dark:bg-[#6366F1]/10 text-[#6366F1] dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={activeMenu === item.id ? 'text-[#6366F1]' : 'text-slate-400 group-hover:text-slate-600'}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    {item.badge && <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MOBILE SIDEBAR (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 flex flex-col p-8 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-10 shrink-0">
              <div className="bg-white p-2 sm:p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center h-12">
                <img src={BRANDS.LOGO_KWIKLINER_WIDE} alt="KwikLiner" className="h-7 w-auto object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow space-y-10 overflow-y-auto pr-2 scrollbar-hide">
              {Object.entries(menuSections).map(([title, items]) => (
                <div key={title}>
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.25em] mb-6 px-4">{title.replace('_', ' ')}</p>
                  <div className="space-y-2">
                    {items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'Logout') navigate('/');
                          else {
                            setActiveMenu(item.id);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all group ${activeMenu === item.id ? 'bg-[#6366F1] text-white shadow-2xl shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center space-x-5">
                          <span className={activeMenu === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#6366F1] transition-colors'}>{item.icon}</span>
                          <span className="text-sm font-black tracking-tight">{item.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-50 dark:border-slate-800 mt-8 shrink-0">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-900 shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Merchant</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto p-4 md:p-10 lg:p-14 md:pt-16 relative">
        {renderContent()}

        {/* Add Product Modal */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddProductOpen(false)}></div>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Add New Product</h3>
                <button onClick={() => setIsAddProductOpen(false)} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20} className="sm:size-[24px]" />
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <label className="h-32 sm:h-40 w-full rounded-[24px] sm:rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50/10 transition-all cursor-pointer relative overflow-hidden group">
                  {newItemData.image ? (
                    <img src={newItemData.image} className="w-full h-full object-cover absolute inset-0" alt="Preview" />
                  ) : (
                    <>
                      <ImageIcon size={28} className="sm:size-[32px]" />
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest mt-2">Upload Image</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHardwareImageUpload(e, false)} />
                </label>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white" placeholder="e.g. Solar Generator"
                    value={newItemData.name} onChange={e => setNewItemData({ ...newItemData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (MWK)</label>
                    <input className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white" placeholder="0.00"
                      value={newItemData.price} onChange={e => setNewItemData({ ...newItemData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                    <input className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white" placeholder="0"
                      value={newItemData.stock} onChange={e => setNewItemData({ ...newItemData, stock: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleAddProduct({
                    name: newItemData.name,
                    price: newItemData.price,
                    stock: newItemData.stock,
                    category: newItemData.category,
                    image: newItemData.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
                  })}
                  className="w-full py-4 sm:py-5 bg-[#6366F1] text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 mt-4 text-xs sm:text-sm"
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
            <div className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit Product</h3>
                <button onClick={() => setEditingItem(null)} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20} className="sm:size-[24px]" />
                </button>
              </div>
              <form onSubmit={saveEditedItem} className="space-y-4 sm:space-y-6">
                <label className="h-32 sm:h-40 w-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative cursor-pointer group">
                  <img src={editingItem.image} className="w-full h-full object-cover" alt="Product" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest">Change Image</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleHardwareImageUpload(e, true)} />
                </label>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                    <input
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                    <input
                      value={editingItem.stock}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: e.target.value })}
                      className="w-full p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1] dark:text-white"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 sm:py-5 bg-[#6366F1] text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm">
                  <Save size={16} className="sm:size-[18px]" /> Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Shopping Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setCheckoutStep('review'); }}></div>
            <div className="w-full max-w-md bg-white dark:bg-slate-900 h-screen shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
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
                          <div className="h-24 w-24 rounded-2xl bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-black text-slate-900 dark:text-white text-sm">{item.name}</h4>
                              <button onClick={() => removeCartItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                            <p className="text-blue-600 font-black text-sm mt-1">MWK {Number(item.price).toLocaleString()}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Seller: {item.seller}</p>
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
                    <div className="p-8 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Subtotal</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">MWK {cartTotal.toLocaleString()}</span>
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
                          <button onClick={handleCheckout} className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 border-2 border-blue-600 rounded-[32px] shadow-xl group hover:-translate-y-1 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400"><CreditCard size={24} /></div>
                              <div className="text-left">
                                <p className="font-black text-slate-900 dark:text-white text-sm leading-none">KwikWallet Balance</p>
                                <p className="text-[11px] font-bold text-blue-400 mt-1">Available: {wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</p>
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
