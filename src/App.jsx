import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, TrendingUp, Package, Calculator, Upload } from 'lucide-react';
import CategoryDistribution from '@/components/CategoryDistribution';
import TrendAnalysis from '@/components/TrendAnalysis';
import ConsumptionTrends from '@/components/ConsumptionTrends';
import InventoryTurnover from '@/components/inventory-turnover/InventoryTurnover';
import { generateDummyData } from '@/data/dummyData';
import Papa from 'papaparse';

function App() {
  const [inventoryData, setInventoryData] = useState(() => generateDummyData());
  const { toast } = useToast();

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        });
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            toast({
              title: 'Error Parsing CSV',
              description: `There were ${results.errors.length} errors. Please check console and file format.`,
              variant: 'destructive',
            });
            return;
          }
          
          const requiredColumns = ['itemId', 'itemName', 'category', 'abcClass', 'date', 'openingStock', 'received', 'consumption', 'closingStock', 'msl'];
          const actualColumns = results.meta.fields;
          const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

          if (missingColumns.length > 0) {
             toast({
              title: 'Missing Columns in CSV',
              description: `The following columns are missing: ${missingColumns.join(', ')}. Please ensure your CSV has all required columns.`,
              variant: 'destructive',
            });
            return;
          }
          
          const parsedData = results.data.map(row => ({
            ...row,
            date: new Date(row.date).toISOString().split('T')[0], 
          }));

          setInventoryData(parsedData);
          toast({
            title: 'Dataset Loaded Successfully!',
            description: `${parsedData.length} records loaded from your file.`,
          });
        },
        error: (error) => {
          console.error("File Reading Error:", error);
          toast({
            title: 'Error Reading File',
            description: 'Could not read the uploaded file. Please try again.',
            variant: 'destructive',
          });
        }
      });
    }
  }, [toast]);

  const stats = useMemo(() => {
    if (!inventoryData || inventoryData.length === 0) {
        return { totalItems: 0, totalCategories: 0, lowStockItems: 0, avgTurnover: '0.00' };
    }
    const totalItems = inventoryData.length;
    const totalCategories = new Set(inventoryData.map(item => item.category)).size;
    const lowStockItems = inventoryData.filter(item => item.closingStock < item.msl).length;
    
    let totalTurnoverSum = 0;
    let validItemsForTurnover = 0;

    inventoryData.forEach(item => {
      const avgInventory = (item.openingStock + item.closingStock) / 2;
      if (avgInventory > 0) {
        totalTurnoverSum += item.consumption / avgInventory;
        validItemsForTurnover++;
      }
    });
    
    const avgTurnover = validItemsForTurnover > 0 ? totalTurnoverSum / validItemsForTurnover : 0;

    return {
      totalItems,
      totalCategories,
      lowStockItems,
      avgTurnover: avgTurnover.toFixed(2)
    };
  }, [inventoryData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Inventory Dashboard
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive analytics and insights for your inventory management
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <label htmlFor="csvUpload" className="cursor-pointer">
            <Button asChild variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <div>
                <Upload className="mr-2 h-5 w-5" />
                Upload Your CSV Dataset
              </div>
            </Button>
            <Input 
              id="csvUpload" 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="hidden"
            />
          </label>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="metric-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Records</p>
                <p className="text-3xl font-bold text-white">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="metric-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Categories</p>
                <p className="text-3xl font-bold text-white">{stats.totalCategories}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="metric-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-400">{stats.lowStockItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="metric-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Avg Turnover</p>
                <p className="text-3xl font-bold text-white">{stats.avgTurnover}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
              <TabsTrigger 
                value="distribution" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Category Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Stock Trends
              </TabsTrigger>
              <TabsTrigger 
                value="consumption" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Consumption
              </TabsTrigger>
              <TabsTrigger 
                value="turnover" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                ITR Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="mt-6">
              <CategoryDistribution data={inventoryData} />
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <TrendAnalysis data={inventoryData} />
            </TabsContent>

            <TabsContent value="consumption" className="mt-6">
              <ConsumptionTrends data={inventoryData} />
            </TabsContent>

            <TabsContent value="turnover" className="mt-6">
              <InventoryTurnover data={inventoryData} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;