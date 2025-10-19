import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { skills } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAuth, type AuthRequest } from '../../lib/auth';

async function handler(req: AuthRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - List all skills
    if (req.method === 'GET') {
      const result = await db
        .select()
        .from(skills)
        .orderBy(asc(skills.order));

      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    // POST - Create new skill
    if (req.method === 'POST') {
      const { title, proficiency, tools, order } = req.body;

      if (!title || proficiency === undefined || !tools) {
        return res.status(400).json({
          success: false,
          error: 'Title, proficiency, and tools are required',
        });
      }

      const [newSkill] = await db
        .insert(skills)
        .values({
          title,
          proficiency,
          tools,
          order: order || 0,
        })
        .returning();

      return res.status(201).json({
        success: true,
        data: newSkill,
      });
    }

    // PUT - Update skill
    if (req.method === 'PUT') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Skill ID is required',
        });
      }

      const { title, proficiency, tools, order } = req.body;

      const [updatedSkill] = await db
        .update(skills)
        .set({
          ...(title && { title }),
          ...(proficiency !== undefined && { proficiency }),
          ...(tools && { tools }),
          ...(order !== undefined && { order }),
          updatedAt: new Date(),
        })
        .where(eq(skills.id, parseInt(id)))
        .returning();

      if (!updatedSkill) {
        return res.status(404).json({
          success: false,
          error: 'Skill not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedSkill,
      });
    }

    // DELETE - Delete skill
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Skill ID is required',
        });
      }

      await db.delete(skills).where(eq(skills.id, parseInt(id)));

      return res.status(200).json({
        success: true,
        message: 'Skill deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in admin skills API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export default requireAuth(handler);
