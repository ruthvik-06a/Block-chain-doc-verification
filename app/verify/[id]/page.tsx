'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldAlert, FileText, Cpu, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import { Certificate, DocumentVersion } from '@/lib/db';
import { BlockchainProof } from '@/lib/blockchain';

export default function DirectVerificationPage() {
  const params = useParams();
  const certIdParam = params.id as string;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [version, setVersion] = useState<DocumentVersion | null>(null);
  const [proof, setProof] = useState<BlockchainProof | null>(null);

  useEffect(() => {
    verifyRecord();
  }, [certIdParam]);

  const verifyRecord = async () => {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: certIdParam,
          verificationType: 'ID_LOOKUP'
        })
      });

      const data = await res.json();
      setResult(data.result);
      setMessage(data.message);
      setCert(data.certificate || null);
      setVersion(data.latestVersion || null);
      setProof(data.blockchainProof || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-400 mb-3" />
        Verifying Certificate {certIdParam} on Blockchain...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link href="/verify" className="text-xs text-sky-400 font-semibold flex items-center gap-1 hover:text-sky-300">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification Portal
      </Link>

      {result === 'VALID' && cert && (
        <div className="bg-emerald-950/90 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-emerald-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-300">VERIFIED AUTHENTIC RECORD</h1>
              <p className="text-xs text-emerald-200/90 mt-1 font-medium">{message}</p>
            </div>
          </div>

          <div className="bg-slate-950/90 p-6 rounded-2xl border border-emerald-800/60 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono font-bold text-sm text-sky-400">{cert.certificateId}</span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold">
                STATUS: ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Holder Name</span>
                <p className="font-bold text-base text-white">{cert.subjectName}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Course / Degree</span>
                <p className="font-bold text-base text-white">{cert.course}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Issuing Authority</span>
                <p className="font-medium text-slate-300">{cert.organizationName}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Current Version</span>
                <p className="font-mono text-sky-400 font-bold">v{cert.currentVersion}</p>
              </div>
            </div>
          </div>

          {proof && (
            <div className="bg-slate-950/90 p-4 rounded-xl border border-emerald-800/60 text-xs font-mono space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Blockchain Anchor</span>
              <p className="text-slate-300 truncate">Tx: {proof.transactionHash}</p>
              <p className="text-slate-400">Block #{proof.blockNumber} • {proof.network}</p>
            </div>
          )}
        </div>
      )}

      {result === 'REVOKED' && (
        <div className="bg-rose-950/90 border-2 border-rose-500/60 rounded-2xl p-8 shadow-2xl space-y-4 text-rose-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-rose-400">❌ RECORD REVOKED</h1>
              <p className="text-xs text-rose-200 mt-1 font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {result === 'NOT_FOUND' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-3">
          <h2 className="text-xl font-bold text-white">Record Not Found</h2>
          <p className="text-xs text-slate-400">The certificate ID <span className="font-mono text-slate-200">{certIdParam}</span> was not found in the VeriChain registry.</p>
        </div>
      )}

    </div>
  );
}
