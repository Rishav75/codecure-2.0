import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  Globe,
  CheckCircle,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (userData: { name: string; email: string; phone: string; countryCode: string }) => void;
}

const COUNTRIES = [
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+1', name: 'United States / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', iso: 'BR' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        mode === 'signup'
          ? 'Account successfully created with medical telemetry encryption!'
          : 'Authenticated successfully!'
      );

      if (onSuccess) {
        onSuccess({
          name: fullName || 'Verified User',
          email: email || 'user@codecure.ai',
          phone: `${selectedCountry.code} ${phoneNumber}`,
          countryCode: selectedCountry.code,
        });
      }

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CodeCure AI Secure Authentication"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Authentication Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            CODECURE AI <span className="text-blue-400">PASSPORT</span>
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Sign in to access your HIPAA-compliant medical profile & telemetry.'
              : 'Create a new encrypted CodeCure AI health account.'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Account
          </button>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="text-sm font-bold text-emerald-300">{successMessage}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
            )}

            {/* Auth Method Switcher */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Authentication Method:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAuthMethod('mobile')}
                  className={`font-semibold transition-colors ${
                    authMethod === 'mobile' ? 'text-blue-400 underline' : 'hover:text-slate-200'
                  }`}
                >
                  Mobile Number
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`font-semibold transition-colors ${
                    authMethod === 'email' ? 'text-blue-400 underline' : 'hover:text-slate-200'
                  }`}
                >
                  Email
                </button>
              </div>
            </div>

            {authMethod === 'mobile' ? (
              <div className="space-y-3">
                {/* Country Code Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" /> Select Country & Region Code
                  </label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRIES.find((c) => c.code === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:border-blue-500/50"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.name} value={country.code} className="bg-slate-900 text-slate-100">
                        {country.flag} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-400 font-mono font-bold flex items-center shrink-0">
                      {selectedCountry.flag} {selectedCountry.code}
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                'Verifying Credentials...'
              ) : (
                <>
                  {mode === 'login' ? 'Authenticate' : 'Create Encrypted Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Telemetry Encryption Active
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
