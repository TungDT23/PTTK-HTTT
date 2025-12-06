
import { User } from "../models/user.model";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
   try {
      const { username, password, fullName, email, phone } = req.body;

      // Validate required fields
      if (!username || !password) {
         return res.status(400).json({ 
            success: false, 
            message: "Tên đăng nhập và mật khẩu là bắt buộc" 
         });
      }

      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
         return res.status(409).json({ 
            success: false, 
            message: "Tên đăng nhập đã tồn tại" 
         });
      }

      // Check if email already exists (if provided)
      if (email) {
         const existingEmail = await User.findOne({ email });
         if (existingEmail) {
            return res.status(409).json({ 
               success: false, 
               message: "Email đã được sử dụng" 
            });
         }
      }

      // Create new user with 'user' role by default
      const newUser = new User({
         username,
         password, // In production, should hash password
         fullName: fullName || username,
         email: email || undefined,
         phone: phone || undefined,
         role: "user",
         isActive: true
      });

      await newUser.save();

      // Return user data without password
      const userResponse = {
         _id: newUser._id,
         username: newUser.username,
         fullName: newUser.fullName,
         email: newUser.email,
         phone: newUser.phone,
         role: newUser.role,
         isActive: newUser.isActive
      };

      return res.status(201).json({ 
         success: true, 
         message: "Đăng ký thành công",
         data: userResponse 
      });

   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

export const login = async (req: Request, res: Response) => {
   try {
      const { username, password } = req.body;

      // Cho phép đăng nhập bằng username hoặc email
      const user = await User.findOne({ 
         $or: [
            { username: username },
            { email: username }
         ],
         isActive: true 
      });
      

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }
      if (user.password !== password) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set cookie for authentication
      res.cookie("userId", user._id.toString(), {
         httpOnly: false,
         sameSite: "lax",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return user data with id field (convert _id to id for frontend)
      const userResponse = {
         id: user._id.toString(),
         _id: user._id,
         username: user.username,
         fullName: user.fullName,
         email: user.email,
         phone: user.phone,
         role: user.role,
         isActive: user.isActive
      };

      return res.status(200).json({ success: true, data: userResponse });

   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const getCurrentUser = async (req: Request, res: Response) => {
   try {
      const userId = req.cookies.userId;

      if (!userId) {
         return res.status(401).json({ 
            success: false, 
            message: "Not authenticated" 
         });
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
         return res.status(404).json({ 
            success: false, 
            message: "User not found" 
         });
      }

      // Tìm thông tin employee nếu là admin
      let employee = null;
      let isSuper = false;
      
      if (user.role === "admin") {
         // Nếu username là "admin" thì là super admin
         if (user.username === "admin") {
            isSuper = true;
            employee = {
               position: "admin",
               department: "Quản trị hệ thống",
               employeeCode: "ADMIN",
               isAdmin: true
            };
         } else {
            // Tìm employee record cho nhân viên thường
            const Employee = (await import("../models/employee.model")).Employee;
            employee = await Employee.findOne({ userId: user._id });
         }
      }

      const userResponse = {
         id: user._id.toString(),
         _id: user._id,
         username: user.username,
         fullName: user.fullName,
         email: user.email,
         phone: user.phone,
         role: user.role,
         isActive: user.isActive,
         isSuper: isSuper,
         employee: employee ? {
            _id: (employee as any)._id || "super-admin",
            employeeCode: employee.employeeCode,
            position: employee.position,
            department: employee.department,
            isAdmin: (employee as any).isAdmin || false
         } : null
      };

      return res.status(200).json({ success: true, data: userResponse });

   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

export const getAllUsers = async (req: Request, res: Response) => {
   try {
      const users = await User.find({ isActive: true }).select('-password');
      return res.status(200).json({ 
         success: true, 
         data: users 
      });
   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

export const updateUser = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { fullName, email, phone } = req.body;

      console.log("updateUser - id:", id);
      console.log("updateUser - body:", { fullName, email, phone });

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
         console.log("updateUser - user not found");
         return res.status(404).json({ 
            success: false, 
            message: "Không tìm thấy người dùng" 
         });
      }

      console.log("updateUser - found user:", user.username);

      // Check email uniqueness if updating
      if (email && email !== user.email) {
         const existingEmail = await User.findOne({ email, _id: { $ne: id } });
         if (existingEmail) {
            return res.status(409).json({ 
               success: false, 
               message: "Email đã được sử dụng bởi người dùng khác" 
            });
         }
      }

      // Update user
      if (fullName !== undefined) user.fullName = fullName;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.phone = phone;

      await user.save();

      // Return updated user without password
      const updatedUser = await User.findById(id).select('-password');
      
      return res.status(200).json({ 
         success: true, 
         message: "Cập nhật thông tin thành công",
         data: updatedUser 
      });
   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

// Get user wishlist
export const getWishlist = async (req: Request, res: Response) => {
   try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('wishlist');
      
      return res.status(200).json({ 
         success: true, 
         data: user?.wishlist || [] 
      });
   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

// Add product to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
   try {
      const userId = req.user._id;
      const { productId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ 
            success: false, 
            message: "Không tìm thấy người dùng" 
         });
      }

      // Check if product already in wishlist
      if (user.wishlist?.includes(productId)) {
         return res.status(400).json({ 
            success: false, 
            message: "Sản phẩm đã có trong danh sách yêu thích" 
         });
      }

      user.wishlist = user.wishlist || [];
      user.wishlist.push(productId);
      await user.save();

      const updatedUser = await User.findById(userId).populate('wishlist');
      
      return res.status(200).json({ 
         success: true, 
         message: "Đã thêm vào danh sách yêu thích",
         data: updatedUser?.wishlist 
      });
   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
   try {
      const userId = req.user._id;
      const { productId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ 
            success: false, 
            message: "Không tìm thấy người dùng" 
         });
      }

      user.wishlist = user.wishlist?.filter((id: any) => id.toString() !== productId) || [];
      await user.save();

      const updatedUser = await User.findById(userId).populate('wishlist');
      
      return res.status(200).json({ 
         success: true, 
         message: "Đã xóa khỏi danh sách yêu thích",
         data: updatedUser?.wishlist 
      });
   } catch (error: any) {
      res.status(500).json({ 
         success: false, 
         message: error.message 
      });
   }
};