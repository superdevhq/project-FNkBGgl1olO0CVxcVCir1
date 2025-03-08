
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

// Sample event data (will be replaced with actual data from backend later)
const upcomingEvents = [
  {
    id: "1",
    title: "Tech Conference 2023",
    date: "November 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco, CA",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
    image: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Design Workshop",
    date: "December 5, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "New York, NY",
    description: "Learn the latest design trends and techniques from expert designers in this hands-on workshop.",
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Startup Networking Mixer",
    date: "December 12, 2023",
    time: "6:00 PM - 9:00 PM",
    location: "Austin, TX",
    description: "Connect with fellow entrepreneurs and investors in a relaxed setting. Great opportunities for collaboration!",
    image: "/placeholder.svg"
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Discover and Create Memorable Events</h1>
            <p className="text-xl text-gray-600 mb-8">The easiest way to find, register for, and host events that matter to you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/create-event" className="text-white">Create Event</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link to="/browse-events">Browse Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-4">{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {event.location}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link to="/browse-events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Event</h3>
              <p className="text-gray-600">Set up your event with all the details in just a few minutes.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with Attendees</h3>
              <p className="text-gray-600">Invite people via email or share your event link on social media.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Registrations</h3>
              <p className="text-gray-600">Track attendees and communicate with them through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to host your next event?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Our platform makes it easy to create, manage, and promote your events.</p>
          <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link to="/create-event">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
