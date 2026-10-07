import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cpu, GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-sky-500" />
              <span className="font-bold text-lg text-white">VeriChain</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              GitHub for Trusted Documents — Issue, Version, Verify and Audit Official Records using SHA-256 cryptographic proofs and EVM blockchain registration.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Core Solution</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/verify" className="hover:text-sky-400">Public Document Verification</Link></li>
              <li><Link href="/certificates" className="hover:text-sky-400">Document Version History</Link></li>
              <li><Link href="/blockchain" className="hover:text-sky-400">Blockchain Proof Inspector</Link></li>
              <li><Link href="/organizations" className="hover:text-sky-400">Verified Issuer Registry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Security & Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Hash Anchoring</li>
              <li className="flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5 text-sky-400" /> Linked Hash Chain History</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> EVM Smart Contract Audit</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Hackathon Note</h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              VeriChain maintains backend database performance for fast queries while using smart contracts for tamper-evident cryptographic proofs.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs">
          <p>© 2026–2027 VeriChain Inc. Built for Google Antigravity Hackathon.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-slate-400">Polygon Amoy Testnet</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-mono">Contract Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
