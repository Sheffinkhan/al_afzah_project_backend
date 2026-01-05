const { Project, ProjectImage } = require("../models");
const s3 = require("../config/s3");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    for (const file of req.files) {
      const fileName = `${uuid()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      await ProjectImage.create({
        imageUrl: fileName,
        ProjectId: project.id,
      });
    }

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PROJECT IMAGE */
exports.deleteProjectImage = async (req, res) => {
  try {
    const image = await ProjectImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
        Key: image.imageUrl,
      })
    );

    await image.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
