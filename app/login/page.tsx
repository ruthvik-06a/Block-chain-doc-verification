'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '@/lib/db';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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

  const loginDemoRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoRole: role })
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
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Sign In to VeriChain</h1>
        <p className="text-xs text-slate-400">Access role-based document issuance and auditing</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Quick Demo Switcher */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Hackathon Demo Profiles</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loginDemoRole('ISSUER')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-sky-500/30 rounded-xl text-left transition-colors text-xs"
            >
              <p className="font-bold text-sky-400">XYZ University</p>
              <p className="text-[10px] text-slate-400">Issuer Admin</p>
            </button>
            <button
              onClick={() => loginDemoRole('SUPER_ADMIN')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-purple-500/30 rounded-xl text-left transition-colors text-xs"
            >
              <p className="font-bold text-purple-400">Super Admin</p>
              <p className="text-[10px] text-slate-400">System Governance</p>
            </button>
            <button
              onClick={() => loginDemoRole('VERIFIER')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-amber-500/30 rounded-xl text-left transition-colors text-xs"
            >
              <p className="font-bold text-amber-400">Corporate Verifier</p>
              <p className="text-[10px] text-slate-400">Recruiter</p>
            </button>
            <button
              onClick={() => loginDemoRole('PUBLIC_USER')}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 rounded-xl text-left transition-colors text-xs"
            >
              <p className="font-bold text-emerald-400">Public Guest</p>
              <p className="text-[10px] text-slate-400">Public Verifier</p>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="registrar@xyz.edu"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

      </div>

    </div>
  );
}
