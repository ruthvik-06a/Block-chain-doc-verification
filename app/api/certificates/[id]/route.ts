import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { calculateSHA256 } from '@/lib/crypto';
import { getBlockchainProof } from '@/lib/blockchain';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cert = Database.getCertificateById(params.id);
    if (!cert) {
      return NextResponse.json({ error: "Certificate record not found" }, { status: 404 });
    }

    const versions = Database.getVersions(cert.certificateId);
    const latestVersion = versions[0];
    const auditLogs = Database.getAuditLogs().filter(a => a.certificateId === cert.certificateId);

    const proof = await getBlockchainProof(
      cert.certificateId,
      cert.currentVersion,
      latestVersion ? latestVersion.documentHash : "",
      latestVersion ? latestVersion.previousHash : "",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      latestVersion ? latestVersion.blockchainTxHash : undefined,
      latestVersion ? latestVersion.blockNumber : undefined
    );

    return NextResponse.json({
      certificate: cert,
      latestVersion,
      versions,
      auditLogs,
      blockchainProof: proof
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('verichain_session')?.value;
    const session = token ? verifyToken(token) : null;
    const actorId = session?.id || "usr-issuer-01";
    const actorName = session?.name || "Dr. Aris Thorne (Registrar)";

    const formData = await req.formData();
    const changeDescription = (formData.get('changeDescription') as string) || "Legitimate record version update";
    const cgpa = formData.get('cgpa') as string;
    const course = formData.get('course') as string;
    const subjectName = formData.get('subjectName') as string;
    const file = formData.get('document') as File | null;

    const cert = Database.getCertificateById(params.id);
    if (!cert) {
      return NextResponse.json({ error: "Certificate record not found" }, { status: 404 });
    }

    let fileHash: string;
    let fileName = `${cert.certificateId}_v${cert.currentVersion + 1}.pdf`;
    let fileSize = 255000;

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      const buffer = Buffer.from(await file.arrayBuffer());
      fileHash = calculateSHA256(buffer);
    } else {
      fileHash = calculateSHA256(`${cert.certificateId}:v${cert.currentVersion + 1}:${cgpa || cert.cgpa}:${course || cert.course}:${Date.now()}`);
    }

    const updatedFields: Record<string, any> = {};
    if (cgpa) updatedFields.cgpa = cgpa;
    if (course) updatedFields.course = course;
    if (subjectName) updatedFields.subjectName = subjectName;

    const newVersion = Database.addVersion(cert.id, {
      fileName,
      fileSize,
      documentHash: fileHash,
      changeDescription,
      createdBy: actorId,
      createdByName: actorName,
      updatedFields
    });

    const updatedCert = Database.getCertificateById(cert.id);

    return NextResponse.json({
      success: true,
      certificate: updatedCert,
      version: newVersion
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('verichain_session')?.value;
    const session = token ? verifyToken(token) : null;
    const actorId = session?.id || "usr-issuer-01";
    const actorName = session?.name || "Dr. Aris Thorne";

    const body = await req.json();
    const reason = body.reason || "Record revoked by issuing authority";

    const revokedCert = Database.revokeCertificate(params.id, reason, actorId, actorName);

    return NextResponse.json({
      success: true,
      certificate: revokedCert
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
