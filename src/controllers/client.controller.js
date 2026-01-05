const { Client } = require("../models");
const s3 = require("../config/s3");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");

/* CREATE CLIENT */
exports.createClient = async (req, res) => {
  try {
    const fileName = `${uuid()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_CLIENTS,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const client = await Client.create({
      name: req.body.name,
      description: req.body.description,
      logoUrl: fileName,
    });

    res.status(201).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE CLIENT */
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_CLIENTS,
        Key: client.logoUrl,
      })
    );

    await client.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
