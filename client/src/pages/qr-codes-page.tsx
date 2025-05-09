import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QRCodesPage() {
  const { toast } = useToast();
  const [isCreatingQR, setIsCreatingQR] = useState(false);
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [qrName, setQrName] = useState("");
  
  const qrCodes = [
    {
      id: '1',
      name: 'Main Register',
      location: 'Downtown Branch',
      scanCount: 456,
      createdAt: '2023-10-15',
      form: 'Customer Satisfaction'
    },
    {
      id: '2',
      name: 'Checkout Counter',
      location: 'Mall Store',
      scanCount: 382,
      createdAt: '2023-10-18',
      form: 'Product Feedback'
    },
    {
      id: '3',
      name: 'Service Desk',
      location: 'Airport Kiosk',
      scanCount: 178,
      createdAt: '2023-10-21',
      form: 'Service Quality'
    },
    {
      id: '4',
      name: 'Dining Area',
      location: 'Downtown Branch',
      scanCount: 321,
      createdAt: '2023-10-29',
      form: 'Food Experience'
    },
    {
      id: '5',
      name: 'Restroom Feedback',
      location: 'Mall Store',
      scanCount: 128,
      createdAt: '2023-11-02',
      form: 'Cleanliness Survey'
    }
  ];
  
  const forms = [
    { id: '1', name: 'Customer Satisfaction' },
    { id: '2', name: 'Product Feedback' },
    { id: '3', name: 'Service Quality' },
    { id: '4', name: 'Food Experience' },
    { id: '5', name: 'Cleanliness Survey' }
  ];
  
  const locations = [
    { id: '1', name: 'Downtown Branch' },
    { id: '2', name: 'Mall Store' },
    { id: '3', name: 'Airport Kiosk' }
  ];
  
  const createQRCode = () => {
    if (!qrName || !selectedForm || !selectedLocation) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreatingQR(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "QR Code Created",
        description: `${qrName} has been created successfully.`
      });
      setIsCreatingQR(false);
      setQrName("");
      setSelectedForm("");
      setSelectedLocation("");
    }, 1000);
  };
  
  const renderQRCode = (id: string) => {
    const patternId = parseInt(id) % 3;
    
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white border rounded-lg mb-4">
        <rect width="120" height="120" fill="white"/>
        {patternId === 0 && (
          <>
            <rect x="16" y="16" width="24" height="24" fill="black"/>
            <rect x="80" y="16" width="24" height="24" fill="black"/>
            <rect x="16" y="80" width="24" height="24" fill="black"/>
            <rect x="48" y="48" width="24" height="24" fill="black"/>
            <rect x="80" y="80" width="16" height="16" fill="black"/>
            <rect x="52" y="16" width="16" height="16" fill="black"/>
            <rect x="16" y="52" width="16" height="16" fill="black"/>
            <rect x="88" y="52" width="16" height="16" fill="black"/>
          </>
        )}
        {patternId === 1 && (
          <>
            <rect x="20" y="20" width="16" height="16" fill="black"/>
            <rect x="36" y="20" width="8" height="8" fill="black"/>
            <rect x="52" y="20" width="8" height="8" fill="black"/>
            <rect x="68" y="20" width="8" height="8" fill="black"/>
            <rect x="84" y="20" width="16" height="16" fill="black"/>
            <rect x="20" y="36" width="8" height="8" fill="black"/>
            <rect x="36" y="36" width="8" height="8" fill="black"/>
            <rect x="52" y="36" width="16" height="16" fill="black"/>
            <rect x="84" y="36" width="8" height="8" fill="black"/>
            <rect x="20" y="52" width="16" height="8" fill="black"/>
            <rect x="44" y="52" width="8" height="8" fill="black"/>
            <rect x="68" y="52" width="8" height="8" fill="black"/>
            <rect x="84" y="52" width="16" height="8" fill="black"/>
          </>
        )}
        {patternId === 2 && (
          <>
            <rect x="16" y="16" width="24" height="8" fill="black"/>
            <rect x="16" y="24" width="8" height="16" fill="black"/>
            <rect x="32" y="32" width="16" height="8" fill="black"/>
            <rect x="60" y="16" width="16" height="8" fill="black"/>
            <rect x="84" y="16" width="20" height="8" fill="black"/>
            <rect x="96" y="24" width="8" height="16" fill="black"/>
            <rect x="68" y="32" width="20" height="8" fill="black"/>
            <rect x="32" y="48" width="16" height="8" fill="black"/>
            <rect x="56" y="48" width="16" height="8" fill="black"/>
            <rect x="80" y="48" width="16" height="8" fill="black"/>
          </>
        )}
      </svg>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">QR Codes</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Create and manage QR codes for feedback collection
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700">
                    <i className="fas fa-plus mr-2"></i>
                    Create New QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New QR Code</DialogTitle>
                    <DialogDescription>
                      Create a QR code that will direct customers to your feedback form
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="qr-name">QR Code Name</Label>
                      <Input 
                        id="qr-name" 
                        placeholder="E.g., Checkout Counter"
                        value={qrName}
                        onChange={(e) => setQrName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-form">Select Feedback Form</Label>
                      <Select 
                        value={selectedForm}
                        onValueChange={setSelectedForm}
                      >
                        <SelectTrigger id="qr-form">
                          <SelectValue placeholder="Select a form" />
                        </SelectTrigger>
                        <SelectContent>
                          {forms.map(form => (
                            <SelectItem key={form.id} value={form.id}>
                              {form.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="qr-location">Select Location</Label>
                      <Select 
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger id="qr-location">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map(location => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      onClick={createQRCode}
                      disabled={isCreatingQR}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      {isCreatingQR ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Creating...
                        </>
                      ) : "Create QR Code"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* QR Codes Section */}
            <Tabs defaultValue="grid" className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="grid">
                    <i className="fas fa-th-large mr-2"></i>
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <i className="fas fa-list mr-2"></i>
                    List View
                  </TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <Input 
                    placeholder="Search QR codes..." 
                    className="pl-8"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrCodes.map((qrCode) => (
                    <Card key={qrCode.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        {renderQRCode(qrCode.id)}
                        
                        <h3 className="font-semibold text-lg">{qrCode.name}</h3>
                        <p className="text-sm text-gray-500">{qrCode.location}</p>
                        
                        <div className="mt-2 flex items-center justify-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {qrCode.form}
                          </span>
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-qrcode mr-1"></i>
                            {qrCode.scanCount} scans
                          </span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                          <Button variant="outline" size="sm">
                            <i className="fas fa-download mr-1"></i>
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <i className="fas fa-cog mr-1"></i>
                            Options
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            QR Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Form
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Scans
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {qrCodes.map((qrCode) => (
                          <tr key={qrCode.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-12 h-12 overflow-hidden">
                                {renderQRCode(qrCode.id)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{qrCode.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{qrCode.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {qrCode.form}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {qrCode.scanCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {qrCode.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                  <i className="fas fa-download"></i>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                                  <i className="fas fa-cog"></i>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                  <i className="fas fa-trash-alt"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Usage Tips */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg">QR Code Usage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <i className="fas fa-print text-blue-600"></i>
                      </div>
                      <h3 className="font-medium">Print & Display</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Print your QR codes on cards, posters, or table tents and place them strategically for maximum visibility.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <i className="fas fa-bullhorn text-green-600"></i>
                      </div>
                      <h3 className="font-medium">Promote Scanning</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add a clear call-to-action and consider offering incentives to encourage customers to scan and provide feedback.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <i className="fas fa-chart-bar text-purple-600"></i>
                      </div>
                      <h3 className="font-medium">Track Performance</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Monitor scan rates and feedback submission rates to optimize your QR code placement and forms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
