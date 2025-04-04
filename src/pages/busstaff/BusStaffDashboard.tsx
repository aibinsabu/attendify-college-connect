
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  LayoutDashboard, Bus, Map, Timer, Users, Edit, Save, AlertTriangle, 
  CheckCircle, Calendar, Megaphone
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
import { API } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import BusAnnouncementForm from '@/components/busstaff/BusAnnouncementForm';

const BusStaffDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editedStops, setEditedStops] = useState<any[]>([]);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [newSchedule, setNewSchedule] = useState({ day: '', departureTime: '', returnTime: '' });
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Load route data on component mount
  useEffect(() => {
    loadRouteData();
  }, []);
  
  const loadRouteData = async () => {
    try {
      setIsLoading(true);
      const routes = await API.busRoute.getAllRoutes();
      
      // Select first route or return if none exist
      if (!routes || routes.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setRouteData(routes[0]);
      setEditedStops(routes[0].stops || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load route data:', error);
      toast.error('Failed to load bus route data');
      setIsLoading(false);
    }
  };

  const handleEditRoute = () => {
    setIsEditingRoute(true);
    setEditedStops([...(routeData.stops || [])]);
  };

  const handleSaveRoute = async () => {
    try {
      const updatedRoute = {
        ...routeData,
        stops: editedStops,
        updatedAt: new Date()
      };
      
      const saved = await API.busRoute.updateRoute(routeData._id, updatedRoute);
      setRouteData(saved);
      setIsEditingRoute(false);
      toast.success('Route updated successfully');
    } catch (error) {
      console.error('Failed to update route:', error);
      toast.error('Failed to update route');
    }
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

  const handleAddAnnouncement = async () => {
    try {
      if (!newAnnouncement.trim()) {
        toast.error('Please enter an announcement message');
        return;
      }
      
      if (!routeData?._id) {
        toast.error('No route selected');
        return;
      }
      
      const userId = user?._id;
      if (!userId) {
        toast.error('You must be logged in to create announcements');
        return;
      }
      
      await API.busRoute.addAnnouncement(routeData._id, {
        title: 'Route Announcement',
        message: newAnnouncement,
        createdBy: userId,
        priority: 'medium'
      });
      
      // Reload route data to get updated announcements
      await loadRouteData();
      
      setNewAnnouncement('');
      setAnnouncementDialogOpen(false);
      toast.success('Announcement added successfully');
    } catch (error) {
      console.error('Failed to add announcement:', error);
      toast.error('Failed to add announcement');
    }
  };
  
  const handleAddSchedule = async () => {
    try {
      if (!newSchedule.day || !newSchedule.departureTime || !newSchedule.returnTime) {
        toast.error('All schedule fields are required');
        return;
      }
      
      if (!routeData?.schedule) {
        routeData.schedule = [];
      }
      
      // Add new schedule
      const updatedSchedule = [
        ...routeData.schedule, 
        { ...newSchedule }
      ];
      
      // Update route with new schedule
      const updatedRoute = await API.busRoute.updateRoute(routeData._id, {
        ...routeData,
        schedule: updatedSchedule
      });
      
      setRouteData(updatedRoute);
      setNewSchedule({ day: '', departureTime: '', returnTime: '' });
      setScheduleDialogOpen(false);
      toast.success('Schedule added successfully');
    } catch (error) {
      console.error('Failed to add schedule:', error);
      toast.error('Failed to add schedule');
    }
  };
  
  const handleDeleteSchedule = async (index: number) => {
    try {
      const updatedSchedule = [...routeData.schedule];
      updatedSchedule.splice(index, 1);
      
      // Update route with new schedule
      const updatedRoute = await API.busRoute.updateRoute(routeData._id, {
        ...routeData,
        schedule: updatedSchedule
      });
      
      setRouteData(updatedRoute);
      toast.success('Schedule removed');
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error('Failed to remove schedule');
    }
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
    { 
      title: 'Announcements',
      icon: <Megaphone className="h-5 w-5" />,
      key: 'announcements',
      onClick: () => setCurrentTab('announcements')
    },
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <Card className="card-effect lg:col-span-3">
          <CardContent className="p-6 text-center">
            <p>Loading route information...</p>
          </CardContent>
        </Card>
      ) : !routeData ? (
        <Card className="card-effect lg:col-span-3">
          <CardContent className="p-6 text-center">
            <p>No active bus routes found. Please contact an administrator.</p>
          </CardContent>
        </Card>
      ) : (
        <>
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
                <h3 className="text-xl font-bold">{routeData.name}</h3>
                <p className="text-muted-foreground">Bus {routeData.vehicleNo || routeData.routeNumber}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span>{routeData.driver || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={routeData.active ? 'default' : 'outline'}>
                    {routeData.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{routeData.currentOccupancy || 0}/{routeData.capacity || 40} students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route ID:</span>
                  <span>{routeData.routeNumber || routeData._id}</span>
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
              {routeData.schedule && routeData.schedule.length > 0 ? (
                <>
                  <div className="flex items-center justify-between p-2 rounded bg-primary/5">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">Today's Schedule</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentTab('schedule')}
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {routeData.schedule.map((s: any, i: number) => (
                      <div key={i} className="border-b pb-2">
                        <div className="font-medium">{s.day}</div>
                        <div className="text-sm flex justify-between mt-1">
                          <span>Departure: {s.departureTime}</span>
                          <span>Return: {s.returnTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No schedule configured</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setCurrentTab('schedule')}
                  >
                    Add Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="card-effect lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Announcements</CardTitle>
              <CardDescription>Latest updates for your route</CardDescription>
            </CardHeader>
            <CardContent>
              {routeData.announcements && routeData.announcements.length > 0 ? (
                <div className="space-y-4">
                  {routeData.announcements.slice(0, 2).map((announcement: any, index: number) => (
                    <div key={index} className="border-b pb-3">
                      <div className="text-sm mb-1">{announcement.message || announcement.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </div>
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
                  <p className="text-muted-foreground mb-2">Interactive map showing your route and stops</p>
                  <p className="text-xs text-muted-foreground">From: {routeData.stops?.[0]?.name || 'Starting Point'}</p>
                  <p className="text-xs text-muted-foreground">To: {routeData.stops?.[routeData.stops?.length-1]?.name || 'Destination'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
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
        {isLoading ? (
          <div className="text-center p-6">
            <p>Loading route information...</p>
          </div>
        ) : !routeData ? (
          <div className="text-center p-6">
            <p>No active bus routes found. Please contact an administrator.</p>
          </div>
        ) : (
          <>
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
                  {(isEditingRoute ? editedStops : routeData.stops || []).map((stop: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{stop.name}</TableCell>
                      <TableCell>
                        {isEditingRoute ? (
                          <Input 
                            value={stop.time} 
                            onChange={(e) => handleChangeStopTime(stop.id || index, e.target.value)}
                            className="max-w-[120px]"
                          />
                        ) : (
                          stop.time
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditingRoute ? (
                          <Switch 
                            checked={stop.isActive !== false} 
                            onCheckedChange={() => handleToggleStop(stop.id || index)}
                          />
                        ) : (
                          <Badge variant={stop.isActive !== false ? 'default' : 'outline'}>
                            {stop.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </TableCell>
                      {isEditingRoute && (
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleStop(stop.id || index)}
                          >
                            {stop.isActive !== false ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {(isEditingRoute ? editedStops : routeData.stops || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isEditingRoute ? 4 : 3} className="text-center py-4">
                        No stops configured for this route
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
  
  const renderScheduleManagement = () => (
    <Card className="card-effect">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Schedule Management</CardTitle>
            <CardDescription>Configure bus timings and schedules</CardDescription>
          </div>
          <Button onClick={() => setScheduleDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-6">
            <p>Loading schedule information...</p>
          </div>
        ) : !routeData ? (
          <div className="text-center p-6">
            <p>No active bus routes found. Please contact an administrator.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {routeData.schedule && routeData.schedule.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Days</TableHead>
                    <TableHead>Departure Time</TableHead>
                    <TableHead>Return Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeData.schedule.map((schedule: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{schedule.day}</TableCell>
                      <TableCell>{schedule.departureTime}</TableCell>
                      <TableCell>{schedule.returnTime}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteSchedule(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-md">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No schedules configured for this route</p>
                <Button onClick={() => setScheduleDialogOpen(true)}>
                  Add First Schedule
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  const renderStudentsList = () => (
    <Card className="card-effect">
      <CardHeader>
        <CardTitle>Students on Route</CardTitle>
        <CardDescription>Manage students assigned to this route</CardDescription>
      </CardHeader>
      <CardContent>
        {/* We would need to fetch student data linked to this route */}
        <div className="text-center py-6 text-muted-foreground">
          Student management will be implemented in a future update
        </div>
      </CardContent>
    </Card>
  );
  
  const renderAnnouncementsPage = () => (
    <>
      <Card className="card-effect mb-6">
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>Send announcements to students on your bus route</CardDescription>
        </CardHeader>
        <CardContent>
          {routeData ? (
            <BusAnnouncementForm 
              routeId={routeData._id} 
              onSuccess={loadRouteData}
            />
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No active bus route found
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="card-effect">
        <CardHeader>
          <CardTitle>Past Announcements</CardTitle>
          <CardDescription>View all previous announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {routeData && routeData.announcements && routeData.announcements.length > 0 ? (
            <div className="space-y-4 divide-y">
              {routeData.announcements.map((announcement: any, index: number) => (
                <div key={index} className={index > 0 ? "pt-4" : ""}>
                  <h4 className="font-medium">{announcement.title || "Route Announcement"}</h4>
                  <p className="text-sm mt-1">{announcement.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(announcement.createdAt).toLocaleString()}
                    </span>
                    <Badge variant={
                      announcement.priority === 'high' ? 'destructive' : 
                      announcement.priority === 'medium' ? 'default' : 'outline'
                    }>
                      {announcement.priority || 'normal'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No announcements have been made yet
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
  
  // Add Schedule Dialog
  const renderScheduleDialog = () => (
    <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bus Schedule</DialogTitle>
          <DialogDescription>
            Create a new schedule for your bus route
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="day" className="text-sm font-medium">Days</label>
            <Input 
              id="day" 
              value={newSchedule.day}
              onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
              placeholder="e.g. Monday to Friday, or Saturday" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="departureTime" className="text-sm font-medium">Departure Time</label>
            <Input 
              id="departureTime" 
              value={newSchedule.departureTime}
              onChange={(e) => setNewSchedule({...newSchedule, departureTime: e.target.value})}
              placeholder="e.g. 8:00 AM" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="returnTime" className="text-sm font-medium">Return Time</label>
            <Input 
              id="returnTime" 
              value={newSchedule.returnTime}
              onChange={(e) => setNewSchedule({...newSchedule, returnTime: e.target.value})}
              placeholder="e.g. 4:00 PM" 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSchedule}>Add Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Add Announcement Dialog
  const renderAnnouncementDialog = () => (
    <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bus Announcement</DialogTitle>
          <DialogDescription>
            Send an announcement to students on this bus route
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="announcement" className="text-sm font-medium">Announcement Message</label>
            <Textarea
              id="announcement"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Enter your announcement here..."
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddAnnouncement}>Create Announcement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout
      title={
        currentTab === 'dashboard' ? 'Bus Staff Dashboard' : 
        currentTab === 'route' ? 'Route Management' :
        currentTab === 'schedule' ? 'Schedule Management' :
        currentTab === 'students' ? 'Students on Route' :
        'Route Announcements'
      }
      currentTab={currentTab}
      navigation={navigation}
    >
      {currentTab === 'dashboard' && renderDashboard()}
      {currentTab === 'route' && renderRouteManagement()}
      {currentTab === 'schedule' && renderScheduleManagement()}
      {currentTab === 'students' && renderStudentsList()}
      {currentTab === 'announcements' && renderAnnouncementsPage()}
      {renderAnnouncementDialog()}
      {renderScheduleDialog()}
    </DashboardLayout>
  );
};

export default BusStaffDashboard;
