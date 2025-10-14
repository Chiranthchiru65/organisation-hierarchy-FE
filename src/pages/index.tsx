import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, Users, Building2, GitBranch, Activity } from "lucide-react";
export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, John!
            </h1>
            <p className="text-gray-500">
              Here’s a high-level overview of your organization.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              startContent={<Plus size={16} />}
              color="success"
              variant="solid"
              className="font-medium"
            >
              Add Employee
            </Button>
            <Button
              startContent={<Users size={16} />}
              color="primary"
              variant="flat"
              className="font-medium"
            >
              Create Team
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card shadow="sm" className="hover:shadow-md transition">
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">1,234</p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="hover:shadow-md transition">
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">15</p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="hover:shadow-md transition">
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Avg. Span of Control</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">8.2</p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="hover:shadow-md transition">
            <CardBody className="text-center">
              <p className="text-sm text-gray-500">Open Positions</p>
              <p className="text-3xl font-semibold text-green-600 mt-1">12</p>
            </CardBody>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Organizational Chart Preview */}
          <Card shadow="sm" className="col-span-2">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-md font-semibold text-gray-700">
                Organizational Chart Preview
              </h2>
              <Button
                size="sm"
                variant="light"
                color="primary"
                className="text-sm"
              >
                View Full Chart
              </Button>
            </CardHeader>
            <CardBody className="flex justify-center items-center min-h-[220px] text-gray-400">
              <GitBranch size={64} strokeWidth={1.5} />
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-md font-semibold text-gray-700">
                Recent Activity
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <ActivityItem
                name="Alice Johnson"
                action="was hired as"
                role="Software Engineer"
                color="green"
                time="2 hours ago"
              />
              <ActivityItem
                name="Bob Williams"
                action="was promoted to"
                role="Senior Marketing Manager"
                color="blue"
                time="1 day ago"
              />
              <ActivityItem
                name="The Design Team"
                action="was moved under"
                role="Product Department"
                color="yellow"
                time="3 days ago"
              />
              <ActivityItem
                name="Charlie Brown"
                action="was hired as"
                role="UX Designer"
                color="green"
                time="5 days ago"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}

function ActivityItem({
  name,
  action,
  role,
  color,
  time,
}: {
  name: string;
  action: string;
  role: string;
  color: string;
  time: string;
}) {
  const colorMap: Record<string, string> = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full ${colorMap[color]}`}
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
