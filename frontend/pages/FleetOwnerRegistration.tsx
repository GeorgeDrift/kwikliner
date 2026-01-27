import React, { useState } from 'react';
import {
    CheckCircle, Briefcase, ChevronRight, ArrowLeft, ArrowRight,
    Building, User as UserIcon, Truck, FileText, ShieldCheck,
    CreditCard, Upload, AlertCircle, Loader2
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from '../components/ToastContext';

interface FleetOwnerRegistrationProps {
    onComplete: (data: any) => void;
    onBack: () => void;
    isLoading?: boolean;
}

const FleetOwnerRegistration: React.FC<FleetOwnerRegistrationProps> = ({ onComplete, onBack, isLoading }) => {
    const { addToast } = useToast();
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        // Page 1: Company Info
        companyName: '', regNumber: '', street: '', city: '', country: '', poBox: '',
        phone: '', email: '', password: '', website: '', businessActivity1: '', businessActivity2: '',

        // Page 2: Owner Info
        ownerName: '', ownerDob: '', nationalId: '', ownerAddress: '', ownerPhone: '',

        // Page 3: Vehicles (Simplified for Initial Reg)
        vehicleCount: 1, vehicleMake: '', vehicleModel: '', vehiclePlate: '', vehicleCapacity: '',
        driverName: '', driverLicense: '',

        // Page 4: Docs
        hasLicense: false, hasRegCert: false, hasInsurance: false,

        // Page 5: References
        ref1Name: '', ref1Phone: '',

        // Page 6: Financials
        bankName: '', accountName: '', accountNumber: '', swiftCode: '',

        // Page 7-9: Compliance & Terms
        agreedCompliance: false, agreedTerms: false
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
            case 'ownerPhone':
            case 'ref1Phone':
                const phoneDigits = (value || '').replace(/\D/g, '');
                if (!phoneRegex.test(phoneDigits)) error = 'Phone must be exactly 10 digits starting with 0';
                break;
            case 'password':
                if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            case 'companyName':
                if (!value) error = 'Company name is required';
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
        // Compile all data into a User object structure
        const finalData = {
            role: UserRole.LOGISTICS_OWNER,
            name: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || 'password123',
            companyName: formData.companyName,
            isVerified: false,
            complianceStatus: 'SUBMITTED',
            // ... strict compliance pack data would be stored in backend profile
        };
        onComplete(finalData);
    };

    const renderPage = () => {
        switch (page) {
            case 1: // Company Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Company Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 1 of 9</p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input placeholder="Company Name" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.companyName ? 'ring-2 ring-red-500' : ''}`} value={formData.companyName} onChange={e => handleChange('companyName', e.target.value)} />
                                    {errors.companyName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.companyName}</p>}
                                </div>
                                <input placeholder="Registration Number" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.regNumber} onChange={e => handleChange('regNumber', e.target.value)} />
                            </div>
                            <input placeholder="Street Address" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.street} onChange={e => handleChange('street', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input placeholder="City" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.city ? 'ring-2 ring-red-500' : ''}`} value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                                    {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.city}</p>}
                                </div>
                                <input placeholder="Country" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.country} onChange={e => handleChange('country', e.target.value)} />
                            </div>
                            <input placeholder="P.O. Box (Optional)" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.poBox} onChange={e => handleChange('poBox', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Company Phone (10 digits)"
                                        maxLength={10}
                                        className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                                        value={formData.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            handleChange('phone', val);
                                        }}
                                    />
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
                                </div>
                                <div>
                                    <input placeholder="Email" className={`p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none ${errors.email ? 'ring-2 ring-red-500' : ''}`} value={formData.email} onChange={e => handleChange('email', e.target.value)} />
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
                            disabled={!formData.companyName || !formData.phone || !formData.email || !formData.password || Object.values(errors).some(e => e)}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 2: // Owner Info
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Owner Information</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 2 of 9</p>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Full Legal Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.ownerName} onChange={e => handleChange('ownerName', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" placeholder="Date of Birth" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-500 dark:text-slate-400 outline-none" value={formData.ownerDob} onChange={e => handleChange('ownerDob', e.target.value)} />
                                <input placeholder="National ID" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.nationalId} onChange={e => handleChange('nationalId', e.target.value)} />
                            </div>
                            <input placeholder="Residential Address" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.ownerAddress} onChange={e => handleChange('ownerAddress', e.target.value)} />
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 3: // Fleet Size
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Fleet Capacity</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 3 of 9</p>
                        </div>
                        <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[40px] text-center border border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
                            <Truck size={48} className="mx-auto text-blue-500 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            <h4 className="text-xl font-black text-white mb-2">How many vehicles do you manage?</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">This helps us scale your dashboard</p>

                            <div className="max-w-[200px] mx-auto relative">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-3xl p-6 text-4xl font-black text-center text-white focus:border-blue-500 transition-all outline-none"
                                    value={formData.vehicleCount}
                                    onChange={e => handleChange('vehicleCount', parseInt(e.target.value) || 1)}
                                />
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">Vehicles</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 4: // Vehicle Info (Simplified 1st Vehicle)
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Vehicle Details</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 4 of 9</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Truck className="text-blue-600 dark:text-blue-400" />
                                <h4 className="font-black text-blue-900 dark:text-blue-200">Primary Vehicle</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Make (e.g. Scania)" className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehicleMake} onChange={e => handleChange('vehicleMake', e.target.value)} />
                                    <input placeholder="Model" className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehicleModel} onChange={e => handleChange('vehicleModel', e.target.value)} />
                                </div>
                                <input placeholder="License Plate" className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehiclePlate} onChange={e => handleChange('vehiclePlate', e.target.value)} />
                                <input placeholder="Capacity (Tons)" className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.vehicleCapacity} onChange={e => handleChange('vehicleCapacity', e.target.value)} />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <h5 className="font-bold text-slate-500 dark:text-slate-400 text-sm mb-3">Assigned Driver</h5>
                            <input placeholder="Driver Name" className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold w-full mb-3 text-slate-900 dark:text-white outline-none" value={formData.driverName} onChange={e => handleChange('driverName', e.target.value)} />
                            <input placeholder="License Number" className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.driverLicense} onChange={e => handleChange('driverLicense', e.target.value)} />
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 5: // Documentation
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Documents</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 5 of 9</p>
                        </div>
                        <div className="space-y-4">
                            {['Business License', 'Certificate of Incorporation', 'Cargo Insurance Policy', 'Tax Clearance'].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-slate-400" size={20} />
                                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{doc}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Status Indicator */}
                                        {(formData as any)[`doc_${i}`] && <CheckCircle size={16} className="text-green-500" />}

                                        <input
                                            type="file"
                                            id={`file-${i}`}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    try {
                                                        // Simplified upload simulation or base64 conversion
                                                        // const base64 = await fileToBase64(file);
                                                        // In a real app we'd upload to S3 here.
                                                        // For now just mark as "uploaded" in state
                                                        handleChange(`doc_${i}`, file.name); // Storing filename as proof
                                                        addToast(`${doc} uploaded successfully`, 'success');
                                                    } catch (err) {
                                                        addToast('Upload failed', 'error');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => document.getElementById(`file-${i}`)?.click()}
                                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors ${(formData as any)[`doc_${i}`]
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-slate-700 hover:bg-blue-50'
                                                }`}
                                        >
                                            {(formData as any)[`doc_${i}`] ? 'Re-Upload' : 'Upload'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                            <AlertCircle className="text-amber-600 shrink-0" size={20} />
                            <p className="text-xs font-medium text-amber-800">Ensure all scanned documents are clear and valid. Blurred scans will be rejected.</p>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div >
                );
            case 6: // References
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">References</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 6 of 9</p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-4">Provide at least one professional reference.</p>
                        <div className="space-y-4">
                            <input placeholder="Reference Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.ref1Name} onChange={e => handleChange('ref1Name', e.target.value)} />
                            <input
                                type="tel"
                                placeholder="Reference Phone (10 digits)"
                                maxLength={10}
                                className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none"
                                value={formData.ref1Phone}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleChange('ref1Phone', val);
                                }}
                            />
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 7: // Financials
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Financials</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 7 of 9</p>
                        </div>
                        <div className="space-y-4">
                            <input placeholder="Bank Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)} />
                            <input placeholder="Account Holder Name" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.accountName} onChange={e => handleChange('accountName', e.target.value)} />
                            <input placeholder="Account Number" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.accountNumber} onChange={e => handleChange('accountNumber', e.target.value)} />
                            <input placeholder="SWIFT / BIC Code" className="p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold w-full text-slate-900 dark:text-white outline-none" value={formData.swiftCode} onChange={e => handleChange('swiftCode', e.target.value)} />
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 8: // Compliance Agreement
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Compliance</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 8 of 9</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-green-600 dark:text-green-400" size={24} />
                                <h4 className="font-black text-slate-900 dark:text-white">Operational Compliance</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                I confirm compliance with all applicable freight, transport, and logistics laws.
                                I understand that non-compliance may result in rejection or termination.
                            </p>
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                {['Vehicle weight & emissions standards', 'Driver working hours & rest', 'Workplace safety', 'Hazardous goods handling'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-slate-400 dark:text-slate-500" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <CheckCircle size={16} />
                                    <span className="text-xs font-black">All payments must be on-platform (Penalty: Lawsuit)</span>
                                </div>
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <CheckCircle size={16} />
                                    <span className="text-xs font-black">Cancelling scheduled trips will incur financial costs</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-4">
                                <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900" checked={formData.agreedCompliance} onChange={e => handleChange('agreedCompliance', e.target.checked)} />
                                <span className="text-sm font-bold text-slate-900 dark:text-white">I Agree to Compliance Standards</span>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] transition-all">
                            Continue
                        </button>
                    </div>
                );
            case 9: // Terms & Submit
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Final Review</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">Step 9 of 9</p>
                        </div>

                        <div className="p-6 border border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-800 h-64 overflow-y-auto mb-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            <h4 className="font-black text-slate-900 dark:text-white mb-2">KwikLiner Terms of Use</h4>
                            <p className="mb-2">These Terms govern access to and use of KwikLiner, a freight and logistics platform operating across Africa.</p>
                            <p className="mb-2"><strong>1. Contractual Relationship:</strong> Forms a binding agreement...</p>
                            <p className="mb-2"><strong>2. License & Restrictions:</strong> Limited, non-transferable license...</p>
                            <p><strong>3. Dispute Resolution:</strong> Resolved via arbitration in Malawi...</p>
                            {/* ... more terms ... */}
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <input type="checkbox" className="h-5 w-5 rounded-md accent-blue-600 bg-white dark:bg-slate-900" checked={formData.agreedTerms} onChange={e => handleChange('agreedTerms', e.target.checked)} />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">I accept the KwikLiner Terms of Use</span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.agreedTerms || !formData.agreedCompliance || isLoading}
                            className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-slate-200 dark:shadow-none hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
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
                {page < 9 && (
                    <button
                        onClick={() => {
                            if (page === 1 && Object.values(errors).some(e => e)) {
                                addToast('Please correct errors.', 'error');
                                return;
                            }
                            handleNext();
                        }}
                        disabled={page === 1 && (!formData.companyName || !formData.phone || !formData.email || !formData.password || Object.values(errors).some(e => e))}
                        className="flex items-center text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight size={16} className="ml-2" />
                    </button>
                )}
            </div>
            {renderPage()}
        </div>
    );
};

export default FleetOwnerRegistration;
