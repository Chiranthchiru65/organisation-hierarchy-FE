export interface Employee {
  _id?: string; // MongoDB internal id (optional for frontend)
  employeeId: string; // Unique business id, e.g. EMP001
  name: string;
  email: string;
  position: string;
  department: string;
  managerId?: string | null;
  joinDate?: string; // ISO string from backend
  createdAt?: string;
  updatedAt?: string;
}

//  RESPONSE WRAPPERS (backend sends {success, data, message…})

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: string[];
}

//  HIERARCHY STRUCTURE (for /hierarchy/tree)

export interface HierarchyNode extends Employee {
  children?: HierarchyNode[];
}

//  REQUEST PAYLOAD TYPES

// For creating a new employee (backend auto-adds timestamps/_id)
export type CreateEmployeePayload = Omit<
  Employee,
  "_id" | "createdAt" | "updatedAt"
>;

// For partial updates
export type UpdateEmployeePayload = Partial<Employee>;
