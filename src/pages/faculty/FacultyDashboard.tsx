
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AttendanceScanner from '@/components/AttendanceScanner';
import { 
  Users, Search, Edit, Clock, LayoutDashboard, ClipboardCheck, UserSearch, 
  Calendar, BookOpen, CheckCircle, XCircle, User
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock data
const mockStudents = [
  { 
    id: 'S001', 
    name: 'Alex Thompson', 
    rollNo: 'CS22001', 
    class: 'Computer Science', 
    batch: '2022-2026',
    email: 'alex.t@example.edu',
    dob: '2001-05-12',
    attendance: 85,
    marks: { midterm: 78, assignment: 82, final: 88 },
    attendanceHistory: [
      { date: '2023-09-01', status: 'present' },
      { date: '2023-09-02', status: 'present' },
      { date: '2023-09-03', status: 'absent' },
      { date: '2023-09-04', status: 'present' },
      { date: '2023-09-05', status: 'present' },
    ]
  },
  { 
    id: 'S002', 
    name: 'Jessica Martinez', 
    rollNo: 'EE21002', 
    class: 'Electrical Engineering', 
    batch: '2021-2025',
    email: 'jessica.m@example.edu',
    dob: '2000-03-25',
    attendance: 92,
    marks: { midterm: 85, assignment: 88, final: 91 },
    attendanceHistory: [
      { date: '2023-09-01', status: 'present' },
      { date: '2023-09-02', status: 'present' },
      { date: '2023-09-03', status: 'present' },
      { date: '2023-09-04', status: 'present' },
      { date: '2023-09-05', status: 'absent' },
    ]
  },
  { 
    id: 'S003', 
    name: 'Ryan Patel', 
    rollNo: 'ME23003', 
    class: 'Mechanical Engineering', 
    batch: '2023-2027',
    email: 'ryan.p@example.edu',
    dob: '2002-11-17',
    attendance: 78,
    marks: { midterm: 72, assignment: 80, final: 75 },
    attendanceHistory: [
      { date: '2023-09-01', status: 'absent' },
      { date: '2023-09-02', status: 'present' },
      { date: '2023-09-03', status: 'present' },
      { date: '2023-09-04', status: 'absent' },
      { date: '2023-09-05', status: 'present' },
    ]
  },
];

const FacultyDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [studentDetailsOpen, setStudentDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editAttendanceOpen, setEditAttendanceOpen] = useState(false);
  const [editAttendanceDate, setEditAttendanceDate] = useState('');
  const [editAttendanceStatus, setEditAttendanceStatus] = useState('present');

  const handleAttendanceMarked = (studentId: string, method: 'scan' | 'manual', evidence?: string) => {
    // Find student
    const student = mockStudents.find(s => s.id === studentId || s.rollNo === studentId);
    
    if (student) {
      toast.success(`Attendance marked for ${student.name}`);
    } else {
      toast.error(`Student with ID ${studentId} not found`);
    }
  };

  const filterStudents = () => {
    return mockStudents.filter(student => {
      const matchesSearch = 
        !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || student.class === selectedClass;
      const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
      
      return matchesSearch && matchesClass && matchesBatch;
    });
  };

  const openStudentDetails = (student: any) => {
    setSelectedStudent(student);
    setStudentDetailsOpen(true);
  };

  const handleEditAttendance = () => {
    toast.success('Attendance updated successfully');
    setEditAttendanceOpen(false);
  };

  const navigation = [
    { 
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      key: 'dashboard',
      onClick: () => setCurrentTab('dashboard')
    },
    { 
      title: 'Take Attendance',
      icon: <ClipboardCheck className="h-5 w-5" />,
      key: 'attendance',
      onClick: () => setCurrentTab('attendance')
    },
    { 
      title: 'Student Search',
      icon: <UserSearch className="h-5 w-5" />,
      key: 'search',
      onClick: () => setCurrentTab('search')
    },
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Classes</CardTitle>
          <CardDescription>Your teaching schedule for today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {['Introduction to Programming', 'Data Structures', 'Algorithms Design'].map((className, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{className}</div>
                <div className="text-sm text-muted-foreground">Room {101 + i}, {9 + i * 2}:00 AM</div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{i === 0 ? 'Now' : 'In ' + (i * 2) + ' hrs'}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Attendance Overview</CardTitle>
          <CardDescription>Student attendance statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm">Computer Science</div>
              <div className="text-sm font-medium">92%</div>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm">Electrical Engineering</div>
              <div className="text-sm font-medium">87%</div>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-sm">Mechanical Engineering</div>
              <div className="text-sm font-medium">79%</div>
            </div>
            <Progress value={79} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => setCurrentTab('attendance')}>
            Take Attendance
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Your recent actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { action: 'Marked attendance for CS Batch 22', time: '10 mins ago' },
            { action: 'Updated marks for Data Structures', time: '2 hrs ago' },
            { action: 'Edited student profile: Alex Thompson', time: '1 day ago' },
          ].map((activity, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="text-sm">{activity.action}</div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderAttendance = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="card-effect md:col-span-1">
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Scan ID card or enter code manually</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceScanner onAttendanceMarked={handleAttendanceMarked} />
        </CardContent>
      </Card>
      
      <Card className="card-effect md:col-span-1">
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Students who have been marked present today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.slice(0, 2).map((student) => (
              <div key={student.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.rollNo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-green-600">Present</div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{mockStudents[2].name}</div>
                  <div className="text-sm text-muted-foreground">{mockStudents[2].rollNo}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-red-600">Absent</div>
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Attendance Records
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderSearch = () => (
    <div>
      <Card className="card-effect mb-6">
        <CardHeader>
          <CardTitle>Student Search</CardTitle>
          <CardDescription>
            Search for students by name, ID, class, or batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:w-1/2">
              <div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    <SelectItem value="2021-2025">2021-2025</SelectItem>
                    <SelectItem value="2022-2026">2022-2026</SelectItem>
                    <SelectItem value="2023-2027">2023-2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-effect">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterStudents().map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.rollNo}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.attendance} className="h-2 w-16" />
                      <span className="text-sm">{student.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openStudentDetails(student)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filterStudents().length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No students found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // Student Details Dialog
  const renderStudentDetailsDialog = () => {
    if (!selectedStudent) return null;
    
    return (
      <Dialog open={studentDetailsOpen} onOpenChange={setStudentDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedStudent.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="h-28 w-28 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-14 w-14" />
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                <p className="text-muted-foreground">{selectedStudent.rollNo}</p>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span>{selectedStudent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class:</span>
                  <span>{selectedStudent.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch:</span>
                  <span>{selectedStudent.batch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-sm truncate max-w-[150px]">{selectedStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{selectedStudent.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className="font-medium">{selectedStudent.attendance}%</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attendance">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger value="marks">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Marks
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="attendance" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Attendance History</h4>
                    <Button variant="outline" size="sm" onClick={() => setEditAttendanceOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Attendance
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStudent.attendanceHistory.map((record: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {record.status === 'present' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  <span className="text-green-600">Present</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                                  <span className="text-red-600">Absent</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="marks" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Academic Performance</h4>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Marks
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Midterm Exam</TableCell>
                        <TableCell>{selectedStudent.marks.midterm}/100</TableCell>
                        <TableCell>{getGrade(selectedStudent.marks.midterm)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Assignments</TableCell>
                        <TableCell>{selectedStudent.marks.assignment}/100</TableCell>
                        <TableCell>{getGrade(selectedStudent.marks.assignment)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Final Exam</TableCell>
                        <TableCell>{selectedStudent.marks.final}/100</TableCell>
                        <TableCell>{getGrade(selectedStudent.marks.final)}</TableCell>
                      </TableRow>
                      <TableRow className="font-medium">
                        <TableCell>Overall</TableCell>
                        <TableCell>
                          {Math.round((selectedStudent.marks.midterm + selectedStudent.marks.assignment + selectedStudent.marks.final) / 3)}/100
                        </TableCell>
                        <TableCell>
                          {getGrade(Math.round((selectedStudent.marks.midterm + selectedStudent.marks.assignment + selectedStudent.marks.final) / 3))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Attendance Dialog
  const renderEditAttendanceDialog = () => {
    if (!selectedStudent) return null;
    
    return (
      <Dialog open={editAttendanceOpen} onOpenChange={setEditAttendanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>
              Update attendance record for {selectedStudent.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="attendanceDate" className="text-sm font-medium">Date</label>
              <Input
                id="attendanceDate"
                type="date"
                value={editAttendanceDate}
                onChange={(e) => setEditAttendanceDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="attendanceStatus" className="text-sm font-medium">Status</label>
              <Select value={editAttendanceStatus} onValueChange={setEditAttendanceStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAttendanceOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAttendance}>Update Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <DashboardLayout
      title={
        currentTab === 'dashboard' ? 'Faculty Dashboard' : 
        currentTab === 'attendance' ? 'Take Attendance' : 
        'Student Search'
      }
      currentTab={currentTab}
      navigation={navigation}
    >
      {currentTab === 'dashboard' && renderDashboard()}
      {currentTab === 'attendance' && renderAttendance()}
      {currentTab === 'search' && renderSearch()}
      
      {renderStudentDetailsDialog()}
      {renderEditAttendanceDialog()}
    </DashboardLayout>
  );
};

// Helper function to calculate grade
const getGrade = (marks: number) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
};

export default FacultyDashboard;
