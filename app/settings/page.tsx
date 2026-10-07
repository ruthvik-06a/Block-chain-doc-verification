'use client';

import React, { useState } from 'react';
import { Settings, Cpu, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [rpcUrl, setRpcUrl] = useState('https://rpc-amoy.polygon.technology');
  const [contractAddr, setContractAddr] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-sky-400" />
          System Settings & Network Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">Configure RPC endpoints, contract addresses, and demo environment state.</p>
      </div>

      {saved && (
        <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-xs">
        
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            EVM Blockchain Network Settings
          </h3>

          <div>
            <label className="block text-slate-300 font-bold mb-1">RPC Endpoint URL</label>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">VeriChainRecord Smart Contract Address</label>
            <input
              type="text"
              value={contractAddr}
              onChange={(e) => setContractAddr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors"
        >
          Save Configuration
        </button>

      </form>

    </div>
  );
}
