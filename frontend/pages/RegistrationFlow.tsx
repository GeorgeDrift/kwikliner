
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import {
  CheckCircle, Truck, Package, Briefcase, ChevronRight,
  ArrowLeft, FileText, ShieldCheck, UserPlus, Fingerprint, ShoppingCart,
  UserCheck
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

import FleetOwnerRegistration from './FleetOwnerRegistration';
import DriverRegistration from './DriverRegistration';

interface RegistrationFlowProps { onRegister: (user: User) => void; }

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ onRegister }) => {
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(location.state?.isLogin || false);
  const [role, setRole] = useState<UserRole | null>(location.state?.role || null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    if (verificationSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [verificationSent, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', companyName: '', license: '',
    city: '', location: '', poBox: '', agreeCompliance: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|265)\d{9}$/;

    switch (name) {
      case 'email':
        if (!emailRegex.test(value)) error = 'Invalid email address';
        break;
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!phoneRegex.test(phoneDigits)) error = 'Phone must start with 0 or 265 followed by exactly 9 digits';
        break;
      case 'password':
        if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'name':
        if (value.length < 3) error = 'Full name must be at least 3 characters';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'location':
        if (!value) error = 'Specific location is required';
        break;
      case 'companyName':
        if (!value && role === UserRole.HARDWARE_OWNER) error = 'Business name is required';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => { if (step === 1) navigate('/'); else setStep(prev => prev - 1); };

  const handleLoginUser = async (role: UserRole | null, email?: string, password?: string) => {
    try {
      const body = email ? { email, password } : { role };
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('kwikliner_user', JSON.stringify(data.user));

      onRegister(data.user);
      navigate('/dashboard');
      addToast('Welcome back to KwikLiner!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      addToast('Authentication failed. Please check your credentials and try again.', 'error');
    }
  };

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  if (isLogin && !verificationSent) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
        <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Log in to your KwikLiner account</p>
          </div>

          <div className="space-y-4">
            <input
              placeholder="Email Address"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white"
              value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>

          <button
            onClick={() => handleLoginUser(null, loginForm.email, loginForm.password)}
            className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100"
          >
            Log In
          </button>

          <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500">
              New to KwikLiner? <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline">Register Now</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleRegisterUser = async (userData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.error?.includes('unique constraint "users_email_key"')) {
          throw new Error('This email is already registered. Please use a different email or log in.');
        }
        throw new Error(err.error || 'Registration failed');
      }

      const data = await response.json();
      setVerificationSent(data.message.includes('email'));

      // We don't log in yet, wait for verification
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('kwikliner_user', JSON.stringify(data.user));
      // onRegister(data.user);
      // navigate('/dashboard');
      addToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error: any) {
      console.error('Registration error:', error);
      addToast(error.message, 'error');
    }
  };

  const handleResendLink = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to resend link');
      }

      const data = await response.json();
      addToast(data.message, 'success');
      setTimeLeft(180); // Reset timer to 3 minutes
    } catch (error: any) {
      console.error('Resend error:', error);
      addToast(error.message || 'Failed to resend verification link.', 'error');
    }
  };


  const handleFinalize = () => {
    const newUser = {
      role: role!,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password || 'password123',
      companyName: formData.companyName,
      city: formData.city,
      location: formData.location,
      poBox: formData.poBox
    };
    handleRegisterUser(newUser);
  };

  const handleFleetOwnerComplete = (data: Record<string, any>) => {
    const newUser = {
      role: UserRole.FLEET_OWNER,
      password: 'password123',
      ...data
    };
    handleRegisterUser(newUser);
  };

  const handleDriverComplete = (data: Record<string, any>) => {
    const newUser = {
      role: UserRole.DRIVER,
      password: 'password123',
      ...data
    };
    handleRegisterUser(newUser);
  };

  // If specific separate flow is chosen
  if (!verificationSent && step === 2 && role === UserRole.FLEET_OWNER) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <FleetOwnerRegistration onComplete={handleFleetOwnerComplete} onBack={handleBack} />
      </div>
    );
  }

  if (!verificationSent && step === 2 && role === UserRole.DRIVER) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <DriverRegistration onComplete={handleDriverComplete} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-xl w-full">
        {/* Progress */}
        {role !== UserRole.FLEET_OWNER && role !== UserRole.DRIVER && !verificationSent && (
          <div className="mb-12 flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all ${step >= i ? 'bg-blue-600 w-12' : 'bg-slate-100 dark:bg-slate-800 w-4'}`} />
            ))}
          </div>
        )}

        {verificationSent ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-center">
            <div className="bg-blue-600 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Verify Your Email</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium leading-relaxed text-lg">
                We've sent a verification link to <span className="text-blue-600 font-bold">{formData.email}</span>.
              </p>
              <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl inline-block border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Link expires in</p>
                <p className="text-4xl font-black text-blue-600 font-mono tracking-tighter">{formatTime(timeLeft)}</p>
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <button
                onClick={() => {
                  setVerificationSent(false);
                  setIsLogin(true);
                  setStep(1);
                }}
                className="w-full bg-slate-900 dark:bg-slate-800 text-white p-5 rounded-2xl font-black shadow-xl"
              >
                Back to Login
              </button>
              <p className="text-sm text-slate-400 font-bold">
                Didn't receive it? <button onClick={handleResendLink} className="text-blue-600 hover:underline">Resend link</button>
              </p>
            </div>
          </div>
        ) : step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Access KwikLiner</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Select your role or try a demo account</p>
            </div>

            {/* Registration Options */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: UserRole.SHIPPER, title: 'I am a Shipper', desc: 'Customer wanting to send or transport equipment. No document upload required.', icon: <Package className="text-blue-600" /> },
                { id: UserRole.DRIVER, title: 'I am a Driver', desc: 'I am an independent driver looking for work', icon: <Truck className="text-blue-600" /> },
                { id: UserRole.FLEET_OWNER, title: 'I am a Fleet Owner', desc: 'I want to manage a fleet and drivers', icon: <Briefcase className="text-blue-600" /> },
                { id: UserRole.HARDWARE_OWNER, title: 'I sell Spares & Tools', desc: 'I have a shop and want to list hardware', icon: <ShoppingCart className="text-blue-600" /> },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setRole(opt.id); setStep(2); }}
                  className="flex items-center p-6 border-2 border-slate-100 dark:border-slate-800 rounded-3xl hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                >
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mr-6 group-hover:scale-110 transition-transform">{opt.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{opt.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{opt.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              ))}
            </div>

            {/* Quick Access Demo Removed */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500">Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline">Log In</button></p>
            </div>
          </div>
        )}

        {!verificationSent && step === 2 && role !== UserRole.FLEET_OWNER && role !== UserRole.DRIVER && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <button onClick={handleBack} className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Basic Information</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Help us set up your profile</p>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  placeholder="Full Legal Name"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.name} onChange={e => updateField('name', e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.name}</p>}
              </div>

              <div>
                <input
                  placeholder="Phone Number (+265...)"
                  maxLength={13}
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.phone} onChange={e => updateField('phone', e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.phone}</p>}
              </div>

              <div>
                <input
                  placeholder="Email Address"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.email} onChange={e => updateField('email', e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.password} onChange={e => updateField('password', e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.password}</p>}
              </div>

              {(role === UserRole.HARDWARE_OWNER) && (
                <div>
                  <input
                    placeholder="Business/Shop Name"
                    className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.companyName ? 'ring-2 ring-red-500' : ''}`}
                    value={formData.companyName} onChange={e => updateField('companyName', e.target.value)}
                  />
                  {errors.companyName && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.companyName}</p>}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                const phoneDigits = formData.phone.replace(/\D/g, '');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phoneRegex = /^(0|265)\d{9}$/;

                if (!phoneRegex.test(phoneDigits)) {
                  addToast('Phone number must start with 0 or 265 followed by exactly 9 digits.', 'error');
                  return;
                }
                if (!emailRegex.test(formData.email)) {
                  addToast('Please enter a valid email address.', 'error');
                  return;
                }
                if (Object.values(errors).some(e => e)) {
                  addToast('Please correct the highlighted errors before continuing.', 'error');
                  return;
                }
                handleNext();
              }}
              disabled={!formData.name || !formData.phone || !formData.email || !formData.password || Object.values(errors).some(e => e)}
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {!verificationSent && step === 3 && role !== UserRole.FLEET_OWNER && role !== UserRole.DRIVER && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <button onClick={handleBack} className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Location Details</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Almost there! Where are you located?</p>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  placeholder="City"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.city ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.city} onChange={e => updateField('city', e.target.value)}
                />
                {errors.city && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.city}</p>}
              </div>

              <div>
                <input
                  placeholder="Specific Street / Landmark Location"
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white ${errors.location ? 'ring-2 ring-red-500' : ''}`}
                  value={formData.location} onChange={e => updateField('location', e.target.value)}
                />
                {errors.location && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.location}</p>}
              </div>

              <div>
                <input
                  placeholder="P.O. Box (Optional)"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium text-slate-900 dark:text-white"
                  value={formData.poBox} onChange={e => updateField('poBox', e.target.value)}
                />
              </div>

              <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <input
                  type="checkbox"
                  id="compliance"
                  className="h-5 w-5 rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-600 bg-white dark:bg-slate-900"
                  checked={formData.agreeCompliance}
                  onChange={e => setFormData({ ...formData, agreeCompliance: e.target.checked })}
                />
                <label htmlFor="compliance" className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-bold">
                  I agree to the KwikLiner compliance rules:
                  • Not to make payments outside the system (punishable by lawsuit)
                  • Cancellation of scheduled trips will incur costs
                  • All payments must be made within the platform
                </label>
              </div>
            </div>
            <button
              onClick={() => {
                if (Object.values(errors).some(e => e)) {
                  addToast('Please correct the highlighted errors before completing registration.', 'error');
                  return;
                }
                role === UserRole.SHIPPER || role === UserRole.HARDWARE_OWNER ? handleFinalize() : handleNext();
              }}
              disabled={!formData.agreeCompliance || !formData.city || !formData.location || Object.values(errors).some(e => e)}
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {role === UserRole.SHIPPER || role === UserRole.HARDWARE_OWNER ? 'Complete Registration' : 'Continue'}
            </button>
          </div>
        )}

        {!verificationSent && step === 4 && role !== UserRole.FLEET_OWNER && role !== UserRole.DRIVER && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <button onClick={handleBack} className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Compliance & Security</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Verify your business to start selling</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start space-x-4">
              <Fingerprint className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-200">Verification Required</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">We require business registration docs or ID to ensure the marketplace remains trusted.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-10 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <FileText className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto mb-2 group-hover:text-blue-600 transition-colors" />
                <p className="text-slate-400 dark:text-slate-500 font-bold">Upload Documents</p>
              </div>
              <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <input type="checkbox" id="terms" className="h-5 w-5 rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-600 bg-white dark:bg-slate-900" />
                <label htmlFor="terms" className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-bold">I agree to the KwikLiner Marketplace Seller Terms</label>
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

