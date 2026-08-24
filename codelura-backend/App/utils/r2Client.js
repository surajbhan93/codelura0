// r2Client.js


// import { S3Client } from "@aws-sdk/client-s3";
// console.log("R2 CREDS CHECK 👉", {
//   accountId:  process.env.R2_ACCOUNT_ID,
//   keyId:      process.env.R2_ACCESS_KEY_ID,
//   secret:     process.env.R2_SECRET_ACCESS_KEY ? "✅ set" : "❌ MISSING",
//   bucket:     process.env.R2_BUCKET,
// });
// const r2 = new S3Client({
//   region: "auto",
//   endpoint: process.env.R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY,
//     secretAccessKey: process.env.R2_SECRET_KEY,
//   },
// });
// export default r2;


import { S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY,    // ✅ .env se match
    secretAccessKey: process.env.R2_SECRET_KEY,    // ✅ .env se match
  },
});

export default r2;