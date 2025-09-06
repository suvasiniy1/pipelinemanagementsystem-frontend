import { mockDealData } from '../../data/mockDealData';

export const getFilteredData = (conditions: any[]) => {
  let filteredData = mockDealData;
  console.log('Dashboard filtering with conditions:', conditions);
  console.log('Original data count:', mockDealData.length);
  
  conditions.forEach(condition => {
    // Handle both saved condition format and applied filter format
    const field = condition.field;
    const operator = condition.operator;
    const value = condition.value?.toString() || condition.value;
    
    if (!value || !field || !operator) {
      console.log('Skipping incomplete condition:', condition);
      return;
    }
    
    console.log('Applying condition:', { field, operator, value });
    const beforeCount = filteredData.length;
    
    switch (field) {
      case 'Status':
        filteredData = filteredData.filter(deal => 
          operator === '=' ? deal.status === value : deal.status !== value
        );
        break;
      case 'Pipeline':
        filteredData = filteredData.filter(deal => 
          operator === '=' ? deal.pipeline === value : deal.pipeline !== value
        );
        break;
      case 'Owner':
        filteredData = filteredData.filter(deal => 
          operator === '=' ? deal.owner === value : deal.owner !== value
        );
        break;
      case 'Deal value':
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          filteredData = filteredData.filter(deal => {
            switch (operator) {
              case '>': return deal.value > numValue;
              case '<': return deal.value < numValue;
              case '=': return deal.value === numValue;
              case '!=': return deal.value !== numValue;
              default: return true;
            }
          });
        }
        break;
      case 'Deal created on':
        if (value) {
          filteredData = filteredData.filter(deal => {
            const dealDate = deal.addTime.split('T')[0];
            switch (operator) {
              case '>': return dealDate > value;
              case '<': return dealDate < value;
              case '=': return dealDate === value;
              case '!=': return dealDate !== value;
              default: return true;
            }
          });
        }
        break;
    }
    
    const afterCount = filteredData.length;
    console.log(`Filter ${field} ${operator} ${value}: ${beforeCount} -> ${afterCount} deals`);
  });
  
  console.log('Final filtered data count:', filteredData.length);
  return filteredData;
};

export const generateMonthlyPerformanceDataFromDeals = (deals: any[]) => {
  const monthlyData: Record<string, Record<string, number>> = {};
  deals.forEach(deal => {
    const month = deal.addTime.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { won: 0, lost: 0, open: 0, total: 0, value: 0 };
    }
    const statusKey = deal.status.toLowerCase();
    if (['won', 'lost', 'open'].includes(statusKey)) {
      monthlyData[month][statusKey] = (monthlyData[month][statusKey] || 0) + 1;
      monthlyData[month].total += 1;
      monthlyData[month].value += deal.value;
    }
  });
  
  return Object.entries(monthlyData)
    .filter(([_, data]) => data.total > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      won: data.won || 0,
      lost: data.lost || 0,
      open: data.open || 0,
      total: data.total,
      totalValue: data.value
    }));
};

export const generateDailyPerformanceDataFromDeals = (deals: any[]) => {
  const dailyData: Record<string, Record<string, number>> = {};
  deals.forEach(deal => {
    const dealDate = new Date(deal.addTime);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - dealDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff <= 30) {
      const day = deal.addTime;
      if (!dailyData[day]) {
        dailyData[day] = { won: 0, lost: 0, open: 0, total: 0, value: 0 };
      }
      const statusKey = deal.status.toLowerCase();
      if (['won', 'lost', 'open'].includes(statusKey)) {
        dailyData[day][statusKey] = (dailyData[day][statusKey] || 0) + 1;
        dailyData[day].total += 1;
        dailyData[day].value += deal.value;
      }
    }
  });
  
  return Object.entries(dailyData)
    .filter(([_, data]) => data.total > 0)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-20)
    .map(([day, data]) => ({
      month: day,
      won: data.won || 0,
      lost: data.lost || 0,
      open: data.open || 0,
      total: data.total,
      totalValue: data.value
    }));
};

export const generateYearlyPerformanceDataFromDeals = (deals: any[]) => {
  const yearlyData: Record<string, Record<string, number>> = {};
  deals.forEach(deal => {
    const year = deal.addTime.substring(0, 4);
    if (!yearlyData[year]) {
      yearlyData[year] = { won: 0, lost: 0, open: 0, total: 0, value: 0 };
    }
    const statusKey = deal.status.toLowerCase();
    if (['won', 'lost', 'open'].includes(statusKey)) {
      yearlyData[year][statusKey] = (yearlyData[year][statusKey] || 0) + 1;
      yearlyData[year].total += 1;
      yearlyData[year].value += deal.value;
    }
  });
  
  return Object.entries(yearlyData)
    .filter(([_, data]) => data.total > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, data]) => ({
      month: year,
      won: data.won || 0,
      lost: data.lost || 0,
      open: data.open || 0,
      total: data.total,
      totalValue: data.value
    }));
};

