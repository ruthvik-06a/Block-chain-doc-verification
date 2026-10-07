import { NextRequest, NextResponse } from 'next/server';
import { Database, UserRole } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoRole } = body;

    let user;

    if (demoRole) {
      user = Database.getUsers().find(u => u.role === demoRole as UserRole);
    } else if (email) {
      user = Database.getUserByEmail(email);
      if (user && user.passwordHash !== password) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }
    }

    if (!user) {
      user = Database.getUsers()[0]; // Default fallback
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organizationName
    };

    const token = signToken(session);

    const response = NextResponse.json({ success: true, user: session, token });
    response.cookies.set('verichain_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}
