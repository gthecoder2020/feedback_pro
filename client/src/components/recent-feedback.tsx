import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FeedbackSentiment = 'Positive' | 'Neutral' | 'Negative';

type FeedbackItem = {
  id: string;
  customerName: string;
  timeAgo: string;
  rating: number;
  comment: string;
  location: string;
  sentiment: FeedbackSentiment;
  avatarUrl?: string;
  mediaUrl?: string;
};

type RecentFeedbackProps = {
  feedback: FeedbackItem[];
  onViewAll?: () => void;
};

export function RecentFeedback({ 
  feedback = defaultFeedback,
  onViewAll = () => {}
}: Partial<RecentFeedbackProps>) {
  const [displayCount, setDisplayCount] = useState(4);
  
  const loadMore = () => {
    setDisplayCount(prev => prev + 4);
  };
  
  const getSentimentColor = (sentiment: FeedbackSentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-100 text-green-800';
      case 'Neutral': return 'bg-amber-100 text-amber-800';
      case 'Negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-xs"></i>);
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-xs"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-xs"></i>);
      }
    }
    return <div className="flex text-amber-400 mt-1">{stars}</div>;
  };
  
  return (
    <Card className="bg-white col-span-1 lg:col-span-2">
      <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="font-semibold text-gray-800">Recent Feedback</CardTitle>
        <Button 
          variant="link" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium p-0"
          onClick={onViewAll}
        >
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {feedback.slice(0, displayCount).map((item) => (
            <div key={item.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {item.avatarUrl ? (
                      <img 
                        src={item.avatarUrl} 
                        alt={`${item.customerName} avatar`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs font-medium">
                        {item.customerName?.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">{item.customerName}</h4>
                      <span className="ml-2 text-xs text-gray-500">{item.timeAgo}</span>
                    </div>
                    
                    {renderStars(item.rating)}
                    
                    <p className="mt-1 text-sm text-gray-600">{item.comment}</p>
                    
                    {item.mediaUrl && (
                      <div className="mt-2 flex">
                        <img 
                          src={item.mediaUrl}
                          alt="Customer upload" 
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <Badge 
                    variant="outline" 
                    className={getSentimentColor(item.sentiment)}
                  >
                    {item.sentiment}
                  </Badge>
                  <div className="mt-2 text-xs text-gray-500">{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {displayCount < feedback.length && (
          <div className="mt-6 text-center">
            <Button 
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={loadMore}
            >
              <i className="fas fa-chevron-down mr-1"></i>
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const defaultFeedback: FeedbackItem[] = [
  {
    id: '1',
    customerName: 'Emma T.',
    timeAgo: '2 hours ago',
    rating: 5,
    comment: 'The coffee was amazing and the service was very friendly! Will definitely come back again. Love the new seasonal menu.',
    location: 'Downtown Branch',
    sentiment: 'Positive',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '2',
    customerName: 'Michael R.',
    timeAgo: '5 hours ago',
    rating: 3,
    comment: 'The food was good but had to wait too long. Staff seemed understaffed during lunch rush.',
    location: 'Mall Store',
    sentiment: 'Neutral',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
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
    mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '4',
    customerName: 'David H.',
    timeAgo: '2 days ago',
    rating: 2,
    comment: 'Disappointed with the cleanliness of the bathroom. The rest of the store was okay but this needs attention!',
    location: 'Downtown Branch',
    sentiment: 'Negative',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];
