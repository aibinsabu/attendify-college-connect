
import { Schema, model, models, Model, Document } from 'mongoose';
import { getDbConnection } from '@/lib/mongodb';

export type UserRole = 'admin' | 'faculty' | 'student' | 'busstaff';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  studentClass?: string;
  batch?: string;
  rollNo?: string;
  dob?: Date;
  idCardNumber?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the user schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student', 'busstaff'],
    required: true
  },
  department: {
    type: String,
    required: function(this: IUser) { return this.role === 'faculty'; }
  },
  studentClass: {
    type: String,
    required: function(this: IUser) { return this.role === 'student'; }
  },
  batch: {
    type: String,
    required: function(this: IUser) { return this.role === 'student'; }
  },
  rollNo: {
    type: String,
    required: function(this: IUser) { return this.role === 'student'; }
  },
  dob: {
    type: Date,
    required: function(this: IUser) { return this.role === 'student'; }
  },
  idCardNumber: {
    type: String,
    unique: true,
    sparse: true // Only enforces uniqueness for documents where the field exists
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for faster queries
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });
userSchema.index({ studentClass: 1, batch: 1 });

// Pre-save middleware to update the 'updatedAt' field
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create the User model - safely handle the models object which might be undefined in a browser context
let User: Model<IUser>;
try {
  // Check if the model is already defined
  User = models.User || model<IUser>('User', userSchema);
} catch (error) {
  // If there's an error (likely because models is undefined), create the model directly
  User = model<IUser>('User', userSchema);
}

export { User };
export default User;
