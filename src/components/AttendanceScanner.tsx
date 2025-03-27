
import React, { useState, useRef } from 'react';
import { Camera, QrCode, Barcode, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface AttendanceScannerProps {
  onAttendanceMarked: (studentId: string, method: 'scan' | 'manual', evidence?: string) => void;
}

const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ onAttendanceMarked }) => {
  const [activeTab, setActiveTab] = useState('scan');
  const [manualCode, setManualCode] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [evidenceData, setEvidenceData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // Simulate scanning functionality
  const handleScan = () => {
    const mockStudentId = 'STU' + Math.floor(10000 + Math.random() * 90000).toString();
    toast.success('ID scanned successfully!');
    onAttendanceMarked(mockStudentId, 'scan');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim() && evidenceData) {
      onAttendanceMarked(manualCode, 'manual', evidenceData);
      setManualCode('');
      setEvidenceData(null);
      toast.success('Attendance marked manually');
    } else {
      toast.error('Please provide both code and evidence');
    }
  };

  const startCamera = async () => {
    if (!videoRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error('Unable to access camera');
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (!stream) return;
    
    // Start a countdown
    setCountdown(15);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    
    mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
      chunksRef.current.push(e.data);
    });
    
    mediaRecorderRef.current.addEventListener('stop', () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const dataUrl = URL.createObjectURL(blob);
      setEvidenceData(dataUrl);
      setIsRecording(false);
    });
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
    
    // Auto stop after 15 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }, 15000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setEvidenceData(dataUrl);
      toast.success('Photo captured');
    }
  };

  // Handle tab changes
  React.useEffect(() => {
    if (activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          Attendance Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">
              <QrCode className="mr-2 h-4 w-4" />
              Scan ID Card
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Barcode className="mr-2 h-4 w-4" />
              Enter Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="mt-4">
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-lg"></div>
                </div>
              </div>
              <Button onClick={handleScan} className="w-full">
                <QrCode className="mr-2 h-4 w-4" /> Scan ID Card
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="mt-4">
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="manualCode" className="text-sm font-medium">
                    Student ID/Code
                  </label>
                  <Input
                    id="manualCode"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter ID from card"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Evidence (Required)
                  </label>
                  
                  {evidenceData ? (
                    <div className="relative rounded-lg overflow-hidden border mb-2">
                      {evidenceData.startsWith('data:image') ? (
                        <img 
                          src={evidenceData} 
                          alt="Evidence" 
                          className="w-full h-auto" 
                        />
                      ) : (
                        <video 
                          src={evidenceData} 
                          controls 
                          className="w-full h-auto"
                        ></video>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        type="button"
                        onClick={() => setEvidenceData(null)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {isRecording && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full animate-pulse flex items-center">
                          <span className="h-2 w-2 bg-white rounded-full mr-1"></span>
                          REC {countdown}s
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {!evidenceData && !isRecording && (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={takePhoto}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={startRecording}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Record Video
                        </Button>
                      </>
                    )}
                    
                    {isRecording && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        className="flex-1"
                        onClick={stopRecording}
                      >
                        Stop Recording ({countdown}s)
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!manualCode || !evidenceData}
                >
                  Mark Attendance
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendanceScanner;
