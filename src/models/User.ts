
import mongoose from 'mongoose';

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
  } else if (mongoose.connection.models && mongoose.connection.models.User) {
    User = mongoose.connection.models.User;
  } else {
    // Model doesn't exist yet, so create it
    User = mongoose.connection.model('User', userSchema);
  }
} catch (error) {
  console.error("Error creating User model:", error);
  // Fallback - create the model but it might not be connected to the DB
  User = mongoose.model('User', userSchema);
}

export { User };
export default User;
