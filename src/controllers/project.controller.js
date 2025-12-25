const { Project, ProjectImage } = require("../models");
const minioClient = require("../config/minio");
const { v4: uuid } = require("uuid");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    for (const file of req.files) {
      const fileName = `${uuid()}-${file.originalname}`;

      await minioClient.putObject(
        process.env.MINIO_PROJECTS_BUCKET, // ✅ PROJECT BUCKET
        fileName,
        file.buffer,
        file.mimetype
      );

      await ProjectImage.create({
        imageUrl: fileName,
        ProjectId: project.id,
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  const projects = await Project.findAll({
    include: ProjectImage,
  });

  res.json(projects);
};
