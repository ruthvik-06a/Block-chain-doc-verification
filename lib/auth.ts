import jwt from 'jsonwebtoken';
import { User, UserRole, Database } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'verichain_hackathon_super_secret_jwt_key_2027_production';

export interface AuthSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
}

export function signToken(session: AuthSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch (e) {
    return null;
  }
}

export function getDemoSession(role: UserRole): AuthSession {
  const users = Database.getUsers();
  const user = users.find(u => u.role === role) || users[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    organizationName: user.organizationName
  };
}
