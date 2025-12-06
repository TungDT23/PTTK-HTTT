import { Request, Response } from "express";
import Invoice from "../models/invoice.model";

// Create new invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;
    
    // Validate required fields
    if (!invoiceData.invoiceNumber || !invoiceData.userId || !invoiceData.customerName || 
        !invoiceData.customerPhone || !invoiceData.customerAddress || !invoiceData.items || 
        !invoiceData.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create invoice",
    });
  }
};

// Get all invoices by user ID
export const getInvoicesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch invoices",
    });
  }
};

// Get invoice by invoice number
export const getInvoiceByNumber = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await Invoice.findOne({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch invoice",
    });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "shipping", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber },
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice status updated successfully",
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update invoice status",
    });
  }
};

// Cancel invoice
export const cancelInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await Invoice.findOne({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Only allow cancellation for pending and shipping orders
    if (!["pending", "shipping"].includes(invoice.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel this order. Order status must be pending or shipping.",
      });
    }

    invoice.status = "cancelled";
    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Invoice cancelled successfully",
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error cancelling invoice:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel invoice",
    });
  }
};

// Get all invoices (admin)
export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    console.error("Error fetching all invoices:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch invoices",
    });
  }
};
