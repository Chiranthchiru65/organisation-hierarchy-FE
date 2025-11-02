import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  Plus,
  GitBranch,
  Users,
  Building2,
  Network,
  Sparkles,
  Droplet,
  Waves,
} from "lucide-react";
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
import ActivityItem from "@/components/ActivityItem";

export default function IndexPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeManagerCount, setActiveManagerCount] = useState<number>(0);
  const [departmentCount, setDepartmentCount] = useState<number>(0);
  const [monthlyHireCount, setMonthlyHireCount] = useState<number>(0);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        const data = response.data || [];
        setEmployees(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!employees.length) {
      setActiveManagerCount(0);
      setDepartmentCount(0);
      setMonthlyHireCount(0);
      return;
    }

    const managerSet = new Set(
      employees
        .filter((emp: Employee) => Boolean(emp.managerId))
        .map((emp: Employee) => emp.managerId)
    );
    setActiveManagerCount(managerSet.size);

    const departmentSet = new Set(
      employees
        .map((emp: Employee) => emp.department)
        .filter((dept): dept is string => Boolean(dept))
    );
    setDepartmentCount(departmentSet.size);

    const now = new Date();
    const hiresThisMonth = employees.filter((emp: Employee) => {
      if (!emp.joinDate) return false;
      const joinDate = new Date(emp.joinDate);
      if (Number.isNaN(joinDate.getTime())) return false;

      return (
        joinDate.getMonth() === now.getMonth() &&
        joinDate.getFullYear() === now.getFullYear()
      );
    });
    setMonthlyHireCount(hiresThisMonth.length);
  }, [employees]);

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
        setEmployees((prev) => [...prev, payload as Employee]);
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

  const heroStats = [
    {
      label: "Team Members",
      value: employees.length || 0,
      hint: "Across the organisation",
      icon: Users,
    },
    {
      label: "Active Managers",
      value: activeManagerCount || 0,
      hint: "Owning direct reports",
      icon: Network,
    },
    {
      label: "Departments",
      value: departmentCount || 0,
      hint: "Teams with at least one member",
      icon: Building2,
    },
    {
      label: "New Hires (30d)",
      value: monthlyHireCount || 0,
      hint: "Joined this month",
      icon: Sparkles,
    },
  ];

  const quickActions = [
    {
      label: "Add a teammate",
      description: "Create a fresh node in your organisation graph.",
      cta: "Add employee",
      icon: Droplet,
      action: handleOpen,
    },
    {
      label: "View hierarchy",
      description: "Explore the liquid org chart in detail.",
      cta: "Open chart",
      icon: GitBranch,
      action: () => Navigate("/hierarchy"),
    },
  ];

  const pulseActivity = [
    {
      name: "Vivek Patni",
      action: "was hired as",
      role: "Software Engineer",
      color: "green",
      time: "2 hours ago",
    },
    {
      name: "Aarohi Singh",
      action: "transitioned to",
      role: "Design Lead",
      color: "blue",
      time: "Yesterday",
    },
    {
      name: "Jordan Mistry",
      action: "now reports to",
      role: "Priya Sharma",
      color: "purple",
      time: "3 days ago",
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-purple-50 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.45)]">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div className="flex flex-col gap-6">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
                  <Waves className="h-3.5 w-3.5" /> Liquid workspace
                </span>
                <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                  Flow through your organisation
                </h1>
                <p className="mt-3 text-sm text-slate-600">
                  Watch teams grow, managers shift, and reporting lines stay in
                  sync. This dashboard keeps your hierarchy fluid and aligned.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {heroStats.map(({ icon: Icon, label, value, hint }) => (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-200/40 via-transparent to-purple-200/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {label}
                        </p>
                        <p className="text-2xl font-semibold text-slate-900">
                          {value ?? 0}
                        </p>
                        <p className="text-xs text-slate-500">{hint}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/60 bg-white/60 p-6 backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Quick flows
                  </p>
                  <p className="text-xs text-slate-500">
                    Move through the most common hierarchy actions.
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400/90 to-violet-500 text-white shadow-lg">
                  <Droplet className="h-5 w-5" />
                </span>
              </div>

              <div className="space-y-3">
                {quickActions.map(
                  ({ label, description, cta, icon: Icon, action }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur transition hover:border-sky-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {description}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={action}
                      >
                        {cta}
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card
            shadow="sm"
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 backdrop-blur"
          >
            <CardHeader className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Organisational Flow Map
                </h2>
                <p className="text-xs text-slate-500">
                  Preview the structure before diving into the full experience.
                </p>
              </div>
              <Button
                size="sm"
                variant="light"
                color="primary"
                className="text-sm"
                onPress={() => Navigate("/hierarchy")}
                startContent={<GitBranch size={16} />}
              >
                Open hierarchy
              </Button>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-sky-50 via-white to-purple-50 p-8 text-slate-500">
                <div className="absolute -top-12 right-6 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
                <div className="absolute -bottom-14 left-10 h-36 w-36 rounded-full bg-purple-200/40 blur-2xl" />
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-purple-500/40 text-sky-700">
                    <GitBranch size={36} strokeWidth={1.4} />
                  </span>
                  <p className="text-sm font-medium text-slate-600">
                    Liquid nodes ripple outward as you add managers and teams.
                  </p>
                  <p className="text-xs text-slate-500">
                    Snapshot: {activeManagerCount} active manager
                    {activeManagerCount === 1 ? "" : "s"} • {employees.length}{" "}
                    teammate{employees.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-700">
                    Keep the flow updated
                  </p>
                  <p className="text-xs text-slate-500">
                    Add people or adjust reporting lines to keep the chart
                    fluid.
                  </p>
                </div>
                <Button
                  size="sm"
                  color="primary"
                  startContent={<Plus size={16} />}
                  onPress={handleOpen}
                >
                  Add employee
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="sm"
            className="rounded-3xl border border-slate-200 bg-white/85 backdrop-blur"
          >
            <CardHeader className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Activity Stream
                </h2>
                <p className="text-xs text-slate-500">
                  Replays of the latest hierarchy moments.
                </p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {pulseActivity.map((item, index) => (
                <ActivityItem
                  key={`${item.name}-${index}`}
                  name={item.name}
                  action={item.action}
                  role={item.role}
                  // color={item.color}
                  time={item.time}
                />
              ))}
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
