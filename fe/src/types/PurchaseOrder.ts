export interface PurchaseOrderItem {
  product: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PurchaseOrder {
  _id: string;
  orderNumber: string;
  supplierId: {
    _id: string;
    name: string;
    contactPerson: string;
    phone: string;
  };
  employeeId?: {
    _id: string;
    fullName: string;
    employeeCode: string;
  };
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "approved" | "received" | "cancelled";
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
