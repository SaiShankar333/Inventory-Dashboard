
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

function CategoryDistribution({ data }) {
  const [selectedItem, setSelectedItem] = useState('all');
  const [selectedABC, setSelectedABC] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('pie');

  const uniqueItems = useMemo(() => {
    const items = [...new Set(data.map(item => item.itemName))];
    return items.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesItem = selectedItem === 'all' || item.itemName === selectedItem;
      const matchesABC = selectedABC === 'all' || item.abcClass === selectedABC;
      const matchesSearch = searchTerm === '' || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDate = itemDate >= startDate && itemDate <= endDate;
      }

      return matchesItem && matchesABC && matchesSearch && matchesDate;
    });
  }, [data, selectedItem, selectedABC, searchTerm, dateRange]);

  const categoryData = useMemo(() => {
    const categoryStats = {};
    
    filteredData.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = {
          category: item.category,
          totalItems: 0,
          totalStock: 0,
          totalConsumption: 0,
          avgTurnover: 0
        };
      }
      
      categoryStats[item.category].totalItems += 1;
      categoryStats[item.category].totalStock += item.closingStock;
      categoryStats[item.category].totalConsumption += item.consumption;
    });

    // Calculate average turnover for each category
    Object.keys(categoryStats).forEach(category => {
      const categoryItems = filteredData.filter(item => item.category === category);
      const totalTurnover = categoryItems.reduce((sum, item) => {
        const avgInventory = (item.openingStock + item.closingStock) / 2;
        return sum + (avgInventory > 0 ? item.consumption / avgInventory : 0);
      }, 0);
      categoryStats[category].avgTurnover = categoryItems.length > 0 ? totalTurnover / categoryItems.length : 0;
    });

    return Object.values(categoryStats);
  }, [filteredData]);

  const clearFilters = () => {
    setSelectedItem('all');
    setSelectedABC('all');
    setDateRange({ start: '', end: '' });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="filter-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>

          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Items</SelectItem>
              {uniqueItems.map(item => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedABC} onValueChange={setSelectedABC}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="ABC Class" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="A">Class A</SelectItem>
              <SelectItem value="B">Class B</SelectItem>
              <SelectItem value="C">Class C</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            placeholder="Start Date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="bg-slate-800/50 border-slate-600 text-white"
          />

          <Input
            type="date"
            placeholder="End Date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="bg-slate-800/50 border-slate-600 text-white"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button onClick={clearFilters} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Clear Filters
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewType('pie')}
              variant={viewType === 'pie' ? 'default' : 'outline'}
              size="sm"
              className="border-slate-600"
            >
              <PieChartIcon className="h-4 w-4 mr-2" />
              Pie Chart
            </Button>
            <Button
              onClick={() => setViewType('bar')}
              variant={viewType === 'bar' ? 'default' : 'outline'}
              size="sm"
              className="border-slate-600"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Bar Chart
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Category Distribution by Items</h3>
          <ResponsiveContainer width="100%" height={300}>
            {viewType === 'pie' ? (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, totalItems }) => `${category}: ${totalItems}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalItems"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            ) : (
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="totalItems" fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Total Stock by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="totalStock" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="chart-container p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Category Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Total Items</th>
                <th className="px-6 py-3">Total Stock</th>
                <th className="px-6 py-3">Total Consumption</th>
                <th className="px-6 py-3">Avg Turnover</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category, index) => (
                <tr key={category.category} className="bg-slate-800/30 border-b border-slate-700">
                  <td className="px-6 py-4 font-medium text-white">{category.category}</td>
                  <td className="px-6 py-4">{category.totalItems}</td>
                  <td className="px-6 py-4">{category.totalStock.toLocaleString()}</td>
                  <td className="px-6 py-4">{category.totalConsumption.toLocaleString()}</td>
                  <td className="px-6 py-4">{category.avgTurnover.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default CategoryDistribution;
