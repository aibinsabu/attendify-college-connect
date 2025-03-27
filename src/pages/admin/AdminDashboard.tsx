
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, BookOpen, Bus, LayoutDashboard, UserPlus, Search,
  User, PlusCircle, Trash2, Edit, ChevronRight
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

const mockData = {
  faculty: [
    { id: 'F001', name: 'Dr. Sarah Johnson', email: 'sarah.j@example.edu', department: 'Computer Science' },
    { id: 'F002', name: 'Prof. Michael Chen', email: 'michael.c@example.edu', department: 'Mathematics' },
    { id: 'F003', name: 'Dr. Emily Wilson', email: 'emily.w@example.edu', department: 'Physics' },
  ],
  students: [
    { id: 'S001', name: 'Alex Thompson', email: 'alex.t@example.edu', class: 'Computer Science', batch: '2022-2026' },
    { id: 'S002', name: 'Jessica Martinez', email: 'jessica.m@example.edu', class: 'Electrical Engineering', batch: '2021-2025' },
    { id: 'S003', name: 'Ryan Patel', email: 'ryan.p@example.edu', class: 'Mechanical Engineering', batch: '2023-2027' },
  ],
  busStaff: [
    { id: 'B001', name: 'James Wilson', email: 'james.w@example.edu', route: 'Route A' },
    { id: 'B002', name: 'Linda Davis', email: 'linda.d@example.edu', route: 'Route B' },
  ]
};

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('faculty');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleAddUser = () => {
    // In a real app, this would add the user to the database
    toast.success(`New ${selectedUserType} added successfully`);
    setDialogOpen(false);
  };

  const handleDeleteUser = () => {
    // In a real app, this would delete the user from the database
    toast.success(`${selectedUser?.name} has been removed`);
    setDeleteDialogOpen(false);
  };

  const filteredUsers = () => {
    const users = mockData[selectedUserType as keyof typeof mockData] || [];
    if (!searchQuery) return users;
    
    return users.filter((user) => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
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
  ];

  const renderDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-effect">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Faculty</CardTitle>
          <CardDescription>Manage faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{mockData.faculty.length}</div>
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
          <div className="text-3xl font-bold">{mockData.students.length}</div>
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
          <div className="text-3xl font-bold">{mockData.busStaff.length}</div>
          <p className="text-muted-foreground text-sm">Total bus staff</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between" onClick={() => { setCurrentTab('users'); setSelectedUserType('busStaff'); }}>
            Manage Bus Staff <ChevronRight className="h-4 w-4" />
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
        
        {filteredUsers().map((user) => (
          <div key={user.id} className="grid grid-cols-12 p-4 border-b last:border-b-0 hover:bg-muted/50">
            <div className="col-span-3 flex items-center">{user.id}</div>
            <div className="col-span-3 flex items-center">{user.name}</div>
            <div className="col-span-4 flex items-center">{user.email}</div>
            <div className="col-span-2 flex justify-end gap-2">
              <Button variant="ghost" size="icon">
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
        ))}
        
        {filteredUsers().length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No {selectedUserType} found. Try a different search or add a new one.
          </div>
        )}
      </div>
    </div>
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
            <Input id="name" placeholder="Full name" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" placeholder="Email address" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>
          
          {selectedUserType === 'faculty' && (
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedUserType === 'students' && (
            <>
              <div className="space-y-2">
                <label htmlFor="class" className="text-sm font-medium">Class</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="batch" className="text-sm font-medium">Batch</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2020">2020-2024</SelectItem>
                    <SelectItem value="2021">2021-2025</SelectItem>
                    <SelectItem value="2022">2022-2026</SelectItem>
                    <SelectItem value="2023">2023-2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {selectedUserType === 'busStaff' && (
            <div className="space-y-2">
              <label htmlFor="route" className="text-sm font-medium">Route</label>
              <Select>
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
      title={currentTab === 'dashboard' ? 'Admin Dashboard' : `Manage ${selectedUserType}`}
      currentTab={currentTab}
      navigation={navigation}
    >
      {currentTab === 'dashboard' && renderDashboard()}
      {currentTab === 'users' && renderUserManagement()}
      {renderAddUserDialog()}
      {renderDeleteDialog()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
