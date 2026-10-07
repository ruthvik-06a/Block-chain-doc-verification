'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight, UserCheck, Building2, ShieldAlert, CheckCircle2, User, KeyRound } from 'lucide-react';
import { UserRole } from '@/lib/db';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'PUBLIC_USER' | 'ISSUER' | 'SUPER_ADMIN'>('PUBLIC_USER');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            role: selectedRole,
            organizationName
          })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setErrorMsg(data.error || 'Failed to create account');
          return;
        }

        if (selectedRole === 'ISSUER') {
          setSuccessMsg('Issuer Registration Submitted! An Admin must authorize your account before full access.');
        } else {
          setSuccessMsg('Account created successfully! Signing in...');
          setTimeout(() => loginDirectly(email, password), 1000);
        }
      } else {
        await loginDirectly(email, password);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loginDirectly = async (userEmail: string, userPass: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: userPass })
    });
    const data = await res.json();
    if (data.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(data.error || 'Invalid credentials');
    }
  };

  const loginDemoRole = async (role: UserRole, emailOverride?: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const payload = emailOverride ? { email: emailOverride } : { demoRole: role };
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* FUTURISTIC ANIMATED BACKGROUND GLOW & ORBITAL RINGS */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sky-600/10 via-indigo-600/15 to-purple-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full border border-sky-500/10 animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute w-[550px] h-[550px] rounded-full border border-purple-500/15 animate-[spin_40s_linear_infinite_reverse]"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-sky-400 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-indigo-400 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-6">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-purple-500/20 text-sky-400 border border-sky-500/40 shadow-xl shadow-sky-500/10 backdrop-blur-md animate-bounce">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-sky-400">
            VeriChain Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
            Decentralized Document Authenticity, Role-Based Issuance & On-Chain Auditability
          </p>
        </div>

        {/* GLASSMORPHISM CARD CONTAINER */}
        <div className="bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300">
          
          {/* TAB TOGGLE: SIGN IN VS SIGN UP */}
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isSignUp
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* DYNAMIC ROLE SELECTION TOGGLE */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Primary Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('PUBLIC_USER')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  selectedRole === 'PUBLIC_USER'
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <User className="w-5 h-5" />
                <div>
                  <p className="font-extrabold text-xs">User / Holder</p>
                  <p className="text-[9px] opacity-75 leading-tight">View & Wallet</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('ISSUER')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  selectedRole === 'ISSUER'
                    ? 'bg-sky-950/60 border-sky-500/60 text-sky-300 shadow-lg shadow-sky-950/50 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <div>
                  <p className="font-extrabold text-xs">Issuer</p>
                  <p className="text-[9px] opacity-75 leading-tight">Requires Admin Auth</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('SUPER_ADMIN')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  selectedRole === 'SUPER_ADMIN'
                    ? 'bg-purple-950/60 border-purple-500/60 text-purple-300 shadow-lg shadow-purple-950/50 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <KeyRound className="w-5 h-5" />
                <div>
                  <p className="font-extrabold text-xs">System Admin</p>
                  <p className="text-[9px] opacity-75 leading-tight">Approvals & Audit</p>
                </div>
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          {errorMsg && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            )}

            {isSignUp && selectedRole === 'ISSUER' && (
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1">Organization / Institution Name</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. MIT Technology Center"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <span>{isSignUp ? 'Submit Registration' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* QUICK DEMO PROFILE PRESETS */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span>Quick Hackathon Test Profiles</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginDemoRole('SUPER_ADMIN')}
                className="p-2.5 bg-slate-950/90 hover:bg-slate-900 border border-purple-500/40 rounded-xl text-left transition-all group"
              >
                <p className="font-bold text-xs text-purple-400 group-hover:text-purple-300">System Admin</p>
                <p className="text-[9px] text-slate-400">Full Approvals & Audit</p>
              </button>

              <button
                type="button"
                onClick={() => loginDemoRole('ISSUER')}
                className="p-2.5 bg-slate-950/90 hover:bg-slate-900 border border-sky-500/40 rounded-xl text-left transition-all group"
              >
                <p className="font-bold text-xs text-sky-400 group-hover:text-sky-300">Approved Issuer</p>
                <p className="text-[9px] text-slate-400">XYZ University</p>
              </button>

              <button
                type="button"
                onClick={() => loginDemoRole('ISSUER', 'pending-issuer@verichain.org')}
                className="p-2.5 bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 rounded-xl text-left transition-all group"
              >
                <p className="font-bold text-xs text-amber-400 group-hover:text-amber-300">Pending Issuer</p>
                <p className="text-[9px] text-slate-400">Test Auth Guard</p>
              </button>

              <button
                type="button"
                onClick={() => loginDemoRole('PUBLIC_USER', 'holder@verichain.org')}
                className="p-2.5 bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/40 rounded-xl text-left transition-all group"
              >
                <p className="font-bold text-xs text-emerald-400 group-hover:text-emerald-300">User / Holder</p>
                <p className="text-[9px] text-slate-400">Alex Johnson Wallet</p>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
