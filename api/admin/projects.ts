import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { projects } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
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
    // GET - List all projects
    if (req.method === 'GET') {
      const result = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.order));

      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    // POST - Create new project
    if (req.method === 'POST') {
      const {
        title,
        description,
        techStack,
        category,
        imageUrl,
        demoUrl,
        githubUrl,
        completedDate,
        order,
        isVisible,
      } = req.body;

      if (!title || !description || !techStack || !category) {
        return res.status(400).json({
          success: false,
          error: 'Title, description, techStack, and category are required',
        });
      }

      const [newProject] = await db
        .insert(projects)
        .values({
          title,
          description,
          techStack,
          category,
          imageUrl,
          demoUrl,
          githubUrl,
          completedDate,
          order: order || 0,
          isVisible: isVisible !== undefined ? isVisible : true,
        })
        .returning();

      return res.status(201).json({
        success: true,
        data: newProject,
      });
    }

    // PUT - Update project
    if (req.method === 'PUT') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Project ID is required',
        });
      }

      const {
        title,
        description,
        techStack,
        category,
        imageUrl,
        demoUrl,
        githubUrl,
        completedDate,
        order,
        isVisible,
      } = req.body;

      const [updatedProject] = await db
        .update(projects)
        .set({
          ...(title && { title }),
          ...(description && { description }),
          ...(techStack && { techStack }),
          ...(category && { category }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(demoUrl !== undefined && { demoUrl }),
          ...(githubUrl !== undefined && { githubUrl }),
          ...(completedDate !== undefined && { completedDate }),
          ...(order !== undefined && { order }),
          ...(isVisible !== undefined && { isVisible }),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, parseInt(id)))
        .returning();

      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedProject,
      });
    }

    // DELETE - Delete project
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Project ID is required',
        });
      }

      await db.delete(projects).where(eq(projects.id, parseInt(id)));

      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in admin projects API:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export default requireAuth(handler);
