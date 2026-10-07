import { NextResponse } from 'next/server';
import { Database } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ verifications: Database.getVerifications() });
}
