import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CategoryData = {
  name: string;
  percentage: number;
  color: string;
};

type FeedbackCategoryChartProps = {
  totalFeedback: number;
  categories: CategoryData[];
};

export function FeedbackCategoryChart({ 
  totalFeedback = 1284, 
  categories = defaultCategories 
}: Partial<FeedbackCategoryChartProps>) {
  // Calculate stroke dasharray and offset for each segment
  const calculateSegments = () => {
    let offset = 25; // Start position
    const circumference = 2 * Math.PI * 80; // 2πr
    
    return categories.map(category => {
      const dashLength = (circumference * category.percentage) / 100;
      const segment = {
        color: category.color,
        dasharray: `${dashLength} ${circumference - dashLength}`,
        dashoffset: -offset
      };
      offset += dashLength;
      return segment;
    });
  };
  
  const segments = calculateSegments();
  
  return (
    <Card className="bg-white">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="font-semibold text-gray-800">Feedback by Category</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative h-64 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="#E5E7EB" strokeWidth="40" />
            
            {/* Pie chart segments */}
            {segments.map((segment, index) => (
              <circle 
                key={index}
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke={segment.color} 
                strokeWidth="40" 
                strokeDasharray={segment.dasharray} 
                strokeDashoffset={segment.dashoffset} 
              />
            ))}
            
            {/* Center circle */}
            <circle cx="100" cy="100" r="60" fill="white" />
            
            {/* Center text */}
            <text x="100" y="95" fontSize="24" fill="#1F2937" textAnchor="middle" fontWeight="bold">
              {totalFeedback}
            </text>
            <text x="100" y="120" fontSize="14" fill="#6B7280" textAnchor="middle">
              Total
            </text>
          </svg>
        </div>
        
        <div className="mt-6 space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="ml-2 text-sm text-gray-700">{category.name}</span>
              </div>
              <span className="text-sm font-medium">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const defaultCategories = [
  { name: 'Service Quality', percentage: 42, color: '#4F46E5' },
  { name: 'Food/Product', percentage: 28, color: '#0EA5E9' },
  { name: 'Cleanliness', percentage: 15, color: '#F59E0B' },
  { name: 'Other', percentage: 15, color: '#10B981' }
];
