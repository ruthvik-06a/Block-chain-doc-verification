import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const pendingOnly = searchParams.get('pendingOnly') === 'true';

  let users = Database.getUsers();

  if (pendingOnly) {
    users = Database.getPendingIssuers();
  } else if (role) {
    users = users.filter(u => u.role === role);
  }

  return NextResponse.json({ users, success: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, organizationName } = body;

    const existing = Database.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Default approval status: Issuers require admin approval (isApproved: false), while users/holders are auto-approved
    const isApproved = role === 'ISSUER' ? false : true;

    const newUser = Database.createUser({
      name: name || email.split('@')[0],
      email,
      passwordHash: password || 'default123',
      role: role || 'PUBLIC_USER',
      organizationName: organizationName || (role === 'ISSUER' ? 'Independent Issuer' : undefined),
      isApproved
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, isApproved } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updatedUser = Database.updateUserApproval(userId, isApproved);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user approval" }, { status: 500 });
  }
}
