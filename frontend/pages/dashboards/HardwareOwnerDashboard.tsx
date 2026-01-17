
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import {
  LayoutGrid, Truck, Box, MessageSquare, Activity, FileText,
  Globe, UserCheck, Settings, LogOut, ChevronDown, Search,
  Bell, Plus, ShoppingCart, DollarSign, Tag, Store, Ruler, Square,
  Trash2, Package, Filter, MoreHorizontal, ArrowUpRight,
  CreditCard, PieChart, Image as ImageIcon, X, Edit, Save, CheckCircle2,
  ChevronRight, BarChart3, TrendingUp, Info, Award, Star, Menu, ArrowRight, Briefcase, AlertCircle
} from 'lucide-react';
import ChatWidget from '../../components/ChatWidget';
import { api } from '../../services/api';

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
  const [categoryFilter, setCategoryFilter] = useState('All');
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
      const [allProductsData, walletData, transData] = await Promise.all([
        api.getProducts(),
        api.getWallet(user.id),
        api.getWalletTransactions(user.id)
      ]);
      setWallet(walletData);
      setTransactions(Array.isArray(transData) ? transData : []);

      // If no products from API, use sample data
      if (!allProductsData || allProductsData.length === 0) {
        const sampleProducts = [
          {
            id: 'prod-1',
            name: 'Heavy Duty Hydraulic Jack',
            price: '45000',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
            category: 'Hardware',
            seller: 'KwikParts Ltd',
            location: 'Lilongwe',
            ownerId: 'seller-1',
            stock: 15
          },
          {
            id: 'prod-2',
            name: 'Industrial Air Compressor',
            price: '125000',
            image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
            category: 'Hardware',
            seller: 'TechSupply Co',
            location: 'Blantyre',
            ownerId: 'seller-2',
            stock: 8
          },
          {
            id: 'prod-3',
            name: 'Brake Pad Set - Universal',
            price: '12500',
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
            category: 'Spares',
            seller: 'Auto Parts Hub',
            location: 'Lilongwe',
            ownerId: 'seller-3',
            stock: 45
          },
          {
            id: 'prod-4',
            name: 'LED Work Light 50W',
            price: '8500',
            image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=400',
            category: 'Tech',
            seller: 'Bright Solutions',
            location: 'Mzuzu',
            ownerId: 'seller-4',
            stock: 32
          },
          {
            id: 'prod-5',
            name: 'Engine Oil Filter Kit',
            price: '6000',
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
            category: 'Spares',
            seller: 'MotoShop MW',
            location: 'Blantyre',
            ownerId: 'seller-5',
            stock: 120
          },
          {
            id: 'prod-6',
            name: 'Safety Reflective Vest',
            price: '3500',
            image: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=400',
            category: 'Safety',
            seller: 'SafetyFirst Ltd',
            location: 'Zomba',
            ownerId: 'seller-6',
            stock: 200
          },
          {
            id: 'prod-7',
            name: 'Digital Tire Pressure Gauge',
            price: '4800',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            category: 'Tech',
            seller: 'GadgetWorld',
            location: 'Lilongwe',
            ownerId: 'seller-7',
            stock: 55
          },
          {
            id: 'prod-8',
            name: 'Heavy Duty Battery 12V',
            price: '28000',
            image: 'https://images.unsplash.com/photo-1609301244239-c8e965e0eb2b?w=400',
            category: 'Spares',
            seller: 'PowerPlus',
            location: 'Blantyre',
            ownerId: user.id, // This one belongs to the current user
            stock: 18
          },
          {
            id: 'prod-9',
            name: 'Fertilizer 50kg Bag',
            price: '35000',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            category: 'Agri',
            seller: 'AgriSupplies MW',
            location: 'Mzuzu',
            ownerId: 'seller-8',
            stock: 75
          },
          {
            id: 'prod-10',
            name: 'Steel Toolbox Set',
            price: '22000',
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
            category: 'Hardware',
            seller: 'ToolMaster',
            location: 'Zomba',
            ownerId: user.id, // Another user product
            stock: 12
          },
          {
            id: 'prod-11',
            name: 'Protective Goggles',
            price: '2500',
            image: 'https://images.unsplash.com/photo-1577071835592-dea7215c0992?w=400',
            category: 'Safety',
            seller: 'WorkSafe Pro',
            location: 'Lilongwe',
            ownerId: 'seller-9',
            stock: 150
          },
          {
            id: 'prod-12',
            name: 'Portable Generator 5KVA',
            price: '185000',
            image: 'https://images.unsplash.com/photo-1521714161819-15534968fc5f?w=400',
            category: 'Hardware',
            seller: 'PowerGen Ltd',
            location: 'Blantyre',
            ownerId: 'seller-10',
            stock: 6
          }
        ];
        setAllProducts(sampleProducts);
        setInventory(sampleProducts.filter((p: any) => p.ownerId === user.id));
      } else {
        setAllProducts(allProductsData);
        setInventory(allProductsData.filter((p: any) => p.ownerId === user.id));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Set empty arrays on error
      setAllProducts([]);
      setInventory([]);
      setWallet(null);
      setTransactions([]);
    }
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

  const [newItemData, setNewItemData] = useState({ name: '', price: '', stock: '', category: 'Hardware' });

  const renderContent = () => {
    switch (activeMenu) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 animate-in fade-in duration-500">
            <div
              onClick={() => setActiveMenu('Wallet')}
              className="col-span-12 md:col-span-4 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-50 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
            >
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-4 sm:mb-6">Wallet Balance</h3>
              <div className="flex items-end space-x-4 mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl font-black tracking-tighter">{wallet?.currency || 'MWK'} {wallet?.balance?.toLocaleString() || '0.00'}</span>
                <span className="text-emerald-500 text-xs font-black mb-1">Available</span>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="user" />
                  </div>
                ))}
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white bg-[#6366F1] flex items-center justify-center text-[10px] font-black text-white">
                  +12
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white p-6 sm:p-8 rounded-[32px] border border-slate-50 shadow-sm">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mb-4 sm:mb-6">Inventory Health</h3>
              <div className="flex items-baseline space-x-2 mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl font-black tracking-tighter">{inventory.reduce((acc, item) => acc + Number(item.stock), 0)}</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-300">Total Units</span>
              </div>
              <div className="flex space-x-1.5 h-12 sm:h-16 items-end">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-full ${i < 19 ? 'bg-[#14B8A6]' : 'bg-slate-100'}`} style={{ height: `${Math.random() * 20 + 80}%` }}></div>
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
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400">Top Five Products</h3>
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <Award size={16} className="text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Industrial Generator XL', amount: '1,200,000', date: '2 hrs ago' },
                    { name: 'Solar Panel System (x10)', amount: '850,000', date: '5 hrs ago' },
                    { name: 'Hydraulic Pump Unit', amount: '450,000', date: '1 day ago' },
                    { name: 'Construction Tool Set', amount: '120,000', date: '2 days ago' },
                    { name: 'Safety Equipment Bundle', amount: '85,000', date: '2 days ago' }
                  ].map((sale, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 w-4">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{sale.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sale.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-indigo-600">MWK {sale.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 Sales (formerly Products) */}
              {/* Top 5 Sales (formerly Products) */}
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-slate-400">Top Five Sales</h3>
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <TrendingUp size={16} className="text-indigo-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Heavy Duty Drill', sales: '145 sold', trend: '+12%' },
                    { name: 'Safety Vest Pro', sales: '120 sold', trend: '+8%' },
                    { name: 'Concrete Mixer', sales: '82 sold', trend: '+24%' },
                    { name: 'Steel Toolbox', sales: '65 sold', trend: '-5%' },
                    { name: 'Extension Cord 50m', sales: '48 sold', trend: '+1%' }
                  ].map((prod, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 w-4">0{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{prod.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prod.sales}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg ${prod.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>{prod.trend}</span>
                    </div>
                  ))}
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
                <div key={item.id} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group relative">
                  <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black text-indigo-600 uppercase tracking-widest">
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
        const displayProducts = productFilter === 'Mine' ? inventory : allProducts;
        const filteredProducts = displayProducts.filter(p => {
          const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
          const matchesLocation = locationFilter === 'All' || p.location === locationFilter;
          return matchesCategory && matchesLocation;
        });

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 relative">
            {/* Cart Trigger */}
            <div className="fixed bottom-24 right-4 sm:bottom-32 sm:right-8 z-[60]">
              <button onClick={() => setIsCartOpen(true)} className="h-14 w-14 sm:h-20 sm:w-20 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
                <ShoppingCart size={24} className="sm:size-[32px]" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-black h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center border-4 border-white">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Kwik Shop</h3>
                <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">Browse the global marketplace. Manage your products or shop from others.</p>
              </div>
              <div className="relative flex-grow w-full md:max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input className="bg-white border border-slate-100 rounded-xl pl-12 pr-6 py-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 outline-none w-full shadow-sm" placeholder="Search Marketplace..." />
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-bold text-slate-600">Filter by Location:</span>
              <div className="w-full sm:w-auto">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer hover:border-blue-600 transition-colors"
                >
                  <option value="All">All Locations</option>
                  <option value="Lilongwe">Lilongwe</option>
                  <option value="Blantyre">Blantyre</option>
                  <option value="Mzuzu">Mzuzu</option>
                  <option value="Zomba">Zomba</option>
                </select>
              </div>
            </div>

            {/* Product Filter Tabs */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setProductFilter('All')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${productFilter === 'All' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'}`}
              >
                All Products
              </button>
              <button
                onClick={() => setProductFilter('Mine')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${productFilter === 'Mine' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-600'}`}
              >
                My Products ({inventory.length})
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Hardware', 'Spares', 'Agri', 'Tech', 'Safety'].map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`flex-shrink-0 px-6 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-600'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((item, idx) => {
                const isMine = item.ownerId === user.id;
                return (
                  <div key={idx} className="bg-white rounded-[32px] p-4 border border-slate-50 shadow-sm hover:shadow-2xl transition-all group">
                    <div className="h-48 rounded-[24px] overflow-hidden mb-4 relative bg-slate-100">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-black text-blue-600 uppercase tracking-widest">
                        {item.category || 'Hardware'}
                      </div>
                      {isMine && (
                        <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          Your Product
                        </div>
                      )}
                    </div>
                    <div className="px-2 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                      </div>
                      <p className="text-lg font-black text-blue-600 mb-4">MWK {Number(item.price).toLocaleString()}</p>

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
                          className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all"
                        >
                          <ShoppingCart size={14} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'Analytics':
        // Graph data showing growth from past performances - starts low, grows progressively
        const hGraphData = [15, 18, 25, 32, 38, 45, 52, 61, 68, 75, 83, 92];
        const hPoints = hGraphData.map((val, i) => ({
          x: (i / (hGraphData.length - 1)) * 100,
          y: 100 - val
        }));
        const hPathData = `M ${hPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
        const hAreaPathData = `${hPathData} L 100 100 L 0 100 Z`;

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 pb-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Store Analytics</h3>
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
              <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign size={16} />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Sales</p>
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">MWK 8.4M</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600">
                  <TrendingUp size={12} />
                  <span>+15.2% grow</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:border-blue-200 group flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Box size={16} />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Orders Fulfilled</p>
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">1,240</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600">
                  <CheckCircle2 size={12} />
                  <span>98% Accuracy</span>
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
                  <h4 className="text-2xl font-black tracking-tight">4.9/5</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400">
                    <span>Top Vendor</span>
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
                    <p className="text-indigo-100 text-[10px] font-medium leading-tight">Earnings up <span className="text-white font-black">15%</span> this month.</p>
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
                    <p className="text-slate-400 text-[10px] font-medium leading-tight">FH16 spares are high demand. <span className="text-white font-black underline">Restock</span> now.</p>
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
            <ChatWidget currentUser={user} onClose={() => setActiveMenu('Overview')} />
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
                      <p className="text-sm font-black">MWK 4.2M</p>
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

              <div className="lg:col-span-8 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 sm:p-10 border-b border-slate-50">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Transaction History</h4>
                </div>
                <div className="flex-grow overflow-y-auto max-h-[600px] scrollbar-hide">
                  {transactions.length > 0 ? (
                    transactions.map((tx: any) => (
                      <div key={tx.id} className="p-8 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group">
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
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Store Settings</h3>
              <p className="text-slate-500 font-medium mt-1">Configure your store preferences and security.</p>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[48px] border border-slate-100 shadow-2xl space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-4">Notifications</h4>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                    <div>
                      <p className="font-black text-slate-900 text-sm">Order Alerts</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Instant purchase notifications</p>
                    </div>
                    <div className="h-6 w-12 bg-indigo-600 rounded-full flex items-center px-1">
                      <div className="h-4 w-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
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
                  <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all">
                    <div className="text-left">
                      <p className="font-black text-slate-900 text-sm">Change Password</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Last changed 3mo ago</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                  <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all text-red-600">
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
    <div className="flex flex-col md:flex-row bg-[#F8F9FB] min-h-screen text-slate-900 overflow-hidden font-['Inter'] relative">



      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 shrink-0 h-screen sticky top-0">
        <div className="flex items-center justify-center mb-10 px-2">
          <div className="bg-[#6366F1] p-2 rounded-xl shadow-lg shadow-indigo-100">
            <Store className="text-white" size={24} />
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
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white flex flex-col p-8 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#6366F1] p-2.5 rounded-xl">
                  <Globe className="text-white" size={24} />
                </div>
                <span className="font-black text-xl tracking-tighter">KwikLiner</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
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

            <div className="pt-8 border-t border-slate-50 mt-8 shrink-0">
              <div className="bg-slate-50 p-6 rounded-[32px] flex items-center gap-4 border border-slate-100 overflow-hidden">
                <div className="h-12 w-12 rounded-full bg-white shadow-sm overflow-hidden shrink-0"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="pfp" /></div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
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
            <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Product</h3>
                <button onClick={() => setIsAddProductOpen(false)} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20} className="sm:size-[24px]" />
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="h-32 sm:h-40 w-full rounded-[24px] sm:rounded-[32px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400 hover:border-[#6366F1] hover:text-[#6366F1] hover:bg-indigo-50/10 transition-all cursor-pointer">
                  <ImageIcon size={28} className="sm:size-[32px]" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest mt-2">Upload Image</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="e.g. Solar Generator"
                    value={newItemData.name} onChange={e => setNewItemData({ ...newItemData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (MWK)</label>
                    <input className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="0.00"
                      value={newItemData.price} onChange={e => setNewItemData({ ...newItemData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                    <input className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]" placeholder="0"
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
                    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
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
            <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Product</h3>
                <button onClick={() => setEditingItem(null)} className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-50 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={20} className="sm:size-[24px]" />
                </button>
              </div>
              <form onSubmit={saveEditedItem} className="space-y-4 sm:space-y-6">
                <div className="h-32 sm:h-40 w-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative">
                  <img src={editingItem.image} className="w-full h-full object-cover" alt="Product" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-white/90 px-4 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest">Change Image</span>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                    <input
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Qty</label>
                    <input
                      value={editingItem.stock}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: e.target.value })}
                      className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#6366F1]"
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
                                <p className="text-[11px] font-bold text-blue-400 mt-1">Available: MWK 1.2M</p>
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
