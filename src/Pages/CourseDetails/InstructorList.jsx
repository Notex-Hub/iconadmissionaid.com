/* eslint-disable react/prop-types */


export function InstructorList({ instructors = [] }) {
  if (!instructors || instructors.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">কোর্স ইনস্ট্রাক্টর</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {instructors.map((t) => (
          <div key={t._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded">
            <img src={t.profile_picture || "/public/default-avatar.png"} alt={t.name} className="w-14 h-14 object-cover rounded-full" />
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-gray-600">{t.role} {t.phone ? `· ${t.phone}` : ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
