import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { calculateSHA256 } from '@/lib/crypto';
import { getBlockchainProof } from '@/lib/blockchain';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const orgId = searchParams.get('orgId') || '';

    let certs = Database.getCertificates();

    if (query) {
      certs = certs.filter(c => 
        c.certificateId.toLowerCase().includes(query) ||
        c.subjectName.toLowerCase().includes(query) ||
        c.course.toLowerCase().includes(query) ||
        c.organizationName.toLowerCase().includes(query)
      );
    }

    if (status) {
      certs = certs.filter(c => c.status === status);
    }

    if (orgId) {
      certs = certs.filter(c => c.organizationId === orgId);
    }

    return NextResponse.json({ certificates: certs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('verichain_session')?.value;
    const session = token ? verifyToken(token) : null;
    const actorId = session?.id || "usr-issuer-01";
    const actorName = session?.name || "Dr. Aris Thorne (Registrar)";

    const formData = await req.formData();
    const certificateId = (formData.get('certificateId') as string) || `CERT-2027-${Math.floor(100000 + Math.random() * 900000)}`;
    const subjectName = formData.get('subjectName') as string;
    const course = formData.get('course') as string;
    const cgpa = formData.get('cgpa') as string;
    const issueDate = (formData.get('issueDate') as string) || new Date().toISOString().split('T')[0];
    const expiryDate = formData.get('expiryDate') as string || undefined;
    const organizationId = (formData.get('organizationId') as string) || session?.organizationId || "org-xyz-univ";
    const organizationName = (formData.get('organizationName') as string) || session?.organizationName || "XYZ University";
    const file = formData.get('document') as File | null;

    if (!subjectName || !course) {
      return NextResponse.json({ error: "Subject Name and Course/Designation are required" }, { status: 400 });
    }

    let fileHash: string;
    let fileName = `${certificateId}_v1.pdf`;
    let fileSize = 250000;

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      const buffer = Buffer.from(await file.arrayBuffer());
      fileHash = calculateSHA256(buffer);
    } else {
      // Generate deterministic SHA-256 for metadata payload
      fileHash = calculateSHA256(`${certificateId}:${subjectName}:${course}:${cgpa}:${issueDate}:${organizationId}`);
    }

    // Register Certificate in Database
    const { certificate, version } = Database.createCertificate(
      {
        certificateId,
        organizationId,
        organizationName,
        subjectName,
        course,
        cgpa,
        issueDate,
        expiryDate
      },
      {
        fileName,
        fileSize,
        documentHash: fileHash,
        createdBy: actorId,
        createdByName: actorName,
        changeDescription: `Initial Record Creation (Version 1)`
      }
    );

    // Get Proof Receipt
    const proof = await getBlockchainProof(
      certificate.certificateId,
      1,
      fileHash,
      "0000000000000000000000000000000000000000000000000000000000000000",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      version.blockchainTxHash,
      version.blockNumber
    );

    return NextResponse.json({
      success: true,
      certificate,
      version,
      blockchainProof: proof
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
