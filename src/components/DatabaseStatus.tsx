
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import mockDb from '@/lib/mockDb';
import { getConnectionStatus, connectToDatabase } from '@/lib/mongodb';
import getDatabaseConfig from '@/config/database';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { useMockDatabase } = getDatabaseConfig();
  
  useEffect(() => {
    // Check initial connection status based on which database we're using
    if (useMockDatabase) {
      setIsConnected(mockDb.isConnectedStatus());
    } else {
      setIsConnected(getConnectionStatus());
    }
    
    // Set up an interval to check connection status
    const intervalId = setInterval(() => {
      if (useMockDatabase) {
        setIsConnected(mockDb.isConnectedStatus());
      } else {
        setIsConnected(getConnectionStatus());
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [useMockDatabase]);
  
  const handleConnect = async () => {
    try {
      if (useMockDatabase) {
        await mockDb.connect();
      } else {
        await connectToDatabase();
      }
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
        {!useMockDatabase && (
          <Badge variant="outline" className="ml-2">
            MongoDB
          </Badge>
        )}
        {useMockDatabase && (
          <Badge variant="outline" className="ml-2">
            Mock DB
          </Badge>
        )}
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
