
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface QRCodeGeneratorProps {
  size?: number;
  logoUrl?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  size = 200,
  logoUrl
}) => {
  const { user } = useAuth();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [qrData] = useState(() => {
    if (!user) return '';
    
    // Generate QR data with user information
    const data = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.rollNo && { rollNo: user.rollNo }),
      ...(user.studentClass && { class: user.studentClass }),
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  });
  
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    
    try {
      // Get SVG element
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (!svgElement) return;
      
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = size;
      canvas.height = size;
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
      
      // Create image from SVG
      const img = new Image();
      img.onload = () => {
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to image
        const pngURL = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = pngURL;
        downloadLink.download = `student-id-qrcode.png`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast.success('QR Code downloaded successfully');
      };
      
      img.src = svgURL;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <p>Please log in to generate your QR code</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your ID Card QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div ref={qrCodeRef} className="bg-white p-3 rounded-lg shadow-sm">
          <QRCodeSVG
            value={qrData}
            size={size}
            level="H" // Highest error correction
            includeMargin={true}
            imageSettings={
              logoUrl ? {
                src: logoUrl,
                height: 24,
                width: 24,
                excavate: true,
              } : undefined
            }
          />
        </div>
        
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground mb-1">
            Scan this code to mark your attendance
          </p>
          <p className="text-xs text-muted-foreground">
            {user.name} • {user.rollNo || 'No Roll No.'}
          </p>
        </div>
        
        <Button onClick={downloadQRCode} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
