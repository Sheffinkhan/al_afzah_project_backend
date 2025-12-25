const app = require("./app");
const { sequelize } = require("./models");
const minioClient = require("./config/minio");

async function initBuckets() {
  const projectBucket = process.env.MINIO_PROJECTS_BUCKET;
  const clientBucket = process.env.MINIO_CLIENTS_BUCKET;

  const projectExists = await minioClient.bucketExists(projectBucket);
  if (!projectExists) {
    await minioClient.makeBucket(projectBucket);
    console.log("Created bucket:", projectBucket);
  }

  const clientExists = await minioClient.bucketExists(clientBucket);
  if (!clientExists) {
    await minioClient.makeBucket(clientBucket);
    console.log("Created bucket:", clientBucket);
  }
}

sequelize.sync().then(async () => {
  await initBuckets();

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
