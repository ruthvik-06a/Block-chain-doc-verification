import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF } from '@/lib/pdfGenerator';
import { Database } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const certId = searchParams.get('certId') || 'CERT-2027-001024';
    const tampered = searchParams.get('tampered') === 'true';

    const cert = Database.getCertificateById(certId) || {
      certificateId: 'CERT-2027-001024',
      subjectName: 'Rahul Kumar',
      course: 'B.E Computer Science',
      cgpa: '8.5',
      organizationName: 'XYZ University',
      issueDate: '2027-10-10'
    };

    const pdfBuffer = generateCertificatePDF({
      certificateId: cert.certificateId,
      subjectName: cert.subjectName,
      course: cert.course,
      cgpa: cert.cgpa || '8.5',
      organizationName: cert.organizationName,
      issueDate: cert.issueDate,
      isTampered: tampered,
      tamperedCgpa: tampered ? '9.9' : undefined
    });

    const filename = `${cert.certificateId}_${tampered ? 'TAMPERED_MODIFIED' : 'AUTHENTIC_ORIGINAL'}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
