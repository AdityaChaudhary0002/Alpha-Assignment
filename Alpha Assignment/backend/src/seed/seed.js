const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Test Campaign',
        description: 'A test campaign',
      },
    });

    const company = await prisma.company.create({
      data: {
        name: 'Sample Company',
        industry: 'Tech',
        campaignId: campaign.id,
      },
    });

    await prisma.person.createMany({
      data: [
        {
          name: 'Person 1',
          email: 'person1@example.com',
          role: 'CEO',
          companyId: company.id,
        },
        {
          name: 'Person 2',
          email: 'person2@example.com',
          role: 'CTO',
          companyId: company.id,
        },
      ],
    });

    console.log('✅ Seeding completed.');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); // <- IMPORTANT!!
