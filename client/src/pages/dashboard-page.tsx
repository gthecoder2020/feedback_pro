import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { MetricsOverview } from "@/components/metrics-overview";
import { FeedbackTrendChart } from "@/components/feedback-trend-chart";
import { FeedbackCategoryChart } from "@/components/feedback-category-chart";
import { RecentFeedback } from "@/components/recent-feedback";
import { QRCodesOverview } from "@/components/qr-codes-overview";
import { FormBuilderPreview } from "@/components/form-builder-preview";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [timeRange, setTimeRange] = useState("30days");
  
  // Demo data for metrics overview
  const metrics = [
    {
      title: "Total Feedback",
      value: "1,284",
      subtitle: "responses",
      trend: { value: "12.5%", direction: "up" },
      progressValue: 78,
      progressLabel: "78% of monthly target (1,650)"
    },
    {
      title: "Average Rating",
      value: "4.7",
      subtitle: "/ 5.0",
      trend: { value: "3.2%", direction: "up" },
      children: (
        <div className="mt-4 flex items-center">
          <div className="flex text-amber-400">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star-half-alt"></i>
          </div>
          <p className="ml-2 text-xs text-gray-500">Based on 827 ratings</p>
        </div>
      )
    },
    {
      title: "Response Rate",
      value: "18.3%",
      subtitle: "conversion",
      trend: { value: "2.1%", direction: "down" },
      progressValue: 18.3,
      progressLabel: "7,021 scans to 1,284 responses"
    },
    {
      title: "Sentiment Score",
      value: "82",
      subtitle: "/ 100",
      trend: { value: "5.7%", direction: "up" },
      children: (
        <div className="mt-4 grid grid-cols-3 gap-1">
          <div className="h-2 bg-green-500 rounded-full"></div>
          <div className="h-2 bg-amber-400 rounded-full"></div>
          <div className="h-2 bg-red-500 rounded-full"></div>
          <div className="text-xs text-green-600 text-center">+67%</div>
          <div className="text-xs text-amber-500 text-center">+23%</div>
          <div className="text-xs text-red-500 text-center">+10%</div>
        </div>
      )
    }
  ];
  
  const navigateToFormBuilder = () => {
    navigate("/form-builder");
  };
  
  const navigateToQRCodes = () => {
    navigate("/qr-codes");
  };
  
  const navigateToFeedback = () => {
    navigate("/feedback");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          <div className="p-6 lg:p-8">
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor and analyze your customer feedback metrics
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <Select 
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="downtown">Downtown Branch</SelectItem>
                    <SelectItem value="airport">Airport Kiosk</SelectItem>
                    <SelectItem value="mall">Mall Store</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  className="inline-flex items-center justify-center bg-primary-600 text-white font-medium hover:bg-primary-700"
                  onClick={navigateToQRCodes}
                >
                  <i className="fas fa-plus mr-2"></i>
                  <span>New QR Code</span>
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            <MetricsOverview metrics={metrics} />

            {/* Charts & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <FeedbackTrendChart />
              <FeedbackCategoryChart />
            </div>

            {/* Recent Feedback & QR Codes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <RecentFeedback onViewAll={navigateToFeedback} />
              <QRCodesOverview onCreateNew={navigateToQRCodes} onManageAll={navigateToQRCodes} />
            </div>
            
            {/* Form Builder Preview */}
            <FormBuilderPreview onEditForms={navigateToFormBuilder} />
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
