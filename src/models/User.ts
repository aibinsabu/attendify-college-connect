
import { Schema, model, models, Model } from 'mongoose';
import { getDbConnection } from '@/lib/mongodb';

export type UserRole = 'admin' | 'faculty' | 'student' | 'busstaff';

// Define the user schema
const userSchema = new Schema({
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
    required: function() { return this.role === 'faculty'; }
  },
  studentClass: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  batch: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  rollNo: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  dob: {
    type: Date,
    required: function() { return this.role === 'student'; }
  },
  idCardNumber: {
    type: String,
    unique: true,
    sparse: true // Only enforces uniqueness for documents where the field exists
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

// Create the User model - safely handle the models object which might be undefined in a browser context
let User: Model<any>;
try {
  // Check if the model is already defined
  User = models.User || model('User', userSchema);
} catch (error) {
  // If there's an error (likely because models is undefined), create the model directly
  User = model('User', userSchema);
}

export { User };
export default User;
