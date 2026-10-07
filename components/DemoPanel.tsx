'use client';

import React, { useState } from 'react';
import { Play, Download, AlertTriangle, CheckCircle, RefreshCw, FileText, XCircle, ShieldAlert, Sparkles, GitCommit } from 'lucide-react';

export default function DemoPanel() {
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const runDemoScenario = async (action: string) => {
    setLoading(true);
    setStatusMsg(`Running ${action}...`);

    try {
      if (action === 'download_authentic') {
        window.open('/api/demo/generate-pdf?certId=CERT-2027-001024&tampered=false', '_blank');
        setStatusMsg('Downloaded authentic degree PDF: rahul_kumar_degree_v1.pdf');
      } else if (action === 'download_tampered') {
        window.open('/api/demo/generate-pdf?certId=CERT-2027-001024&tampered=true', '_blank');
        setStatusMsg('Downloaded tampered degree PDF: rahul_kumar_degree_TAMPERED.pdf');
      } else if (action === 'verify_authentic') {
        window.location.href = '/verify/CERT-2027-001024';
      } else if (action === 'verify_tampered_demo') {
        window.location.href = '/verify?demoTampered=true';
      } else if (action === 'create_version_2') {
        window.location.href = '/certificates/cert-001';
      } else if (action === 'view_timeline') {
        window.location.href = '/certificates/cert-001#timeline';
      } else if (action === 'revoke_demo') {
        window.location.href = '/certificates/cert-003';
      } else if (action === 'issue_new') {
        window.location.href = '/certificates/create';
      }
    } catch (e: any) {
      setStatusMsg(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-sky-400/30 hover:scale-105 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        Hackathon Judge Demo Toolbar
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 text-slate-100 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Play className="w-4 h-4 fill-sky-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white tracking-wide">JUDGE DEMO CONTROL CENTER</h4>
            <p className="text-[10px] text-sky-400 font-mono">1-Click Live Test Scenarios</p>
          </div>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
        >
          Minimize
        </button>
      </div>

      {statusMsg && (
        <div className="my-2 p-2 bg-sky-950/80 border border-sky-700/50 rounded-lg text-[11px] text-sky-300 font-mono flex items-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin shrink-0 text-sky-400" />
          <span className="truncate">{statusMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => runDemoScenario('download_authentic')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-emerald-500/50 group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <Download className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 rounded">Authentic</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-emerald-300">1. Download Authentic PDF</span>
        </button>

        <button
          onClick={() => runDemoScenario('download_tampered')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-rose-500/50 group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-rose-950 text-rose-300 px-1 rounded">Tampered</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-rose-300">2. Download Tampered PDF</span>
        </button>

        <button
          onClick={() => runDemoScenario('verify_authentic')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-sky-500/50 group"
        >
          <div className="flex items-center justify-between text-sky-400 mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-sky-950 text-sky-300 px-1 rounded">Lookup</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-sky-300">3. Verify Genuine Record</span>
        </button>

        <button
          onClick={() => runDemoScenario('verify_tampered_demo')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-rose-500/50 group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-rose-950 text-rose-300 px-1 rounded">Upload</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-rose-300">4. Test Tamper Detector</span>
        </button>

        <button
          onClick={() => runDemoScenario('create_version_2')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-indigo-500/50 group"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <GitCommit className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1 rounded">Version</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-indigo-300">5. View Version 1 → 2</span>
        </button>

        <button
          onClick={() => runDemoScenario('revoke_demo')}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition-all text-xs flex flex-col justify-between hover:border-amber-500/50 group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[9px] bg-amber-950 text-amber-300 px-1 rounded">Revoke</span>
          </div>
          <span className="font-medium text-[11px] text-slate-200 group-hover:text-amber-300">6. View Revoked Certificate</span>
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Target Record: CERT-2027-001024</span>
        <span className="text-emerald-400 font-bold">Network: Polygon Amoy</span>
      </div>
    </div>
  );
}
