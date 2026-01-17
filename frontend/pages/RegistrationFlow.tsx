
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { 
  CheckCircle, Truck, Package, Briefcase, ChevronRight, 
  ArrowLeft, FileText, ShieldCheck, UserPlus, Fingerprint, ShoppingCart,
  UserCheck
} from 'lucide-react';

interface RegistrationFlowProps { onRegister: (user: User) => void; }

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ onRegister }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(location.state?.role || null);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', companyName: '', license: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => { if (step === 1) navigate('/'); else setStep(prev => prev - 1); };

  const handleDemoLogin = (role: UserRole) => {
    const dummyNames = {
      [UserRole.SHIPPER]: 'John Shipper',
      [UserRole.DRIVER]: 'Musa Driver',
      [UserRole.LOGISTICS_OWNER]: 'Fleet Dynamics Ltd',
      [UserRole.HARDWARE_OWNER]: 'KwikSpares Central',
      [UserRole.ADMIN]: 'System Admin'
    };

    const demoUser: User = {
      id: `demo-${role.toLowerCase()}`,
      role: role,
      name: dummyNames[role],
      phone: '+265 000 000 000',
      isVerified: true,
      complianceStatus: 'APPROVED',
      companyName: role === UserRole.LOGISTICS_OWNER || role === UserRole.HARDWARE_OWNER ? dummyNames[role] : undefined
    };

    onRegister(demoUser);
    navigate('/dashboard');
  };

  const handleFinalize = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: role!,
      name: formData.name,
      phone: formData.phone,
      isVerified: false,
      complianceStatus: 'SUBMITTED',
      companyName: formData.companyName
    };
    onRegister(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="mb-12 flex items-center justify-center space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all ${step >= i ? 'bg-blue-600 w-12' : 'bg-slate-100 w-4'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900">Access KwikLiner</h2>
              <p className="text-slate-500 mt-2 font-medium">Select your role or try a demo account</p>
            </div>

            {/* Registration Options */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: UserRole.SHIPPER, title: 'I am a Shipper', desc: 'I want to book trucks and move goods', icon: <Package className="text-blue-600" /> },
                { id: UserRole.DRIVER, title: 'I am a Driver', desc: 'I am an independent driver looking for work', icon: <Truck className="text-blue-600" /> },
                { id: UserRole.LOGISTICS_OWNER, title: 'I own a Logistics Co.', desc: 'I want to manage a fleet and drivers', icon: <Briefcase className="text-blue-600" /> },
                { id: UserRole.HARDWARE_OWNER, title: 'I sell Spares & Tools', desc: 'I have a shop and want to list hardware', icon: <ShoppingCart className="text-blue-600" /> },
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => { setRole(opt.id); setStep(2); }}
                  className="flex items-center p-6 border-2 border-slate-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="bg-white p-4 rounded-2xl shadow-sm mr-6 group-hover:scale-110 transition-transform">{opt.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-extrabold text-lg text-slate-900">{opt.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{opt.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>

            {/* Quick Access Demo (Now inside Login area) */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Quick Demo Access</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: UserRole.SHIPPER, label: 'Shipper' },
                  { role: UserRole.DRIVER, label: 'Driver' },
                  { role: UserRole.LOGISTICS_OWNER, label: 'Fleet Owner' },
                  { role: UserRole.HARDWARE_OWNER, label: 'Hardware' },
                ].map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => handleDemoLogin(demo.role)}
                    className="bg-slate-50 text-slate-900 p-4 rounded-2xl text-xs font-black border border-transparent hover:border-blue-600 hover:bg-white transition-all shadow-sm"
                  >
                    Login as {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <button onClick={handleBack} className="flex items-center text-slate-400 font-bold text-sm hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="text-center">
               <h2 className="text-3xl font-black text-slate-900">Basic Information</h2>
               <p className="text-slate-500 mt-2 font-medium">Help us set up your profile</p>
            </div>
            <div className="space-y-4">
              <input 
                placeholder="Full Legal Name" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                placeholder="Phone Number (+265...)" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              {(role === UserRole.LOGISTICS_OWNER || role === UserRole.HARDWARE_OWNER) && (
                <input 
                  placeholder="Business/Shop Name" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                />
              )}
            </div>
            <button onClick={handleNext} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100">
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <button onClick={handleBack} className="flex items-center text-slate-400 font-bold text-sm hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="text-center">
               <h2 className="text-3xl font-black text-slate-900">Compliance & Security</h2>
               <p className="text-slate-500 mt-2 font-medium">Verify your business to start selling</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start space-x-4">
              <Fingerprint className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900">Verification Required</h4>
                <p className="text-sm text-blue-700 font-medium">We require business registration docs or ID to ensure the marketplace remains trusted.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-10 border-4 border-dashed border-slate-100 rounded-3xl text-center cursor-pointer hover:bg-slate-50 transition-colors">
                <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 font-bold">Upload Documents</p>
              </div>
              <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
                 <input type="checkbox" id="terms" className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600" />
                 <label htmlFor="terms" className="ml-3 text-xs text-slate-500 font-bold">I agree to the KwikLiner Marketplace Seller Terms</label>
              </div>
            </div>

            <button onClick={handleFinalize} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100">
              Complete Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;
