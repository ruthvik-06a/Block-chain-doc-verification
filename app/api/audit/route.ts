import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const certId = searchParams.get('certId');

  let logs = Database.getAuditLogs();

  if (action) {
    logs = logs.filter(l => l.action === action);
  }
  if (certId) {
    logs = logs.filter(l => l.certificateId === certId);
  }

  return NextResponse.json({ auditLogs: logs });
}
