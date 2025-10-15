export interface Employee {
  _id?: string; // mongoDB internal id (optional for frontend)
  employeeId: string; // unique business id, e.g: EMP001
  name: string;
  email: string;
  position: string;
  department: string;
  managerId?: string | null;
  joinDate?: string; // ISO string from backend
  createdAt?: string;
  updatedAt?: string;
}

//  (for /hierarchy/tree)

export interface HierarchyNode extends Employee {
  children?: HierarchyNode[];
}
