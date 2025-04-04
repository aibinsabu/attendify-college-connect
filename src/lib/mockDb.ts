
import { toast } from 'sonner';

// Sample mock data for initialization
const sampleMockData = {
  users: [
    {
      _id: 'mock_admin_1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    },
    {
      _id: 'mock_student_1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      rollNo: 'S12345',
      studentClass: '10A',
      batch: '2025',
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02')
    },
    {
      _id: 'mock_faculty_1',
      name: 'Prof. Jane Smith',
      email: 'jane.smith@example.com',
      role: 'faculty',
      department: 'Computer Science',
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02')
    },
    {
      _id: 'mock_busstaff_1',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'busstaff',
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-03')
    }
  ],
  attendance: [
    {
      _id: 'mock_attendance_1',
      student: 'mock_student_1',
      class: 'mock_class_1',
      subject: 'Mathematics',
      status: 'present',
      markedVia: 'scanner',
      date: new Date('2025-03-15'),
      markedAt: new Date('2025-03-15T09:15:00')
    }
  ],
  busroutes: [
    {
      _id: 'mock_route_1',
      routeNumber: 'R-001',
      name: 'North Campus Route',
      stops: [
        { name: 'Main Gate', time: '08:00 AM' },
        { name: 'Library', time: '08:10 AM' },
        { name: 'Science Block', time: '08:20 AM' }
      ],
      driver: 'David Smith',
      active: true,
      announcements: [],
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-01')
    }
  ],
  marks: [
    {
      _id: 'mock_mark_1',
      student: 'mock_student_1',
      subject: 'Mathematics',
      exam: 'Mid-term',
      marks: 85,
      totalMarks: 100,
      percentage: 85,
      grade: 'A',
      remarks: 'Excellent work',
      addedBy: 'mock_faculty_1',
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10')
    }
  ],
  timetables: [
    {
      _id: 'mock_timetable_1',
      class: '10A',
      day: 'Monday',
      periods: [
        { subject: 'Mathematics', startTime: '09:00 AM', endTime: '10:00 AM', teacher: 'mock_faculty_1' },
        { subject: 'Science', startTime: '10:15 AM', endTime: '11:15 AM', teacher: 'mock_faculty_1' }
      ],
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-02-15')
    }
  ],
  announcements: [
    {
      _id: 'mock_announcement_1',
      title: 'Holiday Notice',
      message: 'School will remain closed on April 10th due to elections.',
      createdBy: 'mock_admin_1',
      priority: 'high',
      createdAt: new Date('2025-04-01'),
      read: []
    }
  ]
};

// Mock database connection for development in browser environment
class MockDatabase {
  private static instance: MockDatabase;
  private isConnected: boolean = false;
  public collections: Map<string, any[]> = new Map();
  private localStorage: Storage | null = null;
  private initialized: boolean = false;
  
  private constructor() {
    // Initialize with empty collections
    this.collections.set('users', []);
    this.collections.set('marks', []);
    this.collections.set('attendance', []);
    this.collections.set('busroutes', []);
    this.collections.set('timetables', []);
    this.collections.set('announcements', []);
    
    // Try to use localStorage for persistence if available
    if (typeof window !== 'undefined') {
      this.localStorage = window.localStorage;
    }
    
    console.log('📦 Mock database initialized');
  }
  
  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }
  
  private loadFromStorage(): void {
    if (!this.localStorage) return;
    
    try {
      let hasData = false;
      
      // Load each collection from localStorage if it exists
      for (const collectionName of this.collections.keys()) {
        const storedData = this.localStorage.getItem(`mockDb_${collectionName}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData, (key, value) => {
            // Convert date strings back to Date objects
            if (key === 'createdAt' || key === 'updatedAt' || key === 'date' || key === 'markedAt') {
              return new Date(value);
            }
            return value;
          });
          this.collections.set(collectionName, parsedData);
          hasData = true;
        }
      }
      
      if (hasData) {
        console.log('📦 Loaded mock database from localStorage');
      } else {
        console.log('📦 No stored data found in localStorage');
      }
      
      return hasData;
    } catch (error) {
      console.error('Failed to load mock database from localStorage:', error);
      return false;
    }
  }
  
  private initializeWithSampleData(): void {
    if (this.initialized) return;
    
    // Initialize with sample data if no data in localStorage
    for (const [collectionName, data] of Object.entries(sampleMockData)) {
      this.collections.set(collectionName, [...data]);
    }
    
    console.log('📦 Initialized mock database with sample data');
    this.saveToStorage();
    this.initialized = true;
  }
  
  private saveToStorage(): void {
    if (!this.localStorage) return;
    
    try {
      // Save each collection to localStorage
      for (const [collectionName, data] of this.collections.entries()) {
        this.localStorage.setItem(`mockDb_${collectionName}`, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save mock database to localStorage:', error);
    }
  }
  
  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Try to load data from localStorage first
        const hasStoredData = this.loadFromStorage();
        
        // If no data was loaded from localStorage, initialize with sample data
        if (!hasStoredData) {
          this.initializeWithSampleData();
        }
        
        this.isConnected = true;
        this.initialized = true;
        console.log('✅ Connected to mock database');
        toast.success('Connected to development database');
        resolve(true);
      }, 500); // Simulate connection delay
    });
  }
  
  public getCollection(name: string): any[] {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
    }
    return this.collections.get(name) || [];
  }
  
  public addToCollection(name: string, document: any): any {
    if (!document._id) {
      document._id = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    const collection = this.getCollection(name);
    collection.push(document);
    this.collections.set(name, collection);
    
    // Save changes to localStorage
    this.saveToStorage();
    
    return document;
  }
  
  public updateInCollection(name: string, id: string, update: any): any | null {
    const collection = this.getCollection(name);
    const index = collection.findIndex(item => item._id === id);
    
    if (index === -1) return null;
    
    collection[index] = { ...collection[index], ...update };
    
    // Save changes to localStorage
    this.saveToStorage();
    
    return collection[index];
  }
  
  public deleteFromCollection(name: string, id: string): boolean {
    const collection = this.getCollection(name);
    const index = collection.findIndex(item => item._id === id);
    
    if (index === -1) return false;
    
    collection.splice(index, 1);
    this.collections.set(name, collection);
    
    // Save changes to localStorage
    this.saveToStorage();
    
    return true;
  }
  
  public findInCollection(name: string, query: any): any[] {
    const collection = this.getCollection(name);
    
    // Simple query matching
    return collection.filter(item => {
      return Object.keys(query).every(key => {
        if (typeof query[key] === 'object' && query[key].$regex) {
          const regex = new RegExp(query[key].$regex, query[key].$options || '');
          return regex.test(item[key]);
        }
        return item[key] === query[key];
      });
    });
  }
  
  public isConnectedStatus(): boolean {
    return this.isConnected;
  }
  
  public resetCollection(name: string): void {
    this.collections.set(name, []);
    this.saveToStorage();
  }
  
  public clearDatabase(): void {
    for (const name of this.collections.keys()) {
      this.collections.set(name, []);
    }
    
    if (this.localStorage) {
      for (const name of this.collections.keys()) {
        this.localStorage.removeItem(`mockDb_${name}`);
      }
    }
    
    console.log('📦 Mock database cleared');
  }
}

export const mockDb = MockDatabase.getInstance();
export default mockDb;
