import { Activity } from "lucide-react";

interface ActivityItemProps {
  name: string;
  action: string;
  role: string;
  color?: "green" | "blue" | "yellow";
  time: string;
}

export default function ActivityItem({
  name,
  action,
  role,
  color = "green",
  time,
}: ActivityItemProps) {
  const colorMap: Record<string, string> = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full ${
          colorMap[color]
        }`}
      >
        <Activity size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">{name}</span> {action}{" "}
          <span className="font-medium">{role}</span>.
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