export const generateConversionDataFromDeals = (deals: any[]) => {
  const monthlyConversion: Record<string, { total: number; won: number }> = {};
  deals.forEach(deal => {
    const month = deal.addTime.substring(0, 7);
    if (!monthlyConversion[month]) {
      monthlyConversion[month] = { total: 0, won: 0 };
    }
    monthlyConversion[month].total += 1;
    if (deal.status === 'Won') {
      monthlyConversion[month].won += 1;
    }
  });
  
  return Object.entries(monthlyConversion)
    .filter(([_, data]) => data.total > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, data]) => ({
      month,
      conversionRate: ((data.won / data.total) * 100).toFixed(1),
      totalDeals: data.total,
      wonDeals: data.won
    }));
};

export const generateDurationDataFromDeals = (deals: any[]) => {
  const closedDeals = deals.filter(deal => deal.duration && (deal.status === 'Won' || deal.status === 'Lost'));
  const durationRanges: Record<string, number> = {
    '0-30 days': 0,
    '31-60 days': 0,
    '61-90 days': 0,
    '90+ days': 0
  };
  
  closedDeals.forEach(deal => {
    if (deal.duration <= 30) durationRanges['0-30 days']++;
    else if (deal.duration <= 60) durationRanges['31-60 days']++;
    else if (deal.duration <= 90) durationRanges['61-90 days']++;
    else durationRanges['90+ days']++;
  });
  
  return Object.entries(durationRanges).map(([range, count]) => ({
    range,
    count,
    percentage: closedDeals.length > 0 ? ((count / closedDeals.length) * 100).toFixed(1) : '0'
  }));
};

export const generateProgressDataFromDeals = (deals: any[]) => {
  const stageData: Record<string, number> = {};
  deals.filter(deal => deal.status === 'Open').forEach(deal => {
    stageData[deal.stage] = (stageData[deal.stage] || 0) + 1;
  });
  
  const totalCount = Object.values(stageData).reduce((a, b) => a + b, 0);
  return Object.entries(stageData).map(([stage, count]) => ({
    stage,
    count,
    percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0'
  }));
};

export const generateProductsDataFromDeals = (deals: any[]) => {
  const productData: Record<string, { count: number; totalValue: number; wonDeals: number }> = {};
  deals.forEach(deal => {
    deal.products.forEach((product: string) => {
      if (!productData[product]) {
        productData[product] = { count: 0, totalValue: 0, wonDeals: 0 };
      }
      productData[product].count += 1;
      productData[product].totalValue += deal.value;
      if (deal.status === 'Won') {
        productData[product].wonDeals += 1;
      }
    });
  });
  
  return Object.entries(productData)
    .sort(([,a], [,b]) => b.totalValue - a.totalValue)
    .map(([product, data]) => ({
      product,
      totalDeals: data.count,
      wonDeals: data.wonDeals,
      totalValue: data.totalValue,
      avgValue: Math.round(data.totalValue / data.count),
      winRate: ((data.wonDeals / data.count) * 100).toFixed(1)
    }));
};

export const getReportData = (reportType: string, frequency: string, conditions: any[]) => {
  const filteredDeals = getFilteredData(conditions);
  let data: Array<any>;
  
  if (reportType === 'Performance') {
    if (frequency === 'Daily') {
      data = generateDailyPerformanceDataFromDeals(filteredDeals);
    } else if (frequency === 'Yearly') {
      data = generateYearlyPerformanceDataFromDeals(filteredDeals);
    } else {
      data = generateMonthlyPerformanceDataFromDeals(filteredDeals);
    }
  } else {
    switch (reportType) {
      case 'Conversion':
        data = generateConversionDataFromDeals(filteredDeals);
        break;
      case 'Duration':
        data = generateDurationDataFromDeals(filteredDeals);
        break;
      case 'Progress':
        data = generateProgressDataFromDeals(filteredDeals);
        break;
      case 'Products':
        data = generateProductsDataFromDeals(filteredDeals);
        break;
      default:
        data = generateMonthlyPerformanceDataFromDeals(filteredDeals);
    }
    
    if (frequency === 'Daily' && data.length > 7) {
      data = data.slice(-7);
    } else if (frequency === 'Yearly' && data.length > 3) {
      data = data.slice(-3);
    }
  }
  
  return data;
};