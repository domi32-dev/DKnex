import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Demo users for portfolio showcase
const DEMO_USERS = [
  {
    email: 'demo@dknex.com',
    password: 'Demo123!@#',
    name: 'Demo User',
  },
  {
    email: 'admin@dknex.com',
    password: 'Admin123!@#',
    name: 'Admin Demo',
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data
  await prisma.userNotification.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users first
  console.log('👤 Creating demo users...');
  for (const demoUser of DEMO_USERS) {
    const hashedPassword = await bcrypt.hash(demoUser.password, 12);
    
    await prisma.user.create({
      data: {
        email: demoUser.email,
        name: demoUser.name,
        password: hashedPassword,
        emailVerified: new Date(),
        twoFactorEnabled: false, // Disable 2FA for demo users
      },
    });
    
    console.log(`✅ Created demo user: ${demoUser.email}`);
  }

  // Create demo users
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@dknex.com',
      password: hashedPassword,
      emailVerified: new Date(),
      image: '/avatars/john-doe.png',
      twoFactorEnabled: true,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@dknex.com',
      password: hashedPassword,
      emailVerified: new Date(),
      image: '/avatars/jane-smith.png',
      twoFactorEnabled: false,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@dknex.com',
      password: hashedPassword,
      emailVerified: new Date(),
      image: '/avatars/demo-user.png',
      twoFactorEnabled: false,
    },
  });

  // Create demo projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Contact Form Builder',
        description: 'Advanced contact form with file upload and validation',
        userId: adminUser.id,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Event Registration System',
        description: 'Complete event registration with payment integration',
        userId: adminUser.id,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-15'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Customer Feedback Survey',
        description: 'Multi-step survey with conditional logic',
        userId: regularUser.id,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-25'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Job Application Portal',
        description: 'Comprehensive job application form with resume upload',
        userId: regularUser.id,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-10'),
      },
    }),
    prisma.project.create({
      data: {
        name: 'Product Launch Survey',
        description: 'Market research survey for new product launch',
        userId: demoUser.id,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-20'),
      },
    }),
  ]);

  // Create demo notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Welcome to DkNex!',
        description: 'Your account has been successfully created. Start building amazing forms today!',
        createdAt: new Date('2024-01-15'),
      },
    }),
    prisma.notification.create({
      data: {
        title: 'New Form Submission',
        description: 'You have received a new submission on your Contact Form Builder.',
        createdAt: new Date('2024-01-20'),
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Monthly Analytics Report',
        description: 'Your monthly analytics report is ready. Check your dashboard for insights.',
        createdAt: new Date('2024-02-01'),
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Security Alert',
        description: 'Two-factor authentication has been enabled for your account.',
        createdAt: new Date('2024-02-15'),
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Feature Update',
        description: 'New drag-and-drop components are now available in the form builder.',
        createdAt: new Date('2024-03-01'),
      },
    }),
  ]);

  // Create user notifications
  const userNotifications = [];
  
  // Admin user notifications
  for (const notification of notifications) {
    userNotifications.push(
      prisma.userNotification.create({
        data: {
          userId: adminUser.id,
          notificationId: notification.id,
          read: Math.random() > 0.5, // Randomly mark some as read
          readAt: Math.random() > 0.5 ? new Date() : null,
        },
      })
    );
  }

  // Regular user notifications (first 3)
  for (let i = 0; i < 3; i++) {
    userNotifications.push(
      prisma.userNotification.create({
        data: {
          userId: regularUser.id,
          notificationId: notifications[i].id,
          read: i === 0, // First one is read
          readAt: i === 0 ? new Date() : null,
        },
      })
    );
  }

  // Demo user notifications (last 2)
  for (let i = 3; i < 5; i++) {
    userNotifications.push(
      prisma.userNotification.create({
        data: {
          userId: demoUser.id,
          notificationId: notifications[i].id,
          read: false,
          readAt: null,
        },
      })
    );
  }

  await Promise.all(userNotifications);

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📊 Demo Data Created:');
  console.log(`👥 Users: ${3}`);
  console.log(`📋 Projects: ${projects.length}`);
  console.log(`🔔 Notifications: ${notifications.length}`);
  console.log('');
  console.log('🔐 Demo Accounts:');
  console.log('Admin: john@dknex.com | demo123');
  console.log('User: jane@dknex.com | demo123');
  console.log('Demo: demo@dknex.com | demo123');
  console.log('');
  console.log('🚀 Ready to showcase your portfolio!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 