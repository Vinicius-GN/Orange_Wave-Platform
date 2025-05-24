import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, User as UserIcon, Mail, Calendar, Wallet as WalletIcon, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Define User interface
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer'; // Fixed to only 'admin' | 'customer'
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  balance: {
    wallet: number;
    invested: number;
  };
  avatarUrl?: string;
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-07-15',
    balance: {
      wallet: 1500,
      invested: 5000,
    },
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'customer',
    status: 'suspended',
    joinDate: '2023-11-20',
    lastActive: '2024-07-10',
    balance: {
      wallet: 500,
      invested: 2500,
    },
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'user-3',
    email: 'robert.jones@example.com',
    name: 'Robert Jones',
    role: 'admin',
    status: 'active',
    joinDate: '2024-05-01',
    lastActive: '2024-07-14',
    balance: {
      wallet: 2500,
      invested: 10000,
    },
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'user-4',
    email: 'emily.brown@example.com',
    name: 'Emily Brown',
    role: 'customer',
    status: 'pending',
    joinDate: '2024-06-10',
    lastActive: 'Never',
    balance: {
      wallet: 100,
      invested: 1000,
    },
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 'user-5',
    email: 'michael.davis@example.com',
    name: 'Michael Davis',
    role: 'customer',
    status: 'active',
    joinDate: '2024-02-28',
    lastActive: '2024-07-12',
    balance: {
      wallet: 800,
      invested: 3000,
    },
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...users];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply role filter
      if (roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === roleFilter);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === statusFilter);
      }

      setFilteredUsers(filtered);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'customer') => {
    setUsers(currentUsers => {
      return currentUsers.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      });
    });

    setFilteredUsers(currentUsers => {
      return currentUsers.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      });
    });

    toast({
      title: "Role Updated",
      description: `User ${userId} role changed to ${newRole}.`,
    });
  };

  const openUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeUserDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout title="Users" description="Manage and view all users">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <UserIcon className="h-4 w-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={8} className="h-14">
                    <div className="w-full h-4 bg-secondary/50 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              // No data state
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        user.status === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : user.status === 'suspended'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      )}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.joinDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openUserDialog(user)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.name}
                    className="h-24 w-24 rounded-full mx-auto mb-2"
                  />
                  <div className="text-lg font-medium">{selectedUser.name}</div>
                  <div className="text-muted-foreground">{selectedUser.email}</div>
                  <Badge
                    variant="outline"
                    className={cn(
                      selectedUser.status === 'active'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : selectedUser.status === 'suspended'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    )}
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                      User ID
                    </Label>
                    <Input id="id" value={selectedUser.id} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) => handleRoleChange(selectedUser.id, value as 'admin' | 'customer')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="joinDate" className="text-right">
                      Join Date
                    </Label>
                    <Input id="joinDate" value={format(new Date(selectedUser.joinDate), 'MMM dd, yyyy')} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastActive" className="text-right">
                      Last Active
                    </Label>
                    <Input id="lastActive" value={selectedUser.lastActive} className="col-span-3" readOnly />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-lg font-medium mb-2">Balance</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <WalletIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Wallet</div>
                      <div className="text-lg font-bold">${selectedUser.balance.wallet.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Invested</div>
                      <div className="text-lg font-bold">${selectedUser.balance.invested.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading...</div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeUserDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersManagement;
