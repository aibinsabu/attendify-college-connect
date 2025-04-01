
import { toast } from 'sonner';

// Mock database connection for development in browser environment
class MockDatabase {
  private static instance: MockDatabase;
  private isConnected: boolean = false;
  private collections: Map<string, any[]> = new Map();
  
  private constructor() {
    // Initialize with empty collections
    this.collections.set('users', []);
    this.collections.set('marks', []);
    this.collections.set('attendance', []);
    this.collections.set('busroutes', []);
    
    console.log('📦 Mock database initialized');
  }
  
  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }
  
  public connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
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
    
    return document;
  }
  
  public updateInCollection(name: string, id: string, update: any): any | null {
    const collection = this.getCollection(name);
    const index = collection.findIndex(item => item._id === id);
    
    if (index === -1) return null;
    
    collection[index] = { ...collection[index], ...update };
    return collection[index];
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
}

export const mockDb = MockDatabase.getInstance();
export default mockDb;
