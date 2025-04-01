
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import mockDb from '@/lib/mockDb';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Check initial connection status
    setIsConnected(mockDb.isConnectedStatus());
    
    // Set up an interval to check connection status
    const intervalId = setInterval(() => {
      setIsConnected(mockDb.isConnectedStatus());
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleConnect = async () => {
    try {
      await mockDb.connect();
      setIsConnected(true);
      toast.success('Connected to database successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      toast.error('Failed to connect to database');
    }
  };
  
  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md bg-card">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm font-medium">Database:</span>
        <Badge variant={isConnected ? "secondary" : "destructive"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>
      
      {!isConnected && (
        <Button size="sm" onClick={handleConnect}>
          Connect
        </Button>
      )}
    </div>
  );
};

export default DatabaseStatus;
