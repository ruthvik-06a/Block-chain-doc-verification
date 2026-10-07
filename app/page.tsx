'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, FileText, Cpu, Lock, Sparkles, ArrowRight, ShieldAlert, GitBranch, RefreshCw, Upload, Search, Download, HelpCircle, Building2, Check } from 'lucide-react';

export default function LandingPage() {
  const [certInput, setCertInput] = useState('CERT-2027-001024');

  return (
    <div className="space-y-24 pb-24">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        
        {/* Decorative Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-mono font-medium mb-8 shadow-inner animate-in fade-in slide-in-from-bottom-3">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>Blockchain-Backed Tamper-Evident Audit Trail</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Trust Every Document. <br />
            <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              GitHub for Trusted Records.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Issue, verify, version, and audit official records using blockchain-backed cryptographic proof. Protect degree certificates, marksheets, medical records, and legal credentials from tampering.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              Verify a Document
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all hover:border-slate-500"
            >
              Get Started / Dashboard
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>

          {/* Live Quick Verification Input Bar */}
          <div className="mt-12 max-w-2xl mx-auto bg-slate-900/90 p-2.5 rounded-2xl border border-sky-500/30 shadow-2xl flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="Enter Certificate ID (e.g. CERT-2027-001024)"
              className="bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none w-full font-mono px-2"
            />
            <Link
              href={`/verify/${certInput}`}
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-colors"
            >
              Verify Now
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS FLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400 font-mono mb-2">5-Step Security Workflow</h2>
          <p className="text-3xl font-extrabold text-white">How VeriChain Guarantees Integrity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center relative space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 font-extrabold font-mono text-xl flex items-center justify-center mx-auto border border-sky-500/30">
              1
            </div>
            <h3 className="font-bold text-sm text-white">ISSUE</h3>
            <p className="text-xs text-slate-400">Authorized institution uploads original document & metadata.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center relative space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold font-mono text-xl flex items-center justify-center mx-auto border border-emerald-500/30">
              2
            </div>
            <h3 className="font-bold text-sm text-white">HASH</h3>
            <p className="text-xs text-slate-400">Web Crypto generates unique SHA-256 file fingerprint.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center relative space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 font-extrabold font-mono text-xl flex items-center justify-center mx-auto border border-purple-500/30">
              3
            </div>
            <h3 className="font-bold text-sm text-white">BLOCKCHAIN</h3>
            <p className="text-xs text-slate-400">Registers hash & version proof on EVM smart contract.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center relative space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-extrabold font-mono text-xl flex items-center justify-center mx-auto border border-indigo-500/30">
              4
            </div>
            <h3 className="font-bold text-sm text-white">VERSION</h3>
            <p className="text-xs text-slate-400">Git-style hash chaining links new updates to parent hash.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl text-center relative space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold font-mono text-xl flex items-center justify-center mx-auto border border-amber-500/30">
              5
            </div>
            <h3 className="font-bold text-sm text-white">VERIFY</h3>
            <p className="text-xs text-slate-400">Public verifiers scan QR code or upload PDF to detect edits.</p>
          </div>

        </div>
      </section>

      {/* CORE PROBLEM VS VERICHAIN ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono">The Core Problem</h2>
            <h3 className="text-3xl font-extrabold text-white leading-tight">PDFs Are Easily Manipulated. Normal Databases Can Be Secretly Altered.</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional document validation relies on trusting plain database records or uploaded PDF files. An attacker can modify a grade from 8.0 to 8.5 in Adobe Acrobat in 30 seconds.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">Fake educational marksheets and experience credentials flooding recruitment pipelines.</p>
              </div>
              <div className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">Inability to audit who modified a record, when it changed, or what the previous state was.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 font-mono uppercase">VeriChain Architecture Principle</span>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded font-mono">Immutable Proof</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <DatabaseIcon className="w-4 h-4 text-sky-400" /> Backend Storage
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <li>• Document metadata</li>
                  <li>• User permissions</li>
                  <li>• Audit logs</li>
                  <li>• Verification history</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" /> Blockchain Storage
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1 font-mono">
                  <li>• SHA-256 document hash</li>
                  <li>• Parent version hash</li>
                  <li>• Issuer address</li>
                  <li>• Timestamp & status</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic text-center pt-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              "We never claim a database is immutable. Instead, we anchor cryptographic SHA-256 proof hashes on smart contracts to create a tamper-evident audit trail."
            </p>
          </div>

        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400 font-mono mb-2">Platform Capabilities</h2>
          <p className="text-3xl font-extrabold text-white">Enterprise Features Built for Organizations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Git-Style Version Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Legitimate document edits create Version 2, 3, etc. Every version is linked to its parent hash, maintaining full revision history without overwriting old state.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Drag & Drop Tamper Detector</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifiers drag any PDF into the portal. The system instantly computes its SHA-256 hash and compares it side-by-side against the registered blockchain hash.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-sky-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Instant Record Revocation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If a certificate was issued erroneously, issuers can revoke it on-chain with a stated reason. Verification queries immediately reflect REVOKED status.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
    </svg>
  );
}
