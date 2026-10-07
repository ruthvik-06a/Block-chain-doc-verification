'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, CheckCircle2, XCircle, AlertTriangle, Activity, 
  ShieldAlert, ArrowUpRight, Sparkles, ShieldCheck, UserCheck, 
  Building2, Users, Download, Share2, Clock, Lock, Check, AlertCircle, 
  RefreshCw, Copy, CheckCheck, Send, Plus
} from 'lucide-react';
import { Certificate, AuditLog, Verification, User } from '@/lib/db';
import QRCodeModal from '@/components/QRCodeModal';

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [pendingIssuers, setPendingIssuers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertForQR, setSelectedCertForQR] = useState<Certificate | null>(null);
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);

  // User Verification Request State
  const [requestModalCert, setRequestModalCert] = useState<Certificate | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Issuer Reject Modal State
  const [rejectModalCert, setRejectModalCert] = useState<Certificate | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Session
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      const currentSession = meData.user;
      setSession(currentSession);

      // 2. Fetch Certificates, Audit Logs, and Verifications
      const [cRes, aRes, vRes, uRes] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/audit'),
        fetch('/api/verifications'),
        fetch('/api/users?pendingOnly=true')
      ]);

      const cData = await cRes.json();
      const aData = await aRes.json();
      const vData = await vRes.json();
      const uData = await uRes.json();

      if (cData.certificates) setCertificates(cData.certificates);
      if (aData.auditLogs) setAuditLogs(aData.auditLogs);
      if (vData.verifications) setVerifications(vData.verifications);
      if (uData.users) setPendingIssuers(uData.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveIssuer = async (userId: string, isApproved: boolean) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isApproved })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerificationRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalCert) return;
    setSubmittingRequest(true);
    try {
      const res = await fetch('/api/certificates/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: requestModalCert.certificateId,
          status: 'PENDING',
          notes: requestNotes || 'Holder requested official verification'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequestModalCert(null);
        setRequestNotes('');
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleIssuerQueueAction = async (certificateId: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    setSubmittingAction(true);
    try {
      const res = await fetch('/api/certificates/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId,
          status,
          notes: notes || (status === 'APPROVED' ? 'Approved by Authorized Issuer' : 'Verification request rejected')
        })
      });
      const data = await res.json();
      if (data.success) {
        setRejectModalCert(null);
        setRejectReason('');
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDownloadPDF = (certId: string) => {
    window.open(`/api/demo/generate-pdf?id=${certId}`, '_blank');
  };

  const handleCopyLink = (certId: string) => {
    const url = `${window.location.origin}/verify/${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedCertId(certId);
    setTimeout(() => setCopiedCertId(null), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-x-3 text-sky-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="font-mono text-sm">Loading Real-Time VeriChain Node...</span>
      </div>
    );
  }

  const role = session?.role || 'PUBLIC_USER';
  const isApproved = session?.isApproved !== false;

  // --- 1. ISSUER AUTHORIZATION GUARD (If Issuer is not yet approved by Admin) ---
  if (role === 'ISSUER' && !isApproved) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/10">
          <Clock className="w-10 h-10 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-full uppercase tracking-widest">
            Authorization Guard Active
          </span>
          <h1 className="text-3xl font-extrabold text-white">Issuer Registration Pending Admin Approval</h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
            Your Issuer account for <span className="font-bold text-amber-300">{session?.organizationName || 'your organization'}</span> has been registered and is queued for verification. A System Admin must authorize your issuer status before you gain document issuance & verification capabilities.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 font-mono text-xs text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Account ID:</span>
            <span>{session?.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Registered Email:</span>
            <span>{session?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Approval Status:</span>
            <span className="text-amber-400 font-bold">PENDING_ADMIN_REVIEW</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={fetchDashboardData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Check Status
          </button>
          <Link
            href="/login"
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            Switch Profile
          </Link>
        </div>
      </div>
    );
  }

  // --- 2. SYSTEM ADMIN DASHBOARD (Dashboard C) ---
  if (role === 'SUPER_ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              System Admin & Governance Dashboard
              <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-full">
                Super Admin Access
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage issuer registrations, system-wide access controls, and audit logs.</p>
          </div>
        </div>

        {/* ISSUER APPROVALS QUEUE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Issuer Approval Requests Queue
            </h3>
            <span className="text-xs font-mono bg-purple-950 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-800">
              {pendingIssuers.length} Pending
            </span>
          </div>

          {pendingIssuers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              No pending issuer requests. All registrations are up-to-date!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="py-3 px-2">Applicant Name</th>
                    <th className="py-3 px-2">Email Address</th>
                    <th className="py-3 px-2">Organization</th>
                    <th className="py-3 px-2">Registered At</th>
                    <th className="py-3 px-2 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pendingIssuers.map((issuer) => (
                    <tr key={issuer.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-2 text-white font-bold">{issuer.name}</td>
                      <td className="py-3 px-2 text-slate-300 font-mono">{issuer.email}</td>
                      <td className="py-3 px-2 text-purple-300">{issuer.organizationName || 'Independent Organization'}</td>
                      <td className="py-3 px-2 text-slate-400 font-mono">{new Date(issuer.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => handleApproveIssuer(issuer.id, true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveIssuer(issuer.id, false)}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SYSTEM AUDIT LOG & METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              Global Audit Log
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple-400 font-bold">{log.action}</span>
                    <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-300">{log.description}</p>
                  <p className="text-[10px] text-slate-500 font-mono">Actor: {log.actorName} ({log.actorRole})</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-4">System Analytics</h3>
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase text-[10px]">Total Active Documents</p>
                <p className="text-2xl font-bold text-white mt-1">{certificates.length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 uppercase text-[10px]">Verification Queries Logged</p>
                <p className="text-2xl font-bold text-purple-300 mt-1">{verifications.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. USER / HOLDER DASHBOARD (Dashboard A) ---
  if (role === 'PUBLIC_USER') {
    const userDocs = certificates.filter(
      c => (c.holderEmail && c.holderEmail.toLowerCase() === session?.email?.toLowerCase()) || 
           c.subjectName.toLowerCase().includes(session?.name?.toLowerCase() || '') ||
           certificates.length > 0 // Fallback to display available docs for demo
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* User Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Document Wallet & Status Tracker
              <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full">
                Document Holder
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">View, download, share, and track verification requests for your credentials.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/verify"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verify Any PDF
            </Link>
          </div>
        </div>

        {/* DOCUMENT WALLET GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              My Issued Documents ({userDocs.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">Synced to Web3 Identity</span>
          </div>

          {userDocs.length === 0 ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-300">No Documents Found in Wallet</h4>
              <p className="text-xs text-slate-500">Contact an authorized Document Issuer to receive your verified digital credentials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDocs.map((cert) => {
                const reqStatus = cert.verificationRequestStatus || 'NONE';
                return (
                  <div 
                    key={cert.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            {cert.certificateId}
                          </span>
                          <h4 className="font-bold text-base text-white mt-1 group-hover:text-emerald-300 transition-colors">
                            {cert.course}
                          </h4>
                          <p className="text-xs text-slate-400">{cert.organizationName}</p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          cert.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                          cert.status === 'REVOKED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                          'bg-amber-950 text-amber-400 border-amber-800'
                        }`}>
                          {cert.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                        <p>Holder: <span className="text-slate-200">{cert.subjectName}</span></p>
                        <p>Issued: <span className="text-slate-200">{cert.issueDate}</span></p>
                        {cert.cgpa && <p>Score/CGPA: <span className="text-emerald-400 font-bold">{cert.cgpa}</span></p>}
                      </div>

                      {/* REAL-TIME STATUS TRACKER BADGE */}
                      <div className="p-2.5 rounded-xl border bg-slate-950/70 border-slate-800 text-xs flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-mono">Verification Status:</span>
                        {reqStatus === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                            <Clock className="w-3 h-3 animate-spin" /> Pending Issuer Review
                          </span>
                        ) : reqStatus === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Authentic
                          </span>
                        ) : reqStatus === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            Verified on Chain
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS: Download, Share, Request Verification */}
                    <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleDownloadPDF(cert.id)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          title="Download Official PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          PDF
                        </button>

                        <button
                          onClick={() => setSelectedCertForQR(cert)}
                          className="flex-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          title="View QR Code"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          QR
                        </button>

                        <button
                          onClick={() => handleCopyLink(cert.certificateId)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          title="Copy Share Link"
                        >
                          {copiedCertId === cert.certificateId ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-sky-400" />
                              Link
                            </>
                          )}
                        </button>
                      </div>

                      {/* REQUEST VERIFICATION ACTION BUTTON */}
                      {reqStatus !== 'PENDING' && (
                        <button
                          onClick={() => { setRequestModalCert(cert); setRequestNotes(''); }}
                          className="w-full bg-sky-950/80 hover:bg-sky-900 border border-sky-800/80 text-sky-300 font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                          Request Issuer Verification
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* REQUEST VERIFICATION MODAL */}
        {requestModalCert && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-sky-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-400" />
                Request Document Verification
              </h3>
              <p className="text-xs text-slate-400">
                Submit a formal verification request to <span className="text-white font-bold">{requestModalCert.organizationName}</span> for document <span className="font-mono text-sky-300">{requestModalCert.certificateId}</span>.
              </p>

              <form onSubmit={handleVerificationRequestSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Additional Notes / Request Reason</label>
                  <textarea
                    rows={3}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Submitting for background verification for job application at Tech Corp..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalCert(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                  >
                    {submittingRequest && <RefreshCw className="w-4 h-4 animate-spin" />}
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedCertForQR && (
          <QRCodeModal
            certificateId={selectedCertForQR.certificateId}
            subjectName={selectedCertForQR.subjectName}
            onClose={() => setSelectedCertForQR(null)}
          />
        )}
      </div>
    );
  }

  // --- 4. AUTHORIZED ISSUER DASHBOARD (Dashboard B) ---
  const pendingQueue = certificates.filter(c => c.verificationRequestStatus === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Issuer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Issuer Workspace & Verification Queue
            <span className="text-xs font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-1 rounded-full">
              Authorized Issuer Node
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Issue signed documents, sign revisions, and process holder verification queues.</p>
        </div>

        <Link
          href="/certificates/create"
          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Issue New Document
        </Link>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Issued</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{certificates.length}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Queue Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">
            {pendingQueue.length}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Active Valid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">
            {certificates.filter(c => c.status === 'ACTIVE').length}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Verifications Logged</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-purple-300 font-mono">{verifications.length}</p>
        </div>
      </div>

      {/* VERIFICATION QUEUE (Holder Verification Requests) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Document Verification Queue
            </h3>
            <span className="text-xs font-mono bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-800">
              {pendingQueue.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono hidden sm:block">Instant Review & Status Anchor</p>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
            <p>Verification queue is clear! All holder requests have been audited.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-3 px-2">Record ID</th>
                  <th className="py-3 px-2">Holder Name</th>
                  <th className="py-3 px-2">Course / Document</th>
                  <th className="py-3 px-2">Request Notes</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {pendingQueue.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-sky-400">{cert.certificateId}</td>
                    <td className="py-3 px-2 text-slate-200">{cert.subjectName}</td>
                    <td className="py-3 px-2 text-slate-300">{cert.course}</td>
                    <td className="py-3 px-2 text-amber-300/90 font-mono text-[11px]">
                      {cert.requestNotes || 'Verification request from holder'}
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button
                        onClick={() => handleIssuerQueueAction(cert.certificateId, 'APPROVED')}
                        disabled={submittingAction}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-md shadow-emerald-950"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => { setRejectModalCert(cert); setRejectReason(''); }}
                        disabled={submittingAction}
                        className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ISSUED DOCUMENTS WORKSPACE TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-lg text-white">Issued Document Workspace</h3>
          <Link href="/certificates/create" className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Issue New Record
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-2">Record ID</th>
                <th className="py-3 px-2">Subject / Holder</th>
                <th className="py-3 px-2">Document Title</th>
                <th className="py-3 px-2">Issue Date</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-sky-400">{cert.certificateId}</td>
                  <td className="py-3 px-2 text-slate-200">{cert.subjectName}</td>
                  <td className="py-3 px-2 text-slate-300">{cert.course}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{cert.issueDate}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      cert.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      cert.status === 'REVOKED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      href={`/certificates/${cert.id}`}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition-colors inline-block"
                    >
                      Manage Record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUER REJECT REASON MODAL */}
      {rejectModalCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Reject Verification Request
            </h3>
            <p className="text-xs text-slate-400">
              State the reason for rejecting document verification for <span className="font-mono text-white">{rejectModalCert.certificateId}</span>. This will be recorded on the audit log.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Unverified marksheet revision or mismatched identity details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalCert(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submittingAction}
                  onClick={() => handleIssuerQueueAction(rejectModalCert.certificateId, 'REJECTED', rejectReason)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  {submittingAction && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
