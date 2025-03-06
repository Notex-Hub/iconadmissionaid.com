import { useState } from "react";

const initialProjects = [
  {
    id: "RP001",
    title: "AI in Education",
    description: "Exploring the applications of AI in improving educational outcomes",
    status: "In Progress",
  },
  {
    id: "RP002",
    title: "Quantum Computing Algorithms",
    description: "Developing new algorithms for quantum computers",
    status: "Planning",
  },
];

export function ResearchContent() {
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({ title: "", description: "", status: "Planning" });

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      const projectId = `RP${String(projects.length + 1).padStart(3, "0")}`;
      setProjects([...projects, { ...newProject, id: projectId }]);
      setNewProject({ title: "", description: "", status: "Planning" });
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Research Projects</h2>
      <p className="text-gray-600 mb-4">Manage your ongoing research projects</p>
      
      {/* Add New Project */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Project Title"
          className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <textarea
          placeholder="Project Description"
          className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-400"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button
          onClick={handleAddProject}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Project ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="p-3 border">{project.id}</td>
                  <td className="p-3 border">{project.title}</td>
                  <td className="p-3 border">{project.description}</td>
                  <td className="p-3 border">{project.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center border text-gray-500">
                  No research projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
