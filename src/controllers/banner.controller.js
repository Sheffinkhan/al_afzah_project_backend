const { Banner } = require("../models");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");

/* CREATE BANNER */
const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Banner image required" });
    }

    const key = `banners/${uuid()}-${req.file.originalname}`;

    const upload = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    const banner = await Banner.create({
      title: req.body.title,
      imageUrl: upload.Location,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET BANNERS */
const getBanners = async (req, res) => {
  const banners = await Banner.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(banners);
};

/* UPDATE BANNER */
const updateBanner = async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) return res.status(404).json({ message: "Not found" });

  let imageUrl = banner.imageUrl;

  if (req.file) {
    const key = `banners/${uuid()}-${req.file.originalname}`;

    const upload = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    imageUrl = upload.Location;
  }

  await banner.update({
    title: req.body.title ?? banner.title,
    imageUrl,
  });

  res.json({ success: true });
};

/* DELETE BANNER */
const deleteBanner = async (req, res) => {
  const banner = await Banner.findByPk(req.params.id);
  if (!banner) return res.status(404).json({ message: "Not found" });

  const key = banner.imageUrl.split(".amazonaws.com/")[1];

  await s3.deleteObject({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  }).promise();

  await banner.destroy();
  res.json({ success: true });
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};
