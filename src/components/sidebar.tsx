import {
  Home,
  Briefcase,
  FileText,
  Network,
  Users,
  BarChart,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Logo } from "@/components/icons";

const navItems = [
  { icon: Home, path: "/", label: "Home" },
  { icon: Briefcase, path: "/list", label: "Employees" },
  { icon: Network, path: "/hierarchy", label: "Hierarchy" },
  { icon: FileText, path: "/reports", label: "Reports" },
  { icon: Users, path: "/teams", label: "Teams" },
  { icon: BarChart, path: "/analytics", label: "Analytics" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center justify-between bg-white shadow-sm py-6">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-8">
        <Link
          className="flex justify-start items-center gap-1"
          color="foreground"
          to="/"
        >
          <Logo />
        </Link>

        {/* Navigation icons */}
        <nav className="flex flex-col space-y-6">
          {navItems.map(({ icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={clsx(
                  "flex flex-col items-center transition-colors",
                  isActive ? "text-black" : "text-gray-400 hover:text-gray-800"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings at bottom */}
      <div className="text-gray-400 hover:text-gray-800 cursor-pointer transition-colors">
        <Settings size={22} />
      </div>
    </aside>
  );
}
