// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // const uploadDir = path.join(process.cwd(), "uploads", "pdfs");
// const uploadDir = path.join(process.cwd(), "uploads");

// // ensure folder exists (extra safety)
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// export const uploadPDF = multer({
//   storage,
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype !== "application/pdf") {
//       return cb(new Error("Only PDF files allowed"));
//     }
//     cb(null, true);
//   }
// });

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder = "others";

//     if (file.fieldname === "pdf") folder = "pdfs";
//     if (file.fieldname === "banner") folder = "banners";
//     if (file.fieldname === "attachments") folder = "attachments";

//     const finalPath = path.join(uploadDir, folder);
//     if (!fs.existsSync(finalPath)) {
//       fs.mkdirSync(finalPath, { recursive: true });
//     }

//     cb(null, finalPath);
//   },

//   filename: (req, file, cb) => {
//     const unique =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 } // 50MB
// });


import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2 from "./r2Client.js";

export const uploadPdfToR2 = async (file) => {

  const fileName = `${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: "application/pdf",
  });

  await r2.send(command);

  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
};