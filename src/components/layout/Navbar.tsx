
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  User,
  LogOut,
  Settings,
  PlusCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Set authentication state based on user
  useEffect(() => {
    console.log("Navbar: User state changed:", user ? "authenticated" : "not authenticated");
    setIsAuthenticated(!!user);
  }, [user]);

  // Refresh profile when component mounts or when user changes
  useEffect(() => {
    if (user) {
      console.log("Navbar: Refreshing profile for user:", user.id);
      refreshProfile();
    }
  }, [user, refreshProfile]);

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      console.log("Navbar: Signing out");
      await signOut();
      // Navigate to home page after sign out
      navigate("/");
    } catch (error) {
      console.error("Navbar: Error signing out:", error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // If authentication state is still being determined, show a simplified navbar
  if (isAuthenticated === null) {
    return (
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-purple-600">
                EventHub
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-600">
              EventHub
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isActive("/") ? "text-purple-600" : "text-gray-600"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/browse-events" 
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isActive("/browse-events") ? "text-purple-600" : "text-gray-600"
                }`}
              >
                Browse Events
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                    isActive("/dashboard") ? "text-purple-600" : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/create-event">Create Event</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                        <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/create-event" className="cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create Event</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/create-event">Create Event</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/" 
                  className="text-lg font-medium hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/browse-events" 
                  className="text-lg font-medium hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Events
                </Link>
                {isAuthenticated && (
                  <Link 
                    to="/dashboard" 
                    className="text-lg font-medium hover:text-purple-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                
                <div className="flex flex-col gap-2 mt-4">
                  {isAuthenticated ? (
                    <>
                      {profile && (
                        <div className="flex items-center gap-3 py-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                            <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile.full_name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                      )}
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      
                      <Button asChild className="bg-purple-600 hover:bg-purple-700 mt-2">
                        <Link to="/create-event" onClick={() => setIsOpen(false)}>
                          Create Event
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="mt-2 flex items-center gap-2"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link to="/create-event" onClick={() => setIsOpen(false)}>
                          Create Event
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
