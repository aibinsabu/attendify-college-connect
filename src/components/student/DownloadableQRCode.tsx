
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

type DownloadableQRCodeProps = {
  value: string;
  size?: number;
  title?: string;
  description?: string;
  filename?: string;
  logoUrl?: string;
};

const DownloadableQRCode: React.FC<DownloadableQRCodeProps> = ({
  value,
  size = 200,
  title = 'Student QR Code',
  description = 'Scan this code for attendance',
  filename = 'student-qrcode',
  logoUrl
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
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
        downloadLink.download = `${filename}.png`;
        
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
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div ref={qrCodeRef} className="bg-white p-2 rounded-lg">
          <QRCodeSVG
            value={value}
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
        <Button onClick={downloadQRCode} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default DownloadableQRCode;
