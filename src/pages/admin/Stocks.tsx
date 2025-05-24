import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, DownloadCloud, FileText, ArrowUpDown, AlertTriangle
} from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils';

// Update StockData interface for consistency
interface StockData {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto'; // Removed 'etf' and 'other'
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  logoUrl?: string;
  description?: string;
  sector?: string;
  industry?: string;
  isFrozen?: boolean; 
  isPending?: boolean;
}

interface StockFormValues {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  logoUrl?: string;
  description?: string;
  sector?: string;
  industry?: string;
  isFrozen?: boolean;
}

// Mock stock data
const mockStocks: StockData[] = [
  {
    id: 'stock-1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 175.00,
    change: 1.50,
    changePercent: 0.86,
    marketCap: 2800000000000,
    volume: 45000000,
    logoUrl: 'https://example.com/aapl.png',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'stock-2',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    price: 285.50,
    change: -0.75,
    changePercent: -0.26,
    marketCap: 2100000000000,
    volume: 30000000,
    logoUrl: 'https://example.com/msft.png',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    sector: 'Technology',
    industry: 'Software',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'stock-3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    price: 2500.00,
    change: 25.00,
    changePercent: 1.01,
    marketCap: 1700000000000,
    volume: 20000000,
    logoUrl: 'https://example.com/googl.png',
    description: 'Alphabet Inc. provides various products and platforms worldwide.',
    sector: 'Technology',
    industry: 'Internet',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'stock-4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stock',
    price: 3200.00,
    change: 10.00,
    changePercent: 0.31,
    marketCap: 1600000000000,
    volume: 25000000,
    logoUrl: 'https://example.com/amzn.png',
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
    sector: 'Consumer Discretionary',
    industry: 'E-Commerce',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'stock-5',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    price: 750.00,
    change: -15.00,
    changePercent: -1.96,
    marketCap: 700000000000,
    volume: 35000000,
    logoUrl: 'https://example.com/tsla.png',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    sector: 'Consumer Discretionary',
    industry: 'Auto Manufacturers',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'crypto-1',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 50000.00,
    change: 500.00,
    changePercent: 1.01,
    marketCap: 900000000000,
    volume: 30000000000,
    logoUrl: 'https://example.com/btc.png',
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    isFrozen: false,
    isPending: false,
  },
  {
    id: 'crypto-2',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 3500.00,
    change: -50.00,
    changePercent: -1.41,
    marketCap: 400000000000,
    volume: 15000000000,
    logoUrl: 'https://example.com/eth.png',
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.',
    isFrozen: false,
    isPending: false,
  },
];

