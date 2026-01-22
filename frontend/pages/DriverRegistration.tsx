import React, { useState } from 'react';
import {
    CheckCircle, ChevronRight, ArrowLeft, ArrowRight,
    User, Truck, FileText, Shield, Heart, DollarSign, AlertTriangle, BookOpen
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from '../components/ToastContext';

interface DriverRegistrationProps {
    onComplete: (data: any) => void;
    onBack: () => void;
}

const DriverRegistration: React.FC<DriverRegistrationProps> = ({ onComplete, onBack }) => {
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

        // Page 8: Payment
        paymentMethod: 'Mobile Money', // or 'Bank'
        accountDetails: '',

        // Page 9 & 10: Agreement & Terms
        infoAccurate: false,
        agreeTerms: false,
        agreeCode: false,
        consentTracking: false,
        agreeDriverTerms: false,
        signature: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (name: string, value: any) => {
        let error = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|265)\d{9}$/;

        switch (name) {
            case 'email':
                if (value && !emailRegex.test(value)) error = 'Invalid email address';
                break;
            case 'phone':
            case 'emergencyPhone':
                const phoneDigits = (value || '').replace(/\D/g, '');
                if (!phoneRegex.test(phoneDigits)) error = 'Phone must start with 0 or 265 followed by exactly 9 digits';
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
            // Map specific fields for the backend or store in a 'profile' object
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
                            <div>
                                <input placeholder="Full Legal Name" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.fullName ? 'ring-2 ring-red-500' : ''}`} value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} />
                                {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.fullName}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" placeholder="DOB" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} />
                                <select className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <input placeholder="Nationality" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)} />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input placeholder="National ID" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.nationalId ? 'ring-2 ring-red-500' : ''}`} value={formData.nationalId} onChange={e => handleChange('nationalId', e.target.value)} />
                                    {errors.nationalId && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.nationalId}</p>}
                                </div>
                                <input placeholder="Passport (Optional)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.passport} onChange={e => handleChange('passport', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase">Residential Address</h5>
                                <input placeholder="Street" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.street} onChange={e => handleChange('street', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input placeholder="City" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.city ? 'ring-2 ring-red-500' : ''}`} value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                                        {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.city}</p>}
                                    </div>
                                    <input placeholder="Country" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.country} onChange={e => handleChange('country', e.target.value)} />
                                </div>
                                <input placeholder="P.O. Box (Optional)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.poBox} onChange={e => handleChange('poBox', e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input placeholder="Phone" maxLength={13} className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.phone ? 'ring-2 ring-red-500' : ''}`} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
                                </div>
                                <div>
                                    <input placeholder="Email (Optional)" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.email ? 'ring-2 ring-red-500' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <input type="password" placeholder="Password" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.password ? 'ring-2 ring-red-500' : ''}`} value={formData.password} onChange={e => handleChange('password', e.target.value)} />
                                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.password}</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (Object.values(errors).some(e => e)) {
                                    addToast('Please correct the highlighted errors before continuing.', 'error');
                                    return;
                                }
                                handleNext();
                            }}
                            disabled={!formData.fullName || !formData.phone || !formData.password || Object.values(errors).some(e => e)}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
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
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-2">Issue Date</label>
                                    <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.issueDate} onChange={e => handleChange('issueDate', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pl-2">Expiry Date</label>
                                    <input type="date" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.expiryDate} onChange={e => handleChange('expiryDate', e.target.value)} />
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
                            <select className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.vehicleType} onChange={e => handleChange('vehicleType', e.target.value)}>
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

                        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 mb-6 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="text-red-500" />
                                <h4 className="font-black text-red-900 dark:text-red-200">Medical Fitness</h4>
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 h-5 w-5 rounded-md accent-red-500 bg-white dark:bg-slate-900 shrink-0" checked={formData.medicallyFit} onChange={e => handleChange('medicallyFit', e.target.checked)} />
                                <span className="text-sm font-bold text-red-800 dark:text-red-300">I confirm that I am medically fit to operate commercial vehicles.</span>
                            </label>
                            <input placeholder="Known Medical Conditions (Optional)" className="mt-4 p-4 bg-white dark:bg-slate-800 border-none rounded-xl font-bold w-full text-sm placeholder:text-red-200 dark:placeholder:text-red-900/50 text-red-900 dark:text-red-100 outline-none" value={formData.medicalConditions} onChange={e => handleChange('medicalConditions', e.target.value)} />
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase">Emergency Contact</h5>
                            <input placeholder="Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.emergencyName} onChange={e => handleChange('emergencyName', e.target.value)} />
                            <input placeholder="Relationship" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.emergencyRel} onChange={e => handleChange('emergencyRel', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Phone" maxLength={13} className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.emergencyPhone} onChange={e => handleChange('emergencyPhone', e.target.value)} />
                                <input placeholder="Blood Group (Opt)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.bloodGroup} onChange={e => handleChange('bloodGroup', e.target.value)} />
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 5: // Background Check
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Security Check</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 5 of 8</p>
                        </div>
                        <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-[40px] text-center space-y-6 border border-slate-800 transition-colors">
                            <Shield className="h-16 w-16 mx-auto text-blue-500" />
                            <div>
                                <h4 className="text-xl font-black mb-2">Background Screening</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    To ensure platform safety, KwikLiner may conduct criminal background checks, driving history verification, and license authenticity verification.
                                </p>
                            </div>
                            <label className="flex items-start gap-4 text-left p-4 bg-white/10 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-white/20 dark:hover:bg-white/10 transition-all border border-white/5">
                                <input type="checkbox" className="mt-1 h-6 w-6 rounded-md accent-blue-500 bg-white dark:bg-slate-900 shrink-0" checked={formData.consentBackgroundCheck} onChange={e => handleChange('consentBackgroundCheck', e.target.checked)} />
                                <div>
                                    <span className="font-bold block">I give my consent</span>
                                    <span className="text-xs text-slate-400">Providing false information may result in rejection or permanent suspension.</span>
                                </div>
                            </label>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 6: // Code of Conduct & Responsibilities
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Responsibilities</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 6 of 8</p>
                        </div>

                        <div className="space-y-6 h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-lg">
                                    <BookOpen className="text-blue-600 dark:text-blue-400" size={20} /> Code of Conduct
                                </h4>
                                <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400 list-disc pl-5">
                                    <li>Obey all traffic laws and transport regulations</li>
                                    <li>Zero tolerance for alcohol or drug use while on duty</li>
                                    <li>Respect customers, cargo, and fellow road users</li>
                                    <li>Maintain professionalism and punctuality</li>
                                    <li>Protect cargo from damage, theft, or misuse</li>
                                </ul>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-lg">
                                    <AlertTriangle className="text-amber-500" size={20} /> Operational Duties
                                </h4>
                                <ul className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400 list-disc pl-5">
                                    <li>Confirming cargo pickup and delivery in-app</li>
                                    <li>Using KwikLiner navigation and tracking tools</li>
                                    <li>Uploading proof of delivery (photos/signatures)</li>
                                    <li>Reporting incidents, delays, or emergencies immediately</li>
                                    <li>Using the Panic/SOS button when necessary</li>
                                    <li className="text-red-600 dark:text-red-400 font-bold">Payments outside KwikLiner are strictly prohibited (Lawsuit/Ban risk)</li>
                                    <li className="text-red-600 dark:text-red-400 font-bold">Cancelling scheduled trips will incur financial penalties</li>
                                </ul>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors">
                            <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900" checked={formData.agreeCode} onChange={e => handleChange('agreeCode', e.target.checked)} />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">I agree to Code of Conduct & Responsibilities</span>
                        </label>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 7: // Payment
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Payout Details</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 7 of 8</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleChange('paymentMethod', 'Mobile Money')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'Mobile Money' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
                            >
                                <DollarSign size={24} />
                                <span className="text-xs font-black uppercase">Mobile Money</span>
                            </button>
                            <button
                                onClick={() => handleChange('paymentMethod', 'Bank')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'Bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'}`}
                            >
                                <FileText size={24} />
                                <span className="text-xs font-black uppercase">Bank Transfer</span>
                            </button>
                        </div>
                        <input
                            placeholder={formData.paymentMethod === 'Mobile Money' ? "Phone Number" : "Account Number / Details"}
                            maxLength={13}
                            className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none"
                            value={formData.accountDetails}
                            onChange={e => handleChange('accountDetails', e.target.value)}
                        />
                        <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium px-4">
                            Drivers acknowledge that earnings are subject to KwikLiner’s commission and payment processing timelines.
                        </p>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
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
                                <label key={c.k} className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" className="mt-1 h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900 shrink-0" checked={(formData as any)[c.k]} onChange={e => handleChange(c.k, e.target.checked)} />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{c.l}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase ml-1">Digital Signature</label>
                            <input
                                placeholder="Type Full Name as Signature"
                                className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white"
                                value={formData.signature}
                                onChange={e => handleChange('signature', e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.infoAccurate || !formData.agreeTerms || !formData.signature}
                            className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-slate-200 dark:shadow-none hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Application
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex-grow w-full max-w-xl mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <button onClick={page === 1 ? onBack : handlePrev} className="flex items-center text-slate-400 dark:text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                {page < 8 && (
                    <button onClick={handleNext} className="flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                        Next <ArrowRight size={16} className="ml-2" />
                    </button>
                )}
            </div>
            {renderPage()}
        </div>
    );
};

export default DriverRegistration;
