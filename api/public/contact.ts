import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    // Save to database
    const [savedMessage] = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        message,
      })
      .returning();

    // Send email notification using Resend
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL || 'i.romadhon26@gmail.com',
          subject: `New Contact Message from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><small>Sent from your portfolio website</small></p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails - message is still saved
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: savedMessage,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit message',
    });
  }
}
