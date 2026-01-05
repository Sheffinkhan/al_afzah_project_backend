const { Project, ProjectImage } = require("../models");
const { v4: uuid } = require("uuid");
const s3 = require("../config/s3"); // your new S3 config

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      completedDate,
    } = req.body;

    // 🔒 Basic validation
    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required",
      });
    }

    // ✅ Create project with explicit fields
    const project = await Project.create({
      title,
      description,
      location,
      completedDate,
    });

    // ✅ Upload images if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${uuid()}-${file.originalname}`;

        await s3.upload({
          Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }).promise();

        await ProjectImage.create({
          imageUrl: fileName,
          ProjectId: project.id,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: project,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* GET PROJECTS */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: ProjectImage,
      order: [["createdAt", "DESC"]],
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE PROJECT */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const {
      title,
      description,
      location,
      completedDate,
    } = req.body;

    await project.update({
      title,
      description,
      location,
      completedDate,
    });

    res.json({
      success: true,
      message: "Project updated",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PROJECT */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: ProjectImage,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🧹 delete images from S3
    for (const img of project.ProjectImages) {
      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
        Key: img.imageUrl,
      }).promise();
    }

    await project.destroy();

    res.json({
      success: true,
      message: "Project deleted",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PROJECT IMAGE */
const deleteProjectImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await ProjectImage.findByPk(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
      Key: image.imageUrl,
    }).promise();

    await image.destroy();

    res.json({
      success: true,
      message: "Image deleted",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  deleteProjectImage,
};
