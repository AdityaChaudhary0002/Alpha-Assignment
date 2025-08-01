const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Alpha Campaign',
        description: 'Hiring campaign for Alpha Platform'
      },
    });

    const company = await prisma.company.create({
      data: {
        name: 'OpenAI Research Co.',
        industry: 'AI',
        campaignId: campaign.id,
      },
    });

    await prisma.person.createMany({
      data: [
        { name: 'Aditya Chaudhary', email: 'aditya@example.com', role: 'Founder', companyId: company.id },
        { name: 'Riya Sharma', email: 'riya@example.com', role: 'CTO', companyId: company.id },
        { name: 'Kunal Mehta', email: 'kunal@example.com', role: 'Lead Engineer', companyId: company.id },
        { name: 'Priya Verma', email: 'priya@example.com', role: 'Product Manager', companyId: company.id },
        { name: 'Sahil Kapoor', email: 'sahil@example.com', role: 'Research Analyst', companyId: company.id },
        { name: 'Neha Singh', email: 'neha@example.com', role: 'ML Engineer', companyId: company.id },
        { name: 'Arjun Joshi', email: 'arjun@example.com', role: 'Data Scientist', companyId: company.id },
      ],
    });

    console.log('✅ Seeded sample people successfully.');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
