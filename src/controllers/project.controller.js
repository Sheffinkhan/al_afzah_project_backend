const { Project, ProjectImage } = require("../models");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    if (req.files && req.files.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const project = await Project.create(req.body);

    if (req.files) {
      for (const file of req.files) {
        const key = `projects/${project.id}/${uuid()}-${file.originalname}`;

        const upload = await s3.upload({
          Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }).promise();


        await ProjectImage.create({
          projectId: project.id,
          imageUrl: upload.Location,
        });
      }
    }

    const result = await Project.findByPk(project.id, {
      include: ProjectImage,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET PROJECTS */
const getProjects = async (req, res) => {
  const projects = await Project.findAll({
    include: ProjectImage,
    order: [["createdAt", "DESC"]],
  });
  res.json(projects);
};

/* UPDATE PROJECT */
const updateProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });

  await project.update(req.body);
  res.json({ success: true });
};

/* DELETE PROJECT */
const deleteProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: ProjectImage,
  });

  if (!project) return res.status(404).json({ message: "Not found" });

  for (const img of project.ProjectImages) {
    const key = img.imageUrl.split(".amazonaws.com/")[1];
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
      Key: key,
    }).promise();
  }

  await project.destroy();
  res.json({ success: true });
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
