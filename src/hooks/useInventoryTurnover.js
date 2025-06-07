import { useMemo } from 'react';

export const useITRData = (data, sortBy, sortOrder, filterThreshold) => {
  return useMemo(() => {
    const itemStats = {};

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

    const itrResults = Object.values(itemStats).map(item => {
      const avgInventory = (item.totalOpeningStock + item.totalClosingStock) / (2 * item.dataPoints);
      const itr = avgInventory > 0 ? item.totalConsumption / avgInventory : 0;
      
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

    let filtered = itrResults;
    if (filterThreshold === 'low') {
      filtered = itrResults.filter(item => parseFloat(item.itr) < 2);
    } else if (filterThreshold === 'high') {
      filtered = itrResults.filter(item => parseFloat(item.itr) > 10);
    } else if (filterThreshold === 'normal') {
      filtered = itrResults.filter(item => parseFloat(item.itr) >= 2 && parseFloat(item.itr) <= 10);
    }

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
};

export const useITRStats = (itrData) => {
  return useMemo(() => {
    if (!itrData || itrData.length === 0) {
      return { lowTurnover: 0, highTurnover: 0, normalTurnover: 0, avgITR: '0.00', totalItems: 0 };
    }
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
};

export const useCategoryITR = (itrData) => {
  return useMemo(() => {
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
      categoryStats[category].avgITR = categoryStats[category].itemCount > 0 
        ? categoryStats[category].totalITR / categoryStats[category].itemCount 
        : 0;
    });

    return Object.values(categoryStats).sort((a, b) => b.avgITR - a.avgITR);
  }, [itrData]);
};