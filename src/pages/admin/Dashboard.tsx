
import { useEffect, useState } from 'react';
import { BarChart3, Users, ShoppingCart, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

// Mock transaction data for sales chart
const salesData = [
  { name: 'Jan', stocks: 4000, crypto: 2400 },
  { name: 'Feb', stocks: 3000, crypto: 1398 },
  { name: 'Mar', stocks: 2000, crypto: 9800 },
  { name: 'Apr', stocks: 2780, crypto: 3908 },
  { name: 'May', stocks: 1890, crypto: 4800 },
  { name: 'Jun', stocks: 2390, crypto: 3800 },
  { name: 'Jul', stocks: 3490, crypto: 4300 }
];

// Mock user registration data for user chart
const userData = [
  { name: 'Week 1', users: 40 },
  { name: 'Week 2', users: 30 },
  { name: 'Week 3', users: 20 },
  { name: 'Week 4', users: 27 },
  { name: 'Week 5', users: 18 },
  { name: 'Week 6', users: 23 },
  { name: 'Week 7', users: 34 }
];

const AdminDashboard = () => {
  const [stocksCount, setStocksCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [cartsCount, setCartsCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [frozenAssets, setFrozenAssets] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Simulate loading counts
  useEffect(() => {
    // In a real application, these would be API calls
    setStocksCount(25);
    setUsersCount(158);
    setCartsCount(12);
    setTransactionsCount(243);
    setFrozenAssets(['TSLA']);
  }, []);
  
  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Overview of platform statistics and management tools"
    >
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex pt-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stocks</p>
              <h3 className="text-2xl font-bold">{stocksCount}</h3>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin/stocks')}
              >
                Manage Stocks
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex pt-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{usersCount}</h3>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin/users')}
              >
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex pt-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Carts</p>
              <h3 className="text-2xl font-bold">{cartsCount}</h3>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin/carts')}
              >
                View Carts
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex pt-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <h3 className="text-2xl font-bold">{transactionsCount}</h3>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate('/admin/transactions')}
              >
                View Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts section */}
      {frozenAssets.length > 0 && (
        <Card className="mb-6 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Frozen Assets
            </CardTitle>
            <CardDescription>
              The following assets are currently frozen and unavailable for trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {frozenAssets.map(asset => (
                <div 
                  key={asset} 
                  className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium"
                >
                  {asset}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales by asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1e1e',
                      border: '1px solid #333',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="stocks" name="Stocks" fill="#8b5cf6" />
                  <Bar dataKey="crypto" name="Crypto" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Weekly user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1e1e',
                      border: '1px solid #333',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    name="New Users" 
                    stroke="#0ea5e9" 
                    strokeWidth={2} 
                    dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common management tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            className="h-auto py-4 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/stocks/new')}
          >
            <Package className="h-8 w-8 mb-2" />
            <span>Add New Stock</span>
          </Button>
          
          <Button 
            className="h-auto py-4 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/users/new')}
          >
            <Users className="h-8 w-8 mb-2" />
            <span>Register Admin</span>
          </Button>
          
          <Button 
            className="h-auto py-4 flex flex-col items-center justify-center"
            onClick={() => navigate('/admin/transactions')}
          >
            <BarChart3 className="h-8 w-8 mb-2" />
            <span>Export Reports</span>
          </Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
