"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";

interface Hackathon {
  title: string;
  shortDescription: string;
}

export default function SubmissionPage() {
  const params = useParams();
  const hackathonId = params.id as string;

  const [hackathonTitle, setHackathonTitle] = useState("");

  const [form, setForm] = useState({
    projectTitle: "",
    projectDescription: "",
    problemStatement: "",
    solution: "",
    techStack: "",
    githubRepo: "",
    demoVideo: "",
    liveUrl: "",
    pitchDeck: "",
    screenshots: [""],
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await api.get(`/hackathons/${hackathonId}`);
        setHackathonTitle(res.data.title);
        setForm((prev) => ({
          ...prev,
          projectTitle: res.data.title,
          projectDescription: res.data.shortDescription,
        }));
      } catch {
        toast.error("Failed to load hackathon");
      }
    };
    fetchHackathon();
  }, [hackathonId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScreenshotChange = (index: number, value: string) => {
    const updated = [...form.screenshots];
    updated[index] = value;
    setForm({ ...form, screenshots: updated });
  };

  const addScreenshot = () => {
    setForm({ ...form, screenshots: [...form.screenshots, ""] });
  };

  const removeScreenshot = (index: number) => {
    const updated = form.screenshots.filter((_, i) => i !== index);
    setForm({ ...form, screenshots: updated });
  };

  const submitProject = async () => {
    try {
      await api.post("/participation/submit", {
        hackathonId,
        projectTitle: form.projectTitle,
        projectDescription: form.projectDescription,
        problemStatement: form.problemStatement,
        solution: form.solution,
        techStack: form.techStack.split(",").map((t) => t.trim()),
        githubRepo: form.githubRepo,
        demoVideo: form.demoVideo,
        liveUrl: form.liveUrl,
        pitchDeck: form.pitchDeck,
        screenshots: form.screenshots,
      });
      toast.success("Project submitted successfully");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Submission failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .submission-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8f0;
          padding: 0;
          position: relative;
          overflow-x: hidden;
        }

        .submission-root::before {
          content: '';
          position: fixed;
          top: -30%;
          right: -20%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(99, 60, 255, 0.12) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .submission-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          left: -15%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 210, 180, 0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .submission-inner {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        /* Header */
        .sub-header {
          margin-bottom: 52px;
        }

        .sub-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7c6ef7;
          background: rgba(99, 60, 255, 0.1);
          border: 1px solid rgba(99, 60, 255, 0.2);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .sub-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7c6ef7;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        .sub-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 5vw, 38px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #f0f0fa;
          margin: 0 0 12px;
        }

        .sub-title span {
          background: linear-gradient(135deg, #7c6ef7, #00d2b4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sub-subtitle {
          font-size: 15px;
          color: #6b6b80;
          font-weight: 300;
          margin: 0;
        }

        /* Progress indicator */
        .progress-bar-wrap {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          margin-bottom: 48px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          width: 35%;
          background: linear-gradient(90deg, #7c6ef7, #00d2b4);
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        /* Section Cards */
        .form-section {
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px 28px 24px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s ease;
        }

        .form-section:hover {
          border-color: rgba(124, 110, 247, 0.18);
        }

        .section-label {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #4a4a60;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        /* Field groups */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 580px) {
          .field-row {
            grid-template-columns: 1fr;
          }
        }

        /* Field wrapper */
        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-wrap label {
          font-size: 12px;
          font-weight: 500;
          color: #5a5a70;
          letter-spacing: 0.04em;
        }

        /* Inputs & Textareas */
        .sub-input,
        .sub-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          color: #e0e0f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .sub-input::placeholder,
        .sub-textarea::placeholder {
          color: #3a3a50;
        }

        .sub-input:focus,
        .sub-textarea:focus {
          border-color: rgba(124, 110, 247, 0.5);
          background: rgba(124, 110, 247, 0.06);
          box-shadow: 0 0 0 3px rgba(124, 110, 247, 0.08);
        }

        .sub-input.readonly,
        .sub-textarea.readonly {
          background: rgba(255,255,255,0.02);
          border-color: rgba(255,255,255,0.04);
          color: #5a5a70;
          cursor: not-allowed;
        }

        .sub-textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.6;
        }

        .sub-textarea.tall {
          min-height: 130px;
        }

        /* Screenshot row */
        .screenshot-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .screenshot-row .sub-input {
          flex: 1;
        }

        .screenshot-index {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #3a3a50;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        /* Buttons */
        .btn-remove {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 80, 80, 0.08);
          border: 1px solid rgba(255, 80, 80, 0.18);
          color: #ff6060;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
          padding: 0;
        }

        .btn-remove:hover {
          background: rgba(255, 80, 80, 0.16);
          border-color: rgba(255, 80, 80, 0.35);
        }

        .btn-add-screenshot {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #7c6ef7;
          background: rgba(124, 110, 247, 0.08);
          border: 1px dashed rgba(124, 110, 247, 0.3);
          border-radius: 10px;
          padding: 9px 18px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-top: 4px;
          width: fit-content;
        }

        .btn-add-screenshot:hover {
          background: rgba(124, 110, 247, 0.14);
          border-color: rgba(124, 110, 247, 0.5);
        }

        /* Submit button */
        .submit-wrap {
          margin-top: 36px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .submit-note {
          font-size: 12px;
          color: #3a3a50;
          flex: 1;
        }

        .btn-submit {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #fff;
          background: linear-gradient(135deg, #6a5cf7, #00c4a8);
          border: none;
          border-radius: 14px;
          padding: 14px 32px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 8px 32px rgba(99, 60, 255, 0.28);
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99, 60, 255, 0.38);
        }

        .btn-submit:hover::before {
          opacity: 1;
        }

        .btn-submit:active {
          transform: translateY(0);
        }

        .btn-submit-arrow {
          font-size: 16px;
          transition: transform 0.2s;
        }

        .btn-submit:hover .btn-submit-arrow {
          transform: translateX(3px);
        }

        /* Divider */
        .section-divider {
          height: 1px;
          background: rgba(255,255,255,0.04);
          margin: 8px 0;
        }

        /* Responsive padding */
        @media (max-width: 480px) {
          .submission-inner {
            padding: 36px 16px 60px;
          }

          .form-section {
            padding: 20px 18px 18px;
          }

          .submit-wrap {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-submit {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      <div className="submission-root">
        <div className="submission-inner">

          {/* Header */}
          <div className="sub-header">
            <div className="sub-eyebrow">Hackathon Submission</div>
            <h1 className="sub-title">
              Submit Your <span>Project</span>
            </h1>
            <p className="sub-subtitle">
              {hackathonTitle ? `For: ${hackathonTitle}` : "Loading hackathon details…"}
            </p>
          </div>

          {/* Progress */}
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" />
          </div>

          {/* Section 1 — Project Info (auto-filled) */}
          <div className="form-section">
            <p className="section-label">Project Info</p>
            <div className="field-group">
              <div className="field-wrap">
                <label>Project Title</label>
                <input
                  name="projectTitle"
                  value={form.projectTitle}
                  className="sub-input readonly"
                  readOnly
                />
              </div>
              <div className="field-wrap">
                <label>Project Description</label>
                <textarea
                  name="projectDescription"
                  value={form.projectDescription}
                  className="sub-textarea readonly"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section 2 — Problem & Solution */}
          <div className="form-section">
            <p className="section-label">Problem & Solution</p>
            <div className="field-group">
              <div className="field-wrap">
                <label>Problem Statement</label>
                <textarea
                  name="problemStatement"
                  placeholder="What problem does your project solve?"
                  className="sub-textarea tall"
                  onChange={handleChange}
                />
              </div>
              <div className="field-wrap">
                <label>Your Solution</label>
                <textarea
                  name="solution"
                  placeholder="Describe how your project solves the problem"
                  className="sub-textarea tall"
                  onChange={handleChange}
                />
              </div>
              <div className="field-wrap">
                <label>Tech Stack</label>
                <input
                  name="techStack"
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker"
                  className="sub-input"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3 — Links */}
          <div className="form-section">
            <p className="section-label">Links & Resources</p>
            <div className="field-group">
              <div className="field-row">
                <div className="field-wrap">
                  <label>GitHub Repository</label>
                  <input
                    name="githubRepo"
                    placeholder="https://github.com/…"
                    className="sub-input"
                    onChange={handleChange}
                  />
                </div>
                <div className="field-wrap">
                  <label>Live Project URL</label>
                  <input
                    name="liveUrl"
                    placeholder="https://yourproject.com"
                    className="sub-input"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field-wrap">
                  <label>Demo Video URL</label>
                  <input
                    name="demoVideo"
                    placeholder="https://youtube.com/…"
                    className="sub-input"
                    onChange={handleChange}
                  />
                </div>
                <div className="field-wrap">
                  <label>Pitch Deck URL</label>
                  <input
                    name="pitchDeck"
                    placeholder="https://slides.com/…"
                    className="sub-input"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 — Screenshots */}
          <div className="form-section">
            <p className="section-label">Screenshots</p>
            <div className="field-group">
              {form.screenshots.map((url, index) => (
                <div className="screenshot-row" key={index}>
                  <span className="screenshot-index">{index + 1}</span>
                  <input
                    value={url}
                    placeholder="Paste Cloudinary Image URL"
                    className="sub-input"
                    onChange={(e) => handleScreenshotChange(index, e.target.value)}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeScreenshot(index)}
                      aria-label="Remove screenshot"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add-screenshot"
                onClick={addScreenshot}
              >
                <span>＋</span> Add Screenshot
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="submit-wrap">
            <p className="submit-note">
              Make sure all required fields are filled before submitting.
            </p>
            <button
              className="btn-submit"
              onClick={submitProject}
            >
              Submit Project
              <span className="btn-submit-arrow">→</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}