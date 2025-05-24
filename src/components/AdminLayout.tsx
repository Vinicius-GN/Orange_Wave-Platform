
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, Settings, Package, ShoppingCart, ReceiptText } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

// Define admin roles or special permission
// In a real application, this would come from your auth system
const isAdmin = (userId: string) => {
  // For now, just return true if userId contains 'admin'
  return userId.includes('admin');
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated, or to home if not an admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user && !isAdmin(user.id)) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user || !isAdmin(user.id)) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Manage stocks, users, and transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="p-4 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin/stocks')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Stocks
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin/users')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin/carts')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Active Carts
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin/transactions')}
                  >
                    <ReceiptText className="h-4 w-4 mr-2" />
                    Transactions
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/admin/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Main content */}
          <div className="md:col-span-9">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            
            {/* Page content */}
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
