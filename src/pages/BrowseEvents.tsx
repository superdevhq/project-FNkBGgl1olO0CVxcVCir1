
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Search, Filter, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

// Sample event data (will be replaced with actual data from backend later)
const allEvents = [
  {
    id: "1",
    title: "Tech Conference 2023",
    date: "November 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco, CA",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
    image: "/placeholder.svg",
    category: "Technology",
    price: "Free",
    format: "In-person"
  },
  {
    id: "2",
    title: "Design Workshop",
    date: "December 5, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "New York, NY",
    description: "Learn the latest design trends and techniques from expert designers in this hands-on workshop.",
    image: "/placeholder.svg",
    category: "Design",
    price: "$50",
    format: "In-person"
  },
  {
    id: "3",
    title: "Startup Networking Mixer",
    date: "December 12, 2023",
    time: "6:00 PM - 9:00 PM",
    location: "Austin, TX",
    description: "Connect with fellow entrepreneurs and investors in a relaxed setting. Great opportunities for collaboration!",
    image: "/placeholder.svg",
    category: "Networking",
    price: "$25",
    format: "In-person"
  },
  {
    id: "4",
    title: "Digital Marketing Masterclass",
    date: "November 20, 2023",
    time: "1:00 PM - 4:00 PM",
    location: "Online",
    description: "Master the latest digital marketing strategies and tools to grow your business online.",
    image: "/placeholder.svg",
    category: "Marketing",
    price: "$75",
    format: "Virtual"
  },
  {
    id: "5",
    title: "Product Management Summit",
    date: "January 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Chicago, IL",
    description: "A full-day summit dedicated to product management best practices, featuring speakers from top tech companies.",
    image: "/placeholder.svg",
    category: "Business",
    price: "$120",
    format: "In-person"
  },
  {
    id: "6",
    title: "Web3 and Blockchain Webinar",
    date: "December 8, 2023",
    time: "11:00 AM - 12:30 PM",
    location: "Online",
    description: "Explore the future of Web3 and blockchain technology with industry experts.",
    image: "/placeholder.svg",
    category: "Technology",
    price: "Free",
    format: "Virtual"
  }
];

const categories = ["All Categories", "Technology", "Design", "Networking", "Marketing", "Business"];
const formats = ["All Formats", "In-person", "Virtual"];
const prices = ["All Prices", "Free", "Paid"];

const BrowseEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [showFilters, setShowFilters] = useState(false);

  // Filter events based on search and filter criteria
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
    const matchesFormat = selectedFormat === "All Formats" || event.format === selectedFormat;
    const matchesPrice = selectedPrice === "All Prices" || 
                        (selectedPrice === "Free" && event.price === "Free") ||
                        (selectedPrice === "Paid" && event.price !== "Free");
    
    return matchesSearch && matchesCategory && matchesFormat && matchesPrice;
  });

  return (
    <Layout>
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Events</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events, locations, or keywords"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Mobile Filters (shown when button is clicked) */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 border rounded-md bg-white">
              <h3 className="font-medium mb-3">Filters</h3>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map(format => (
                        <SelectItem key={format} value={format}>{format}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Price</Label>
                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      {prices.map(price => (
                        <SelectItem key={price} value={price}>{price}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden md:block w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Format</h3>
                  <div className="space-y-2">
                    {formats.map(format => (
                      <div key={format} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`format-${format}`} 
                          checked={selectedFormat === format}
                          onCheckedChange={() => setSelectedFormat(format)}
                        />
                        <Label htmlFor={`format-${format}`}>{format}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Price</h3>
                  <div className="space-y-2">
                    {prices.map(price => (
                      <div key={price} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`price-${price}`} 
                          checked={selectedPrice === price}
                          onCheckedChange={() => setSelectedPrice(price)}
                        />
                        <Label htmlFor={`price-${price}`}>{price}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Events Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">{filteredEvents.length} events found</p>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="za">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={event.format === "Virtual" ? "bg-blue-500" : "bg-green-500"}>
                          {event.format}
                        </Badge>
                      </div>
                      {event.price !== "Free" && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" className="bg-white">
                            {event.price}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{event.location}</span>
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters to find events.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                    setSelectedFormat("All Formats");
                    setSelectedPrice("All Prices");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrowseEvents;
