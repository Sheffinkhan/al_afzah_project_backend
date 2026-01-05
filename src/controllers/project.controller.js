const { Project, ProjectImage } = require("../models");
const { v4: uuid } = require("uuid");

/* CREATE PROJECT */
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET PROJECTS */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ include: ProjectImage });
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
    res.json({ success: true, message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE PROJECT */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    res.json({ success: true, message: "Project deleted" });
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

    await image.destroy();
    res.json({ success: true, message: "Image deleted" });
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
