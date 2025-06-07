
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Filter } from 'lucide-react';

function TrendAnalysis({ data }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const uniqueItems = useMemo(() => {
    const items = [...new Set(data.map(item => item.itemName))];
    return items.sort();
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedItem) {
      filtered = filtered.filter(item => item.itemName === selectedItem);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, selectedItem, dateRange]);

  const chartData = useMemo(() => {
    if (!selectedItem) return [];

    return filteredData.map(item => ({
      date: item.date,
      closingStock: item.closingStock,
      msl: item.msl,
      status: item.closingStock < item.msl ? 'Below MSL' : 
               item.closingStock > item.msl * 2 ? 'Excess Stock' : 'Normal'
    }));
  }, [filteredData, selectedItem]);

  const stockAnalysis = useMemo(() => {
    if (!selectedItem) return null;

    const itemData = filteredData;
    const belowMSL = itemData.filter(item => item.closingStock < item.msl).length;
    const excessStock = itemData.filter(item => item.closingStock > item.msl * 2).length;
    const normalStock = itemData.length - belowMSL - excessStock;
    const avgStock = itemData.reduce((sum, item) => sum + item.closingStock, 0) / itemData.length;
    const avgMSL = itemData.reduce((sum, item) => sum + item.msl, 0) / itemData.length;

    return {
      belowMSL,
      excessStock,
      normalStock,
      avgStock: avgStock.toFixed(0),
      avgMSL: avgMSL.toFixed(0),
      totalDays: itemData.length
    };
  }, [filteredData, selectedItem]);

  const clearFilters = () => {
    setSelectedItem('');
    setDateRange({ start: '', end: '' });
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
          <h3 className="text-lg font-semibold text-white">Trend Analysis Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Select Item for Analysis" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {uniqueItems.map(item => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
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

        <Button onClick={clearFilters} variant="outline" className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700">
          Clear Filters
        </Button>
      </motion.div>

      {selectedItem && stockAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="metric-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Below MSL Days</p>
                <p className="text-2xl font-bold text-red-400">{stockAnalysis.belowMSL}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </div>

          <div className="metric-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Excess Stock Days</p>
                <p className="text-2xl font-bold text-yellow-400">{stockAnalysis.excessStock}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-yellow-400" />
            </div>
          </div>

          <div className="metric-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Normal Days</p>
                <p className="text-2xl font-bold text-green-400">{stockAnalysis.normalStock}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>

          <div className="metric-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Avg Stock</p>
                <p className="text-2xl font-bold text-blue-400">{stockAnalysis.avgStock}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </motion.div>
      )}

      {selectedItem ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Stock vs MSL Trend for {selectedItem}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="closingStock" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Closing Stock"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="msl" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="MSL"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container p-12 text-center"
        >
          <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Select an Item for Trend Analysis</h3>
          <p className="text-slate-400">Choose an item from the dropdown above to view its stock trends and MSL comparison over time.</p>
        </motion.div>
      )}

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Stock Status Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Closing Stock</th>
                  <th className="px-6 py-3">MSL</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Variance</th>
                </tr>
              </thead>
              <tbody>
                {chartData.slice(-10).map((item, index) => {
                  const variance = item.closingStock - item.msl;
                  const variancePercent = ((variance / item.msl) * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="bg-slate-800/30 border-b border-slate-700">
                      <td className="px-6 py-4 font-medium text-white">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{item.closingStock}</td>
                      <td className="px-6 py-4">{item.msl}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Below MSL' ? 'bg-red-900 text-red-300' :
                          item.status === 'Excess Stock' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${variance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {variance >= 0 ? '+' : ''}{variance} ({variancePercent}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TrendAnalysis;
