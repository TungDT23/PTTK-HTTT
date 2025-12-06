import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   fullName: { type: String },
   email: { type: String, unique: true, sparse: true },
   phone: { type: String },
   role: { type: String, enum: ['admin', 'user'], default: 'user' },
   isActive: { type: Boolean, default: true },
   wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, {
   timestamps: true,
})

export const User = mongoose.model("User", userSchema, "users")