const { performResearch } = require('./researchService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('performResearch', () => {
  it('handles missing fields gracefully in iterations', async () => {
    const companyId = 'test-company-id';
    // Should not throw if progressCb is missing
    await expect(performResearch(companyId)).resolves.toBeDefined();
  });
});

describe('Integration: research job flow', () => {
  let companyId;
  beforeAll(async () => {
    // Seed a company
    const company = await prisma.company.create({
      data: { name: 'TestCo', campaignId: 'seed-campaign' }
    });
    companyId = company.id;
  });
  it('runs enrich and gets snippet', async () => {
    await performResearch(companyId);
    const snippet = await prisma.contextSnippet.findFirst({ where: { companyId } });
    expect(snippet).toBeTruthy();
    expect(snippet.snippet).toBeDefined();
  });
  afterAll(async () => {
    await prisma.contextSnippet.deleteMany({ where: { companyId } });
    await prisma.company.delete({ where: { id: companyId } });
    await prisma.$disconnect();
  });
});