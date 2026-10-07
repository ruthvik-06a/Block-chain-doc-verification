'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, CheckCircle2, FileText, Cpu, Lock, Sparkles, ArrowRight, 
  ShieldAlert, GitBranch, RefreshCw, Upload, Search, Download, HelpCircle, 
  Building2, Check, ExternalLink, Box, Activity, Layers, Wallet, Terminal, Globe
} from 'lucide-react';

export default function LandingPage() {
  const [certInput, setCertInput] = useState('CERT-2027-001024');

  return (
    <div className="relative bg-[#050608] text-slate-100 min-h-screen overflow-hidden font-sans selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* BACKGROUND DECORATIVE GLOW & GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.08),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* FAR-LEFT CYBERNETIC SPEC SIDEBAR (Reference Image Match) */}
      <div className="hidden lg:flex fixed left-3 top-1/4 bottom-1/4 z-20 flex-col justify-between items-center text-[10px] font-mono text-slate-600 tracking-widest uppercase pointer-events-none select-none">
        <span className="rotate-[-90deg] origin-center whitespace-nowrap">CYBERNETIC SPECS</span>
        <span className="rotate-[-90deg] origin-center whitespace-nowrap">-0.321/06</span>
        <span className="rotate-[-90deg] origin-center whitespace-nowrap">IEEE S$aY</span>
        <span className="rotate-[-90deg] origin-center whitespace-nowrap">VERICHAIN CORE</span>
      </div>

      {/* TOP HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT HERO COLUMN */}
          <div className="lg:col-span-7 space-y-8 z-10">
            
            {/* Top Monospace Tagline */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-mono font-medium shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>NEXUS ARCHITECTURE • VERICHAIN V1.0</span>
            </div>

            {/* Main Metallic Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif leading-[1.08] text-white">
              The Immutable Proof, <br />
              <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-amber-200/90 bg-clip-text text-transparent filter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                Connected.
              </span>
            </h1>

            {/* All-Caps Monospace Subtitle */}
            <p className="text-xs sm:text-sm font-mono text-slate-400 uppercase tracking-widest max-w-xl leading-relaxed">
              UNMATCHED INTEGRITY, SPEED, AND IMMUTABILITY FOR THE NEXT GENERATION OF ON-CHAIN DOCUMENT VERIFICATION.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-slate-800/90 via-slate-900 to-slate-950 border border-slate-400/30 text-white font-semibold text-sm shadow-xl shadow-sky-500/10 hover:border-slate-200/70 transition-all hover:scale-105"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>

              <Link
                href="/verify"
                className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors px-4 py-3"
              >
                <span>Verify Document</span>
                <span className="text-slate-500 font-mono">→</span>
              </Link>
            </div>

            {/* Quick Record Verification Input Bar */}
            <div className="pt-4 max-w-xl">
              <div className="bg-slate-900/70 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2">
                <Search className="w-5 h-5 text-slate-500 ml-3 shrink-0" />
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. CERT-2027-001024)"
                  className="bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none w-full font-mono px-2"
                />
                <Link
                  href={`/verify/${certInput}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-5 py-2.5 rounded-xl font-mono font-bold text-xs shrink-0 transition-all hover:border-sky-400"
                >
                  Verify Now
                </Link>
              </div>
            </div>

            {/* Code Snippet Overlay Background (As seen in image) */}
            <div className="pt-4 hidden sm:block font-mono text-[11px] text-slate-600/70 space-y-1 select-none pointer-events-none">
              <p>// smart-contract-anchor.sol</p>
              <p>function verifyRecord(bytes32 recordHash) public view returns (bool) &#123;</p>
              <p className="pl-4">require(min_nodes &gt;= 30, "Consensus threshold reached");</p>
              <p className="pl-4">return hash_chain[recordHash].status == Status.Active;</p>
              <p>&#125;</p>
            </div>

          </div>

          {/* RIGHT HERO COLUMN: 3D METALLIC ORBITAL SPHERE & STATS OVERLAY */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Background Sphere Glow */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none" />

            {/* 3D ORBITAL GYROSCOPE GRAPHIC */}
            <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
              
              {/* Outer Rotating Ring 1 */}
              <div className="absolute inset-0 rounded-full border border-slate-400/20 animate-spin-slow shadow-[0_0_30px_rgba(255,255,255,0.05)] transform rotate-45" />

              {/* Reverse Rotating Ring 2 with Metallic Ellipse */}
              <div className="absolute inset-4 rounded-full border-2 border-slate-300/30 animate-spin-reverse-slow transform -rotate-12 border-dashed" />

              {/* Glowing Metallic Gyro Ring 3 */}
              <div className="absolute inset-12 rounded-full border-4 border-slate-500/20 border-t-amber-300/80 border-b-sky-400/80 animate-spin-slow transform rotate-60 shadow-[0_0_50px_rgba(56,189,248,0.2)]" />

              {/* Center Core Metallic Globe */}
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border border-slate-500/40 shadow-2xl flex items-center justify-center relative overflow-hidden animate-float-slow">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
                <Globe className="w-20 h-20 text-slate-400/40 animate-pulse" />
                
                {/* Center Core Floating Text */}
                <div className="absolute font-mono text-[10px] text-amber-200/90 font-bold tracking-widest text-center">
                  0x71C7...8976F
                </div>
              </div>

              {/* Coordinate Callout Tag (Reference Image Match) */}
              <div className="absolute top-6 right-6 font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>45.2532.30</span>
              </div>

            </div>

            {/* FLOATING STATS OVERLAY CARD (Bottom Right of Graphic - Reference Image Match) */}
            <div className="absolute -bottom-8 right-0 left-0 sm:left-auto bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-20 font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
                
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Records</span>
                  <p className="text-lg font-bold text-white font-serif">$1.2M+</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Trans. Speed</span>
                  <p className="text-lg font-bold text-slate-200">65k <span className="text-xs text-slate-400 font-sans">TPS</span></p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Nodes</span>
                  <p className="text-lg font-bold text-slate-200">14,822</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Security</span>
                  <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                    Audited <span className="text-amber-300 text-xs">✦</span>
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* THREE BOTTOM FEATURE CARDS (Reference Image Match with [01], [02], [03]) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 01 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 hover:border-slate-400/40 transition-all hover:-translate-y-1 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-amber-300 transition-colors">
                <Box className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-slate-500 font-bold">[01]</span>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white">Smart Contract Security</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Sltra-fine cryptographic details & Solidity v0.8.20 consensus proof.</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
              <span>→ Hover to Explore</span>
            </div>
          </div>

          {/* CARD 02 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 hover:border-slate-400/40 transition-all hover:-translate-y-1 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-sky-300 transition-colors">
                <GitBranch className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-slate-500 font-bold">[02]</span>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white">Git-Style Version Control</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Parent-child hash chains link updates without overwriting historical state.</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
              <span>→ View Network</span>
            </div>
          </div>

          {/* CARD 03 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 hover:border-slate-400/40 transition-all hover:-translate-y-1 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-emerald-300 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-slate-500 font-bold">[03]</span>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-white">SHA-256 Tamper Detector</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Drag-and-drop instant file hashing comparison against on-chain proof.</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
              <span>→ Run Verification</span>
            </div>
          </div>

        </div>
      </section>

      {/* CORE PROBLEM VS ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">The Problem</span>
            <h2 className="text-3xl font-extrabold text-white font-serif leading-tight">
              PDFs Are Easily Manipulated. <br /> Normal Databases Can Be Secretly Altered.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Traditional document validation relies on trusting plain database records or uploaded PDF files. An attacker can modify a grade from 8.0 to 8.5 in Adobe Acrobat in 30 seconds.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 font-mono">Fake educational marksheets and experience credentials flooding recruitment pipelines.</p>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 font-mono">Inability to audit who modified a record, when it changed, or what the previous state was.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-sky-400 font-mono uppercase">VeriChain Architecture Principle</span>
              <span className="text-[10px] bg-slate-800 text-sky-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">Immutable Proof</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <DatabaseIcon className="w-4 h-4 text-sky-400" /> Backend Storage
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• Document metadata</li>
                  <li>• User permissions</li>
                  <li>• Audit logs</li>
                  <li>• Verification history</li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" /> Blockchain Storage
                </h4>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• SHA-256 document hash</li>
                  <li>• Parent version hash</li>
                  <li>• Issuer address</li>
                  <li>• Timestamp & status</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic text-center pt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
              "We never claim a database is immutable. Instead, we anchor cryptographic SHA-256 proof hashes on smart contracts to create a tamper-evident audit trail."
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
