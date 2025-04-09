
# College Management System Database Schemas

This document outlines the database schemas used in the College Management System.

## User Collection

The User schema defines the structure for storing user data, including administrators, faculty members, students, and bus staff.

```typescript
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
    sparse: true
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

// Indexes
userSchema.index({ email: 1, role: 1 });
userSchema.index({ role: 1 });
userSchema.index({ studentClass: 1, batch: 1 });
```

## Attendance Collection

The Attendance schema tracks student attendance records across different classes and subjects.

```typescript
const attendanceSchema = new Schema<IAttendance>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  markedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  markedVia: {
    type: String,
    enum: ['scanner', 'manual', 'code'],
    default: 'manual'
  },
  verificationMedia: {
    type: String,
    required: function() { return this.markedVia === 'code'; }
  },
  note: String
});

// Indexes
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });
```

## Mark Collection

The Mark schema stores student academic performance records for various exams and subjects.

```typescript
const markSchema = new Schema<IMark>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  remarks: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Indexes
markSchema.index({ student: 1, subject: 1, exam: 1 }, { unique: true });
```

## BusRoute Collection

The BusRoute schema manages transportation routes, stops, and related announcements.

```typescript
// Sub-schemas
const stopSchema = new Schema<IStop>({
  name: String,
  time: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Main schema
const busRouteSchema = new Schema<IBusRoute>({
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverContact: {
    type: String,
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  stops: [stopSchema],
  active: {
    type: Boolean,
    default: true
  },
  busCapacity: {
    type: Number,
    required: true
  },
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  departureTime: {
    type: String,
    required: true,
    default: '08:00 AM'
  },
  arrivalTime: {
    type: String,
    required: true,
    default: '05:00 PM'
  },
  operationDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  announcements: [announcementSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
busRouteSchema.index({ routeNumber: 1 }, { unique: true });
busRouteSchema.index({ active: 1 });
```

## TimeTable Collection

The TimeTable schema manages class schedules and academic timetables.

```typescript
// Sub-schema
const timeTableSlotSchema = new Schema<ITimeTableSlot>({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  batch: String,
  section: String
});

// Main schema
const timeTableSchema = new Schema<ITimeTable>({
  name: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  slots: [timeTableSlotSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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

// Indexes
timeTableSchema.index({ academicYear: 1, semester: 1, department: 1 });
timeTableSchema.index({ active: 1 });
timeTableSchema.index({ 'slots.faculty': 1 });
```

## Relationships Between Collections

The following diagram illustrates the relationships between different collections:

1. **User** → **Attendance**: One-to-many (a student has multiple attendance records)
2. **User** → **Mark**: One-to-many (a student has multiple mark records)
3. **User** → **BusRoute**: Many-to-many (students are assigned to bus routes)
4. **User** → **TimeTable**: Many-to-many (faculty members are assigned to timetable slots)
5. **User** → **BusRoute.announcements**: One-to-many (a staff member creates multiple announcements)

## Indexes and Performance Considerations

Each collection includes carefully designed indexes to optimize query performance:

- **Unique indexes** ensure data integrity (e.g., unique email addresses, unique route numbers)
- **Compound indexes** optimize frequent query patterns (e.g., student+date+subject for attendance)
- **Single-field indexes** improve sorting and filtering operations (e.g., by role, by active status)

## Data Validation and Middleware

The schemas implement various validation rules and middleware functions:

- **Required fields** enforce data completeness
- **Conditional requirements** apply validation based on document type (e.g., department required only for faculty)
- **Pre-save hooks** automatically update timestamps and calculate derived values
- **Enum validation** restricts certain fields to predefined values
