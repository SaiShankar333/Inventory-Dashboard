import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export function ITRStatsSummary({ itrStats }) {
  return (
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
  );
}