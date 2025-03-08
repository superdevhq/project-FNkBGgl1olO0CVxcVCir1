
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { UserProfile } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile, signOut, updatePassword, isLoading } = useAuth();
  
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    full_name: "",
    bio: "",
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<{
    profile?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Initialize profile data when profile is loaded
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    if (profile) {
      console.log("Setting profile data from profile:", profile);
      setProfileData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
      });
      
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
      
      setLocalLoading(false);
    } else if (!isLoading) {
      // If profile is null but not loading, create default profile data
      if (user) {
        console.log("Setting profile data from user:", user);
        setProfileData({
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "",
          bio: "",
        });
      }
      setLocalLoading(false);
    }
  }, [user, profile, isLoading, navigate]);

  // Handle profile form field changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form field changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear confirm password error when user types in either password field
    if (name === "newPassword" || name === "confirmPassword") {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to storage
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      console.log("Starting avatar upload");
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
      
      console.log("Uploading to path:", filePath);
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) {
        console.error("Avatar upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Avatar uploaded successfully, getting public URL");
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log("Avatar public URL:", data.publicUrl);
      return data.publicUrl;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile form submitted");
    setErrors({});
    setIsSubmitting(true);
    
    try {
      let newAvatarUrl = null;
      
      if (avatarFile) {
        console.log("Uploading avatar file");
        newAvatarUrl = await uploadAvatar();
        console.log("Avatar upload result:", newAvatarUrl);
      }
      
      const updatedProfile: Partial<UserProfile> = {
        ...profileData,
      };
      
      if (newAvatarUrl) {
        updatedProfile.avatar_url = newAvatarUrl;
      }
      
      console.log("Submitting profile update:", updatedProfile);
      
      // Update profile
      await updateProfile(updatedProfile);
      console.log("Profile update completed successfully");
      
      // Reset avatar file state after successful upload
      setAvatarFile(null);
      
      // Refresh profile to ensure we have the latest data
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updatePassword(passwordData.newPassword);
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Error updating password",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsSubmitting(true);
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Show loading state
  if (isLoading || localLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If no user, redirect to login (handled in useEffect)
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <form onSubmit={handleProfileSubmit}>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and profile picture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={avatarUrl} alt={profileData.full_name} />
                            <AvatarFallback>
                              {getInitials(profileData.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Input
                              id="avatar"
                              name="avatar"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('avatar')?.click()}
                              disabled={isSubmitting}
                            >
                              Change Avatar
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              name="full_name"
                              value={profileData.full_name}
                              onChange={handleProfileChange}
                              placeholder="Your full name"
                              disabled={isSubmitting}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              value={user.email}
                              disabled
                              className="bg-gray-100"
                            />
                            <p className="text-sm text-gray-500">
                              Email cannot be changed
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio || ""}
                          onChange={handleProfileChange}
                          placeholder="Tell us a bit about yourself"
                          className="min-h-[120px]"
                          disabled={isSubmitting}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate("/dashboard")}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Saving...
                          </span>
                        ) : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="mb-6">
                  <form onSubmit={handlePasswordSubmit}>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                          disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Updating Password...
                          </span>
                        ) : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>
                      Manage your account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Sign Out</h3>
                      <p className="text-gray-500 mb-4">
                        Sign out from your account on this device
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                            Signing Out...
                          </span>
                        ) : "Sign Out"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-red-600 mb-2">Delete Account</h3>
                      <p className="text-gray-500 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          toast({
                            title: "Feature not available",
                            description: "Account deletion is not implemented yet.",
                          });
                        }}
                        disabled={isSubmitting}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
