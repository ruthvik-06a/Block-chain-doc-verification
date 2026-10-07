import { NextRequest, NextResponse } from 'next/server';
import { Database, VerificationResult } from '@/lib/db';
import { calculateSHA256, compareHashes } from '@/lib/crypto';
import { getBlockchainProof } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let certificateId = '';
    let verificationType: 'ID_LOOKUP' | 'QR_SCAN' | 'FILE_UPLOAD' = 'ID_LOOKUP';
    let uploadedHash = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      verificationType = 'FILE_UPLOAD';
      certificateId = (formData.get('certificateId') as string) || '';
      const file = formData.get('document') as File | null;

      if (!file) {
        return NextResponse.json({ error: "No document file provided for upload verification" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      uploadedHash = calculateSHA256(buffer);
    } else {
      const body = await req.json();
      certificateId = body.certificateId || '';
      verificationType = body.verificationType || 'ID_LOOKUP';
      uploadedHash = body.uploadedHash ? body.uploadedHash.toUpperCase() : '';
    }

    if (!certificateId && !uploadedHash) {
      return NextResponse.json({ error: "Certificate ID or document hash required" }, { status: 400 });
    }

    // Lookup Certificate by ID or match by hash across versions
    let cert = Database.getCertificateById(certificateId);

    if (!cert && uploadedHash) {
      // Find version matching uploaded hash
      const allVersions = Database.getVersions(certificateId || "");
      const matchVer = allVersions.find(v => compareHashes(v.documentHash, uploadedHash));
      if (matchVer) {
        cert = Database.getCertificateById(matchVer.certificateId);
      }
    }

    if (!cert) {
      // Record failed verification attempt
      Database.recordVerification({
        certificateId: certificateId || "UNKNOWN",
        verificationType,
        result: 'NOT_FOUND',
        uploadedHash,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || undefined
      });

      return NextResponse.json({
        verified: false,
        result: 'NOT_FOUND',
        message: "Record not found in VeriChain registry.",
        uploadedHash,
        certificateId
      }, { status: 404 });
    }

    const versions = Database.getVersions(cert.certificateId);
    const latestVersion = versions[0];
    const expectedHash = latestVersion ? latestVersion.documentHash : "";

    let result: VerificationResult = 'VALID';
    let message = "This document matches the original blockchain-backed record.";

    if (cert.status === 'REVOKED') {
      result = 'REVOKED';
      message = `This certificate was REVOKED by ${cert.organizationName}. Reason: ${cert.revocationReason || 'Administrative decision'}`;
    } else if (cert.status === 'EXPIRED') {
      result = 'EXPIRED';
      message = "This certificate has passed its validity expiration date.";
    } else if (uploadedHash) {
      // Check if uploaded hash matches ANY valid version
      const hashMatchAnyVersion = versions.some(v => compareHashes(v.documentHash, uploadedHash));
      if (!hashMatchAnyVersion) {
        result = 'TAMPERED';
        message = "TAMPER DETECTED: Uploaded file cryptographic SHA-256 hash does NOT match the registered blockchain hash!";
      }
    }

    // Get Proof
    const proof = await getBlockchainProof(
      cert.certificateId,
      cert.currentVersion,
      expectedHash,
      latestVersion ? latestVersion.previousHash : "",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      latestVersion ? latestVersion.blockchainTxHash : undefined,
      latestVersion ? latestVersion.blockNumber : undefined
    );

    // Record verification log
    Database.recordVerification({
      certificateId: cert.certificateId,
      verificationType,
      result,
      uploadedHash: uploadedHash || expectedHash,
      expectedHash,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || undefined
    });

    return NextResponse.json({
      verified: result === 'VALID',
      result,
      message,
      certificate: cert,
      latestVersion,
      versions,
      uploadedHash,
      expectedHash,
      blockchainProof: proof
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
