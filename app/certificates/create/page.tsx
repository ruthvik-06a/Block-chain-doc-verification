'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, FileText, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export default function CreateCertificatePage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState(`CERT-2027-${Math.floor(100000 + Math.random() * 900000)}`);
  const [subjectName, setSubjectName] = useState('Rahul Kumar');
  const [course, setCourse] = useState('B.E Computer Science');
  const [cgpa, setCgpa] = useState('8.5');
  const [issueDate, setIssueDate] = useState('2027-10-10');
  const [organizationName, setOrganizationName] = useState('XYZ University');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('certificateId', certificateId);
      formData.append('subjectName', subjectName);
      formData.append('course', course);
      formData.append('cgpa', cgpa);
      formData.append('issueDate', issueDate);
      formData.append('organizationName', organizationName);
      if (file) {
        formData.append('document', file);
      }

      const res = await fetch('/api/certificates', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to issue record');
      }

      router.push(`/certificates/${data.certificate.id}`);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-sky-400" />
          Issue Official Record
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload original document PDF, compute SHA-256 hash, register Version 1 on blockchain, and generate verification QR.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-xl text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Certificate Record ID
            </label>
            <input
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-sky-400 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Issuing Organization
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Holder / Student Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Course / Degree / Designation
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. B.E Computer Science"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              CGPA / Score / Result
            </label>
            <input
              type="text"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

        </div>

        {/* File Upload Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Original PDF Document Upload
          </label>
          <div className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 bg-slate-950 p-8 rounded-2xl text-center space-y-3 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              <Upload className="w-6 h-6" />
            </div>
            {file ? (
              <div>
                <p className="font-bold text-sm text-emerald-400">{file.name}</p>
                <p className="text-xs text-slate-400 font-mono">{(file.size / 1024).toFixed(1)} KB • SHA-256 ready</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-sm text-slate-200">Drag & Drop original PDF or click to browse</p>
                <p className="text-xs text-slate-500 font-mono mt-1">(If left empty, system auto-generates deterministic PDF payload)</p>
              </div>
            )}
          </div>
        </div>

        {/* Processing Steps Visualization */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
          <div className="flex items-center text-slate-400 gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Generate SHA-256 Cryptographic Fingerprint</span>
          </div>
          <div className="flex items-center text-slate-400 gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Create Immutable Version 1 Record</span>
          </div>
          <div className="flex items-center text-slate-400 gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Anchor Event & Hash Proof on Polygon Amoy Smart Contract</span>
          </div>
          <div className="flex items-center text-slate-400 gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Generate Verification QR Code</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Processing Blockchain Anchor...' : 'Issue Record & Anchor on Blockchain'}
        </button>

      </form>

    </div>
  );
}
