import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('verichain_session')?.value;
    const session = token ? verifyToken(token) : null;

    const body = await req.json();
    const { certificateId, status, notes } = body;

    if (!certificateId || !status) {
      return NextResponse.json({ error: "Missing certificateId or status" }, { status: 400 });
    }

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedCert = Database.updateVerificationRequest(
      certificateId,
      status,
      notes,
      session?.id,
      session?.name,
      session?.role
    );

    return NextResponse.json({
      success: true,
      certificate: updatedCert
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
