import * as dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import { db } from './index';
import { projects, skills, users } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Seed admin user (password should be hashed in production)
    console.log('Creating admin user...');
    await db.insert(users).values({
      email: process.env.ADMIN_EMAIL || 'i.romadhon26@gmail.com',
      password: 'admin123', // TODO: Hash this password using bcrypt in production
      name: 'Ilham Gusnul Romadhon',
    });

    // Seed skills from existing portfolio
    console.log('Seeding skills...');
    await db.insert(skills).values([
      {
        title: 'Full Stack Web Development',
        proficiency: 95,
        tools: ['Laravel', 'React', 'Tailwind'],
        order: 1,
      },
      {
        title: 'Mobile Apps Development',
        proficiency: 85,
        tools: ['Flutter', 'React Native', 'Dart'],
        order: 2,
      },
      {
        title: 'UI/UX Design',
        proficiency: 90,
        tools: ['Figma', 'Adobe XD', 'Sketch'],
        order: 3,
      },
      {
        title: 'Design Graphic',
        proficiency: 80,
        tools: ['Adobe', 'Photoshop', 'Illustrator'],
        order: 4,
      },
    ]);

    // Seed projects from existing portfolio
    console.log('Seeding projects...');
    await db.insert(projects).values([
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
        techStack: ['Laravel', 'React', 'Tailwind'],
        category: 'web',
        completedDate: 'December 2023',
        order: 1,
        isVisible: true,
      },
      {
        title: 'Task Management App',
        description: 'Mobile application for task and project management with real-time sync',
        techStack: ['Flutter', 'Firebase', 'Dart'],
        category: 'mobile',
        completedDate: 'January 2024',
        order: 2,
        isVisible: true,
      },
      {
        title: 'Banking App UI',
        description: 'Modern and intuitive banking application UI/UX design with prototyping',
        techStack: ['Figma', 'Adobe XD', 'Prototyping'],
        category: 'design',
        completedDate: 'November 2023',
        order: 3,
        isVisible: true,
      },
      {
        title: 'Portfolio Website',
        description: 'Personal portfolio website showcasing projects and skills',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        category: 'web',
        completedDate: 'February 2024',
        order: 4,
        isVisible: true,
      },
      {
        title: 'Fitness Tracker',
        description: 'Cross-platform fitness tracking app with workout plans and progress monitoring',
        techStack: ['React Native', 'Node.js', 'MongoDB'],
        category: 'mobile',
        completedDate: 'March 2024',
        order: 5,
        isVisible: true,
      },
      {
        title: 'Restaurant Website',
        description: 'Restaurant website design with online ordering and reservation system',
        techStack: ['UI Design', 'UX Research', 'Prototyping'],
        category: 'design',
        completedDate: 'October 2023',
        order: 6,
        isVisible: true,
      },
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
