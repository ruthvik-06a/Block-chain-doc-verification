'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Sparkles, FileText, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Certificate } from '@/lib/db';

export default function CertificateListPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [query, statusFilter]);

  const fetchCertificates = async () => {
    try {
      const url = new URL('/api/certificates', window.location.origin);
      if (query) url.searchParams.set('q', query);
      if (statusFilter) url.searchParams.set('status', statusFilter);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.certificates) setCertificates(data.certificates);
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Official Record Registry</h1>
          <p className="text-sm text-slate-400 mt-1">Browse, search, version, and inspect blockchain-anchored certificates.</p>
        </div>

        <Link
          href="/certificates/create"
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Issue New Record
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="sm:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Certificate ID, Name, Organization, Course..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Record Statuses</option>
            <option value="ACTIVE">ACTIVE Only</option>
            <option value="REVOKED">REVOKED Only</option>
            <option value="EXPIRED">EXPIRED Only</option>
          </select>
        </div>

      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-sky-400 bg-sky-950 px-2.5 py-1 rounded-lg border border-sky-800">
                  {cert.certificateId}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  cert.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  cert.status === 'REVOKED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                  'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {cert.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-sky-300 transition-colors">
                  {cert.subjectName}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{cert.course}</p>
                {cert.cgpa && <p className="text-xs text-slate-400 mt-0.5">CGPA: <span className="font-bold text-slate-200">{cert.cgpa}</span></p>}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Issued By:</span>
                  <span className="font-medium text-slate-200">{cert.organizationName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current Version:</span>
                  <span className="font-mono text-sky-400 font-bold">v{cert.currentVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Issue Date:</span>
                  <span className="font-mono">{cert.issueDate}</span>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
              <Link
                href={`/verify/${cert.certificateId}`}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verify
              </Link>

              <Link
                href={`/certificates/${cert.id}`}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                Inspect Details →
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
