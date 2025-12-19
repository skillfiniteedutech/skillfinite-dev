// MongoDB connection utility for frontend (if needed for direct client connections)
// Note: In most cases, frontend should connect to backend API, not directly to MongoDB

interface MongoConfig {
  uri: string;
  db: string;
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
  };
}

class MongoDBClient {
  private config: MongoConfig;
  private isConnected: boolean = false;

  constructor(config: MongoConfig) {
    this.config = config;
  }

  // Check if MongoDB connection is available (frontend check)
  async checkConnection(): Promise<{
    status: 'connected' | 'disconnected' | 'error';
    message: string;
    timestamp: string;
  }> {
    try {
      // In a real implementation, this would check the backend API
      // since frontend shouldn't connect directly to MongoDB
      const response = await fetch('/api/health/database');
      const data = await response.json();

      if (data.success && data.database.status.isConnected) {
        this.isConnected = true;
        return {
          status: 'connected',
          message: 'Database connection is healthy',
          timestamp: data.timestamp
        };
      } else {
        this.isConnected = false;
        return {
          status: 'disconnected',
          message: 'Database connection is not available',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      this.isConnected = false;
      return {
        status: 'error',
        message: `Connection check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get database statistics through backend API
  async getDatabaseStats(): Promise<any> {
    try {
      const response = await fetch('/api/admin/database/stats');
      const data = await response.json();

      if (data.success) {
        return {
          stats: data.stats,
          collections: data.collections,
          timestamp: data.timestamp
        };
      } else {
        throw new Error('Failed to get database stats');
      }
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  // Health check with retry logic
  async healthCheckWithRetry(maxRetries: number = 3, delay: number = 1000): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await this.checkConnection();
        if (result.status === 'connected') {
          return true;
        }

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`Health check attempt ${i + 1} failed:`, error);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    return false;
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Get configuration
  getConfig(): MongoConfig {
    return { ...this.config };
  }
}

// Create MongoDB client instance
const createMongoClient = (): MongoDBClient => {
  const config: MongoConfig = {
    uri: process.env.NEXT_PUBLIC_MONGO_URI || 'mongodb://localhost:27017/skillfinite_db',
    db: process.env.NEXT_PUBLIC_MONGO_DB || 'skillfinite_db',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }
  };

  return new MongoDBClient(config);
};

// Export singleton instance
export const mongoClient = createMongoClient();

// Export types and utilities
export type { MongoConfig };
export { MongoDBClient };

// Database health check hook for React components
export const useDatabaseHealth = () => {
  const [isHealthy, setIsHealthy] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsLoading(true);
        const result = await mongoClient.checkConnection();
        setIsHealthy(result.status === 'connected');
        setError(result.status === 'error' ? result.message : null);
      } catch (err) {
        setIsHealthy(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();

    // Set up periodic health checks if enabled
    const healthCheckInterval = process.env.NEXT_PUBLIC_DB_HEALTH_INTERVAL;
    if (healthCheckInterval && process.env.NEXT_PUBLIC_DB_STATUS_CHECK === 'true') {
      const interval = setInterval(checkHealth, parseInt(healthCheckInterval));
      return () => clearInterval(interval);
    }
  }, []);

  return { isHealthy, isLoading, error };
};

// Import React for the hook
import React from 'react';
