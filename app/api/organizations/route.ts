import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ organizations: Database.getOrganizations() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, email, logo, walletAddress, address } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Organization Name and Email are required" }, { status: 400 });
    }

    const org = Database.createOrganization({
      name,
      type: type || 'University',
      email,
      logo: logo || '🏛️',
      walletAddress: walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
      verificationStatus: 'VERIFIED',
      address: address || '100 Innovation Park, Tech City'
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
