import DefaultLayout from "@/layouts/default";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, GitBranch, Activity } from "lucide-react";
import { addEmployee } from "@/services/employeeService";
import type { Employee } from "@/types/employee";
import { useState } from "react";
import { Form } from "@heroui/form";
import { toast } from "react-toastify";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";

export default function IndexPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    employeeId: "",
    position: "",
    department: "",
    managerId: "",
    joinDate: "",
  });

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
    <DefaultLayout>
      <div className="flex flex-col gap-6">
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

        {/* bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
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
                </Form>
              </ModalBody>
              <ModalFooter>
                <div className="mt-6 flex justify-end gap-3">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
