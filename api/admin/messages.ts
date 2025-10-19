import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, type AuthRequest } from '../../lib/auth';

async function handler(req: AuthRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - List all messages
    if (req.method === 'GET') {
      const result = await db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt));

      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    // PUT - Mark message as read
    if (req.method === 'PUT') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Message ID is required',
        });
      }

      const [updatedMessage] = await db
        .update(contactMessages)
        .set({ isRead: true })
        .where(eq(contactMessages.id, parseInt(id)))
        .returning();

      if (!updatedMessage) {
        return res.status(404).json({
          success: false,
          error: 'Message not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedMessage,
      });
    }

    // DELETE - Delete message
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Message ID is required',
        });
      }

      await db
        .delete(contactMessages)
        .where(eq(contactMessages.id, parseInt(id)));

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in admin messages API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export default requireAuth(handler);
