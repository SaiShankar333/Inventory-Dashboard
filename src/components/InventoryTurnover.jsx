
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

function InventoryTurnover({ data }) {
  const [sortBy, setSortBy] = useState('itr');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterThreshold, setFilterThreshold] = useState('all');

  const itrData = useMemo(() => {
    const itemStats = {};

    // Group data by item
    data.forEach(item => {
      if (!itemStats[item.itemName]) {
        itemStats[item.itemName] = {
          itemName: item.itemName,
          category: item.category,
          abcClass: item.abcClass,
          totalConsumption: 0,
          totalOpeningStock: 0,
          totalClosingStock: 0,
          dataPoints: 0
        };
      }

      itemStats[item.itemName].totalConsumption += item.consumption;
      itemStats[item.itemName].totalOpeningStock += item.openingStock;
      itemStats[item.itemName].totalClosingStock += item.closingStock;
      itemStats[item.itemName].dataPoints += 1;
    });

    // Calculate ITR for each item
    const itrResults = Object.values(itemStats).map(item => {
      const avgInventory = (item.totalOpeningStock + item.totalClosingStock) / (2 * item.dataPoints);
      const itr = avgInventory > 0 ? item.totalConsumption / avgInventory : 0;
      
      // Determine turnover category
      let turnoverCategory = 'Normal';
      if (itr < 2) turnoverCategory = 'Low';
      else if (itr > 10) turnoverCategory = 'High';

      return {
        ...item,
        avgInventory: avgInventory.toFixed(2),
        itr: itr.toFixed(2),
        turnoverCategory,
        avgConsumption: (item.totalConsumption / item.dataPoints).toFixed(2)
      };
    });

    // Apply filtering
    let filtered = itrResults;
    if (filterThreshold === 'low') {
      filtered = itrResults.filter(item => parseFloat(item.itr) < 2);
    } else if (filterThreshold === 'high') {
      filtered = itrResults.filter(item => parseFloat(item.itr) > 10);
    } else if (filterThreshold === 'normal') {
      filtered = itrResults.filter(item => parseFloat(item.itr) >= 2 && parseFloat(item.itr) <= 10);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'itr':
          aValue = parseFloat(a.itr);
          bValue = parseFloat(b.itr);
          break;
        case 'consumption':
          aValue = a.totalConsumption;
          bValue = b.totalConsumption;
          break;
        case 'inventory':
          aValue = parseFloat(a.avgInventory);
          bValue = parseFloat(b.avgInventory);
          break;
        case 'name':
          aValue = a.itemName;
          bValue = b.itemName;
          break;
        default:
          aValue = parseFloat(a.itr);
          bValue = parseFloat(b.itr);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, sortBy, sortOrder, filterThreshold]);

  const itrStats = useMemo(() => {
    const lowTurnover = itrData.filter(item => parseFloat(item.itr) < 2).length;
    const highTurnover = itrData.filter(item => parseFloat(item.itr) > 10).length;
    const normalTurnover = itrData.length - lowTurnover - highTurnover;
    const avgITR = itrData.reduce((sum, item) => sum + parseFloat(item.itr), 0) / itrData.length;

    return {
      lowTurnover,
      highTurnover,
      normalTurnover,
      avgITR: avgITR.toFixed(2),
      totalItems: itrData.length
    };
  }, [itrData]);

  const categoryITR = useMemo(() => {
    const categoryStats = {};

    itrData.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = {
          category: item.category,
          totalITR: 0,
          itemCount: 0,
          avgITR: 0
        };
      }

      categoryStats[item.category].totalITR += parseFloat(item.itr);
      categoryStats[item.category].itemCount += 1;
    });

    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].avgITR = categoryStats[category].totalITR / categoryStats[category].itemCount;
    });

    return Object.values(categoryStats).sort((a, b) => b.avgITR - a.avgITR);
  }, [itrData]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="filter-card p-6 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">ITR Analysis Controls</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="itr">ITR Value</SelectItem>
              <SelectItem value="consumption">Total Consumption</SelectItem>
              <SelectItem value="inventory">Average Inventory</SelectItem>
              <SelectItem value="name">Item Name</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterThreshold} onValueChange={setFilterThreshold}>
            <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
              <SelectValue placeholder="Filter by Threshold" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="low">Low Turnover (&lt; 2)</SelectItem>
              <SelectItem value="normal">Normal Turnover (2-10)</SelectItem>
              <SelectItem value="high">High Turnover (&gt; 10)</SelectItem>
            </SelectContent>
          </Select>
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
              <p className="text-sm text-slate-400 mb-1">Low Turnover</p>
              <p className="text-2xl font-bold text-red-400">{itrStats.lowTurnover}</p>
            </div>
            <TrendingDown className="h-6 w-6 text-red-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Normal Turnover</p>
              <p className="text-2xl font-bold text-green-400">{itrStats.normalTurnover}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">High Turnover</p>
              <p className="text-2xl font-bold text-yellow-400">{itrStats.highTurnover}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-yellow-400" />
          </div>
        </div>

        <div className="metric-card p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Average ITR</p>
              <p className="text-2xl font-bold text-blue-400">{itrStats.avgITR}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-blue-400" />
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
          <h3 className="text-xl font-semibold text-white mb-4">Top 10 Items by ITR</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={itrData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="itemName" 
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar 
                dataKey="itr" 
                fill="#3b82f6"
                name="ITR"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Category Average ITR</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryITR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="category" 
                stroke="#9ca3af"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar 
                dataKey="avgITR" 
                fill="#10b981"
                name="Average ITR"
              />
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
        <h3 className="text-xl font-semibold text-white mb-4">
          Inventory Turnover Ratio Analysis
          <span className="text-sm text-slate-400 ml-2">
            (ITR = Total Consumption ÷ Average Inventory)
          </span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('name')}
                    className="text-slate-400 hover:text-white p-0"
                  >
                    Item Name
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">ABC Class</th>
                <th className="px-6 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('consumption')}
                    className="text-slate-400 hover:text-white p-0"
                  >
                    Total Consumption
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('inventory')}
                    className="text-slate-400 hover:text-white p-0"
                  >
                    Avg Inventory
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('itr')}
                    className="text-slate-400 hover:text-white p-0"
                  >
                    ITR
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {itrData.slice(0, 20).map((item, index) => (
                <tr key={item.itemName} className="bg-slate-800/30 border-b border-slate-700">
                  <td className="px-6 py-4 font-medium text-white">{item.itemName}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.abcClass === 'A' ? 'bg-green-900 text-green-300' :
                      item.abcClass === 'B' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {item.abcClass}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.totalConsumption.toLocaleString()}</td>
                  <td className="px-6 py-4">{item.avgInventory}</td>
                  <td className="px-6 py-4 font-bold">{item.itr}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.turnoverCategory === 'Low' ? 'bg-red-900 text-red-300' :
                      item.turnoverCategory === 'High' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {item.turnoverCategory}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {itrData.length > 20 && (
          <div className="mt-4 text-center text-slate-400">
            Showing top 20 items. Total items: {itrData.length}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default InventoryTurnover;
