const Queue = require('bull');

// Redis URL (Docker default host + port)
const researchQueue = new Queue('researchQueue', 'redis://localhost:6379');

// Optional: handle job processing (you can expand this later)
researchQueue.process('enrichCompany', async (job) => {
  const { companyId } = job.data;

  console.log(`🔬 Running enrichment for companyId: ${companyId}`);

  // Simulate a delay like real-world enrichment
  await new Promise((res) => setTimeout(res, 5000));

  // You could also store context snippet or progress updates here
  console.log(`✅ Enrichment done for ${companyId}`);
});

module.exports = researchQueue;
