import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, GitBranch, Activity } from "lucide-react";
import { addEmployee, getAllEmployees } from "@/services/employeeService";
import type { Employee } from "@/types/employee";
import { useState, useEffect } from "react";
import { Form } from "@heroui/form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import StatsCard from "@/components/StatsCard";
import ActivityItem from "@/components/ActivityItem";

export default function IndexPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeManagerCount, setActiveManagerCount] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Navigate = useNavigate();

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    employeeId: "",
    position: "",
    department: "",
    managerId: "",
    joinDate: "",
  });

  const stats = [
    { label: "Total Employees", value: employees.length },
    { label: "Total Departments", value: "-" },
    { label: "Active Managers", value: activeManagerCount },
    { label: "New Hires This Month", value: "-", color: "text-green-600" },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        const data = response.data || [];
        setEmployees(data);

        const managerSet = new Set(
          data
            .filter((emp: Employee) => emp.managerId)
            .map((emp: Employee) => emp.managerId)
        );
        setActiveManagerCount(managerSet.size);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: newEmployee.employeeId?.toUpperCase(),
        name: newEmployee.name,
        email: newEmployee.email,
        position: newEmployee.position,
        department: newEmployee.department,
        managerId: newEmployee.managerId || null,
        joinDate: newEmployee.joinDate || new Date().toISOString(),
      };
      const res = await addEmployee(payload as Employee);

      if (res.success) {
        toast.success("Employee added successfully!");
        onClose();
        setNewEmployee({
          name: "",
          email: "",
          employeeId: "",
          position: "",
          department: "",
          managerId: "",
          joinDate: "",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add employee");
    }
  };

  const handleOpen = () => onOpen();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome back!
            </h1>
            <p className="text-gray-500">
              Here’s a high-level overview of your organization.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onPress={handleOpen}
              startContent={<Plus size={16} />}
              color="success"
              variant="solid"
              className="font-medium"
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <Card shadow="sm" className="col-span-2">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-md font-semibold text-gray-700">
                Organizational Chart Preview{" "}
                <span className="text-xs">(dummy)</span>
              </h2>
              <Button
                size="sm"
                variant="light"
                color="primary"
                className="text-sm"
                onPress={() => Navigate("/hierarchy")}
              >
                View Full Chart
              </Button>
            </CardHeader>
            <CardBody className="flex justify-center items-center min-h-[220px] text-gray-400">
              <GitBranch size={64} strokeWidth={1.5} />
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-md font-semibold text-gray-700">
                Recent Activity <span className="text-xs">(dummy)</span>
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <ActivityItem
                name="Vivek Patni"
                action="was hired as"
                role="Software Engineer"
                color="green"
                time="2 hours ago"
              />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* add emp modal */}
      <Modal isOpen={isOpen} size="3xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Employee
              </ModalHeader>
              <ModalBody>
                <Form className="w-full" onSubmit={handleSubmit}>
                  <div className="flex flex-wrap w-full gap-6">
                    <Input
                      name="employeeId"
                      label="Employee ID"
                      labelPlacement="outside"
                      placeholder="e.g. EMP007"
                      value={newEmployee.employeeId}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="name"
                      label="Full Name"
                      labelPlacement="outside"
                      placeholder="Enter name"
                      value={newEmployee.name}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="email"
                      type="email"
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter email"
                      value={newEmployee.email}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="position"
                      label="Position"
                      labelPlacement="outside"
                      placeholder="e.g. SWE, Head of Design"
                      value={newEmployee.position}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="department"
                      label="Department"
                      labelPlacement="outside"
                      placeholder="e.g. Engineering, Design"
                      value={newEmployee.department}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="managerId"
                      label="Manager ID"
                      labelPlacement="outside"
                      placeholder="Enter Manager ID"
                      value={newEmployee.managerId ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                    />
                    <Input
                      name="joinDate"
                      type="date"
                      label="Joining Date"
                      labelPlacement="outside"
                      value={
                        newEmployee.joinDate
                          ? newEmployee.joinDate.split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="w-[45%]"
                    />
                  </div>
                  <ModalFooter>
                    <div className="mt-6 flex  gap-3">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </div>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
