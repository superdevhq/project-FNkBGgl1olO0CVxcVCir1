
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState<{
    login?: string;
    register?: string;
    confirmPassword?: string;
  }>({});

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear confirm password error when user types in either password field
    if (name === "password" || name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await signIn(loginData.email, loginData.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      await signUp(registerData.email, registerData.password, registerData.fullName);
      setActiveTab("login");
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">EventHub</h1>
            <p className="mt-2 text-gray-600">Sign in to manage your events</p>
          </div>

          <Card>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-purple-600 hover:text-purple-800"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    {errors.login && (
                      <p className="text-sm text-red-500">{errors.login}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit}>
                  <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                      Enter your details to create a new account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        value={registerData.fullName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input
                        id="registerEmail"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                    {errors.register && (
                      <p className="text-sm text-red-500">{errors.register}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
