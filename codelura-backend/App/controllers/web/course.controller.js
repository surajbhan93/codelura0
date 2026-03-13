import Course from "../../models/Course.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { rgb, degrees } from "pdf-lib";
import path from "path";
/**
 * ===============================
 * LIST COURSES
 * ===============================
 */
export const listCourses = async (req, res) => {
  const courses = await Course.find({ isPublished: true })
    .select("-pdf.filePath -attachments.filePath")
    .sort({ createdAt: -1 });

  res.json(courses);
};



// export const getCourse = async (req, res) => {

//   const course = await Course.findById(req.params.id);
//   console.log("USER 👉", req.user);
//   console.log("PURCHASED COURSES 👉", req.user?.purchasedCourses);
//   if (!course || !course.isPublished) {
//     return res.status(404).json({ message: "Not found" });
//   }

//   const isLoggedIn = !!req.user;

//   const hasPurchased =
//   req.user?.purchasedCourses?.some(
//     (id) => id.toString() === course._id.toString()
//   );
//   let accessLevel = "preview";
//   console.log("HAS PURCHASED 👉", hasPurchased);
//   if (course.accessType === "public_preview") {

//     accessLevel = "preview";

//   }

//   if (course.accessType === "login_required") {

//     accessLevel = isLoggedIn ? "full_read" : "preview";

//   }

//   if (course.accessType === "paid_only") {

//     accessLevel = hasPurchased ? "full_access" : "locked";

//   }

//   if (hasPurchased) {
//     accessLevel = "full_access";
//   }

//   res.json({
//     course,
//     accessLevel
//   });

// };


export const getCourse = async (req, res) => {

  const course = await Course.findById(req.params.id);

  console.log("USER 👉", req.user);
  console.log("PURCHASED COURSES 👉", req.user?.purchasedCourses);

  if (!course || !course.isPublished) {
    return res.status(404).json({ message: "Not found" });
  }

  const isLoggedIn = !!req.user;

  const hasPurchased =
    req.user?.purchasedCourses?.some(
      (id) => id.toString() === course._id.toString()
    );

  console.log("HAS PURCHASED 👉", hasPurchased);

  let accessLevel = "preview";

  // Purchased user → full access
  if (hasPurchased) {
    accessLevel = "full_access";
  }

  // Logged in user → full read
  else if (isLoggedIn) {
    accessLevel = "full_read";
  }

  // Guest → preview
  else {
    accessLevel = "preview";
  }

  res.json({
    course,
    accessLevel
  });
};

