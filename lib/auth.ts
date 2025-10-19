import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

export interface AuthRequest extends VercelRequest {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export async function verifyAuth(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);

  // For simplicity, we're using email:password base64 encoded
  // In production, use JWT tokens
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return false;
    }

    // In production, use bcrypt.compare
    // For now, simple comparison (since we didn't hash in seed)
    return password === user.password;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export function requireAuth(
  handler: (req: AuthRequest, res: VercelResponse) => Promise<void> | void
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const isAuthenticated = await verifyAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    return handler(req as AuthRequest, res);
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
