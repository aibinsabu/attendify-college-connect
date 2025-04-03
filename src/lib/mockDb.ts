
import { toast } from 'sonner';

// Mock database connection for development in browser environment
class MockDatabase {
  private static instance: MockDatabase;
  private isConnected: boolean = false;
  public collections: Map<string, any[]> = new Map();
  private localStorage: Storage | null = null;
  
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
      this.loadFromStorage();
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
      // Load each collection from localStorage if it exists
      for (const collectionName of this.collections.keys()) {
        const storedData = this.localStorage.getItem(`mockDb_${collectionName}`);
        if (storedData) {
          this.collections.set(collectionName, JSON.parse(storedData));
        }
      }
      console.log('📦 Loaded mock database from localStorage');
    } catch (error) {
      console.error('Failed to load mock database from localStorage:', error);
    }
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
