import type { SVGProps } from "react";
import { SortDescriptor } from "@heroui/table";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import {
  getAllEmployees,
  updateEmployee,
  addEmployee,
  deleteEmployee,
} from "@/services/employeeService";
import type { Employee } from "@/types/employee";
import { toast } from "react-toastify";
import { Search, ChevronDown, EllipsisVertical } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Form } from "@heroui/form";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/* ---------------------------------- Columns ---------------------------------- */

const columns = [
  { name: "EMPLOYEE ID", uid: "employeeId", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "POSITION", uid: "position" },
  { name: "DEPARTMENT", uid: "department" },
  { name: "MANAGER ID", uid: "managerId" },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "employeeId",
  "name",
  "email",
  "position",
  "department",
  "actions",
];

/* -------------------------------- Component -------------------------------- */

export default function List() {
  // ------------------- Data -------------------
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------- UI State -------------------
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  // ------------------- Modal State -------------------
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee>>({
    employeeId: "",
    name: "",
    email: "",
    position: "",
    department: "",
    managerId: "",
    joinDate: "",
  });

  /* ------------------ Fetch Employees ------------------ */
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();
      setEmployees(response.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch employees");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  /* ------------------ Modal Helpers ------------------ */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedEmployee({
      employeeId: "",
      name: "",
      email: "",
      position: "",
      department: "",
      managerId: "",
      joinDate: "",
    });
    onOpen();
  };

  const handleOpenEdit = (employee: Employee) => {
    setModalMode("edit");
    setSelectedEmployee(employee);
    onOpen();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "add") {
        const res = await addEmployee(selectedEmployee as Employee);
        if (res.success) {
          toast.success("🎉 Employee added successfully!");
        }
      } else {
        const res = await updateEmployee(
          selectedEmployee.employeeId!,
          selectedEmployee
        );
        if (res.success) {
          toast.success("✅ Employee updated successfully!");
        }
      }

      onClose();
      await fetchEmployees(); // refresh table
    } catch (err: any) {
      toast.error(err.message || "Failed to save employee");
    }
  };

  /* ------------------ Table Computations ------------------ */

  const hasSearchFilter = Boolean(filterValue);
  const pages = Math.ceil(employees.length / rowsPerPage);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // 🔍 Filtering
  const filteredItems = useMemo(() => {
    let filtered = [...employees];
    if (hasSearchFilter) {
      filtered = filtered.filter((emp) =>
        emp.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [employees, filterValue]);

  // pagination
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Employee] ?? "";
      const second = b[sortDescriptor.column as keyof Employee] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  /* ------------------ Table Rendering ------------------ */

  const renderCell = useCallback(
    (employee: Employee, columnKey: React.Key) => {
      const cellValue = employee[columnKey as keyof Employee];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-800">
                {employee.name}
              </p>
              <p className="text-xs text-gray-500">{employee.email}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <EllipsisVertical className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="edit"
                    onPress={() => handleOpenEdit(employee)}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    onPress={async () => {
                      try {
                        await deleteEmployee(employee.employeeId);
                        toast.success("🗑️ Employee deleted");
                        await fetchEmployees();
                      } catch (err: any) {
                        toast.error("Failed to delete employee");
                      }
                    }}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [fetchEmployees]
  );

  /* ------------------ Top & Bottom Sections ------------------ */

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<Search size={18} className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button color="success" onPress={handleOpenAdd}>
              + Add Employee
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {employees.length} employees
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-1"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, employees.length, onRowsPerPageChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-6xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: ["text-sm"],
    }),
    []
  );

  /* ------------------ Render ------------------ */

  if (loading) return;
  <p>Loading employees...</p>;
  if (error) return;
  <p>Error: {error}</p>;

  return (
    <>
      <section>
        <Table
          isCompact
          removeWrapper
          aria-label="Employee table with sorting, pagination, and filters"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={classNames}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody emptyContent={"No employees found"} items={sortedItems}>
            {(item) => (
              <TableRow key={item.employeeId}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* ------------------ Modal ------------------ */}
      <Modal isOpen={isOpen} size="3xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalMode === "add" ? "Add Employee" : "Edit Employee"}
              </ModalHeader>
              <ModalBody>
                <Form className="w-full" onSubmit={handleSubmit}>
                  <div className="flex flex-wrap w-full gap-6">
                    <Input
                      name="employeeId"
                      label="Employee ID"
                      labelPlacement="outside"
                      placeholder="e.g. EMP007"
                      value={selectedEmployee.employeeId ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="name"
                      label="Full Name"
                      labelPlacement="outside"
                      placeholder="Enter name"
                      value={selectedEmployee.name ?? ""}
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
                      value={selectedEmployee.email ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="position"
                      label="Position"
                      labelPlacement="outside"
                      placeholder="e.g. SWE, Head of Design"
                      value={selectedEmployee.position ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="department"
                      label="Department"
                      labelPlacement="outside"
                      placeholder="e.g. Engineering, Design"
                      value={selectedEmployee.department ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                      isRequired
                    />
                    <Input
                      name="managerId"
                      label="Manager ID"
                      labelPlacement="outside"
                      placeholder="Enter Manager ID"
                      value={selectedEmployee.managerId ?? ""}
                      onChange={handleChange}
                      className="w-[45%]"
                    />
                    <Input
                      name="joinDate"
                      type="date"
                      label="Joining Date"
                      labelPlacement="outside"
                      value={
                        selectedEmployee.joinDate
                          ? selectedEmployee.joinDate.split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="w-[45%]"
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      {modalMode === "add" ? "Add" : "Update"}
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
