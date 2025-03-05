
import { FaEnvelope, FaPhone, FaBook, FaClock, FaCalendarAlt } from "react-icons/fa";

const faculty = [
  {
    name: "Dr. Smith",
    department: "Computer Science",
    email: "smith@university.edu",
    phone: "(555) 123-4567",
    office: "Science Building, Room 420",
    officeHours: "Monday & Wednesday, 1:00 PM - 3:00 PM",
  },
  {
    name: "Dr. Johnson",
    department: "Mathematics",
    email: "johnson@university.edu",
    phone: "(555) 234-5678",
    office: "Math Building, Room 310",
    officeHours: "Tuesday & Thursday, 10:00 AM - 12:00 PM",
  },
  {
    name: "Prof. Williams",
    department: "English",
    email: "williams@university.edu",
    phone: "(555) 345-6789",
    office: "Humanities Building, Room 210",
    officeHours: "Monday & Friday, 2:00 PM - 4:00 PM",
  },
  {
    name: "Dr. Brown",
    department: "Physics",
    email: "brown@university.edu",
    phone: "(555) 456-7890",
    office: "Science Building, Room 350",
    officeHours: "Wednesday & Friday, 11:00 AM - 1:00 PM",
  },
  {
    name: "Dr. Davis",
    department: "Chemistry",
    email: "davis@university.edu",
    phone: "(555) 567-8901",
    office: "Science Building, Room 280",
    officeHours: "Tuesday & Thursday, 3:00 PM - 5:00 PM",
  },
];

const FacultyContacts = () => {
  return (
    <div className="p-6  mx-auto">
      <h2 className="text-2xl font-bold mb-4">Faculty Contacts</h2>
      <p className="text-gray-600 mb-6">Contact information for your professors</p>

      <div className="space-y-4">
        {faculty.map((prof, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-md bg-white"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold">
                {prof.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>

            {/* Faculty Info */}
            <div className="flex-1 space-y-2">
              <h4 className="text-lg font-medium">{prof.name}</h4>
              <p className="text-sm text-gray-500">{prof.department}</p>

              <div className="grid gap-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  <span>{prof.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaPhone className="mr-2 text-green-500" />
                  <span>{prof.phone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaBook className="mr-2 text-purple-500" />
                  <span>{prof.office}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-2 text-orange-500" />
                  <span>Office Hours: {prof.officeHours}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-center px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
                <FaEnvelope className="mr-2" />
                Email
              </button>
              <button className="flex items-center justify-center px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
                <FaCalendarAlt className="mr-2" />
                Schedule Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyContacts;
