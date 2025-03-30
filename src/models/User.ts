
import mongoose from 'mongoose';
import { getDbConnection } from '@/lib/mongodb';

export type UserRole = 'admin' | 'faculty' | 'student' | 'busstaff';

// Define the user schema
const userSchema = new mongoose.Schema({
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

// Create the User model
let User;
try {
  // Check if the model already exists
  if (mongoose.models && mongoose.models.User) {
    User = mongoose.models.User;
  } else {
    // Get the connection - if not connected yet, will use default connection
    const conn = getDbConnection() || mongoose.connection;
    // Model doesn't exist yet, so create it
    User = conn.model('User', userSchema);
  }
} catch (error) {
  console.error("Error creating User model:", error);
  // Fallback - create the model on default connection
  User = mongoose.model('User', userSchema);
}

export { User };
export default User;
