import { apiClient } from "./apiClient";
import type { Employee, HierarchyNode } from "@/types/employee";

const EMPLOYEE_PATH = "/employees";

export const getAllEmployees = async () => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}`);
  return res.data;
};

// export const getEmployeeById = async (id: string) => {
//   const res = await apiClient.get(`${EMPLOYEE_PATH}/${id}`);
//   return res.data;
// };

export const addEmployee = async (
  payload: Omit<Employee, "_id" | "createdAt" | "updatedAt">
) => {
  const res = await apiClient.post(`${EMPLOYEE_PATH}`, payload);
  return res.data;
};

export const updateEmployee = async (
  id: string,
  payload: Partial<Employee>
) => {
  const res = await apiClient.put(`${EMPLOYEE_PATH}/${id}`, payload);
  return res.data;
};

export const deleteEmployee = async (id: string) => {
  const res = await apiClient.delete(`${EMPLOYEE_PATH}/${id}`);
  return res.data;
};

// employees/hierarchy/tree
export const getHierarchy = async () => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}/hierarchy/tree`);
  return res.data as { success: boolean; data: HierarchyNode[] };
};
