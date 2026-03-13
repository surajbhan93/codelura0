"use client";
//add -> final score, plagarism column, judge button
import { useEffect, useState } from "react";
import api from "@/lib/api";

type Submission = {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  techStack: string[];
  githubRepo: string;
  demoVideo: string;
  liveUrl: string;
  user?: {
    name: string;
    email: string;
  };
  hackathon?: {
    title: string;
  };
};

export default function HackathonSubmissionsPage() {

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {

    try {

      const res = await api.get("/admin/submissions");

      setSubmissions(res.data.data);

    } catch (error) {
      console.error("Error fetching submissions", error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading submissions...
      </div>
    );
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Hackathon Submissions
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 border">User</th>
              <th className="p-3 border">Project</th>
              <th className="p-3 border">Hackathon</th>
              <th className="p-3 border">Tech Stack</th>
              <th className="p-3 border">GitHub</th>
              <th className="p-3 border">Demo</th>
              <th className="p-3 border">Live</th>

            </tr>

          </thead>

          <tbody>

            {submissions.map((sub) => (

              <tr key={sub._id} className="text-center">

                <td className="p-3 border">
                  {sub.user?.name}
                  <div className="text-sm text-gray-500">
                    {sub.user?.email}
                  </div>
                </td>

                <td className="p-3 border">
                  {sub.projectTitle}
                </td>

                <td className="p-3 border">
                  {sub.hackathon?.title}
                </td>

                <td className="p-3 border">
                  {sub.techStack?.join(", ")}
                </td>

                <td className="p-3 border">
                  <a
                    href={sub.githubRepo}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    GitHub
                  </a>
                </td>

                <td className="p-3 border">
                  <a
                    href={sub.demoVideo}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Demo
                  </a>
                </td>

                <td className="p-3 border">
                  <a
                    href={sub.liveUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Live
                  </a>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}