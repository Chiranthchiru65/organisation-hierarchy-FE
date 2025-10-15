import { Card, CardBody } from "@heroui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  color?: string; // optional for future customization
}

export default function StatsCard({ label, value, color }: StatsCardProps) {
  return (
    <Card shadow="sm" className="hover:shadow-md transition">
      <CardBody className="text-center">
        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={`text-3xl font-semibold mt-1 ${
            color ? color : "text-gray-800"
          }`}
        >
          {value}
        </p>
      </CardBody>
    </Card>
  );
}
