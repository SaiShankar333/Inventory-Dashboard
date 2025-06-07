
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, LineChart as LineChartIcon, Filter } from 'lucide-react';

function ConsumptionTrends({ data }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedABC, setSelectedABC] = useState('all');
  const [selectedItem, setSelectedItem] = useState('all');
  const [viewType, setViewType] = useState('line');

  const uniqueCategories = useMemo(() => {
    return [...new Set(data.map(item => item.category))].sort();
  }, [data]);

  const uniqueItems = useMemo(() => {
    const filtered = selectedCategory === 'all' ? data : data.filter(item => item.category === selectedCategory);
    return [...new Set(filtered.map(item => item.itemName))].sort();
  }, [data, selectedCategory]);

  const monthlyConsumption = useMemo(() => {
    let filtered = data;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    if (selectedABC !== 'all') {
      filtered = filtered.filter(item => item.abcClass === selectedABC);
    }
    if (selectedItem !== 'all') {
      filtered = filtered.filter(item => item.itemName === selectedItem);
    }

    const monthlyData = {};

    filtered.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          totalConsumption: 0,
          itemCount: 0,
          avgConsumption: 0
        };
      }
      
      monthlyData[monthKey].totalConsumption += item.consumption;
      monthlyData[monthKey].itemCount += 1;
    });

    // Calculate average consumption per month
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].avgConsumption = monthlyData[month].totalConsumption / monthlyData[month].itemCount;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }, [data, selectedCategory, selectedABC, selectedItem]);

  const categoryConsumption = useMemo(() => {
    const categoryData = {};

    data.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = 0;
      }
      categoryData[item.category] += item.consumption;
    });

    return Object.entries(categoryData).map(([category, consumption]) => ({
      category,
      consumption
    })).sort((a, b) => b.consumption - a.consumption);
  }, [data]);

  const consumptionStats = useMemo(() => {
    const totalConsumption = monthlyConsumption.reduce((sum, month) => sum + month.totalConsumption, 0);
    const avgMonthlyConsumption = monthlyConsumption.length > 0 ? totalConsumption / monthlyConsumption.length : 0;
    const highestMonth = monthlyConsumption.reduce((max, month) => 
      month.totalConsumption > max.totalConsumption ? month : max, 
      { totalConsumption: 0, month: 'N/A' }
    );
    const lowestMonth = monthlyConsumption.reduce((min, month) => 
      month.totalConsumption < min.totalConsumption ? month : min, 
      { totalConsumption: Infinity, month: 'N/A' }
    );

    return {
      totalConsumption,
      avgMonthlyConsumption: avgMonthlyConsumption.toFixed(0),
      highestMonth: highestMonth.month,
      lowestMonth: lowestMonth.month
    };
  }, [monthlyConsumption]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedABC('all');
    setSelectedItem('all');
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
          <h3 className="text-lg font-semibold text-white">Consumption Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
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
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button onClick={clearFilters} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Clear Filters
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewType('line')}
              variant={viewType === 'line' ? 'default' : 'outline'}
              size="sm"
              className="border-slate-600"
            >
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line Chart
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Consumption</p>
              <p className="text-2xl font-bold text-blue-400">{consumptionStats.totalConsumption.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Avg Monthly</p>
              <p className="text-2xl font-bold text-green-400">{consumptionStats.avgMonthlyConsumption}</p>
            </div>
            <BarChart3 className="h-6 w-6 text-green-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Highest Month</p>
              <p className="text-lg font-bold text-yellow-400">{consumptionStats.highestMonth}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-yellow-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Lowest Month</p>
              <p className="text-lg font-bold text-purple-400">{consumptionStats.lowestMonth}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Monthly Consumption Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            {viewType === 'line' ? (
              <LineChart data={monthlyConsumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalConsumption" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Total Consumption"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={monthlyConsumption}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="totalConsumption" fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Category Consumption Ranking</h3>
          <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={categoryConsumption}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barCategoryGap={15}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="category" type="category" stroke="#9ca3af" width={120} />
            <Tooltip
              contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="consumption" fill="#10b981" barSize={20} />
        </BarChart> 
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="chart-container p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Monthly Consumption Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-3">Month</th>
                <th className="px-6 py-3">Total Consumption</th>
                <th className="px-6 py-3">Item Count</th>
                <th className="px-6 py-3">Average Consumption</th>
                <th className="px-6 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {monthlyConsumption.map((month, index) => {
                const prevMonth = index > 0 ? monthlyConsumption[index - 1] : null;
                const trend = prevMonth ? 
                  (month.totalConsumption > prevMonth.totalConsumption ? 'up' : 
                   month.totalConsumption < prevMonth.totalConsumption ? 'down' : 'same') : 'same';
                
                return (
                  <tr key={month.month} className="bg-slate-800/30 border-b border-slate-700">
                    <td className="px-6 py-4 font-medium text-white">{month.month}</td>
                    <td className="px-6 py-4">{month.totalConsumption.toLocaleString()}</td>
                    <td className="px-6 py-4">{month.itemCount}</td>
                    <td className="px-6 py-4">{month.avgConsumption.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                      {trend === 'down' && <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />}
                      {trend === 'same' && <span className="text-slate-400">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default ConsumptionTrends;
