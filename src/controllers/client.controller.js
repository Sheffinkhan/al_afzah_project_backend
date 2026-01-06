const { Client } = require("../models");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");

/* ============================
   CREATE CLIENT (1 IMAGE)
============================ */
const createClient = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Client image is required" });
    }

    const key = `clients/${uuid()}-${req.file.originalname}`;

    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
      .promise();

    const client = await Client.create({
      name: req.body.name,
      logoUrl: uploadResult.Location, // ✅ CORRECT FIELD
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (err) {
    console.error("CREATE CLIENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   GET CLIENTS
============================ */
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(clients);
  } catch (err) {
    console.error("GET CLIENTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   UPDATE CLIENT (OPTIONAL IMAGE)
============================ */
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    let logoUrl = client.logoUrl;

    if (req.file) {
      const key = `clients/${uuid()}-${req.file.originalname}`;

      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
        .promise();

      logoUrl = uploadResult.Location;
    }

    await client.update({
      name: req.body.name ?? client.name,
      logoUrl, // ✅ CORRECT FIELD
    });

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE CLIENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   DELETE CLIENT
============================ */
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Delete image from S3
    const key = client.logoUrl.split(".amazonaws.com/")[1];

    await s3
      .deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      })
      .promise();

    await client.destroy();

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE CLIENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient,
};
