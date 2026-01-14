import { Bus, FileText, Users, TrendingUp } from "lucide-react";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Buses",
      value: "12",
      change: "+2 new",
      icon: <Bus className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Active Notices",
      value: "5",
      change: "Updated today",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Total Bookings",
      value: "1,245",
      change: "+18% from last month",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Registered Students",
      value: "850",
      change: "+12 this week",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Last 30 Days
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.bg} p-3`}>{stat.icon}</div>
              {index === 2 ? (
                 <span className="inline-flex items-baseline rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700 md:mt-2 lg:mt-0">
                  +18%
                </span>
              ) : null}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className="mt-1">
               <p className="text-xs text-gray-400">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">Activity chart placeholders will go here</p>
        </div>
      </div>
    </div>
  );
}