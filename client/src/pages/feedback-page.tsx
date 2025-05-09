import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { RecentFeedback } from "@/components/recent-feedback";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { getQueryFn } from "@/lib/queryClient";

type FeedbackItem = {
  id: string;
  customerName: string | null;
  timeAgo: string;
  rating: number | null;
  comment: string;
  location: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  avatarUrl?: string;
  mediaUrl?: string;
  formName: string;
  qrCodeName: string;
  response: Record<string, any>;
  createdAt: string;
};

export default function FeedbackPage() {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch feedback data
  const { data: feedbackData, isLoading } = useQuery<FeedbackItem[]>({
    queryKey: ['/api/feedback'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Fetch locations for filter
  const { data: locations } = useQuery({
    queryKey: ['/api/locations'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Mock formatted feedback data
  const mockFeedbackData: FeedbackItem[] = [
    {
      id: '1',
      customerName: 'Emma T.',
      timeAgo: '2 hours ago',
      rating: 5,
      comment: 'The coffee was amazing and the service was very friendly! Will definitely come back again. Love the new seasonal menu.',
      location: 'Downtown Branch',
      sentiment: 'Positive',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      formName: 'Customer Satisfaction',
      qrCodeName: 'Main Register',
      response: { rating: 5, liked: 'Coffee and service', suggestions: 'None' },
      createdAt: '2023-11-10T14:30:00Z'
    },
    {
      id: '2',
      customerName: 'Michael R.',
      timeAgo: '5 hours ago',
      rating: 3,
      comment: 'The food was good but had to wait too long. Staff seemed understaffed during lunch rush.',
      location: 'Mall Store',
      sentiment: 'Neutral',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      formName: 'Customer Satisfaction',
      qrCodeName: 'Checkout Counter',
      response: { rating: 3, liked: 'Food quality', suggestions: 'More staff during rush hour' },
      createdAt: '2023-11-10T11:15:00Z'
    },
    {
      id: '3',
      customerName: 'Sophia L.',
      timeAgo: 'Yesterday',
      rating: 4.5,
      comment: 'Very satisfied with my purchase! The quality was excellent and it was packaged nicely.',
      location: 'Airport Kiosk',
      sentiment: 'Positive',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      formName: 'Product Feedback',
      qrCodeName: 'Service Desk',
      response: { rating: 4.5, productQuality: 'Excellent', packaging: 'Very Good' },
      createdAt: '2023-11-09T09:45:00Z'
    },
    {
      id: '4',
      customerName: 'David H.',
      timeAgo: '2 days ago',
      rating: 2,
      comment: 'Disappointed with the cleanliness of the bathroom. The rest of the store was okay but this needs attention!',
      location: 'Downtown Branch',
      sentiment: 'Negative',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      formName: 'Cleanliness Survey',
      qrCodeName: 'Restroom Feedback',
      response: { rating: 2, cleanliness: 'Poor', suggestions: 'Regular cleaning checks' },
      createdAt: '2023-11-08T15:20:00Z'
    },
    {
      id: '5',
      customerName: null,
      timeAgo: '3 days ago',
      rating: 4,
      comment: 'Quick service and friendly staff. Food was hot and fresh.',
      location: 'Mall Store',
      sentiment: 'Positive',
      formName: 'Food Experience',
      qrCodeName: 'Dining Area',
      response: { rating: 4, foodQuality: 'Great', serviceSpeed: 'Fast' },
      createdAt: '2023-11-07T12:10:00Z'
    }
  ];
  
  const displayData = feedbackData || mockFeedbackData;
  
  // Filter feedback based on selected filters and search query
  const filteredFeedback = displayData.filter(feedback => {
    const matchesLocation = selectedLocation === "all" || feedback.location === selectedLocation;
    const matchesSentiment = selectedSentiment === "all" || feedback.sentiment === selectedSentiment;
    const matchesSearch = !searchQuery || 
      (feedback.comment && feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (feedback.customerName && feedback.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesLocation && matchesSentiment && matchesSearch;
  });
  
  // Format feedback for RecentFeedback component
  const formattedFeedback = filteredFeedback.map(feedback => ({
    id: feedback.id,
    customerName: feedback.customerName || 'Anonymous User',
    timeAgo: feedback.timeAgo,
    rating: feedback.rating || 0,
    comment: feedback.comment,
    location: feedback.location,
    sentiment: feedback.sentiment,
    avatarUrl: feedback.avatarUrl,
    mediaUrl: feedback.mediaUrl
  }));
  
  const handleFeedbackClick = (id: string) => {
    const feedback = displayData.find(f => f.id === id);
    if (feedback) {
      setSelectedFeedback(feedback);
      setIsDialogOpen(true);
    }
  };
  
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
      case 'Neutral':
        return <Badge className="bg-amber-100 text-amber-800">Neutral</Badge>;
      case 'Negative':
        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Feedback</h2>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage feedback submissions from your customers
                </p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <Select 
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                    <SelectItem value="Mall Store">Mall Store</SelectItem>
                    <SelectItem value="Airport Kiosk">Airport Kiosk</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedSentiment}
                  onValueChange={setSelectedSentiment}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative">
                  <Input
                    placeholder="Search feedback..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            </div>
            
            {/* Feedback Content */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Feedback</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
                <TabsTrigger value="with-media">With Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-60">
                    <div className="text-primary-600">
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                    </div>
                  </div>
                ) : filteredFeedback.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 h-60">
                      <div className="text-gray-400 text-4xl mb-4">
                        <i className="fas fa-comment-slash"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback found</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        There's no feedback matching your current filters. Try adjusting your search or filters to see more results.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <RecentFeedback
                          feedback={formattedFeedback}
                          onViewAll={() => {}}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg">Feedback Analytics</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                <i className="fas fa-smile text-green-600"></i>
                              </div>
                              <h3 className="font-medium">Positive Feedback</h3>
                            </div>
                            <p className="text-2xl font-semibold mb-1">
                              {filteredFeedback.filter(f => f.sentiment === 'Positive').length}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.round((filteredFeedback.filter(f => f.sentiment === 'Positive').length / filteredFeedback.length) * 100)}% of total
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                                <i className="fas fa-meh text-amber-600"></i>
                              </div>
                              <h3 className="font-medium">Neutral Feedback</h3>
                            </div>
                            <p className="text-2xl font-semibold mb-1">
                              {filteredFeedback.filter(f => f.sentiment === 'Neutral').length}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.round((filteredFeedback.filter(f => f.sentiment === 'Neutral').length / filteredFeedback.length) * 100)}% of total
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                <i className="fas fa-frown text-red-600"></i>
                              </div>
                              <h3 className="font-medium">Negative Feedback</h3>
                            </div>
                            <p className="text-2xl font-semibold mb-1">
                              {filteredFeedback.filter(f => f.sentiment === 'Negative').length}
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.round((filteredFeedback.filter(f => f.sentiment === 'Negative').length / filteredFeedback.length) * 100)}% of total
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unread">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600">Unread feedback will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="flagged">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600">Flagged feedback will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="with-media">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600">Feedback with media uploads will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <MobileNav />
      
      {/* Feedback Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Submitted {selectedFeedback?.timeAgo} via {selectedFeedback?.qrCodeName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="grid gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {selectedFeedback.avatarUrl ? (
                      <img 
                        src={selectedFeedback.avatarUrl} 
                        alt={`${selectedFeedback.customerName} avatar`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs font-medium">
                        {selectedFeedback.customerName ? 
                          selectedFeedback.customerName.split(' ').map(n => n[0]).join('') : 
                          'A'
                        }
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      {selectedFeedback.customerName || 'Anonymous User'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className={`text-xs ${i < Math.floor(selectedFeedback.rating || 0) ? 'fas fa-star' : i < (selectedFeedback.rating || 0) ? 'fas fa-star-half-alt' : 'far fa-star'}`}></i>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {selectedFeedback.location}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  {getSentimentBadge(selectedFeedback.sentiment)}
                </div>
              </div>
              
              <div className="border-t border-b py-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Feedback Comment</h5>
                <p className="text-gray-800">{selectedFeedback.comment}</p>
                
                {selectedFeedback.mediaUrl && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Attached Media</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <img 
                        src={selectedFeedback.mediaUrl} 
                        alt="Customer upload" 
                        className="rounded-md border object-cover"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Form Responses</h5>
                <div className="space-y-3">
                  {Object.entries(selectedFeedback.response || {}).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-sm font-medium text-gray-600 w-1/3 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-800 w-2/3">
                        {typeof value === 'number' && key === 'rating' 
                          ? `${value} stars` 
                          : String(value)
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline">
                  <i className="fas fa-flag mr-2"></i>
                  Flag for Review
                </Button>
                <Button variant="outline">
                  <i className="fas fa-reply mr-2"></i>
                  Reply
                </Button>
                <Button 
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
