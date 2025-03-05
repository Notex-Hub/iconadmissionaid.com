import { CheckCircleIcon, PlusIcon } from 'lucide-react';
import  { useState } from 'react';
import { FaExclamation } from 'react-icons/fa';


const assignments = [
  {
    id: 1,
    course: "CS 101",
    title: "Programming Assignment 3",
    due: "Tomorrow, 11:59 PM",
    status: "pending",
    description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
  },
  {
    id: 2,
    course: "MATH 201",
    title: "Problem Set 5",
    due: "Thursday, 11:59 PM",
    status: "pending",
    description: "Complete problems 5.1-5.10 in the textbook.",
  },
  {
    id: 3,
    course: "ENG 110",
    title: "Essay Draft",
    due: "Wednesday, 11:59 PM",
    status: "pending",
    description: "Submit a 3-page draft of your research paper.",
  },
  {
    id: 4,
    course: "PHYS 101",
    title: "Lab Report 2",
    due: "Friday, 5:00 PM",
    status: "completed",
    description: "Write a report on the pendulum experiment conducted in lab.",
  },
];

const Assignments = () => {
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);

  // Mark assignment as completed
  const markAsComplete = (title) => {
    setFilteredAssignments(prevAssignments =>
      prevAssignments.map(assignment =>
        assignment.title === title
          ? { ...assignment, status: 'completed' }
          : assignment
      )
    );
  };

  return (
    <div className="space-y-4 mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Assignments</h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Assignment
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-xl text-gray-900">{assignment.title}</h4>
                <p className="text-sm text-gray-600">{assignment.course}</p>
              </div>
              <div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    assignment.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {assignment.status === "completed" ? (
                    <span className="flex items-center">
                      <CheckCircleIcon className="mr-1 h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaExclamation className="mr-1 h-3 w-3" />
                      Due: {assignment.due}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{assignment.description}</p>

            <div className="mt-4">
              {assignment.status === "pending" ? (
                <button
                  onClick={() => markAsComplete(assignment.title)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Mark as Complete
                </button>
              ) : (
                <button
                  className="w-full py-2 px-4 bg-gray-500 text-white rounded-md cursor-not-allowed"
                  disabled
                >
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
