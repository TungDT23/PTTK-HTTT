import { Request, Response } from "express";
import { PurchaseOrder } from "../models/purchaseOrder.model";
import { Product } from "../models/product.model";
import { InventoryTransaction } from "../models/inventoryTransaction.model";

// Lấy tất cả đơn nhập hàng
export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate("supplierId", "name contactPerson phone")
      .populate("employeeId", "fullName employeeCode")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn nhập hàng",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Tạo đơn nhập hàng mới
export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    // Generate order number tự động
    const lastOrder = await PurchaseOrder.findOne().sort({ orderNumber: -1 });
    let newOrderNumber = "PO0001";
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.substring(2));
      newOrderNumber = `PO${String(lastNumber + 1).padStart(4, "0")}`;
    }

    const purchaseOrder = new PurchaseOrder({
      ...orderData,
      orderNumber: newOrderNumber,
    });
    await purchaseOrder.save();

    res.status(201).json({
      success: true,
      message: "Tạo đơn nhập hàng thành công",
      data: purchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn nhập hàng",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Cập nhật trạng thái đơn nhập hàng
export const updatePurchaseOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, receivedDate } = req.body;

    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn nhập hàng",
      });
    }

    purchaseOrder.status = status;
    if (status === "received" && receivedDate) {
      purchaseOrder.receivedDate = receivedDate;

      // Cập nhật tồn kho khi nhận hàng
      for (const item of purchaseOrder.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const previousStock = product.stock;
          product.stock += item.quantity;
          await product.save();

          // Tạo giao dịch kho
          const lastTransaction = await InventoryTransaction.findOne().sort({
            transactionNumber: -1,
          });
          let newTransNumber = "INV0001";
          if (lastTransaction) {
            const lastNumber = parseInt(lastTransaction.transactionNumber.substring(3));
            newTransNumber = `INV${String(lastNumber + 1).padStart(4, "0")}`;
          }

          await InventoryTransaction.create({
            transactionNumber: newTransNumber,
            productId: item.product,
            type: "import",
            quantity: item.quantity,
            previousStock,
            newStock: product.stock,
            referenceType: "purchase_order",
            referenceId: purchaseOrder.orderNumber,
            employeeId: purchaseOrder.employeeId,
            note: `Nhập hàng từ đơn ${purchaseOrder.orderNumber}`,
          });
        }
      }
    }

    await purchaseOrder.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: purchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Lấy lịch sử giao dịch kho
export const getInventoryTransactions = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const query = productId ? { productId } : {};

    const transactions = await InventoryTransaction.find(query)
      .populate("productId", "title thumbnail")
      .populate("employeeId", "fullName employeeCode")
      .sort({ transactionDate: -1 });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử giao dịch",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Kiểm kê kho
export const inventoryAdjustment = async (req: Request, res: Response) => {
  try {
    const { productId, actualStock, employeeId, note } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const previousStock = product.stock;
    const difference = actualStock - previousStock;

    if (difference === 0) {
      return res.json({
        success: true,
        message: "Tồn kho đã chính xác, không cần điều chỉnh",
      });
    }

    product.stock = actualStock;
    await product.save();

    // Tạo giao dịch điều chỉnh
    const lastTransaction = await InventoryTransaction.findOne().sort({
      transactionNumber: -1,
    });
    let newTransNumber = "INV0001";
    if (lastTransaction) {
      const lastNumber = parseInt(lastTransaction.transactionNumber.substring(3));
      newTransNumber = `INV${String(lastNumber + 1).padStart(4, "0")}`;
    }

    await InventoryTransaction.create({
      transactionNumber: newTransNumber,
      productId,
      type: "adjustment",
      quantity: Math.abs(difference),
      previousStock,
      newStock: actualStock,
      referenceType: "manual",
      employeeId,
      note: note || `Kiểm kê kho: ${difference > 0 ? "Thêm" : "Giảm"} ${Math.abs(difference)} sản phẩm`,
    });

    res.json({
      success: true,
      message: "Điều chỉnh tồn kho thành công",
      data: {
        previousStock,
        newStock: actualStock,
        difference,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi điều chỉnh tồn kho",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
