
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import mockDb from '@/lib/mockDb';
import { getConnectionStatus, connectToDatabase, checkDatabaseHealth } from '@/lib/mongodb';
import getDatabaseConfig from '@/config/database';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, DatabaseIcon, CloudOffIcon } from 'lucide-react';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking' | 'mock'>('checking');
  const [dbInfo, setDbInfo] = useState('');
  const { useMockDatabase, mongodbUri } = getDatabaseConfig();
  
  useEffect(() => {
    // Check initial connection status based on which database we're using
    if (useMockDatabase) {
      setIsConnected(mockDb.isConnectedStatus());
      setHealthStatus('mock');
    } else {
      setIsConnected(getConnectionStatus());
      checkDbHealth();
    }
    
    // Extract and set database name for display
    if (mongodbUri && !useMockDatabase) {
      try {
        const dbName = mongodbUri.split('/').pop();
        setDbInfo(dbName || 'Unknown DB');
      } catch (error) {
        setDbInfo('Unknown DB');
      }
    } else {
      setDbInfo('Mock Database');
    }
    
    // Set up an interval to check connection status
    const intervalId = setInterval(() => {
      if (useMockDatabase) {
        setIsConnected(mockDb.isConnectedStatus());
      } else {
        setIsConnected(getConnectionStatus());
        checkDbHealth();
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [useMockDatabase, mongodbUri]);
  
  const checkDbHealth = async () => {
    if (useMockDatabase) {
      setHealthStatus('mock');
      return;
    }
    
    setHealthStatus('checking');
    try {
      const health = await checkDatabaseHealth();
      setHealthStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      setHealthStatus('unhealthy');
    }
  };
  
  const handleConnect = async () => {
    try {
      if (useMockDatabase) {
        await mockDb.connect();
        setIsConnected(true);
        setHealthStatus('mock');
        toast.success('Connected to mock database');
      } else {
        await connectToDatabase();
        setIsConnected(getConnectionStatus());
        checkDbHealth();
        toast.success('Connected to database');
      }
    } catch (error) {
      console.error('Failed to connect to database:', error);
      toast.error('Failed to connect to database');
    }
  };
  
  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md bg-card">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isConnected 
            ? healthStatus === 'healthy' ? 'bg-green-500' : healthStatus === 'mock' ? 'bg-yellow-500' : 'bg-amber-500'
            : 'bg-red-500'
        }`} />
        <span className="text-sm font-medium">Database:</span>
        <Badge variant={isConnected ? "secondary" : "destructive"}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                {useMockDatabase ? <CloudOffIcon size={12} /> : <DatabaseIcon size={12} />}
                {dbInfo}
                <InfoIcon size={12} className="ml-1" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {useMockDatabase 
                ? 'Using in-memory mock database for development' 
                : `Connected to MongoDB: ${mongodbUri}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
