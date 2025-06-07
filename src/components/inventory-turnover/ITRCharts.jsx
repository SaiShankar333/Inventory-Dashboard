import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ITRCharts({ itrData, categoryITR }) {
  return (
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
  );
}