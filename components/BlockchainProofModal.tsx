'use client';

import React from 'react';
import { X, CheckCircle, ExternalLink, ShieldCheck, Copy, Cpu, Layers } from 'lucide-react';
import { BlockchainProof } from '@/lib/blockchain';

interface BlockchainProofModalProps {
  proof: BlockchainProof | null;
  onClose: () => void;
}

export default function BlockchainProofModal({ proof, onClose }: BlockchainProofModalProps) {
  if (!proof) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                Blockchain Cryptographic Proof
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Confirmed
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Anchored on EVM Smart Contract</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Blockchain Network</span>
            <p className="font-bold text-slate-200 text-sm">{proof.network}</p>
            <p className="text-[10px] text-slate-400 font-mono">Chain ID: {proof.chainId}</p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Block Number</span>
            <p className="font-bold text-sky-400 text-sm font-mono">#{proof.blockNumber}</p>
            <p className="text-[10px] text-slate-400 font-mono">{new Date(proof.timestamp).toLocaleString()}</p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Smart Contract Address</span>
              <button onClick={() => copyToClipboard(proof.contractAddress)} className="text-slate-400 hover:text-sky-400">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-mono text-xs text-slate-200 break-all select-all">{proof.contractAddress}</p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Transaction Receipt Hash</span>
              <button onClick={() => copyToClipboard(proof.transactionHash)} className="text-slate-400 hover:text-sky-400">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-mono text-xs text-purple-300 break-all select-all">{proof.transactionHash}</p>
          </div>

          <div className="col-span-1 md:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">Document SHA-256 Hash</span>
              <button onClick={() => copyToClipboard(proof.documentHash)} className="text-slate-400 hover:text-sky-400">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-mono text-xs text-emerald-400 break-all select-all">{proof.documentHash}</p>
          </div>

          {proof.previousHash && proof.previousHash !== "0000000000000000000000000000000000000000000000000000000000000000" && (
            <div className="col-span-1 md:col-span-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Parent Hash (Linked Version Chain)</span>
                <button onClick={() => copyToClipboard(proof.previousHash)} className="text-slate-400 hover:text-amber-400">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-mono text-xs text-amber-300 break-all select-all">{proof.previousHash}</p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" /> Cryptographic Proof Validated
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Close Proof
          </button>
        </div>

      </div>
    </div>
  );
}
