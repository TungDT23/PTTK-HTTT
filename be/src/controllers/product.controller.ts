import { Types } from "mongoose";
import { Product } from "../models/product.model";
import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
   try {
      const products = await Product.find();
      res.status(200).json({ success: true, data: products });
   } catch (error: any) {
      res.status(500).json({ message: (error as Error).message });
   }
}

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { title, description, category, price, discountPercentage, rating, stock, thumbnail, slug } = req.body;
      console.log(req.body);
      const newProduct = new Product({
         title,
         description,
         category,
         price,
         discountPercentage,
         rating,
         stock,
         thumbnail,
         slug
      });
      const savedProduct = await newProduct.save();
      res.status(201).json({ success: true, data: savedProduct });
   }
   catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const updateProduct = async (req: Request, res: Response) => {
   try {

      const { _id, title, description, category, price, discountPercentage, rating, stock, thumbnail, slug } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
         _id,
         {
            title,
            description,
            category,
            price,
            discountPercentage,
            rating,
            stock,
            thumbnail,
            slug
         },
         { new: true }
      );

      if (!updatedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ success: true, data: updatedProduct });

   } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: error.message });
   }
};


export const getProductById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const product = await Product.findById({
         _id: new Types.ObjectId(id)
      });
      if (!product) {
         return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ success: true, data: product });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};


export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      console.log("Deleting product with ID:", id);
      const deletedProduct = await Product.findByIdAndDelete({
         _id: new Types.ObjectId(id)
      });
      if (!deletedProduct) {
         return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ success: true, message: "Product deleted successfully" });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
      console.error("Error deleting product:", error);
   }
}