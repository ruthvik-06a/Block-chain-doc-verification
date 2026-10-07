'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, ExternalLink, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  certificateId: string;
  subjectName: string;
  onClose: () => void;
}

export default function QRCodeModal({ certificateId, subjectName, onClose }: QRCodeModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const verifyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${certificateId}`
    : `https://verichain.org/verify/${certificateId}`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
  }, [verifyUrl]);

  const copyUrl = () => {
    navigator.clipboard.writeText(verifyUrl);
    alert("Verification URL copied!");
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `QR_${certificateId}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-left">
            <QrCode className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm text-white">Record Verification QR</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {qrUrl ? (
          <div className="bg-white p-4 rounded-2xl inline-block border-4 border-sky-500/30 shadow-inner">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-xs">
            Generating QR...
          </div>
        )}

        <div>
          <h4 className="font-bold text-slate-100 text-sm">{subjectName}</h4>
          <p className="font-mono text-xs text-sky-400 font-semibold">{certificateId}</p>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 truncate text-left">
          {verifyUrl}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={copyUrl}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy URL
          </button>
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2 rounded-xl shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR
          </button>
        </div>

      </div>
    </div>
  );
}
