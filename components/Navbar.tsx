'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, CheckCircle2, FileText, Building2, Users, Lock, Sparkles, LogOut, ChevronDown } from 'lucide-react';
import { UserRole } from '@/lib/db';

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ name: string; email: string; role: UserRole; organizationName?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setSession(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  const switchRole = async (role: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoRole: role })
      });
      const data = await res.json();
      if (data.user) {
        setSession(data.user);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getRoleBadgeColor = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-900/60 text-purple-200 border-purple-700/50';
      case 'ISSUER': return 'bg-sky-900/60 text-sky-200 border-sky-700/50';
      case 'VERIFIER': return 'bg-amber-900/60 text-amber-200 border-amber-700/50';
      default: return 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                VeriChain
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase tracking-widest font-mono">v1.0</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">GitHub for Trusted Records</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/certificates"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/certificates') ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Records
            </Link>
            <Link
              href="/verify"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/verify') ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Public Verification
            </Link>
            <Link
              href="/organizations"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/organizations' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Issuers
            </Link>
            <Link
              href="/blockchain"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/blockchain' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 text-purple-400" />
              Blockchain Proofs
            </Link>
          </nav>
        </div>

        {/* Right Section: Role Switcher & Issue Button */}
        <div className="flex items-center space-x-3">
          <Link
            href="/certificates/create"
            className="hidden sm:inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Issue Record
          </Link>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${getRoleBadgeColor(session?.role)}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{session?.role || 'ISSUER'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-slate-200">{session?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{session?.organizationName || session?.email}</p>
                </div>
                <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Role (Hackathon Demo)</p>
                
                <button
                  onClick={() => { switchRole('SUPER_ADMIN'); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>Super Admin</span>
                  <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded">Full System</span>
                </button>
                <button
                  onClick={() => { switchRole('ISSUER'); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>University Admin (Issuer)</span>
                  <span className="text-[10px] bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded">XYZ Univ</span>
                </button>
                <button
                  onClick={() => { switchRole('VERIFIER'); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>Corporate Verifier</span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">Recruiter</span>
                </button>
                <button
                  onClick={() => { switchRole('PUBLIC_USER'); setDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>Public Guest</span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">Public</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
