import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export function ITRTable({ itrData, toggleSort }) {
  return (
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
            {itrData.slice(0, 20).map((item) => (
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
  );
}