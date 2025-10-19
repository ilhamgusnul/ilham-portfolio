import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { projects } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category } = req.query;

    let query = db
      .select()
      .from(projects)
      .where(eq(projects.isVisible, true))
      .orderBy(desc(projects.order));

    // Filter by category if provided
    if (category && typeof category === 'string' && category !== 'all') {
      query = query.where(eq(projects.category, category));
    }

    const result = await query;

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
}
