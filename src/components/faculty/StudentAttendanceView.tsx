
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { API } from '@/services/api';
import { Search, UserPlus, Edit, Check, X } from 'lucide-react';

const StudentAttendanceView = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editData, setEditData] = useState({
    status: 'present',
    remarks: ''
  });
  
  // Load attendance records on component mount
  useEffect(() => {
    loadAttendanceRecords();
    loadStudents();
  }, []);
  
  // Filter records when criteria changes
  useEffect(() => {
    if (attendanceRecords.length === 0) return;
    
    let filtered = [...attendanceRecords];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(record => {
        const student = students.find(s => s._id === record.student);
        if (!student) return false;
        
        return (
          student.name?.toLowerCase().includes(lowerQuery) ||
          student.rollNo?.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    if (selectedDate) {
      const date = new Date(selectedDate).toDateString();
      filtered = filtered.filter(record => {
        return new Date(record.date).toDateString() === date;
      });
    }
    
    if (selectedClass) {
      filtered = filtered.filter(record => {
        const student = students.find(s => s._id === record.student);
        return student?.studentClass === selectedClass;
      });
    }
    
    setFilteredRecords(filtered);
  }, [searchQuery, selectedDate, selectedClass, attendanceRecords, students]);
  
  const loadAttendanceRecords = async () => {
    try {
      const records = await API.attendance.getAllAttendanceRecords();
      setAttendanceRecords(records);
      setFilteredRecords(records);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
      toast.error('Failed to load attendance records');
    }
  };
  
  const loadStudents = async () => {
    try {
      const studentsList = await API.user.getAllUsers('student');
      setStudents(studentsList);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };
  
  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setEditData({
      status: record.status || 'present',
      remarks: record.remarks || ''
    });
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = async () => {
    try {
      // Save changes to the attendance record
      const updated = await API.attendance.updateAttendance(selectedRecord._id, {
        ...selectedRecord,
        status: editData.status,
        remarks: editData.remarks
      });
      
      // Update the local state
      setAttendanceRecords(attendanceRecords.map(record => 
        record._id === updated._id ? updated : record
      ));
      
      // Close dialog and show success message
      setEditDialogOpen(false);
      toast.success('Attendance record updated');
    } catch (error) {
      console.error('Failed to update attendance record:', error);
      toast.error('Failed to update attendance record');
    }
  };
  
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    return student ? student.name : 'Unknown Student';
  };
  
  const getStudentClass = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    return student ? student.studentClass : 'Unknown';
  };
  
  const getStudentRollNo = (studentId: string) => {
    const student = students.find(s => s._id === studentId);
    return student ? student.rollNo : 'Unknown';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Search Student</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Name or Roll No."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-40">
            <Label htmlFor="date">Filter by Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-60">
            <Label htmlFor="class">Filter by Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full md:w-auto" onClick={() => loadAttendanceRecords()}>
            Refresh Data
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStudentName(record.student)}</TableCell>
                    <TableCell>{getStudentRollNo(record.student)}</TableCell>
                    <TableCell>{getStudentClass(record.student)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Edit Attendance Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Attendance Record</DialogTitle>
            </DialogHeader>
            
            {selectedRecord && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Student</Label>
                    <p className="mt-1">{getStudentName(selectedRecord.student)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="mt-1">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Attendance Status</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <Button
                        type="button"
                        size="sm"
                        variant={editData.status === 'present' ? 'default' : 'outline'}
                        onClick={() => setEditData({...editData, status: 'present'})}
                        className="mr-2"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Present
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        size="sm"
                        variant={editData.status === 'absent' ? 'default' : 'outline'}
                        onClick={() => setEditData({...editData, status: 'absent'})}
                        className="mr-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Absent
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-sm font-medium">Remarks (Optional)</Label>
                  <Input
                    id="remarks"
                    value={editData.remarks}
                    onChange={(e) => setEditData({...editData, remarks: e.target.value})}
                    placeholder="Add any additional remarks"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceView;
