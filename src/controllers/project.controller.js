const { Project, ProjectImage } = require("../models");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    const { title, description, location, completedDate } = req.body;

    // 1. Create project
    const project = await Project.create({
      title,
      description,
      location,
      completedDate,
    });

    // 2. Upload images to S3
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `projects/${project.id}/${uuid()}-${file.originalname}`;

        const uploadResult = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
          .promise();

        // 3. Save image URL in DB
        await ProjectImage.create({
          projectId: project.id,
          imageUrl: uploadResult.Location,
        });
      }
    }

    // 4. Return project with images
    const result = await Project.findByPk(project.id, {
      include: ProjectImage,
    });

    res.status(201).json({ success: true, data: result });
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

    await project.update(req.body);

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `projects/${project.id}/${uuid()}-${file.originalname}`;

        const uploadResult = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
          })
          .promise();

        await ProjectImage.create({
          projectId: project.id,
          imageUrl: uploadResult.Location,
        });
      }
    }

    res.json({ success: true });
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

    // Delete images from S3
    for (const img of project.ProjectImages) {
      const key = img.imageUrl.split(".amazonaws.com/")[1];

      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET_PROJECTS,
          Key: key,
        })
        .promise();
    }

    await project.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
