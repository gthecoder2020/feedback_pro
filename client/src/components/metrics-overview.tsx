import { Card, CardContent } from "@/components/ui/card";

type Metric = {
  title: string;
  value: string;
  trend: {
    value: string;
    direction: "up" | "down";
  };
  subtitle?: string;
  progressValue?: number;
  progressTotal?: number;
  progressLabel?: string;
  children?: React.ReactNode;
};

type MetricsOverviewProps = {
  metrics: Metric[];
};

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <span className={`flex items-center text-xs font-medium ${
                metric.trend.direction === "up" 
                  ? "text-green-600 bg-green-50" 
                  : "text-red-600 bg-red-50"
              } rounded-full px-2 py-1`}>
                <i className={`fas fa-arrow-${metric.trend.direction} mr-1`}></i>
                {metric.trend.value}
              </span>
            </div>
            
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
              {metric.subtitle && (
                <p className="ml-2 text-sm text-gray-600">{metric.subtitle}</p>
              )}
            </div>
            
            {metric.progressValue !== undefined && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div 
                    className="h-2 bg-primary-500 rounded-full" 
                    style={{ width: `${metric.progressValue}%` }}
                  ></div>
                </div>
                {metric.progressLabel && (
                  <p className="mt-2 text-xs text-gray-500">{metric.progressLabel}</p>
                )}
              </div>
            )}
            
            {metric.children}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
