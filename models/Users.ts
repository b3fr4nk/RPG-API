import { Document, Model, Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Interface for the User Schema
export interface IUserDocument extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  registrationDate: Date;
  lastLoginDate: Date;
}

// Static methods for the User Schema
export interface IUser extends IUserDocument {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
}

// Interface for the User Model
interface IUserModel extends Model<IUserDocument, {}> {}

// User Schema
// prettier-ignore
const UserSchema = new Schema<IUser, IUserModel>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get signed JWT token
UserSchema.methods.getSignedJwtToken = async function (
  id: Schema.Types.ObjectId
) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = model<IUser>("User", UserSchema);

export default User;
