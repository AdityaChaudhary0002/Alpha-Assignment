const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const researchQueue = require('../queues/researchQueue'); // We'll create this later

// src/controllers/peopleController.js

exports.getPeople = async (req, res) => {
  try {
    const people = await prisma.person.findMany();  // 👈 Make sure this table exists
    res.json(people);
  } catch (error) {
    console.error("Error in getPeople:", error);
    res.status(500).json({ error: "Failed to fetch people" });  // 👈 This goes to frontend
  }
};

exports.enrichPerson = async (req, res) => {
  const { person_id } = req.params;

  const person = await prisma.person.findUnique({
    where: { id: person_id },
  });

  if (!person) {
    return res.status(404).json({ error: 'Person not found' });
  }

  await researchQueue.add('enrichCompany', {
    companyId: person.companyId,
  });

  res.status(200).json({ success: true });
};
