/* eslint-disable react/prop-types */

  
  export function RecentActivity({activities}) {
    return (
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="flex items-center justify-center h-9 w-9 bg-gray-200 rounded-full">
              <span className="text-sm font-semibold text-white">{activity?.avatar}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity?.user} <span className="text-gray-500">{activity?.action}</span>
              </p>
              <p className="text-xs text-gray-400">{activity?.time}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  