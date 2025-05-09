import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QRCode = {
  id: string;
  name: string;
  location: string;
  scanCount: number;
};

type QRCodesOverviewProps = {
  qrCodes: QRCode[];
  onCreateNew: () => void;
  onManageAll: () => void;
};

export function QRCodesOverview({ 
  qrCodes = defaultQRCodes,
  onCreateNew = () => {},
  onManageAll = () => {}
}: Partial<QRCodesOverviewProps>) {
  // Create a basic QR code SVG pattern for display purposes
  const renderQRCode = (id: string) => {
    // Different patterns for different QR codes
    const patternId = parseInt(id) % 3;
    
    if (patternId === 0) {
      return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white">
          <rect width="64" height="64" fill="white"/>
          <rect x="8" y="8" width="12" height="12" fill="black"/>
          <rect x="44" y="8" width="12" height="12" fill="black"/>
          <rect x="8" y="44" width="12" height="12" fill="black"/>
          <rect x="24" y="24" width="16" height="16" fill="black"/>
          <rect x="44" y="44" width="8" height="8" fill="black"/>
          <rect x="28" y="8" width="8" height="8" fill="black"/>
          <rect x="8" y="28" width="8" height="8" fill="black"/>
          <rect x="48" y="28" width="8" height="8" fill="black"/>
        </svg>
      );
    } else if (patternId === 1) {
      return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white">
          <rect width="64" height="64" fill="white"/>
          <rect x="12" y="12" width="8" height="8" fill="black"/>
          <rect x="20" y="12" width="4" height="4" fill="black"/>
          <rect x="28" y="12" width="4" height="4" fill="black"/>
          <rect x="36" y="12" width="4" height="4" fill="black"/>
          <rect x="44" y="12" width="8" height="8" fill="black"/>
          <rect x="12" y="20" width="4" height="4" fill="black"/>
          <rect x="20" y="20" width="4" height="4" fill="black"/>
          <rect x="28" y="20" width="8" height="8" fill="black"/>
          <rect x="44" y="20" width="4" height="4" fill="black"/>
          <rect x="12" y="28" width="8" height="4" fill="black"/>
          <rect x="24" y="28" width="4" height="4" fill="black"/>
          <rect x="36" y="28" width="4" height="4" fill="black"/>
          <rect x="44" y="28" width="8" height="4" fill="black"/>
        </svg>
      );
    } else {
      return (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white">
          <rect width="64" height="64" fill="white"/>
          <rect x="8" y="8" width="12" height="4" fill="black"/>
          <rect x="8" y="12" width="4" height="8" fill="black"/>
          <rect x="16" y="16" width="8" height="4" fill="black"/>
          <rect x="32" y="8" width="8" height="4" fill="black"/>
          <rect x="44" y="8" width="12" height="4" fill="black"/>
          <rect x="52" y="12" width="4" height="8" fill="black"/>
          <rect x="36" y="16" width="12" height="4" fill="black"/>
          <rect x="16" y="24" width="8" height="4" fill="black"/>
          <rect x="28" y="24" width="8" height="4" fill="black"/>
          <rect x="40" y="24" width="8" height="4" fill="black"/>
        </svg>
      );
    }
  };
  
  return (
    <Card className="bg-white">
      <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="font-semibold text-gray-800">Your QR Codes</CardTitle>
        <Button 
          variant="link" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium p-0"
          onClick={onManageAll}
        >
          Manage All
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          {qrCodes.map((qrCode) => (
            <div key={qrCode.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                {renderQRCode(qrCode.id)}
                
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{qrCode.name}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{qrCode.location}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-green-600">{qrCode.scanCount} scans</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onCreateNew}
          >
            <i className="fas fa-plus mr-2"></i>
            Create New QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const defaultQRCodes: QRCode[] = [
  {
    id: '1',
    name: 'Main Register',
    location: 'Downtown Branch',
    scanCount: 456
  },
  {
    id: '2',
    name: 'Checkout Counter',
    location: 'Mall Store',
    scanCount: 382
  },
  {
    id: '3',
    name: 'Service Desk',
    location: 'Airport Kiosk',
    scanCount: 178
  }
];
