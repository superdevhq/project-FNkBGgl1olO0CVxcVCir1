
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
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Set initial check done after a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialCheckDone(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Add a timer to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setWaitTime(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, waitTime]);

  // If still loading, show a loading spinner
  // But if loading takes too long (more than 4 seconds), proceed with the check
  if (isLoading && !initialCheckDone && waitTime < 2) {
    console.log('ProtectedRoute: Still loading, showing spinner');
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
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
