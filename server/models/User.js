
const mongoose = require('mongoose');

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

module.exports = mongoose.model('User', userSchema);
