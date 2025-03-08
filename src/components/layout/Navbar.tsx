
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isActive("/dashboard") ? "text-purple-600" : "text-gray-600"
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/create-event">Create Event</Link>
            </Button>
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
                <Link 
                  to="/dashboard" 
                  className="text-lg font-medium hover:text-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex flex-col gap-2 mt-4">
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
