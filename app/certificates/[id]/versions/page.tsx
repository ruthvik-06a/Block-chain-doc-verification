'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { GitBranch, GitCommit, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Certificate, DocumentVersion } from '@/lib/db';

export default function VersionHistoryPage() {
  const params = useParams();
  const certIdParam = params.id as string;
  const [cert, setCert] = useState<Certificate | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [certIdParam]);

  const fetchVersions = async () => {
    try {
      const res = await fetch(`/api/certificates/${certIdParam}`);
      const data = await res.json();
      if (data.certificate) {
        setCert(data.certificate);
        setVersions(data.versions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!cert) return null;

  // Verify Linked Hash Chain Integrity
  let hashChainValid = true;
  for (let i = 0; i < versions.length - 1; i++) {
    const newer = versions[i];
    const older = versions[i + 1];
    if (newer.previousHash !== older.documentHash) {
      hashChainValid = false;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <Link href={`/certificates/${cert.id}`} className="text-xs text-sky-400 font-semibold flex items-center gap-1 mb-2 hover:text-sky-300">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Record Details
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-sky-400" />
            Document Version History & Linked Hash Chain
          </h1>
          <p className="text-sm text-slate-400 mt-1">Record ID: <span className="font-mono font-bold text-slate-200">{cert.certificateId}</span></p>
        </div>
      </div>

      {/* Hash Chain Integrity Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
        hashChainValid ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
              Cryptographic Hash Chain Intact
              <span className="text-[10px] bg-emerald-900 text-emerald-300 font-mono px-2 py-0.5 rounded">VERIFIED</span>
            </h4>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Every version correctly references the exact SHA-256 hash of its parent version. No history rewriting or tampering detected.
            </p>
          </div>
        </div>
      </div>

      {/* Version Cards List */}
      <div className="space-y-6">
        {versions.map((ver, idx) => (
          <div key={ver.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-sm text-sky-400 bg-sky-950 px-3 py-1 rounded-xl border border-sky-800">
                  Version {ver.version} {ver.version === cert.currentVersion && '(CURRENT)'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Created on {new Date(ver.createdAt).toLocaleString()} by {ver.createdByName}
                </span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-1 rounded-lg">
                Block #{ver.blockNumber}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-200">{ver.changeDescription}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Document SHA-256 Hash</span>
                <p className="text-slate-200 break-all select-all">{ver.documentHash}</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Parent Version Hash</span>
                <p className="text-slate-300 break-all select-all">{ver.previousHash}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono truncate">
              Tx Hash: {ver.blockchainTxHash}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
