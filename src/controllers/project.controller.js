const { Project, ProjectImage } = require("../models");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    const { title, description, location, completedDate } = req.body;

    const project = await Project.create({
      title,
      description,
      location,
      completedDate,
    });

    // If images exist
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await ProjectImage.create({
          imageUrl: file.originalname, // later replace with S3 URL
          ProjectId: project.id,
        });
      }
    }

    res.status(201).json({ success: true, data: project });
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
