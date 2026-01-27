
import React, { useState } from 'react';
import {
    CheckCircle, ChevronRight, ArrowLeft, ArrowRight,
    User, Truck, FileText, Shield, Heart, DollarSign, AlertTriangle, BookOpen, Loader2, Briefcase, Store
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from '../components/ToastContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FleetOwnerRegistration from './FleetOwnerRegistration';

interface DriverRegistrationProps {
    onComplete: (data: any) => void;
    onBack: () => void;
    isLoading?: boolean;
}

const DriverRegistration: React.FC<DriverRegistrationProps> = ({ onComplete, onBack, isLoading }) => {
    const { addToast } = useToast();
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        // Page 1: Personal Info
        fullName: '', dob: '', gender: '', nationality: '', nationalId: '', passport: '',
        street: '', city: '', country: '', poBox: '', phone: '', email: '', password: '',

        // Page 2: License & Quals
        licenseNumber: '', licenseClass: '', issuingAuthority: '', issueDate: '', expiryDate: '',
        certificationHaemat: false, certificationCrossBorder: false, certificationDefensive: false,
        experienceYears: '', previousEmployer: '',

        // Page 3: Vehicle Assignment
        driverType: 'Independent', // or 'Company'
        vehicleMakeModel: '', vehiclePlate: '', vehicleType: '',
        authorizedConfirmation: false,

        // Page 4: Health & Safety
        medicallyFit: false, medicalConditions: '',
        emergencyName: '', emergencyRel: '', emergencyPhone: '', bloodGroup: '',

        // Page 5: Background
        consentBackgroundCheck: false,

        // Page 6 & 7: Conduct & Payment
        agreeCode: false,
        paymentMethod: 'Mobile Money',
        accountDetails: '',

        // Page 8: Agreement & Terms
        infoAccurate: false,
        agreeTerms: false,
        consentTracking: false,
        agreeDriverTerms: false,
        agreeStrictPayments: false,
        signature: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (name: string, value: any) => {
        let error = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^0\d{9}$/;

        switch (name) {
            case 'email':
                if (value && !emailRegex.test(value)) error = 'Invalid email address';
                break;
            case 'phone':
            case 'emergencyPhone':
            case 'accountDetails':
                const phoneDigits = (value || '').replace(/\D/g, '');
                if (!phoneRegex.test(phoneDigits)) error = 'Phone must be exactly 10 digits starting with 0';
                break;
            case 'password':
                if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            case 'fullName':
                if (value.length < 3) error = 'Full name must be at least 3 characters';
                break;
            case 'nationalId':
                if (!value) error = 'National ID is required';
                break;
            case 'city':
                if (!value) error = 'City is required';
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const handleNext = () => setPage(p => p + 1);
    const handlePrev = () => setPage(p => p - 1);

    const handleSubmit = () => {
        const finalData = {
            role: UserRole.DRIVER,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || 'password123',
            isVerified: false,
            complianceStatus: 'SUBMITTED',
            companyName: formData.driverType === 'Company' ? formData.previousEmployer : 'Independent',
            licenses: [formData.licenseNumber],
            primaryPayoutMethod: formData.paymentMethod === 'Mobile Money' ? 'MOBILE_MONEY' : 'BANK',
            mobileMoneyNumber: formData.paymentMethod === 'Mobile Money' ? formData.accountDetails : undefined,
            accountNumber: formData.paymentMethod === 'Bank' ? formData.accountDetails : undefined,
        };
        onComplete(finalData);
    };

    const renderPage = () => {
        switch (page) {
            case 1: // Personal Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Driver Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 1 of 8</p>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Full Legal Name" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.fullName ? 'ring-2 ring-red-500' : ''}`} value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 outline-none" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} />
                                <select className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 outline-none" value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <input placeholder="Nationality" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="National ID" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.nationalId} onChange={e => handleChange('nationalId', e.target.value)} />
                                <input placeholder="Passport (Optional)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.passport} onChange={e => handleChange('passport', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Phone" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.phone ? 'ring-2 ring-red-500' : ''}`} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                <input placeholder="Email" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.email ? 'ring-2 ring-red-500' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                            </div>
                            <input type="password" placeholder="Create Password" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.password} onChange={e => handleChange('password', e.target.value)} />
                        </div>
                        <button onClick={handleNext} disabled={!formData.fullName || !formData.phone || !formData.password} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                            Continue
                        </button>
                    </div>
                );
            case 2: // License & Qualifications
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">License & Skills</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 2 of 8</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="License Number" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.licenseNumber} onChange={e => handleChange('licenseNumber', e.target.value)} />
                                <input placeholder="Class / Category" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.licenseClass} onChange={e => handleChange('licenseClass', e.target.value)} />
                            </div>
                            <input placeholder="Issuing Authority" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.issuingAuthority} onChange={e => handleChange('issuingAuthority', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-2 uppercase">Issue Date</label>
                                    <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 outline-none" value={formData.issueDate} onChange={e => handleChange('issueDate', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-2 uppercase">Expiry Date</label>
                                    <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 outline-none" value={formData.expiryDate} onChange={e => handleChange('expiryDate', e.target.value)} />
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-3">
                                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Certifications</p>
                                {[
                                    { k: 'certificationHaemat', l: 'Hazardous Materials' },
                                    { k: 'certificationCrossBorder', l: 'Cross-Border Permit' },
                                    { k: 'certificationDefensive', l: 'Defensive Driving' }
                                ].map(c => (
                                    <label key={c.k} className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900" checked={(formData as any)[c.k]} onChange={e => handleChange(c.k, e.target.checked)} />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{c.l}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Exp. (Years)" type="number" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.experienceYears} onChange={e => handleChange('experienceYears', e.target.value)} />
                                <input placeholder="Previous Employer" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.previousEmployer} onChange={e => handleChange('previousEmployer', e.target.value)} />
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 3: // Vehicle Assignment
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Vehicle Info</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 3 of 8</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                onClick={() => handleChange('driverType', 'Company')}
                                className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.driverType === 'Company' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
                            >
                                Company Driver
                            </button>
                            <button
                                onClick={() => handleChange('driverType', 'Independent')}
                                className={`p-4 rounded-2xl border-2 font-bold transition-all ${formData.driverType === 'Independent' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
                            >
                                Independent
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Vehicle Make & Model" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehicleMakeModel} onChange={e => handleChange('vehicleMakeModel', e.target.value)} />
                            <input placeholder="License Plate" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehiclePlate} onChange={e => handleChange('vehiclePlate', e.target.value)} />
                            <select className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 outline-none" value={formData.vehicleType} onChange={e => handleChange('vehicleType', e.target.value)}>
                                <option value="">Vehicle Type</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Pickup">Pickup</option>
                                <option value="Bike">Bike</option>
                            </select>
                            <label className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl cursor-pointer">
                                <input type="checkbox" className="mt-1 h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900 shrink-0" checked={formData.authorizedConfirmation} onChange={e => handleChange('authorizedConfirmation', e.target.checked)} />
                                <span className="text-xs font-bold text-blue-800 dark:text-blue-200 leading-relaxed">I confirm that I am authorized to operate the above vehicle(s) for freight services on the KwikLiner platform.</span>
                            </label>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 4: // Health & Safety
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Health & Safety</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 4 of 8</p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 mb-6 transition-colors text-center">
                            <div className="flex items-center justify-center gap-3 mb-4 text-red-600 font-black uppercase text-sm tracking-widest">
                                <Heart className="text-red-500" />
                                <h4>Medical Fitness</h4>
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer text-left">
                                <input type="checkbox" className="mt-1 h-5 w-5 rounded-md accent-red-500 bg-white dark:bg-slate-900 shrink-0" checked={formData.medicallyFit} onChange={e => handleChange('medicallyFit', e.target.checked)} />
                                <span className="text-sm font-bold text-red-800 dark:text-red-300">I confirm that I am medically fit to operate commercial vehicles.</span>
                            </label>
                            <input placeholder="Known Medical Conditions (Optional)" className="mt-4 p-4 bg-white dark:bg-slate-800 border-none rounded-xl font-bold w-full text-sm placeholder:text-red-200 text-red-900 outline-none" value={formData.medicalConditions} onChange={e => handleChange('medicalConditions', e.target.value)} />
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Emergency Contact</h5>
                            <input placeholder="Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white" value={formData.emergencyName} onChange={e => handleChange('emergencyName', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Phone (10 digits)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)} />
                                <input placeholder="Relationship" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.emergencyRel} onChange={e => handleChange('emergencyRel', e.target.value)} />
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 5: // Background Check
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 text-center px-4">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Security Check</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 5 of 8</p>
                        </div>
                        <div className="bg-slate-900 p-10 rounded-[40px] border border-slate-800 shadow-2xl space-y-8">
                            <Shield className="h-16 w-16 mx-auto text-blue-500" />
                            <div>
                                <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Background Screening</h4>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    To ensure platform safety, KwikLiner conducts identity verification and criminal record checks for all independent operators.
                                </p>
                            </div>
                            <label className="flex items-center gap-4 text-left p-6 bg-white/5 rounded-3xl cursor-pointer hover:bg-white/10 transition-all border border-white/10">
                                <input type="checkbox" className="h-6 w-6 rounded-md accent-blue-500 bg-white" checked={formData.consentBackgroundCheck} onChange={e => handleChange('consentBackgroundCheck', e.target.checked)} />
                                <div className="space-y-1">
                                    <span className="font-bold block text-white text-sm">I give my consent</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-black leading-tight block">Background screening is mandatory for drivers.</span>
                                </div>
                            </label>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 6: // Conduct & Payment Options
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Responsibilities</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 6 of 8</p>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2 text-amber-600 font-black uppercase text-[10px] tracking-widest">
                                    <AlertTriangle size={16} />
                                    <span>Core Driver Rules</span>
                                </div>
                                <ul className="text-xs font-bold text-amber-800 dark:text-amber-200 space-y-2 list-disc pl-4">
                                    <li>Strict adherence to pickup/delivery schedules.</li>
                                    <li>Cargo integrity is your direct responsibility.</li>
                                    <li>Strict prohibition on off-platform payments.</li>
                                    <li>Failure to follow rules results in permanent platform ban.</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <h4 className="font-black text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest">Conduct Agreement</h4>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600" checked={formData.agreeCode} onChange={e => handleChange('agreeCode', e.target.checked)} />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">I agree to the KwikLiner Driver Code of Conduct.</span>
                                </label>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 7: // Payout
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 px-4 text-center">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Earnings Payout</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 7 of 8</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleChange('paymentMethod', 'Mobile Money')}
                                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === 'Mobile Money' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                            >
                                <DollarSign size={24} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Mobile Money</span>
                            </button>
                            <button
                                onClick={() => handleChange('paymentMethod', 'Bank')}
                                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === 'Bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                            >
                                <Briefcase size={24} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Bank Transfer</span>
                            </button>
                        </div>
                        <input
                            placeholder={formData.paymentMethod === 'Mobile Money' ? "Phone Number (10 digits)" : "Account Number"}
                            className="p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-center text-lg"
                            value={formData.accountDetails}
                            onChange={e => handleChange('accountDetails', e.target.value)}
                        />
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
                            Continue
                        </button>
                    </div>
                );
            case 8: // Final Agreement
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Final Agreement</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 8 of 8</p>
                        </div>

                        <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 transition-colors">
                            {[
                                { k: 'infoAccurate', l: 'All information provided is true and accurate' },
                                { k: 'agreeTerms', l: 'I agree to comply with KwikLiner’s Terms of Use' },
                                { k: 'consentTracking', l: 'I consent to monitoring and tracking during active trips' },
                                { k: 'agreeDriverTerms', l: 'I agree to KwikLiner Driver Terms (Indep. Contractor)' },
                                { k: 'agreeStrictPayments', l: 'I confirm all payments will stay on-platform or face lawsuit' }
                            ].map(c => (
                                <label key={c.k} className="flex items-start gap-4 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">
                                    <input type="checkbox" className="mt-1 h-5 w-5 rounded-md accent-blue-600 shrink-0" checked={(formData as any)[c.k]} onChange={e => handleChange(c.k, e.target.checked)} />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{c.l}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Digital Signature</label>
                            <input
                                placeholder="Type Full Legal Name"
                                className="p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black w-full focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder:font-bold text-center uppercase tracking-widest"
                                value={formData.signature}
                                onChange={e => handleChange('signature', e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.infoAccurate || !formData.agreeTerms || !formData.signature || isLoading}
                            className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Submit Application'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex-grow w-full max-w-xl mx-auto py-10 px-4">
            <div className="mb-8 flex items-center justify-between">
                <button onClick={page === 1 ? onBack : handlePrev} className="flex items-center text-slate-400 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors uppercase text-[10px] tracking-widest">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                {page < 8 && (
                    <button
                        onClick={() => {
                            if (page === 1) {
                                if (!formData.fullName || !formData.phone || !formData.password) {
                                    addToast('Please fill in all required fields.', 'error');
                                    return;
                                }
                                if (Object.values(errors).some(e => e)) {
                                    addToast('Please fix validation errors.', 'error');
                                    return;
                                }
                            }
                            handleNext();
                        }}
                        className="flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase text-[10px] tracking-widest"
                    >
                        Next <ArrowRight size={16} className="ml-2" />
                    </button>
                )}
            </div>
            {renderPage()}
        </div>
    );
};

const ShipperRegistration: React.FC<DriverRegistrationProps> = ({ onComplete, onBack, isLoading }) => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', password: '', companyName: '', agreeTerms: false });
    const handleSubmit = () => onComplete({ role: UserRole.SHIPPER, name: formData.fullName, email: formData.email, phone: formData.phone, password: formData.password, companyName: formData.companyName, isVerified: true });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 max-w-md mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <div className="h-20 w-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                    <User size={40} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Shipper Account</h2>
                <p className="text-slate-500 font-bold mt-2 text-xs uppercase tracking-widest">Start moving goods now</p>
            </div>
            <div className="space-y-4">
                <input placeholder="Full Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                <input placeholder="Company (Optional)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                <input placeholder="Phone" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                <input placeholder="Email" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <input type="password" placeholder="Password" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl cursor-pointer">
                    <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600" checked={formData.agreeTerms} onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })} />
                    <span className="text-[10px] font-black uppercase text-slate-500">I Agree to KwikLiner Terms</span>
                </label>
            </div>
            <button onClick={handleSubmit} disabled={!formData.fullName || !formData.phone || !formData.password || !formData.agreeTerms || isLoading} className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Create Account'}
            </button>
            <button onClick={onBack} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Change Role</button>
        </div>
    );
};

const HardwareOwnerRegistration: React.FC<DriverRegistrationProps> = ({ onComplete, onBack, isLoading }) => {
    const { addToast } = useToast();
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', password: '',
        storeName: '', location: '', businessType: '',
        hasLicense: false, hasTaxClearance: false,
        agreeTerms: false
    });

    const handleNext = () => setPage(p => p + 1);
    const handlePrev = () => setPage(p => p - 1);

    const handleSubmit = () => {
        onComplete({
            role: UserRole.HARDWARE_OWNER,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            companyName: formData.storeName,
            isVerified: true
        });
    };

    const renderPage = () => {
        switch (page) {
            case 1: // Store Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Store Setup</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 1 of 3</p>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Owner Full Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            <input placeholder="Store / Business Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.storeName} onChange={e => setFormData({ ...formData, storeName: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Location / City" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                <input placeholder="Phone" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <input placeholder="Business Email" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input type="password" placeholder="Create Password" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <button
                            onClick={() => {
                                if (!formData.fullName || !formData.storeName || !formData.phone || !formData.email || !formData.password) {
                                    addToast('Please fill in all required fields.', 'error');
                                    return;
                                }
                                handleNext();
                            }}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 2: // Documents
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Documents</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 2 of 3</p>
                        </div>
                        <div className="space-y-4">
                            {['Business Registration', 'Tax Clearance Certificate', 'Proof of Premises'].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-slate-400" size={20} />
                                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{doc}</span>
                                    </div>
                                    <button className="px-4 py-2 bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">Upload</button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                            <Briefcase className="text-blue-600 shrink-0" size={20} />
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Verified businesses get higher visibility and customer trust scores on the Marketplace.</p>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 3: // Final Review
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Review & Submit</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 3 of 3</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-2">Terms of Service</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                By registering as a Hardware Partner, you agree to maintain accurate inventory listings and honor all confirmed product reservations.
                            </p>
                            <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-slate-200 dark:border-slate-700">
                                <input type="checkbox" className="h-5 w-5 rounded-md accent-amber-600" checked={formData.agreeTerms} onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })} />
                                <span className="text-sm font-bold text-slate-900 dark:text-white">I Agree to KwikLiner Partner Terms</span>
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.agreeTerms || isLoading}
                            className="w-full py-6 bg-slate-900 dark:bg-amber-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Complete Setup'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex-grow w-full max-w-xl mx-auto py-10 px-4">
            <div className="mb-8 flex items-center justify-between">
                <button onClick={page === 1 ? onBack : handlePrev} className="flex items-center text-slate-400 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors uppercase text-[10px] tracking-widest">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                {page < 3 && (
                    <button
                        onClick={() => {
                            if (page === 1 && (!formData.fullName || !formData.storeName || !formData.phone || !formData.email || !formData.password)) {
                                addToast('Please fill in all required fields.', 'error');
                                return;
                            }
                            handleNext();
                        }}
                        className="flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase text-[10px] tracking-widest"
                    >
                        Next <ArrowRight size={16} className="ml-2" />
                    </button>
                )}
            </div>
            {renderPage()}
        </div>
    );
};

