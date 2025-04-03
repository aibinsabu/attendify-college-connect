import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import AttendanceScanner from '@/components/AttendanceScanner';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, ClipboardCheck, LayoutDashboard, CheckCircle, XCircle, 
  BookOpen, Map, BarChart3, Bus
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Fetch attendance data
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/attendance/student/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      return response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Fetch marks data
  const { data: marksData, isLoading: marksLoading } = useQuery({
    queryKey: ['marks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/marks/student/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch marks data');
      }
      return response.json();
    },
    enabled: !!user?.id,
  });
  
  // Fetch bus route data
  const { data: busRouteData, isLoading: busRouteLoading } = useQuery({
    queryKey: ['busroute'],
    queryFn: async () => {
      const response = await fetch('/api/busroutes');
      if (!response.ok) {
        throw new Error('Failed to fetch bus route data');
      }
      const routes = await response.json();
      return routes[0]; // Just use the first route for now
    },
  });
  
  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    
    const totalRecords = attendanceData.length;
    const presentRecords = attendanceData.filter(record => record.status === 'present').length;
    
    return Math.round((presentRecords / totalRecords) * 100);
  };
  
  const attendancePercentage = calculateAttendancePercentage();
  
  const handleAttendanceMarked = (studentId: string, method: 'scan' | 'manual', evidence?: string) => {
    toast.success('Attendance marked successfully');
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const navigation = [
    { 
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      key: 'dashboard',
      onClick: () => setCurrentTab('dashboard')
    },
    { 
      title: 'My Attendance',
      icon: <ClipboardCheck className="h-5 w-5" />,
      key: 'attendance',
      onClick: () => setCurrentTab('attendance')
    },
    { 
      title: 'Academic Performance',
      icon: <BookOpen className="h-5 w-5" />,
      key: 'marks',
      onClick: () => setCurrentTab('marks')
    },
    { 
      title: 'Bus Route',
      icon: <Bus className="h-5 w-5" />,
      key: 'busroute',
      onClick: () => setCurrentTab('busroute')
    },
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Profile Card */}
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">My Profile</CardTitle>
          <CardDescription>Your student information</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarFallback className="text-2xl">{studentData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{studentData.name}</h3>
          <p className="text-muted-foreground mb-4">{studentData.rollNo}</p>
          
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span>{studentData.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch:</span>
              <span>{studentData.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="truncate max-w-[150px]">{studentData.email}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setQrDialogOpen(true)}
          >
            Show ID Card
          </Button>
        </CardFooter>
      </Card>
      
      {/* Attendance Card */}
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Classes</CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['Introduction to Programming (9:00 AM)', 'Data Structures (11:00 AM)', 'Computer Networks (2:00 PM)'].map((className, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="text-sm">{className}</div>
              <div>
                {i === 0 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Attended</span>
                  </div>
                ) : i === 1 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Attended</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Absent</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex justify-between mb-1 text-sm">
              <span>Your Attendance</span>
              <span className={getAttendanceColor(studentData.attendancePercentage)}>
                {studentData.attendancePercentage}%
              </span>
            </div>
            <Progress value={studentData.attendancePercentage} className="h-2" />
          </div>
        </CardFooter>
      </Card>
      
      {/* Mark Attendance Card */}
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mark Attendance</CardTitle>
          <CardDescription>Scan your ID card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AttendanceScanner onAttendanceMarked={handleAttendanceMarked} />
        </CardContent>
      </Card>
      
      {/* Marks Card */}
      <Card className="card-effect lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Academic Summary</CardTitle>
          <CardDescription>Your latest performance across subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {studentData.marks.map((subject, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{subject.subject}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Midterm</span>
                      <span>{subject.midterm}/100</span>
                    </div>
                    <Progress value={subject.midterm} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Assignments</span>
                      <span>{subject.assignment}/100</span>
                    </div>
                    <Progress value={subject.assignment} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Final</span>
                      <span>{subject.final}/100</span>
                    </div>
                    <Progress value={subject.final} className="h-1" />
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-medium">{subject.total}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAttendance = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>My Attendance Records</CardTitle>
        <CardDescription>View your complete attendance history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Overall Attendance</h4>
            <div className={`text-sm font-medium ${getAttendanceColor(studentData.attendancePercentage)}`}>
              {studentData.attendancePercentage}%
            </div>
          </div>
          <Progress value={studentData.attendancePercentage} className="h-2" />
        </div>
        
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">
              <Calendar className="h-4 w-4 mr-2" />
              Daily View
            </TabsTrigger>
            <TabsTrigger value="subject">
              <BookOpen className="h-4 w-4 mr-2" />
              By Subject
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.latestAttendance.map((record, i) => (
                  <TableRow key={i}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>
                      {record.status === 'present' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Present</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>Absent</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="subject">
            <div className="space-y-6">
              {[
                { subject: 'Introduction to Programming', attendance: 90 },
                { subject: 'Data Structures', attendance: 85 },
                { subject: 'Computer Networks', attendance: 78 },
              ].map((subject, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">{subject.subject}</h4>
                    <div className={`text-sm ${getAttendanceColor(subject.attendance)}`}>
                      {subject.attendance}%
                    </div>
                  </div>
                  <Progress value={subject.attendance} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {studentData.attendancePercentage}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classes Attended</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">42</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classes Missed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">7</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderMarks = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
        <CardDescription>View your grades and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Semester</TabsTrigger>
            <TabsTrigger value="all">All Semesters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Midterm</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead>Final</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.marks.map((subject, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.midterm}/100</TableCell>
                    <TableCell>{subject.assignment}/100</TableCell>
                    <TableCell>{subject.final}/100</TableCell>
                    <TableCell>{subject.total}/100</TableCell>
                    <TableCell>{getGrade(subject.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Semester Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">GPA</div>
                  <div className="text-2xl font-bold">3.7</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Credits Completed</div>
                  <div className="text-2xl font-bold">16</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Rank in Class</div>
                  <div className="text-2xl font-bold">12<span className="text-sm text-muted-foreground">/120</span></div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="text-center py-8 text-muted-foreground">
              Previous semester data will be available soon.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderBusRoute = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>Bus Route Information</CardTitle>
        <CardDescription>View your assigned bus route and schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary">
            <Bus className="mr-2 h-4 w-4" />
            <span className="font-medium">{studentData.busRoute.number}</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-muted"></div>
          
          {studentData.busRoute.stops.map((stop, i) => (
            <div key={i} className="flex mb-6 relative">
              <div className={`z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                stop.isNext ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Map className="h-5 w-5" />
              </div>
              
              <div className="ml-4 flex-1">
                <div className={`font-medium ${stop.isNext ? 'text-primary' : ''}`}>
                  {stop.name}
                </div>
                <div className="text-sm text-muted-foreground">{stop.time}</div>
                
                {stop.isNext && (
                  <div className="mt-2 text-xs inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Next Stop
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Map className="mr-2 h-4 w-4" />
          View Full Route Map
        </Button>
      </CardFooter>
    </Card>
  );

  const renderQrDialog = () => (
    <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your ID Card</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">Campus ID</h2>
            <p className="text-muted-foreground text-sm">Student Identification</p>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
              <span className="text-2xl font-bold">{studentData.name.charAt(0)}</span>
            </div>
            <div>
              <div className="font-bold">{studentData.name}</div>
              <div className="text-sm text-muted-foreground">{studentData.rollNo}</div>
              <div className="text-sm">{studentData.class}</div>
            </div>
          </div>
          
          <div className="border border-dashed p-4 rounded-lg mb-4 flex justify-center">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STUDENT-ID-001" 
              alt="QR Code" 
              className="w-40 h-40"
            />
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{studentData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch:</span>
              <span className="font-medium">{studentData.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="font-medium">31 May 2026</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button>Download ID Card</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout
      title={
        currentTab === 'dashboard' ? 'Student Dashboard' : 
        currentTab === 'attendance' ? 'My Attendance' : 
        currentTab === 'marks' ? 'Academic Performance' : 
        'Bus Route'
      }
      currentTab={currentTab}
      navigation={navigation}
    >
      {/* Show loading state when data is being fetched */}
      {(attendanceLoading || marksLoading || busRouteLoading) && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Show content when data is loaded */}
      {!attendanceLoading && !marksLoading && !busRouteLoading && (
        <>
          {currentTab === 'dashboard' && renderDashboard()}
          {currentTab === 'attendance' && renderAttendance()}
          {currentTab === 'marks' && renderMarks()}
          {currentTab === 'busroute' && renderBusRoute()}
        </>
      )}
      
      {renderQrDialog()}
    </DashboardLayout>
  );
};

const getGrade = (marks: number) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
};

export default StudentDashboard;
