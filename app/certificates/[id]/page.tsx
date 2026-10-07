'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, CheckCircle2, ShieldAlert, GitBranch, Cpu, Download, QrCode, XCircle, Sparkles, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { Certificate, DocumentVersion, AuditLog } from '@/lib/db';
import { BlockchainProof } from '@/lib/blockchain';
import GitHubTimeline from '@/components/GitHubTimeline';
import BlockchainProofModal from '@/components/BlockchainProofModal';
import QRCodeModal from '@/components/QRCodeModal';

export default function CertificateDetailPage() {
  const params = useParams();
  const certIdParam = params.id as string;

  const [cert, setCert] = useState<Certificate | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [proof, setProof] = useState<BlockchainProof | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProofModal, setShowProofModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  // Version update form state
  const [newCgpa, setNewCgpa] = useState('');
  const [changeDesc, setChangeDesc] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCertDetails();
  }, [certIdParam]);

  const fetchCertDetails = async () => {
    try {
      const res = await fetch(`/api/certificates/${certIdParam}`);
      const data = await res.json();
      if (data.certificate) {
        setCert(data.certificate);
        setVersions(data.versions || []);
        setAuditLogs(data.auditLogs || []);
        setProof(data.blockchainProof || null);
        setNewCgpa(data.certificate.cgpa || '8.5');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cert) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('changeDescription', changeDesc || `CGPA updated to ${newCgpa}`);
      formData.append('cgpa', newCgpa);

      const res = await fetch(`/api/certificates/${cert.id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setShowVersionModal(false);
        fetchCertDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cert) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/certificates/${cert.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: revokeReason || 'Administrative revocation request' })
      });

      const data = await res.json();
      if (data.success) {
        setShowRevokeModal(false);
        fetchCertDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-400 mb-3" />
        Fetching record & blockchain proof...
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Record Not Found</h2>
        <p className="text-sm text-slate-400">The requested certificate record does not exist in the VeriChain database.</p>
        <Link href="/certificates" className="inline-block bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
          Return to Registry
        </Link>
      </div>
    );
  }

  const latestVersion = versions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* HEADER BAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-bold text-sm text-sky-400 bg-sky-950 px-3 py-1 rounded-xl border border-sky-800">
                {cert.certificateId}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                cert.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                cert.status === 'REVOKED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                'bg-amber-950 text-amber-400 border-amber-800'
              }`}>
                {cert.status}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                Current: v{cert.currentVersion}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white">{cert.subjectName}</h1>
            <p className="text-sm text-slate-300 font-medium">{cert.course} • Issued by {cert.organizationName}</p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/verify/${cert.certificateId}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify Record
            </Link>

            <button
              onClick={() => setShowQRModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              QR Code
            </button>

            <button
              onClick={() => setShowProofModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              Blockchain Proof
            </button>

            {cert.status === 'ACTIVE' && (
              <>
                <button
                  onClick={() => setShowVersionModal(true)}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                  New Version
                </button>

                <button
                  onClick={() => setShowRevokeModal(true)}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-rose-800 flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  Revoke
                </button>
              </>
            )}
          </div>

        </div>

        {/* REVOCATION WARNING IF REVOKED */}
        {cert.status === 'REVOKED' && (
          <div className="bg-rose-950/90 border border-rose-800 p-4 rounded-xl text-rose-200 text-xs space-y-1">
            <p className="font-bold flex items-center gap-2 text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              THIS CERTIFICATE HAS BEEN PERMANENTLY REVOKED
            </p>
            <p><span className="font-bold">Reason:</span> {cert.revocationReason || 'Administrative order'}</p>
            <p className="text-[11px] text-rose-400/80 font-mono">Revoked by {cert.revokedBy || 'Authority'} on {new Date(cert.revokedAt!).toLocaleString()}</p>
          </div>
        )}

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Issue Date</span>
            <p className="font-bold text-slate-200 text-sm">{cert.issueDate}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CGPA / Grade</span>
            <p className="font-bold text-sky-400 text-sm">{cert.cgpa || 'N/A'}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Current Version Hash</span>
            <p className="font-mono text-[11px] text-emerald-400 truncate">{latestVersion?.documentHash}</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Blockchain Status</span>
            <p className="font-mono text-[11px] text-purple-300 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Anchored on Polygon
            </p>
          </div>

        </div>

      </div>

      {/* SAMPLE TEST PDF DOWNLOAD BAR FOR JUDGES */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-400" />
            Download Sample PDFs for Hackathon Testing
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Generate authentic or tampered sample PDFs for drag-and-drop verification testing.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href={`/api/demo/generate-pdf?certId=${cert.certificateId}&tampered=false`}
            target="_blank"
            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
          >
            Authentic PDF
          </a>
          <a
            href={`/api/demo/generate-pdf?certId=${cert.certificateId}&tampered=true`}
            target="_blank"
            className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
          >
            Tampered PDF (CGPA 9.9)
          </a>
        </div>
      </div>

      {/* TWO COLUMNS: VERSION HISTORY + GITHUB ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Version History Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-sky-400" />
              Version History
            </h3>
            <Link href={`/certificates/${cert.id}/versions`} className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
              Diff Breakdown →
            </Link>
          </div>

          <div className="space-y-3">
            {versions.map((ver) => (
              <div
                key={ver.id}
                className={`bg-slate-900/90 border p-4 rounded-xl space-y-2 transition-all ${
                  ver.version === cert.currentVersion ? 'border-sky-500/50 bg-slate-900' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    Version {ver.version} {ver.version === cert.currentVersion && '(CURRENT)'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(ver.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium">{ver.changeDescription}</p>

                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
                  <p className="truncate"><span className="text-emerald-400">Hash: </span>{ver.documentHash}</p>
                  <p className="truncate"><span className="text-amber-400">Prev: </span>{ver.previousHash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Activity Timeline Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            GitHub-Style Activity History
          </h3>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <GitHubTimeline logs={auditLogs} onViewProof={() => setShowProofModal(true)} />
          </div>
        </div>

      </div>

      {/* MODALS */}
      <BlockchainProofModal proof={proof} onClose={() => setShowProofModal(false)} />
      
      {showQRModal && (
        <QRCodeModal certificateId={cert.certificateId} subjectName={cert.subjectName} onClose={() => setShowQRModal(false)} />
      )}

      {/* New Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">Create Version {cert.currentVersion + 1}</h3>
            <p className="text-xs text-slate-400">Legitimate record updates link parent hash {latestVersion?.documentHash.substring(0, 8)}... to the new version.</p>
            
            <form onSubmit={handleCreateVersion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Updated CGPA</label>
                <input
                  type="text"
                  value={newCgpa}
                  onChange={(e) => setNewCgpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Change Description / Reason</label>
                <textarea
                  value={changeDesc}
                  onChange={(e) => setChangeDesc(e.target.value)}
                  placeholder="e.g. Legitimate Update: CGPA updated 8.0 → 8.5 following re-evaluation."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-sky-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVersionModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md"
                >
                  {submitting ? 'Creating Version...' : 'Create & Link Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-rose-400">Revoke Certificate {cert.certificateId}</h3>
            <p className="text-xs text-slate-400">This action permanently invalidates public verification for this record on-chain.</p>
            
            <form onSubmit={handleRevoke} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Revocation Reason</label>
                <textarea
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Certificate issued under wrong specialization code (Administrative error)."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-rose-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md"
                >
                  {submitting ? 'Revoking...' : 'Confirm Revocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
