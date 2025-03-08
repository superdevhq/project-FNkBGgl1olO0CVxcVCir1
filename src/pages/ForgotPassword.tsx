
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

const ForgotPassword = () => {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-gray-600">
              Enter your email to receive a password reset link
            </p>
          </div>

          <Card>
            {isSubmitted ? (
              <CardContent className="pt-6 text-center">
                <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                  <p className="font-medium">Reset link sent!</p>
                  <p className="text-sm mt-1">
                    Check your email for instructions to reset your password.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Link>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Forgot Password</CardTitle>
                  <CardDescription>
                    We'll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Link
                    to="/login"
                    className="text-sm text-center text-purple-600 hover:text-purple-800"
                  >
                    Back to login
                  </Link>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
