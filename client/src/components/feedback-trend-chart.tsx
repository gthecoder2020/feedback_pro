import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type TimeRange = "Day" | "Week" | "Month";

type FeedbackTrendChartProps = {
  data?: { 
    labels: string[]; 
    feedbackCount: number[]; 
    avgRating: number[];
  };
};

export function FeedbackTrendChart({ data = defaultChartData }: FeedbackTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("Day");
  
  return (
    <Card className="bg-white col-span-1 lg:col-span-2">
      <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibold text-gray-800">Feedback Trend</CardTitle>
        <div className="flex space-x-2">
          {(["Day", "Week", "Month"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              className={`px-3 py-1 h-auto text-xs font-medium rounded-md ${
                timeRange === range 
                  ? "bg-primary-50 text-primary-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            <line x1="0" y1="250" x2="800" y2="250" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="200" x2="800" y2="200" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="50" x2="800" y2="50" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* X-axis labels */}
            {data.labels.map((label, i) => (
              <text 
                key={label} 
                x={50 + i * 100} 
                y="280" 
                fill="#6B7280" 
                fontSize="12"
                textAnchor="middle"
              >
                {label}
              </text>
            ))}
            
            {/* Y-axis labels */}
            <text x="20" y="250" fill="#6B7280" fontSize="12">0</text>
            <text x="20" y="200" fill="#6B7280" fontSize="12">25</text>
            <text x="20" y="150" fill="#6B7280" fontSize="12">50</text>
            <text x="20" y="100" fill="#6B7280" fontSize="12">75</text>
            <text x="20" y="50" fill="#6B7280" fontSize="12">100</text>
            
            {/* Feedback count line and area */}
            <path 
              d={`M${data.feedbackCount.map((val, i) => `${50 + i * 100},${250 - val * 1.8}`).join(' L')}`} 
              stroke="#4F46E5" 
              strokeWidth="3" 
              fill="none" 
            />
            {data.feedbackCount.map((val, i) => (
              <circle 
                key={`fc-${i}`} 
                cx={50 + i * 100} 
                cy={250 - val * 1.8} 
                r="4" 
                fill="#4F46E5" 
              />
            ))}
            <path 
              d={`M${data.feedbackCount.map((val, i) => `${50 + i * 100},${250 - val * 1.8}`).join(' L')} L${650},250 L${50},250 Z`}
              fill="url(#gradient1)" 
              opacity="0.2" 
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Rating line */}
            <path 
              d={`M${data.avgRating.map((val, i) => `${50 + i * 100},${250 - val * 30}`).join(' L')}`} 
              stroke="#0EA5E9" 
              strokeWidth="3" 
              fill="none" 
            />
            {data.avgRating.map((val, i) => (
              <circle 
                key={`ar-${i}`} 
                cx={50 + i * 100} 
                cy={250 - val * 30} 
                r="4" 
                fill="#0EA5E9" 
              />
            ))}
          </svg>
          
          <div className="absolute bottom-0 left-0 p-4 flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary-600 rounded-full"></span>
              <span className="ml-2 text-xs text-gray-600">Feedback Count</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-secondary-500 rounded-full"></span>
              <span className="ml-2 text-xs text-gray-600">Avg Rating</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const defaultChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  feedbackCount: [39, 61, 50, 72, 83, 100, 89],
  avgRating: [4.0, 4.3, 4.6, 5.0, 4.7, 5.0, 4.9]
};
