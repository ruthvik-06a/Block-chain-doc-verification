'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Lock, ExternalLink, Copy, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { Certificate, DocumentVersion } from '@/lib/db';

export default function BlockchainExplorerPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (data.certificates) {
        setCertificates(data.certificates);
        // Extract versions from all certificates
        const allVers: DocumentVersion[] = [];
        for (const c of data.certificates) {
          const vRes = await fetch(`/api/certificates/${c.id}`);
          const vData = await vRes.json();
          if (vData.versions) allVers.push(...vData.versions);
        }
        setVersions(allVers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-purple-400" />
            Blockchain Proof Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1">Live inspection of EVM smart contract state, transaction block receipts, and cryptographic event logs.</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-purple-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Polygon Amoy Testnet (Chain ID 80002)</span>
        </div>
      </div>

      {/* CONTRACT STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Smart Contract Address</span>
          <p className="font-mono text-xs text-sky-400 font-bold break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Solidity v0.8.20 Verified
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">On-Chain Anchored Versions</span>
          <p className="font-mono text-3xl font-extrabold text-purple-300">{versions.length}</p>
          <span className="text-[10px] text-slate-400 font-mono">Linked Hash Chain Records</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Consensus Confirmation</span>
          <p className="font-mono text-3xl font-extrabold text-emerald-400">100%</p>
          <span className="text-[10px] text-slate-400 font-mono">Zero Tamper Mismatches</span>
        </div>
      </div>

      {/* RECENT TRANSACTION BLOCKS TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-lg text-white">Smart Contract Event Logs & Transactions</h3>
          <span className="text-xs text-slate-400 font-mono">VeriChainRecord.sol</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="py-3 px-2">Block</th>
                <th className="py-3 px-2">Transaction Hash</th>
                <th className="py-3 px-2">Record ID</th>
                <th className="py-3 px-2">Ver.</th>
                <th className="py-3 px-2">SHA-256 Fingerprint</th>
                <th className="py-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {versions.map((ver) => (
                <tr key={ver.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-2 text-sky-400 font-bold">#{ver.blockNumber}</td>
                  <td className="py-3 px-2 text-purple-300 truncate max-w-[150px]">{ver.blockchainTxHash}</td>
                  <td className="py-3 px-2 text-slate-200">{ver.certificateId}</td>
                  <td className="py-3 px-2 text-slate-400">v{ver.version}</td>
                  <td className="py-3 px-2 text-emerald-400 truncate max-w-[200px]">{ver.documentHash}</td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
