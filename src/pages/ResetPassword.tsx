
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);

  useEffect(() => {
    // Check if the URL contains a valid hash for password reset
    const checkResetToken = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes('type=recovery')) {
        setIsValidLink(false);
        toast({
          title: "Invalid reset link",
          description: "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
      }
    };

    checkResetToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await updatePassword(password);
      toast({
        title: "Password updated",
        description: "Your password has been reset successfully.",
      });
      navigate("/login");
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  if (!isValidLink) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Invalid Reset Link</h1>
              <p className="mt-2 text-gray-600">
                This password reset link is invalid or has expired.
              </p>
              <Button
                className="mt-6 bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate("/forgot-password")}
              >
                Request a new link
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
            <p className="mt-2 text-gray-600">
              Create a new password for your account
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>New Password</CardTitle>
                <CardDescription>
                  Please enter a new password for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
