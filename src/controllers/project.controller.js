const { Project, ProjectImage } = require("../models");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    const {
      title = null,
      description = null,
      location = null,
      completedDate = null,
    } = req.body || {};

    const project = await Project.create({
      title,
      description,
      location,
      completedDate,
    });

    if (req.files?.length) {
      for (const file of req.files) {
        await ProjectImage.create({
          imageUrl: file.originalname,
          ProjectId: project.id,
        });
      }
    }

    return res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  deleteProjectImage,
};
