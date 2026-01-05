const { Client, ClientImage } = require("../models");

/* CREATE CLIENT */
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET CLIENTS */
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ include: ClientImage });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE CLIENT */
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.update(req.body);
    res.json({ success: true, message: "Client updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE CLIENT */
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.destroy();
    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE CLIENT IMAGE */
const deleteClientImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await ClientImage.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await image.destroy();
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  deleteClientImage,
};
