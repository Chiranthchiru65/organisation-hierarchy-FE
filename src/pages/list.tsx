import type { Employee } from "@/types/employee";

import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { getAllEmployees } from "@/services/employeeService";
import { toast } from "react-toastify";
export default function ListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getAllEmployees(); // call service
        setEmployees(response.data); // backend returns { success, data }
        toast.success("data loaded successfully!");
      } catch (err: any) {
        setError(err.message || "Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-2">Employee List</h1>
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <ul className="space-y-1">
            {employees.map((emp) => (
              <li key={emp.employeeId}>
                <strong>{emp.name}</strong> — {emp.position} ({emp.department})
              </li>
            ))}
          </ul>
        )}
      </div>
    </DefaultLayout>
  );
}
