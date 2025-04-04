
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { API } from '@/services/api';
import { Edit, Save, Plus, Trash, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const TimetableEditor = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isEditing, setIsEditing] = useState(false);
  const [timetables, setTimetables] = useState<any[]>([]);
  const [currentTimetable, setCurrentTimetable] = useState<any>(null);
  const [periodDialogOpen, setPeriodDialogOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    subject: '',
    teacher: '',
    startTime: '08:00 AM',
    endTime: '09:00 AM'
  });
  const [editingPeriodIndex, setEditingPeriodIndex] = useState<number | null>(null);
  const [faculty, setFaculty] = useState<any[]>([]);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const classes = [
    '10A', '10B', '11A', '11B', '12A', '12B',
    'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'
  ];

  useEffect(() => {
    loadTimetables();
    loadFaculty();
  }, []);
  
  useEffect(() => {
    if (selectedClass && selectedDay) {
      const found = timetables.find(tt => tt.class === selectedClass && tt.day === selectedDay);
      setCurrentTimetable(found || null);
    }
  }, [selectedClass, selectedDay, timetables]);
  
  const loadTimetables = async () => {
    try {
      const data = await API.timeTable.getAllTimetables();
      setTimetables(data);
      
      // If we have timetables and nothing is selected yet, select the first one
      if (data.length > 0 && !selectedClass) {
        setSelectedClass(data[0].class);
      }
    } catch (error) {
      console.error('Failed to load timetables:', error);
      toast.error('Failed to load timetable data');
    }
  };
  
  const loadFaculty = async () => {
    try {
      const data = await API.user.getAllUsers('faculty');
      setFaculty(data);
    } catch (error) {
      console.error('Failed to load faculty:', error);
    }
  };
  
  const handleSaveTimetable = async () => {
    try {
      if (!currentTimetable) {
        // Create new timetable
        if (!selectedClass || !selectedDay) {
          toast.error('Please select a class and day');
          return;
        }
        
        const newTimetable = {
          class: selectedClass,
          day: selectedDay,
          periods: []
        };
        
        const created = await API.timeTable.createTimetable(newTimetable);
        setTimetables([...timetables, created]);
        setCurrentTimetable(created);
      } else {
        // Update existing timetable
        const updated = await API.timeTable.updateTimetable(currentTimetable._id, currentTimetable);
        
        setTimetables(timetables.map(tt => 
          tt._id === updated._id ? updated : tt
        ));
      }
      
      setIsEditing(false);
      toast.success('Timetable saved successfully');
    } catch (error) {
      console.error('Failed to save timetable:', error);
      toast.error('Failed to save timetable');
    }
  };
  
  const handleAddPeriod = () => {
    setNewPeriod({
      subject: '',
      teacher: '',
      startTime: '08:00 AM',
      endTime: '09:00 AM'
    });
    setEditingPeriodIndex(null);
    setPeriodDialogOpen(true);
  };
  
  const handleEditPeriod = (index: number) => {
    if (!currentTimetable || !currentTimetable.periods) return;
    
    const period = currentTimetable.periods[index];
    setNewPeriod({
      subject: period.subject,
      teacher: period.teacher,
      startTime: period.startTime,
      endTime: period.endTime
    });
    setEditingPeriodIndex(index);
    setPeriodDialogOpen(true);
  };
  
  const handleDeletePeriod = (index: number) => {
    if (!currentTimetable || !currentTimetable.periods) return;
    
    const updatedPeriods = [...currentTimetable.periods];
    updatedPeriods.splice(index, 1);
    
    setCurrentTimetable({
      ...currentTimetable,
      periods: updatedPeriods
    });
  };
  
  const handleSavePeriod = () => {
    if (!currentTimetable) return;
    
    const { subject, teacher, startTime, endTime } = newPeriod;
    
    if (!subject || !teacher || !startTime || !endTime) {
      toast.error('All fields are required');
      return;
    }
    
    let updatedPeriods;
    
    if (editingPeriodIndex !== null) {
      // Edit existing period
      updatedPeriods = [...(currentTimetable.periods || [])];
      updatedPeriods[editingPeriodIndex] = newPeriod;
    } else {
      // Add new period
      updatedPeriods = [...(currentTimetable.periods || []), newPeriod];
    }
    
    // Sort periods by start time
    updatedPeriods.sort((a, b) => {
      return new Date(`1970/01/01 ${a.startTime}`).getTime() - new Date(`1970/01/01 ${b.startTime}`).getTime();
    });
    
    setCurrentTimetable({
      ...currentTimetable,
      periods: updatedPeriods
    });
    
    setPeriodDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Timetable Management</CardTitle>
            <CardDescription>Create and manage class timetables</CardDescription>
          </div>
          
          {isEditing ? (
            <Button onClick={handleSaveTimetable}>
              <Save className="mr-2 h-4 w-4" />
              Save Timetable
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Timetable
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Select Day</label>
            <Tabs defaultValue={selectedDay} onValueChange={setSelectedDay} className="w-full">
              <TabsList className="w-full overflow-x-auto flex-nowrap">
                {days.map(day => (
                  <TabsTrigger key={day} value={day} className="flex-1">{day}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {selectedClass && selectedDay ? (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedClass} - {selectedDay}
              </h3>
              
              {isEditing && (
                <Button onClick={handleAddPeriod} size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Period
                </Button>
              )}
            </div>
            
            {currentTimetable && currentTimetable.periods && currentTimetable.periods.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    {isEditing && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTimetable.periods.map((period: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {period.startTime} - {period.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{period.subject}</TableCell>
                      <TableCell>
                        {period.teacher && faculty.find(f => f._id === period.teacher)?.name || period.teacher}
                      </TableCell>
                      {isEditing && (
                        <TableCell className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPeriod(index)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePeriod(index)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 bg-muted/30 rounded-md">
                {isEditing ? (
                  <div>
                    <p className="text-muted-foreground mb-4">No periods added yet</p>
                    <Button onClick={handleAddPeriod} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Period
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No timetable has been created for this class and day. Switch to edit mode to create one.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6 bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Select a class and day to view or edit the timetable</p>
          </div>
        )}
        
        {/* Add/Edit Period Dialog */}
        <Dialog open={periodDialogOpen} onOpenChange={setPeriodDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPeriodIndex !== null ? "Edit Period" : "Add New Period"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input
                  id="subject"
                  value={newPeriod.subject}
                  onChange={(e) => setNewPeriod({...newPeriod, subject: e.target.value})}
                  placeholder="Subject name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="teacher" className="text-sm font-medium">Teacher</label>
                <Select 
                  value={newPeriod.teacher} 
                  onValueChange={(value) => setNewPeriod({...newPeriod, teacher: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculty.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                  <Input
                    id="startTime"
                    value={newPeriod.startTime}
                    onChange={(e) => setNewPeriod({...newPeriod, startTime: e.target.value})}
                    placeholder="e.g. 08:00 AM"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                  <Input
                    id="endTime"
                    value={newPeriod.endTime}
                    onChange={(e) => setNewPeriod({...newPeriod, endTime: e.target.value})}
                    placeholder="e.g. 09:00 AM"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setPeriodDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSavePeriod}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TimetableEditor;
