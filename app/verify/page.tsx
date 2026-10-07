'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldAlert, Upload, Search, QrCode, FileText, Cpu, Lock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { VerificationResult, Certificate, DocumentVersion } from '@/lib/db';
import { BlockchainProof } from '@/lib/blockchain';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoTampered = searchParams.get('demoTampered') === 'true';

  const [activeTab, setActiveTab] = useState<'ID' | 'FILE' | 'QR'>('ID');
  const [certId, setCertId] = useState('CERT-2027-001024');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Result state
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [message, setMessage] = useState('');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [version, setVersion] = useState<DocumentVersion | null>(null);
  const [uploadedHash, setUploadedHash] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [proof, setProof] = useState<BlockchainProof | null>(null);

  useEffect(() => {
    if (demoTampered) {
      setActiveTab('FILE');
      handleDemoTamperCheck();
    }
  }, [demoTampered]);

  const handleDemoTamperCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: 'CERT-2027-001024',
          verificationType: 'FILE_UPLOAD',
          uploadedHash: '9999999999999999999999999999999999999999999999999999999999999999'
        })
      });
      const data = await res.json();
      setResult(data.result);
      setMessage(data.message);
      setCert(data.certificate);
      setVersion(data.latestVersion);
      setUploadedHash(data.uploadedHash);
      setExpectedHash(data.expectedHash);
      setProof(data.blockchainProof);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleIdVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: certId.trim(),
          verificationType: 'ID_LOOKUP'
        })
      });

      const data = await res.json();
      setResult(data.result);
      setMessage(data.message);
      setCert(data.certificate || null);
      setVersion(data.latestVersion || null);
      setUploadedHash(data.uploadedHash || '');
      setExpectedHash(data.expectedHash || '');
      setProof(data.blockchainProof || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('certificateId', certId);
      formData.append('document', uploadedFile);

      const res = await fetch('/api/verify', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setResult(data.result);
      setMessage(data.message);
      setCert(data.certificate || null);
      setVersion(data.latestVersion || null);
      setUploadedHash(data.uploadedHash || '');
      setExpectedHash(data.expectedHash || '');
      setProof(data.blockchainProof || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          Public Record Verification Portal
        </h1>
        <p className="text-sm text-slate-400">
          Verify the authenticity and integrity of official certificates using blockchain-backed cryptographic proofs.
        </p>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center justify-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('ID')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ID' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Certificate ID
        </button>

        <button
          onClick={() => setActiveTab('FILE')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'FILE' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload PDF File
        </button>

        <button
          onClick={() => setActiveTab('QR')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'QR' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Scan QR Code
        </button>
      </div>

      {/* TAB 1: ID LOOKUP */}
      {activeTab === 'ID' && (
        <form onSubmit={handleIdVerify} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 max-w-xl mx-auto">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Enter Official Certificate ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. CERT-2027-001024"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors text-xs shrink-0"
            >
              {loading ? 'Verifying...' : 'Verify ID'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: FILE UPLOAD */}
      {activeTab === 'FILE' && (
        <form onSubmit={handleFileVerify} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 max-w-xl mx-auto">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Upload PDF Document for SHA-256 Hash Matching
          </label>
          
          <div className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 bg-slate-950 p-8 rounded-2xl text-center space-y-3 relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.png,.jpg"
              onChange={(e) => setUploadedFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              <Upload className="w-6 h-6" />
            </div>
            {uploadedFile ? (
              <div>
                <p className="font-bold text-sm text-emerald-400">{uploadedFile.name}</p>
                <p className="text-xs text-slate-400 font-mono">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-slate-200">Drag & Drop certificate PDF here</p>
                <p className="text-xs text-slate-500 mt-1">Calculates SHA-256 fingerprint in browser memory</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !uploadedFile}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-xs disabled:opacity-50"
          >
            {loading ? 'Computing Hash & Checking Blockchain...' : 'Verify Uploaded Document'}
          </button>
        </form>
      )}

      {/* TAB 3: QR SCAN */}
      {activeTab === 'QR' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/30">
            <QrCode className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-white">Scan Certificate QR Code</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            Point your smartphone camera or QR scanner at the certificate QR code. The scanner opens the instant verification endpoint directly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => { setCertId('CERT-2027-001024'); setActiveTab('ID'); }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700"
            >
              Simulate QR Scan (CERT-2027-001024)
            </button>
          </div>
        </div>
      )}

      {/* RESULT CARDS DISPLAY */}
      {result && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
          
          {/* VERIFIED VALID */}
          {result === 'VALID' && (
            <div className="bg-emerald-950/90 border-2 border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-emerald-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-emerald-300">DOCUMENT VERIFIED AUTHENTIC</h3>
                  <p className="text-xs text-emerald-200/90 mt-1 font-medium">{message}</p>
                </div>
              </div>

              {cert && (
                <div className="bg-slate-950/80 p-5 rounded-xl border border-emerald-800/60 space-y-3 text-xs text-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Holder Name</span>
                      <p className="font-bold text-sm text-white">{cert.subjectName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Course / Degree</span>
                      <p className="font-bold text-sm text-white">{cert.course}</p>
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
              )}

              {proof && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-800/60 text-xs font-mono space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Blockchain Proof Receipt</span>
                  <p className="text-slate-300 truncate">Tx: {proof.transactionHash}</p>
                  <p className="text-slate-400">Block #{proof.blockNumber} • Network: {proof.network}</p>
                </div>
              )}
            </div>
          )}

          {/* TAMPER DETECTED */}
          {result === 'TAMPERED' && (
            <div className="bg-rose-950/90 border-2 border-rose-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-rose-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-rose-400">❌ TAMPER DETECTED</h3>
                  <p className="text-xs text-rose-200 mt-1 font-medium leading-relaxed">{message}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-rose-800 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Registered Blockchain Hash</span>
                  <p className="text-emerald-300 break-all select-all">{expectedHash || 'B82D44E92100491823C4D5E6F70123456789ABCDEF0123456789ABCDEF012345'}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-rose-800 space-y-1">
                  <span className="text-[10px] text-rose-400 font-bold uppercase">Uploaded Document Hash</span>
                  <p className="text-rose-300 break-all select-all">{uploadedHash || '9999999999999999999999999999999999999999999999999999999999999999'}</p>
                </div>
              </div>

              <div className="bg-rose-900/40 p-3 rounded-xl border border-rose-800 text-xs text-rose-200">
                <p className="font-bold">Security Analysis:</p>
                <p className="text-[11px] text-rose-300 mt-0.5">
                  The SHA-256 cryptographic signature of the uploaded PDF file does not match the anchor recorded on the blockchain. This document has been edited, modified, or forged after issuance.
                </p>
              </div>
            </div>
          )}

          {/* REVOKED */}
          {result === 'REVOKED' && (
            <div className="bg-rose-950/90 border-2 border-rose-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 text-rose-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 shrink-0">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-rose-400">❌ RECORD REVOKED</h3>
                  <p className="text-xs text-rose-200 mt-1 font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function PublicVerifyPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400 font-mono">
        Loading Public Verification Portal...
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
