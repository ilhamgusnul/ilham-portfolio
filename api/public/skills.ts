import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { skills } from '../../db/schema';
import { asc } from 'drizzle-orm';

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
    const result = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.order));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch skills',
    });
  }
}
