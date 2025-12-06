export interface InventoryTransaction {
  _id: string;
  transactionNumber: string;
  productId: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  type: "import" | "export" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: "purchase_order" | "invoice" | "manual";
  referenceId?: string;
  employeeId?: {
    _id: string;
    fullName: string;
    employeeCode: string;
  };
  note?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}
