import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getDemoSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('verichain_session')?.value;
  if (!token) {
    // Return default Issuer session for seamless hackathon browsing if non-authenticated
    return NextResponse.json({ user: getDemoSession('ISSUER') });
  }

  const session = verifyToken(token);
  if (!session) {
    return NextResponse.json({ user: getDemoSession('ISSUER') });
  }

  return NextResponse.json({ user: session });
}