export const previewPDF = async (req, res) => {
  try {

    const course = await Course.findById(req.params.id);

    if (!course || !course.pdf?.filePath) {
      return res.status(404).json({
        message: "PDF not found"
      });
    }

    const isLoggedIn = !!req.user;
  console.log("PREVIEW REQUEST USER 👉", req.user);
console.log("COURSE ID 👉", req.params.id);
    const hasPurchased =
  req.user?.purchasedCourses?.some(
    (id) => id.toString() === course._id.toString()
  );
    /* ===============================
       ACCESS RULES -1rule
    =============================== */
console.log("PREVIEW HAS PURCHASED 👉", hasPurchased);
    if (course.accessType === "paid_only" && !hasPurchased && !isLoggedIn) {
      return res.status(403).send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="relative h-screen flex items-center justify-center text-white overflow-hidden">

<!-- Fake blurred PDF background -->
<div class="absolute inset-0">

<div class="absolute inset-0 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-black"></div>

<div class="absolute inset-0 backdrop-blur-md opacity-80"></div>

<!-- fake document lines -->
<div class="absolute inset-0 p-20 space-y-4 opacity-20">
<div class="h-3 bg-white rounded w-3/4"></div>
<div class="h-3 bg-white rounded w-5/6"></div>
<div class="h-3 bg-white rounded w-2/3"></div>
<div class="h-3 bg-white rounded w-4/5"></div>
<div class="h-3 bg-white rounded w-1/2"></div>
<div class="h-3 bg-white rounded w-3/4"></div>
</div>

</div>

<!-- Center card -->
<div class="relative z-10 text-center max-w-md p-10 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">

<div class="text-6xl mb-6">🔐</div>

<h1 class="text-2xl font-bold mb-3">
Premium Content Locked
</h1>

<p class="text-zinc-400 text-sm mb-8">
This document is part of a premium course.
Login and purchase to unlock the full PDF notes.
</p>

<div class="flex flex-col gap-3 text-sm text-left mb-8">

<div class="flex items-center gap-3">
<span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
<span>Login to your account</span>
</div>

<div class="flex items-center gap-3">
<span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
<span>Purchase this course</span>
</div>

<div class="flex items-center gap-3">
<span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
<span>Unlock the full document</span>
</div>

</div>

<div class="flex gap-3 justify-center">

<a href="/auth/login"
class="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
Login
</a>

<a href="/courses/${course._id}"
class="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-105 transition">
Buy Course
</a>

</div>

</div>

</body>
</html>
`);
    }

    // 2nd rule 

    if (course.accessType === "login_required" && !isLoggedIn) {
      return res.status(403).send(`
<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-[#0c0b09] flex items-center justify-center h-screen text-white">

<div class="text-center max-w-md p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-800 border border-white/10 shadow-2xl">

<div class="text-5xl mb-4">🔒</div>

<h1 class="text-2xl font-bold mb-2">
Login Required
</h1>

<p class="text-zinc-400 text-sm mb-6">
This premium document preview is available only for logged-in users.
Login to continue reading the notes.
</p>

<a href="/auth/login"
class="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg hover:scale-105 transition">
Login to Continue
</a>

</div>

</body>
</html>
`);
    }

    /* ===============================
       FILE PATH
    =============================== */

    const pdfPath = path.join(
      process.cwd(),
      course.pdf.filePath
    );

    if (!fs.existsSync(pdfPath)) {
      console.log("PDF NOT FOUND 👉", pdfPath);
      return res.status(404).json({
        message: "File not found"
      });
    }

    const originalBytes = fs.readFileSync(pdfPath);
    const originalPdf = await PDFDocument.load(originalBytes);

    const totalPages = originalPdf.getPageCount();

    /* ===============================
       HEAD REQUEST (for total pages)
    =============================== */

    if (req.method === "HEAD") {
      res.setHeader("X-Total-Pages", totalPages);
      return res.status(200).end();
    }

    /* ===============================
       PAGE ACCESS LOGIC-3rd concept
    =============================== */

   let pagesToShow;

// purchased user → full access
if (hasPurchased) {
  pagesToShow = totalPages;
}

// logged in user → full read
else if (isLoggedIn) {
  pagesToShow = totalPages;
}

// guest user → preview
else {
  pagesToShow = course.previewPages || 3;
}
    /* ===============================
       CREATE PREVIEW PDF
    =============================== */

    const previewPdf = await PDFDocument.create();

    const copiedPages = await previewPdf.copyPages(
      originalPdf,
      Array.from(
        { length: Math.min(pagesToShow, totalPages) },
        (_, i) => i
      )
    );

    copiedPages.forEach((page) => {

      const { width, height } = page.getSize();

      /* WATERMARK */

      page.drawText("Codelura", {
        x: width / 2 - 150,
        y: height / 2 - 50,
        size: 100,
        color: rgb(0.75, 0.75, 0.75),
        rotate: degrees(45),
        opacity: 0.4
      });

      previewPdf.addPage(page);

    });

    const previewBytes = await previewPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Total-Pages", totalPages);

    return res.end(Buffer.from(previewBytes));

  } catch (err) {

    console.error("PREVIEW ERROR 👉", err);

    res.status(500).json({
      message: "Preview failed"
    });

  }
};

// import path from "path";
// import Course from "../../models/Course.js";

export const downloadPDF = async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const hasPurchased =
  req.user?.purchasedCourses?.some(
    (id) => id.toString() === course._id.toString()
  );
    if (!hasPurchased) {
      return res.status(403).json({
        message: "Purchase required"
      });
    }

    const filePath = path.join(
      process.cwd(),
      course.pdf.filePath
    );

    return res.download(filePath);

  } catch (err) {

    console.error("DOWNLOAD ERROR 👉", err);

    res.status(500).json({
      message: "Download failed"
    });

  }

};