// Function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const StocksManagement = () => {
  const [stocks, setStocks] = useState<StockData[]>(mockStocks);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(mockStocks);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [formValues, setFormValues] = useState<StockFormValues>({
    symbol: '',
    name: '',
    type: 'stock',
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: 0,
    volume: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    applyFilters(searchQuery);
  }, [stocks, searchQuery]);

  const applyFilters = (search: string) => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...stocks];

      if (search) {
        filtered = filtered.filter(stock =>
          stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
          stock.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredStocks(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openNewStockDialog = () => {
    setIsEditMode(false);
    setSelectedStock(null);
    setFormValues({
      symbol: '',
      name: '',
      type: 'stock',
      price: 0,
      change: 0,
      changePercent: 0,
      marketCap: 0,
      volume: 0,
    });
    setIsDialogOpen(true);
  };

  const openEditStockDialog = (stock: StockData) => {
    setIsEditMode(true);
    setSelectedStock(stock);
    setFormValues({
      symbol: stock.symbol,
      name: stock.name,
      type: stock.type,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      marketCap: stock.marketCap,
      volume: stock.volume,
      logoUrl: stock.logoUrl,
      description: stock.description,
      sector: stock.sector,
      industry: stock.industry,
      isFrozen: stock.isFrozen,
    });
    setIsDialogOpen(true);
  };

  const closeStockDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormValues(prevValues => ({
      ...prevValues,
      type: value === 'crypto' ? 'crypto' : 'stock',
    }));
  };

  const handleToggleFreeze = (stockId: string) => {
    setStocks(prevStocks =>
      prevStocks.map(stock =>
        stock.id === stockId ? { ...stock, isFrozen: !stock.isFrozen } : stock
      )
    );
  };

  const handleTogglePending = (stockId: string) => {
    setStocks(prevStocks =>
      prevStocks.map(stock =>
        stock.id === stockId ? { ...stock, isPending: !stock.isPending } : stock
      )
    );
  };

  const handleSaveStock = (editedStock: StockData) => {
    // Ensure type is valid (stock or crypto only)
    const validType: 'stock' | 'crypto' = editedStock.type === 'crypto' ? 'crypto' : 'stock';
    
    const updatedStock = {
      ...editedStock,
      type: validType
    };
    
    if (isEditMode && selectedStock) {
      // Update existing stock
      setStocks(prevStocks =>
        prevStocks.map(stock =>
          stock.id === selectedStock.id ? updatedStock : stock
        )
      );
      toast({
        title: 'Stock Updated',
        description: `${updatedStock.name} has been updated successfully.`,
      });
    } else {
      // Add new stock
      const newStock = { ...updatedStock, id: `stock-${Date.now()}` };
      setStocks(prevStocks => [...prevStocks, newStock]);
      toast({
        title: 'Stock Created',
        description: `${newStock.name} has been created successfully.`,
      });
    }
  };

  const handleSubmit = () => {
    const { symbol, name, type, price, change, changePercent, marketCap, volume, logoUrl, description, sector, industry, isFrozen } = formValues;

    if (!symbol || !name || !type || !price || !change || !changePercent || !marketCap || !volume) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const editedStock: StockData = {
      id: selectedStock?.id || `stock-${Date.now()}`,
      symbol,
      name,
      type,
      price,
      change,
      changePercent,
      marketCap,
      volume,
      logoUrl,
      description,
      sector,
      industry,
      isFrozen: isFrozen || false,
      isPending: selectedStock?.isPending || false,
    };

    handleSaveStock(editedStock);
    closeStockDialog();
  };

  const handleDeleteStock = (stockId: string) => {
    setStocks(prevStocks => prevStocks.filter(stock => stock.id !== stockId));
    toast({
      title: 'Stock Deleted',
      description: 'Stock has been deleted successfully.',
    });
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Symbol', 'Name', 'Type', 'Price', 'Change', 'Change Percent', 'Market Cap', 'Volume', 'Logo URL', 'Description', 'Sector', 'Industry', 'Is Frozen', 'Is Pending'];
    const csvRows = [
      headers.join(','),
      ...filteredStocks.map(stock => [
        stock.id,
        stock.symbol,
        stock.name,
        stock.type,
        stock.price,
        stock.change,
        stock.changePercent,
        stock.marketCap,
        stock.volume,
        stock.logoUrl || '',
        stock.description || '',
        stock.sector || '',
        stock.industry || '',
        stock.isFrozen || false,
        stock.isPending || false
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stocks.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Successful',
      description: `${filteredStocks.length} stocks exported to CSV.`,
    });
  };

  return (
    <AdminLayout title="Stocks" description="Manage and view all stocks">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search stocks..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCsv}>
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={openNewStockDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stocks table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-center">Frozen</TableHead>
              <TableHead className="text-center">Pending</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={10} className="h-14">
                    <div className="w-full h-4 bg-secondary/50 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStocks.length === 0 ? (
              // No data state
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No stocks found.
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              filteredStocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell className="capitalize">{stock.type}</TableCell>
                  <TableCell className="text-right">{formatCurrency(stock.price)}</TableCell>
                  <TableCell className="text-right">{stock.change}</TableCell>
                  <TableCell className="text-right">{stock.marketCap}</TableCell>
                  <TableCell className="text-right">{stock.volume}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={stock.isFrozen || false}
                      onCheckedChange={() => handleToggleFreeze(stock.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={stock.isPending || false}
                      onCheckedChange={() => handleTogglePending(stock.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditStockDialog(stock)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteStock(stock.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stock details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Stock' : 'Add New Stock'}</DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Edit stock details.' : 'Create a new stock.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input id="symbol" name="symbol" value={formValues.symbol} onChange={handleInputChange} />

              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formValues.name} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={formValues.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input id="price" name="price" type="number" value={formValues.price} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="change" className="text-right">
                Change
              </Label>
              <Input id="change" name="change" type="number" value={formValues.change} onChange={handleInputChange} />

              <Label htmlFor="changePercent" className="text-right">
                Change Percent
              </Label>
              <Input id="changePercent" name="changePercent" type="number" value={formValues.changePercent} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="marketCap" className="text-right">
                Market Cap
              </Label>
              <Input id="marketCap" name="marketCap" type="number" value={formValues.marketCap} onChange={handleInputChange} />

              <Label htmlFor="volume" className="text-right">
                Volume
              </Label>
              <Input id="volume" name="volume" type="number" value={formValues.volume} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="logoUrl" className="text-right">
                Logo URL
              </Label>
              <Input id="logoUrl" name="logoUrl" value={formValues.logoUrl || ''} onChange={handleInputChange} />

              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" value={formValues.description || ''} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="sector" className="text-right">
                Sector
              </Label>
              <Input id="sector" name="sector" value={formValues.sector || ''} onChange={handleInputChange} />

              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input id="industry" name="industry" value={formValues.industry || ''} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeStockDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Update Stock' : 'Create Stock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StocksManagement;
