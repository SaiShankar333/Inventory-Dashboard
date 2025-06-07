import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useITRData, useITRStats, useCategoryITR } from '@/hooks/useInventoryTurnover';
import { ITRFilterControls } from '@/components/inventory-turnover/ITRFilterControls';
import { ITRStatsSummary } from '@/components/inventory-turnover/ITRStatsSummary';
import { ITRCharts } from '@/components/inventory-turnover/ITRCharts';
import { ITRTable } from '@/components/inventory-turnover/ITRTable';

function InventoryTurnover({ data }) {
  const [sortBy, setSortBy] = useState('itr');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterThreshold, setFilterThreshold] = useState('all');

  const itrData = useITRData(data, sortBy, sortOrder, filterThreshold);
  const itrStats = useITRStats(itrData);
  const categoryITR = useCategoryITR(itrData);

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
      <ITRFilterControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        filterThreshold={filterThreshold}
        setFilterThreshold={setFilterThreshold}
      />
      
      <ITRStatsSummary itrStats={itrStats} />
      
      <ITRCharts itrData={itrData} categoryITR={categoryITR} />

      <ITRTable itrData={itrData} toggleSort={toggleSort} />
    </div>
  );
}

export default InventoryTurnover;