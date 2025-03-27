
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  LayoutDashboard, Bus, Map, Timer, Users, Edit, Save, AlertTriangle, 
  CheckCircle, Calendar
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data
const busRouteData = {
  routeId: 'ROUTE-A',
  routeName: 'Route A',
  driverName: 'James Wilson',
  vehicleNo: 'BUS-001',
  capacity: 40,
  currentOccupancy: 32,
  status: 'active',
  schedule: [
    { day: 'Monday to Friday', departureTime: '8:00 AM', returnTime: '5:00 PM' },
    { day: 'Saturday', departureTime: '9:00 AM', returnTime: '1:00 PM' },
  ],
  stops: [
    { id: 'S1', name: 'Central Campus', time: '8:00 AM', isActive: true },
    { id: 'S2', name: 'North Residence', time: '8:15 AM', isActive: true },
    { id: 'S3', name: 'Library', time: '8:25 AM', isActive: true },
    { id: 'S4', name: 'Science Block', time: '8:35 AM', isActive: true },
    { id: 'S5', name: 'Sports Complex', time: '8:45 AM', isActive: true },
  ],
  students: [
    { id: 'STU001', name: 'Alex Thompson', pickup: 'North Residence' },
    { id: 'STU002', name: 'Jessica Martinez', pickup: 'Central Campus' },
    { id: 'STU003', name: 'Ryan Patel', pickup: 'Library' },
  ],
  announcements: [
    { id: 'A1', date: '2023-09-01', message: 'Route will be delayed by 15 minutes tomorrow due to road maintenance.' },
    { id: 'A2', date: '2023-08-25', message: 'New stop added at Engineering Block starting next week.' }
  ]
};

const BusStaffDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [routeData, setRouteData] = useState(busRouteData);
  const [editedStops, setEditedStops] = useState(busRouteData.stops);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handleEditRoute = () => {
    setIsEditingRoute(true);
    setEditedStops([...routeData.stops]);
  };

  const handleSaveRoute = () => {
    setRouteData({ ...routeData, stops: editedStops });
    setIsEditingRoute(false);
    toast.success('Route updated successfully');
  };

  const handleToggleStop = (stopId: string) => {
    setEditedStops(
      editedStops.map(stop => 
        stop.id === stopId ? { ...stop, isActive: !stop.isActive } : stop
      )
    );
  };

  const handleChangeStopTime = (stopId: string, newTime: string) => {
    setEditedStops(
      editedStops.map(stop => 
        stop.id === stopId ? { ...stop, time: newTime } : stop
      )
    );
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }
    
    const announcement = {
      id: `A${routeData.announcements.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      message: newAnnouncement
    };
    
    setRouteData({
      ...routeData,
      announcements: [announcement, ...routeData.announcements]
    });
    
    setNewAnnouncement('');
    setAnnouncementDialogOpen(false);
    toast.success('Announcement added successfully');
  };

  const navigation = [
    { 
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      key: 'dashboard',
      onClick: () => setCurrentTab('dashboard')
    },
    { 
      title: 'Route Management',
      icon: <Map className="h-5 w-5" />,
      key: 'route',
      onClick: () => setCurrentTab('route')
    },
    { 
      title: 'Schedule',
      icon: <Calendar className="h-5 w-5" />,
      key: 'schedule',
      onClick: () => setCurrentTab('schedule')
    },
    { 
      title: 'Students',
      icon: <Users className="h-5 w-5" />,
      key: 'students',
      onClick: () => setCurrentTab('students')
    },
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Route Overview</CardTitle>
          <CardDescription>Your assigned bus route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bus className="h-10 w-10" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{routeData.routeName}</h3>
            <p className="text-muted-foreground">Bus {routeData.vehicleNo}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Driver:</span>
              <span>{routeData.driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={routeData.status === 'active' ? 'default' : 'outline'}>
                {routeData.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span>{routeData.currentOccupancy}/{routeData.capacity} students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route ID:</span>
              <span>{routeData.routeId}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setCurrentTab('route')}
          >
            Manage Route
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Schedule</CardTitle>
          <CardDescription>Current bus timings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 rounded bg-primary/5">
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Next Departure</span>
            </div>
            <div className="text-primary font-medium">8:00 AM</div>
          </div>
          
          <div className="space-y-3">
            {routeData.stops.filter(stop => stop.isActive).map((stop) => (
              <div key={stop.id} className="flex justify-between items-center border-b pb-2">
                <div className="text-sm">{stop.name}</div>
                <div className="text-sm font-medium">{stop.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setCurrentTab('schedule')}
          >
            View Full Schedule
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Announcements</CardTitle>
          <CardDescription>Latest updates for your route</CardDescription>
        </CardHeader>
        <CardContent>
          {routeData.announcements.length > 0 ? (
            <div className="space-y-4">
              {routeData.announcements.slice(0, 2).map((announcement) => (
                <div key={announcement.id} className="border-b pb-3">
                  <div className="text-sm mb-1">{announcement.message}</div>
                  <div className="text-xs text-muted-foreground">{announcement.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No announcements yet
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={() => setAnnouncementDialogOpen(true)}
          >
            Create Announcement
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Route Map</CardTitle>
          <CardDescription>Visual representation of your bus route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Interactive map will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRouteManagement = () => (
    <Card className="card-effect">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Route Management</CardTitle>
            <CardDescription>Manage stops and route details</CardDescription>
          </div>
          {!isEditingRoute ? (
            <Button onClick={handleEditRoute}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Route
            </Button>
          ) : (
            <Button onClick={handleSaveRoute}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Stops Configuration</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stop Name</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Status</TableHead>
                {isEditingRoute && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isEditingRoute ? editedStops : routeData.stops).map((stop) => (
                <TableRow key={stop.id}>
                  <TableCell>{stop.name}</TableCell>
                  <TableCell>
                    {isEditingRoute ? (
                      <Input 
                        value={stop.time} 
                        onChange={(e) => handleChangeStopTime(stop.id, e.target.value)}
                        className="max-w-[120px]"
                      />
                    ) : (
                      stop.time
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditingRoute ? (
                      <Switch 
                        checked={stop.isActive} 
                        onCheckedChange={() => handleToggleStop(stop.id)}
                      />
                    ) : (
                      <Badge variant={stop.isActive ? 'default' : 'outline'}>
                        {stop.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    )}
                  </TableCell>
                  {isEditingRoute && (
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleStop(stop.id)}
                      >
                        {stop.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Route Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Route Name</label>
                <Input value={routeData.routeName} readOnly={!isEditingRoute} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Number</label>
                <Input value={routeData.vehicleNo} readOnly={!isEditingRoute} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Route Status</label>
                {isEditingRoute ? (
                  <Select defaultValue={routeData.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={routeData.status.charAt(0).toUpperCase() + routeData.status.slice(1)} readOnly />
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Driver Name</label>
                <Input value={routeData.driverName} readOnly={!isEditingRoute} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Capacity</label>
                <Input value={routeData.capacity.toString()} readOnly={!isEditingRoute} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Occupancy</label>
                <Input value={routeData.currentOccupancy.toString()} readOnly={!isEditingRoute} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSchedule = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>Bus Schedule</CardTitle>
        <CardDescription>Manage bus timings and schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekday">
          <TabsList>
            <TabsTrigger value="weekday">Weekday</TabsTrigger>
            <TabsTrigger value="weekend">Weekend</TabsTrigger>
            <TabsTrigger value="special">Special Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekday" className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Monday to Friday Schedule</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <div className="font-medium">Morning Departure</div>
                  <div>8:00 AM</div>
                </div>
                
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <div className="font-medium">Evening Return</div>
                  <div>5:00 PM</div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stop</TableHead>
                    <TableHead>Morning Pickup</TableHead>
                    <TableHead>Evening Drop</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeData.stops.filter(stop => stop.isActive).map((stop, i) => (
                    <TableRow key={stop.id}>
                      <TableCell>{stop.name}</TableCell>
                      <TableCell>{stop.time}</TableCell>
                      <TableCell>
                        {/* Calculate evening time by adding 9 hours to morning time */}
                        {(() => {
                          const timeParts = stop.time.match(/(\d+):(\d+)\s*(AM|PM)/);
                          if (timeParts) {
                            let hours = parseInt(timeParts[1]);
                            const minutes = timeParts[2];
                            const period = timeParts[3];
                            
                            if (period === 'AM' && hours !== 12) {
                              hours += 9;
                            } else if (period === 'PM' && hours !== 12) {
                              hours = (hours + 9) % 12;
                            } else if (period === 'AM' && hours === 12) {
                              hours = 9;
                            } else if (period === 'PM' && hours === 12) {
                              hours = 9;
                            }
                            
                            return `${hours}:${minutes} PM`;
                          }
                          return '';
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="weekend" className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Saturday Schedule</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <div className="font-medium">Morning Departure</div>
                  <div>9:00 AM</div>
                </div>
                
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <div className="font-medium">Afternoon Return</div>
                  <div>1:00 PM</div>
                </div>
              </div>
              
              <div className="mt-4 text-center text-muted-foreground">
                No service on Sundays and holidays
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="special" className="pt-4">
            <div className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-2">No Special Events Scheduled</h3>
              <p className="text-muted-foreground">
                There are currently no special event schedules. Special schedules will appear here when available.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Update Schedule
        </Button>
      </CardFooter>
    </Card>
  );

  const renderStudents = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>Students on Route</CardTitle>
        <CardDescription>Manage students assigned to your bus route</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pickup Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routeData.students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.pickup}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm">Active</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Announcement Dialog
  const renderAnnouncementDialog = () => (
    <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Post an announcement for students and faculty regarding your bus route
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="announcement" className="text-sm font-medium">Announcement Message</label>
            <Textarea
              id="announcement"
              placeholder="Type your announcement here..."
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Announcement Type</label>
            <Select defaultValue="info">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="delay">Delay</SelectItem>
                <SelectItem value="route-change">Route Change</SelectItem>
                <SelectItem value="cancellation">Cancellation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddAnnouncement}>Post Announcement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout
      title={
        currentTab === 'dashboard' ? 'Bus Staff Dashboard' : 
        currentTab === 'route' ? 'Route Management' : 
        currentTab === 'schedule' ? 'Bus Schedule' : 
        'Students on Route'
      }
      currentTab={currentTab}
      navigation={navigation}
    >
      {currentTab === 'dashboard' && renderDashboard()}
      {currentTab === 'route' && renderRouteManagement()}
      {currentTab === 'schedule' && renderSchedule()}
      {currentTab === 'students' && renderStudents()}
      
      {renderAnnouncementDialog()}
    </DashboardLayout>
  );
};

export default BusStaffDashboard;
