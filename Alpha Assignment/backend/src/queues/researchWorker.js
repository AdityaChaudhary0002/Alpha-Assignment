// src/queues/researchWorker.js

const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { performResearch } = require('../services/researchService');

const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Create the worker that processes jobs from the 'research' queue
const researchWorker = new Worker(
  'research',
  async (job) => {
    const { companyId } = job.data;

    // Run the research logic with optional progress callback
    await performResearch(companyId, async ({ iteration, message }) => {
      console.log(`Progress [${companyId}] Iteration ${iteration}: ${message}`);
    });

    console.log(`✅ Research completed for companyId: ${companyId}`);
  },
  {
    connection: redisConnection,
  }
);

// Handle job lifecycle events
researchWorker.on('completed', (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

researchWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});

console.log('🚀 Research worker running...');
