import { apiClient } from "./apiClient";
import type { Employee, HierarchyNode } from "@/types/employee";

const EMPLOYEE_PATH = "/employees";

export const getAllEmployees = async () => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}`);
  return res.data; // { success, count, data: Employee[] }
};

//   Get one employee by ID
export const getEmployeeById = async (id: string) => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}/${id}`);
  return res.data; // { success, data: Employee }
};

//  * Add a new employee
export const addEmployee = async (
  payload: Omit<Employee, "_id" | "createdAt" | "updatedAt">
) => {
  const res = await apiClient.post(`${EMPLOYEE_PATH}`, payload);
  return res.data; // { success, data: Employee }
};

//   Update an existing employee
export const updateEmployee = async (
  id: string,
  payload: Partial<Employee>
) => {
  const res = await apiClient.put(`${EMPLOYEE_PATH}/${id}`, payload);
  return res.data; // { success, data: Employee }
};

//  Delete employee
export const deleteEmployee = async (id: string) => {
  const res = await apiClient.delete(`${EMPLOYEE_PATH}/${id}`);
  return res.data; // { success, message }
};

//  Get all subordinates (direct + indirect)
export const getSubordinates = async (id: string) => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}/${id}/subordinates`);
  return res.data; // { success, data: Employee[] }
};

//   Get full hierarchy tree
export const getHierarchy = async () => {
  const res = await apiClient.get(`${EMPLOYEE_PATH}/hierarchy/tree`);
  return res.data as { success: boolean; data: HierarchyNode[] };
};
