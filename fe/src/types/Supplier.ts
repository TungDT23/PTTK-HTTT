export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  taxCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
