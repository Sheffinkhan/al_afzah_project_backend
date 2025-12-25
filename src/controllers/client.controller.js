const { Client } = require("../models");
const minioClient = require("../config/minio");
const { v4: uuid } = require("uuid");

/* CREATE CLIENT */
exports.createClient = async (req, res) => {
  try {
    const fileName = `${uuid()}-${req.file.originalname}`;

    await minioClient.putObject(
      process.env.MINIO_CLIENTS_BUCKET,
      fileName,
      req.file.buffer,
      req.file.mimetype
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

/* GET CLIENTS */
exports.getClients = async (req, res) => {
  res.json(await Client.findAll());
};

/* UPDATE CLIENT (details + logo) */
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    // Replace logo if new one uploaded
    if (req.file) {
      await minioClient.removeObject(
        process.env.MINIO_CLIENTS_BUCKET,
        client.logoUrl
      );

      const newLogo = `${uuid()}-${req.file.originalname}`;
      await minioClient.putObject(
        process.env.MINIO_CLIENTS_BUCKET,
        newLogo,
        req.file.buffer,
        req.file.mimetype
      );

      client.logoUrl = newLogo;
    }

    await client.update(req.body);

    res.json({ success: true, message: "Client updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE CLIENT + LOGO */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    await minioClient.removeObject(
      process.env.MINIO_CLIENTS_BUCKET,
      client.logoUrl
    );

    await client.destroy();

    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
