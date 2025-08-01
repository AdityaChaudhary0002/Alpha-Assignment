const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Simulates a research process for a given company.
 * Sends progress updates through the provided callback.
 */
exports.performResearch = async (companyId, onProgress) => {
  // Simulate steps
  const steps = [
    'Fetching company data...',
    'Analyzing social presence...',
    'Extracting keywords...',
    'Generating context snippet...',
    'Finalizing...'
  ];

  for (let i = 0; i < steps.length; i++) {
    await new Promise((res) => setTimeout(res, 1000)); // wait 1 second
    if (onProgress) {
      await onProgress({ iteration: i + 1, message: steps[i] });
    }
  }

  // Save dummy snippet
  await prisma.contextSnippet.create({
    data: {
      companyId,
      snippet: {
        summary: 'This is a dummy research summary.',
        keywords: ['AI', 'Fintech', 'OpenAI', 'Research'],
        confidence: 0.92
      }
    }
  });
};