const RoleSelection: React.FC<{ onSelect: (role: string) => void }> = ({ onSelect }) => {
    const roles = [
        { id: 'SHIPPER', title: 'Shipper', icon: <User size={32} />, color: 'bg-blue-600', desc: 'Hire drivers to move goods for you.' },
        { id: 'DRIVER', title: 'Driver', icon: <Truck size={32} />, color: 'bg-emerald-600', desc: 'Earn by carrying loads.' },
        { id: 'LOGISTICS_OWNER', title: 'Fleet Owner', icon: <Briefcase size={32} />, color: 'bg-indigo-600', desc: 'Manage your logistics business.' },
        { id: 'HARDWARE_OWNER', title: 'Hardware Owner', icon: <Store size={32} />, color: 'bg-amber-600', desc: 'Sell spares and rent tools.' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-20">
                <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Choose your journey</h2>
                <p className="text-xl text-slate-500 font-medium tracking-tight">Select how you want to build on the KwikLiner network.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {roles.map((role) => (
                    <button key={role.id} onClick={() => onSelect(role.id)} className="group bg-white dark:bg-slate-800 p-10 rounded-[50px] shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:-translate-y-2 flex flex-col items-center">
                        <div className={`h-24 w-24 ${role.color} rounded-[40px] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-xl`}>
                            {role.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{role.title}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{role.desc}</p>
                        <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                            Select Role <ArrowRight size={14} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Register: React.FC<{ onRegister: (user: any) => void }> = ({ onRegister }) => {
    const [mode, setMode] = useState<'select' | 'reg-shipper' | 'reg-driver' | 'reg-fleet' | 'reg-hardware'>('select');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleRegistrationComplete = async (userData: any) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                onRegister(data.user);
                addToast("Account created successfully!", "success");
                navigate('/dashboard');
            } else {
                addToast(data.error || "Registration failed", "error");
            }
        } catch (err) {
            addToast("Network error during registration", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="flex-grow">
                {mode === 'select' && <RoleSelection onSelect={(role) => {
                    if (role === 'SHIPPER') setMode('reg-shipper');
                    else if (role === 'DRIVER') setMode('reg-driver');
                    else if (role === 'LOGISTICS_OWNER') setMode('reg-fleet');
                    else setMode('reg-hardware');
                }} />}
                {mode === 'reg-shipper' && <ShipperRegistration onComplete={handleRegistrationComplete} onBack={() => setMode('select')} isLoading={isLoading} />}
                {mode === 'reg-driver' && <DriverRegistration onComplete={handleRegistrationComplete} onBack={() => setMode('select')} isLoading={isLoading} />}
                {mode === 'reg-fleet' && <FleetOwnerRegistration onComplete={handleRegistrationComplete} onBack={() => setMode('select')} isLoading={isLoading} />}
                {mode === 'reg-hardware' && <HardwareOwnerRegistration onComplete={handleRegistrationComplete} onBack={() => setMode('select')} isLoading={isLoading} />}
            </div>
            <div className="text-center py-12">
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-blue-600 font-black hover:underline ml-2">Sign In</button>
                </p>
            </div>
        </div>
    );
};

export default Register;
