const activities = [
    {
      user: "John Doe",
      action: "updated the cafeteria menu",
      time: "2 minutes ago",
      avatar: "JD",
    },
    {
      user: "Sarah Smith",
      action: "added a new bus route",
      time: "15 minutes ago",
      avatar: "SS",
    },
    {
      user: "Michael Brown",
      action: "created a new event",
      time: "1 hour ago",
      avatar: "MB",
    },
    {
      user: "Emily Johnson",
      action: "updated class schedule",
      time: "3 hours ago",
      avatar: "EJ",
    },
    {
      user: "Admin",
      action: "system maintenance completed",
      time: "5 hours ago",
      avatar: "AD",
    },
  ]
  
  export function RecentActivity() {
    return (
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="flex items-center justify-center h-9 w-9 bg-gray-200 rounded-full">
              <span className="text-sm font-semibold text-white">{activity.avatar}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user} <span className="text-gray-500">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  