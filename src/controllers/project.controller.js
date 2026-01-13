const { Project, ProjectImage } = require("../models");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");
const { validate: isUUID } = require("uuid");

/* ============================
   CREATE PROJECT (MAX 10 IMAGES)
============================ */
const createProject = async (req, res) => {
  try {
    if (req.files && req.files.length > 10) {
      return res.status(400).json({
        message: "Maximum 10 images allowed",
      });
    }

    // 1️⃣ Create project
    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      completedDate: req.body.completedDate,
    });

    // 2️⃣ Upload images (if any)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `projects/${project.id}/${uuid()}-${file.originalname}`;

        const upload = await s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();

        // 3️⃣ Save image reference
        await ProjectImage.create({
          ProjectId: project.id, // 👈 MUST MATCH DB
          imageUrl: upload.Location,
        });
      }
    }

    // 4️⃣ Return project with images
    const result = await Project.findByPk(project.id, {
      include: {
        model: ProjectImage,
        as: "images",
      },
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   GET ALL PROJECTS
============================ */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: {
        model: ProjectImage,
        as: "images",
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ============================
   UPDATE PROJECT (NO IMAGE HERE)
============================ */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ UUID validation
    if (!id || !isUUID(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update({
      title: req.body.title ?? project.title,
      description: req.body.description ?? project.description,
      location: req.body.location ?? project.location,
      completedDate: req.body.completedDate ?? project.completedDate,
    });

    res.json({ success: true, data: project });
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ============================
   DELETE PROJECT + S3 IMAGES
============================ */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ UUID validation
    if (!id || !isUUID(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByPk(id, {
      include: {
        model: ProjectImage,
        as: "images",
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (const img of project.images) {
      const key = img.imageUrl.split(".amazonaws.com/")[1];

      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        })
        .promise();
    }

    await project.destroy();

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateProjectImage = async (req, res) => {
  try {
    const { projectId, imageId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    const image = await ProjectImage.findByPk(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // 🔥 Delete old image from S3
    const oldKey = image.imageUrl.split(".amazonaws.com/")[1];

    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: oldKey,
    }).promise();

    // 🚀 Upload new image
    const newKey = `projects/${projectId}/${uuid()}-${req.file.originalname}`;

    const upload = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: newKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();

    // 💾 Update DB
    image.imageUrl = upload.Location;
    await image.save();

    res.json({
      success: true,
      data: image,
    });
  } catch (err) {
    console.error("UPDATE PROJECT IMAGE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  updateProjectImage,
};
