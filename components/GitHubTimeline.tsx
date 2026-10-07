'use client';

import React from 'react';
import { GitCommit, FileText, CheckCircle2, AlertOctagon, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { AuditLog } from '@/lib/db';

interface GitHubTimelineProps {
  logs: AuditLog[];
  onViewProof?: (txHash: string) => void;
}

export default function GitHubTimeline({ logs, onViewProof }: GitHubTimelineProps) {
  const getIcon = (action: string) => {
    switch (action) {
      case 'CERTIFICATE_CREATED':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'DOCUMENT_UPLOADED':
        return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'DOCUMENT_UPDATED':
      case 'VERSION_CREATED':
        return <GitCommit className="w-4 h-4 text-indigo-400" />;
      case 'CERTIFICATE_VERIFIED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'CERTIFICATE_REVOKED':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeColor = (action: string) => {
    switch (action) {
      case 'CERTIFICATE_CREATED': return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'DOCUMENT_UPLOADED': return 'bg-sky-950/80 text-sky-400 border-sky-800/60';
      case 'VERSION_CREATED': return 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60';
      case 'CERTIFICATE_VERIFIED': return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'CERTIFICATE_REVOKED': return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-indigo-500 before:to-slate-700">
      {logs.map((log, index) => (
        <div key={log.id || index} className="relative group">
          {/* Node Icon Circle */}
          <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
            {getIcon(log.action)}
          </div>

          {/* Activity Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getBadgeColor(log.action)}`}>
                  {log.action.replace('_', ' ')}
                </span>
                {log.version && (
                  <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/50">
                    v{log.version}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-medium mb-3 leading-relaxed">
              {log.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Actor:</span>
                <span className="text-slate-200 font-medium">{log.actorName}</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{log.actorRole}</span>
              </div>

              {log.blockchainTxHash && (
                <button
                  onClick={() => onViewProof && onViewProof(log.blockchainTxHash!)}
                  className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 transition-colors font-medium text-[11px]"
                >
                  <span>Tx: {log.blockchainTxHash.substring(0, 10)}...</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {log.eventHash && (
              <div className="mt-2 text-[10px] font-mono text-slate-400 truncate bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                <span className="text-sky-400">SHA-256 Event Hash: </span>
                <span>{log.eventHash}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
