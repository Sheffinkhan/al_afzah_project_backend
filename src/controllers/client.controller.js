const { Client } = require("../models");
const minioClient = require("../config/minio");
const { v4: uuid } = require("uuid");

exports.createClient = async (req, res) => {
  try {
    const fileName = `${uuid()}-${req.file.originalname}`;

    await minioClient.putObject(
      process.env.MINIO_CLIENTS_BUCKET, // ✅ CLIENT BUCKET
      fileName,
      req.file.buffer,
      req.file.mimetype
    );

    const client = await Client.create({
      name: req.body.name,
      description: req.body.description,
      logoUrl: fileName,
    });

    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClients = async (req, res) => {
  const clients = await Client.findAll();
  res.json(clients);
};
