import cloudinary from "../../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
   console.log("FILE:", req.file);
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error:", error);
            console.log("Cloudinary result:", result);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(file.buffer);
    });

    return res.json({
      url: result.secure_url
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};