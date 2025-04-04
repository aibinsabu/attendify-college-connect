
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, BookOpen, Bus, LayoutDashboard, UserPlus, Search,
  User, PlusCircle, Trash2, Edit, ChevronRight, Calendar
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { API } from '@/services/api';
import TimetableEditor from '@/components/admin/TimetableEditor';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('faculty');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    class: '',
    batch: '',
    route: ''
  });
  const [users, setUsers] = useState<any>({
    faculty: [],
    students: [],
    busStaff: []
  });
  
  // Load users on component mount and tab switch
  useEffect(() => {
    loadUsers();
  }, [selectedUserType]);
  
  const loadUsers = async () => {
    try {
      // Map UI user types to API role types
      const roleMap: any = {
        'faculty': 'faculty',
        'students': 'student',
        'busStaff': 'busstaff'
      };
      
      const role = roleMap[selectedUserType];
      if (!role) return;
      
      const fetchedUsers = await API.user.getAllUsers(role);
      
      setUsers({
        ...users,
        [selectedUserType]: fetchedUsers
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleAddUser = async () => {
    try {
      // Map UI user types to API role types
      const roleMap: any = {
        'faculty': 'faculty',
        'students': 'student',
        'busStaff': 'busstaff'
      };
      
      const role = roleMap[selectedUserType];
      if (!role) {
        toast.error('Invalid user type');
        return;
      }
      
      // Prepare user data based on role
      const newUser: any = {
        name: userData.name,
        email: userData.email,
        password: userData.password || '123456', // Default password
        role: role
      };
      
      // Add role-specific fields
      if (role === 'faculty') {
        newUser.department = userData.department;
      } else if (role === 'student') {
        newUser.studentClass = userData.class;
        newUser.batch = userData.batch;
        newUser.rollNo = 'S' + Math.floor(10000 + Math.random() * 90000); // Generate random roll number
      } else if (role === 'busstaff') {
        // Add bus staff specific fields if any
      }
      
      // Call API to add user
      const addedUser = await API.user.addUser(newUser);
      
      // Update the users list
      setUsers({
        ...users,
        [selectedUserType]: [...users[selectedUserType], addedUser]
      });
      
      toast.success(`New ${selectedUserType.slice(0, -1)} added successfully`);
      setDialogOpen(false);
      
      // Reset form data
      setUserData({
        name: '',
        email: '',
        password: '',
        department: '',
        class: '',
        batch: '',
        route: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected for deletion');
      return;
    }
    
    try {
      // Call API to delete user
      await API.user.deleteUser(selectedUser._id);
      
      // Update the users list by removing the deleted user
      setUsers({
        ...users,
        [selectedUserType]: users[selectedUserType].filter((user: any) => user._id !== selectedUser._id)
      });
      
      toast.success(`${selectedUser.name} has been removed`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setUserData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      department: user.department || '',
      class: user.studentClass || '',
      batch: user.batch || '',
      route: ''
    });
    setEditDialogOpen(true);
  };
  
  const handleUpdateUser = async () => {
    if (!selectedUser?._id) {
      toast.error('No user selected for update');
      return;
    }
    
    try {
      // Prepare update data (exclude password if empty)
      const updateData: any = {
        name: userData.name,
        email: userData.email
      };
      
      if (userData.password) {
        updateData.password = userData.password;
      }
      
      // Add role-specific fields
      if (selectedUser.role === 'faculty') {
        updateData.department = userData.department;
      } else if (selectedUser.role === 'student') {
        updateData.studentClass = userData.class;
        updateData.batch = userData.batch;
      }
      
      // Call API to update user
      const updatedUser = await API.user.updateStudent(selectedUser._id, updateData);
      
      // Update the users list
      setUsers({
        ...users,
        [selectedUserType]: users[selectedUserType].map((user: any) => 
          user._id === updatedUser._id ? updatedUser : user
        )
      });
      
      toast.success(`${updatedUser.name} has been updated`);
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = () => {
    const userList = users[selectedUserType] || [];
    
    if (!searchQuery) return userList;
    
    return userList.filter((user: any) => 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const navigation = [
    { 
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      key: 'dashboard',
      onClick: () => setCurrentTab('dashboard')
    },
    { 
      title: 'Faculty Management',
      icon: <BookOpen className="h-5 w-5" />,
      key: 'faculty',
      onClick: () => { setCurrentTab('users'); setSelectedUserType('faculty'); }
    },
    { 
      title: 'Student Management',
      icon: <Users className="h-5 w-5" />,
      key: 'students',
      onClick: () => { setCurrentTab('users'); setSelectedUserType('students'); }
    },
    { 
      title: 'Bus Staff Management',
      icon: <Bus className="h-5 w-5" />,
      key: 'busStaff',
      onClick: () => { setCurrentTab('users'); setSelectedUserType('busStaff'); }
    },
    { 
      title: 'Timetable Management',
      icon: <Calendar className="h-5 w-5" />,
      key: 'timetable',
      onClick: () => { setCurrentTab('timetable'); }
    },
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Faculty</CardTitle>
          <CardDescription>Manage faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{users.faculty.length}</div>
          <p className="text-muted-foreground text-sm">Total faculty members</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between" onClick={() => { setCurrentTab('users'); setSelectedUserType('faculty'); }}>
            Manage Faculty <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Students</CardTitle>
          <CardDescription>Manage student records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{users.students.length}</div>
          <p className="text-muted-foreground text-sm">Total students</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between" onClick={() => { setCurrentTab('users'); setSelectedUserType('students'); }}>
            Manage Students <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Bus Staff</CardTitle>
          <CardDescription>Manage bus staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{users.busStaff.length}</div>
          <p className="text-muted-foreground text-sm">Total bus staff</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between" onClick={() => { setCurrentTab('users'); setSelectedUserType('busStaff'); }}>
            Manage Bus Staff <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="card-effect lg:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Timetable Management</CardTitle>
          <CardDescription>Manage class schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Assign and manage timetables for all classes</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between" onClick={() => setCurrentTab('timetable')}>
            Manage Timetables <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderUserManagement = () => (
    <div>
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <Tabs value={selectedUserType} onValueChange={setSelectedUserType} className="w-full">
            <TabsList>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="busStaff">Bus Staff</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button onClick={() => setDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b p-4 font-medium">
          <div className="col-span-3">ID</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {filteredUsers().length > 0 ? (
          filteredUsers().map((user: any) => (
            <div key={user._id} className="grid grid-cols-12 p-4 border-b last:border-b-0 hover:bg-muted/50">
              <div className="col-span-3 flex items-center">{user._id}</div>
              <div className="col-span-3 flex items-center">{user.name}</div>
              <div className="col-span-4 flex items-center">{user.email}</div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedUser(user);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No {selectedUserType} found. Try a different search or add a new one.
          </div>
        )}
      </div>
    </div>
  );
  
  const renderTimetableManagement = () => (
    <TimetableEditor />
  );

  // Add User Dialog
  const renderAddUserDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {selectedUserType.slice(0, -1)}</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new {selectedUserType.slice(0, -1)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input 
              id="name" 
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Full name" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email address" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              value={userData.password}
              onChange={handleInputChange}
              placeholder="Create a password" 
            />
          </div>
          
          {selectedUserType === 'faculty' && (
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Department</label>
              <Select value={userData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedUserType === 'students' && (
            <>
              <div className="space-y-2">
                <label htmlFor="class" className="text-sm font-medium">Class</label>
                <Select value={userData.class} onValueChange={(value) => handleSelectChange('class', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="batch" className="text-sm font-medium">Batch</label>
                <Select value={userData.batch} onValueChange={(value) => handleSelectChange('batch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2020-2024">2020-2024</SelectItem>
                    <SelectItem value="2021-2025">2021-2025</SelectItem>
                    <SelectItem value="2022-2026">2022-2026</SelectItem>
                    <SelectItem value="2023-2027">2023-2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {selectedUserType === 'busStaff' && (
            <div className="space-y-2">
              <label htmlFor="route" className="text-sm font-medium">Route</label>
              <Select value={userData.route} onValueChange={(value) => handleSelectChange('route', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="route-a">Route A</SelectItem>
                  <SelectItem value="route-b">Route B</SelectItem>
                  <SelectItem value="route-c">Route C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add {selectedUserType.slice(0, -1)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Edit User Dialog
  const renderEditDialog = () => (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {selectedUserType.slice(0, -1)}</DialogTitle>
          <DialogDescription>
            Update details for {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
            <Input 
              id="edit-name" 
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Full name" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
            <Input 
              id="edit-email" 
              name="email"
              type="email" 
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Email address" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-password" className="text-sm font-medium">Password (leave blank to keep unchanged)</label>
            <Input 
              id="edit-password" 
              name="password"
              type="password" 
              value={userData.password}
              onChange={handleInputChange}
              placeholder="New password" 
            />
          </div>
          
          {selectedUser?.role === 'faculty' && (
            <div className="space-y-2">
              <label htmlFor="edit-department" className="text-sm font-medium">Department</label>
              <Select value={userData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedUser?.role === 'student' && (
            <>
              <div className="space-y-2">
                <label htmlFor="edit-class" className="text-sm font-medium">Class</label>
                <Select value={userData.class} onValueChange={(value) => handleSelectChange('class', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-batch" className="text-sm font-medium">Batch</label>
                <Select value={userData.batch} onValueChange={(value) => handleSelectChange('batch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2020-2024">2020-2024</SelectItem>
                    <SelectItem value="2021-2025">2021-2025</SelectItem>
                    <SelectItem value="2022-2026">2022-2026</SelectItem>
                    <SelectItem value="2023-2027">2023-2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Delete Confirmation Dialog
  const renderDeleteDialog = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout
      title={currentTab === 'dashboard' ? 'Admin Dashboard' : currentTab === 'users' ? `Manage ${selectedUserType}` : 'Timetable Management'}
      currentTab={currentTab}
      navigation={navigation}
    >
      {currentTab === 'dashboard' && renderDashboard()}
      {currentTab === 'users' && renderUserManagement()}
      {currentTab === 'timetable' && renderTimetableManagement()}
      {renderAddUserDialog()}
      {renderEditDialog()}
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
