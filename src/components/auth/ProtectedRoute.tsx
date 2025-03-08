
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [waitTime, setWaitTime] = useState(0);

  // Add a timer to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setWaitTime(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, waitTime]);

  // If still loading, show a loading spinner
  // But if loading takes too long (more than 6 seconds), redirect to login
  if (isLoading) {
    if (waitTime >= 2) {
      // If loading takes too long, redirect to login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
