import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';

export function ITRFilterControls({ sortBy, setSortBy, sortOrder, setSortOrder, filterThreshold, setFilterThreshold }) {
  return (
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
  );
}