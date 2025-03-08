
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Share2, 
  ArrowLeft,
  CalendarPlus
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

// Mock event data (will be replaced with API call)
const eventData = {
  id: "1",
  title: "Tech Conference 2023",
  date: "November 15, 2023",
  time: "9:00 AM - 5:00 PM",
  location: "San Francisco Convention Center",
  address: "747 Howard St, San Francisco, CA 94103",
  description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops. This full-day event includes keynote speeches, breakout sessions, networking opportunities, and a showcase of the latest technologies. Whether you're a developer, designer, product manager, or tech enthusiast, there's something for everyone at this premier industry gathering.",
  organizer: "TechEvents Inc.",
  image: "/placeholder.svg",
  attendees: 157,
  capacity: 300,
  price: "Free"
};

const EventDetail = () => {
  const { id } = useParams();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // In a real app, we would fetch the event data based on the ID
  // const event = useQuery(['event', id], () => fetchEvent(id));
  const event = eventData; // Using mock data for now

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = () => {
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, we would submit this data to an API
    setIsRegistering(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false);
      toast({
        title: "Success!",
        description: "You have successfully registered for this event.",
      });
    }, 1500);
  };

  const handleAddToCalendar = () => {
    // In a real app, we would generate a calendar file or link
    toast({
      title: "Calendar Event Created",
      description: "This event has been added to your calendar.",
    });
  };

  const handleShare = () => {
    // In a real app, we would implement proper sharing functionality
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard!",
      });
    }
  };

  return (
    <Layout>
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>Hosted by {event.organizer}</span>
                </div>
              </div>
              <Separator className="my-6" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">About this event</h2>
                <p className="text-gray-700 whitespace-pre-line mb-6">{event.description}</p>
              </div>
              <Separator className="my-6" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <p className="text-gray-700 mb-2">{event.location}</p>
                <p className="text-gray-700 mb-4">{event.address}</p>
                {/* In a real app, we would embed a map here */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Map would be displayed here</p>
                </div>
              </div>
            </div>
            
            {/* Registration Card */}
            <div>
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-2xl font-bold mb-1">{event.price}</p>
                    <div className="flex items-center text-gray-600 mb-4">
                      <User className="h-4 w-4 mr-2" />
                      <span>{event.attendees} attending</span>
                      {event.capacity && (
                        <span className="ml-1">· {event.capacity - event.attendees} spots left</span>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-3">Register Now</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Register for {event.title}</DialogTitle>
                          <DialogDescription>
                            Fill out the form below to secure your spot at this event.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleInputChange} 
                              placeholder="John Doe" 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email" 
                              value={formData.email} 
                              onChange={handleInputChange} 
                              placeholder="john@example.com" 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleRegister} 
                            disabled={isRegistering}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {isRegistering ? "Registering..." : "Complete Registration"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 mb-3"
                      onClick={handleAddToCalendar}
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Share Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
