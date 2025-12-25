const { Project, ProjectImage } = require("../models");
const minioClient = require("../config/minio");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT (already exists) */
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    for (const file of req.files) {
      const fileName = `${uuid()}-${file.originalname}`;

      await minioClient.putObject(
        process.env.MINIO_PROJECTS_BUCKET,
        fileName,
        file.buffer,
        file.mimetype
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

/* GET PROJECTS */
exports.getProjects = async (req, res) => {
  const projects = await Project.findAll({ include: ProjectImage });
  res.json(projects);
};

/* UPDATE PROJECT (details + add new images) */
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.update(req.body);

    // Add new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${uuid()}-${file.originalname}`;

        await minioClient.putObject(
          process.env.MINIO_PROJECTS_BUCKET,
          fileName,
          file.buffer,
          file.mimetype
        );

        await ProjectImage.create({
          imageUrl: fileName,
          ProjectId: project.id,
        });
      }
    }

    res.json({ success: true, message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE SINGLE PROJECT IMAGE */
exports.deleteProjectImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await ProjectImage.findByPk(imageId);

    if (!image) return res.status(404).json({ message: "Image not found" });

    await minioClient.removeObject(
      process.env.MINIO_PROJECTS_BUCKET,
      image.imageUrl
    );

    await image.destroy();

    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PROJECT + ALL IMAGES */
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, { include: ProjectImage });

    if (!project) return res.status(404).json({ message: "Project not found" });

    for (const img of project.ProjectImages) {
      await minioClient.removeObject(
        process.env.MINIO_PROJECTS_BUCKET,
        img.imageUrl
      );
    }

    await project.destroy();

    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
