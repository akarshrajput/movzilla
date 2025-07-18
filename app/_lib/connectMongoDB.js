const mongoose = require("mongoose");

async function connectMongoDB() {
  if (mongoose.connection.readyState === 1) return; // already connected
  const MONGODB_URI = process.env.MONGODB_URI; // ensure this is set in .env
  if (!MONGODB_URI)
    throw new Error("MONGODB_URI not set in environment variables");
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectMongoDB;
