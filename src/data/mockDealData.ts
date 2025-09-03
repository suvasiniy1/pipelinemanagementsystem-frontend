// Mock deal data for the last year
export interface DealData {
  id: number;
  title: string;
  value: number;
  status: 'Open' | 'Won' | 'Lost' | 'Qualified' | 'Proposal' | 'Negotiation';
  pipeline: string;
  stage: string;
  addTime: string;
  closeTime?: string;
  duration?: number; // days
  products: string[];
  owner: string;
  organization: string;
  probability: number;
}

const generateDateRange = (): string[] => {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const dates = generateDateRange();
const statuses: DealData['status'][] = ['Open', 'Won', 'Lost'];
const pipelines = ['Sales', 'Marketing', 'Enterprise', 'SMB'];
const stages = ['Lead In', 'Contact Made', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
const products = ['CRM Pro', 'Analytics Suite', 'Mobile App', 'Integration Pack', 'Premium Support', 'Training Package'];
const owners = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'David Wilson', 'Emma Brown'];
const organizations = ['TechCorp Inc', 'Global Solutions', 'StartupXYZ', 'Enterprise Ltd', 'Innovation Co', 'Digital Dynamics', 'Future Systems', 'Smart Business'];

// Generate deals with weighted distribution for better daily/monthly/yearly data
const generateWeightedDeals = () => {
  const deals: DealData[] = [];
  let dealId = 1;
  
  // Generate daily data (last 30 days) - 3-15 deals per day
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dealsPerDay = Math.floor(Math.random() * 13) + 3; // 3-15 deals per day
    
    for (let j = 0; j < dealsPerDay; j++) {
      deals.push(createDeal(dealId++, dateStr));
    }
  }
  
  // Generate monthly data (last 12 months) - additional deals
  for (let i = 1; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const dealsPerMonth = Math.floor(Math.random() * 200) + 100; // 100-300 deals per month
    
    for (let j = 0; j < dealsPerMonth; j++) {
      const dayOffset = Math.floor(Math.random() * 28);
      const dealDate = new Date(date);
      dealDate.setDate(dealDate.getDate() - dayOffset);
      const dateStr = dealDate.toISOString().split('T')[0];
      deals.push(createDeal(dealId++, dateStr));
    }
  }
  
  // Generate yearly data (last 3 years) - additional deals
  for (let i = 1; i < 3; i++) {
    const year = new Date().getFullYear() - i;
    const dealsPerYear = Math.floor(Math.random() * 1000) + 500; // 500-1500 deals per year
    
    for (let j = 0; j < dealsPerYear; j++) {
      const month = Math.floor(Math.random() * 12);
      const day = Math.floor(Math.random() * 28) + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      deals.push(createDeal(dealId++, dateStr));
    }
  }
  
  return deals;
};

const createDeal = (id: number, addDate: string): DealData => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const isClosedWon = status === 'Won';
  const isClosedLost = status === 'Lost';
  const isClosed = isClosedWon || isClosedLost;
  
  // Calculate close date and duration for closed deals
  let closeTime: string | undefined;
  let duration: number | undefined;
  
  if (isClosed) {
    const addDateObj = new Date(addDate);
    const daysToClose = Math.floor(Math.random() * 120) + 1; // 1-120 days
    const closeDateObj = new Date(addDateObj);
    closeDateObj.setDate(closeDateObj.getDate() + daysToClose);
    closeTime = closeDateObj.toISOString().split('T')[0];
    duration = daysToClose;
  }

  return {
    id,
    title: `Deal ${id} - ${organizations[Math.floor(Math.random() * organizations.length)]}`,
    value: Math.floor(Math.random() * 95000) + 5000, // $5K - $100K
    status,
    pipeline: pipelines[Math.floor(Math.random() * pipelines.length)],
    stage: isClosed ? (isClosedWon ? 'Closed Won' : 'Closed Lost') : stages[Math.floor(Math.random() * (stages.length - 2))],
    addTime: addDate,
    closeTime,
    duration,
    products: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      products[Math.floor(Math.random() * products.length)]
    ).filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
    owner: owners[Math.floor(Math.random() * owners.length)],
    organization: organizations[Math.floor(Math.random() * organizations.length)],
    probability: isClosed ? (isClosedWon ? 100 : 0) : Math.floor(Math.random() * 80) + 10 // 10-90% for open deals
  };
};

export const mockDealData: DealData[] = generateWeightedDeals();

// Chart data generators
export const generateDealPerformanceData = () => {
  const monthlyData: Record<string, Record<string, number>> = {};
  mockDealData.forEach(deal => {
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
      totalValue: data.value,
      tooltip: `${month}: ${data.total} total deals (Won: ${data.won}, Lost: ${data.lost}, Open: ${data.open})`
    }));
};

export const generateDealConversionData = () => {
  const monthlyConversion: Record<string, { total: number; won: number }> = {};
  mockDealData.forEach(deal => {
    // Use addTime for conversion analysis instead of closeTime
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
    .slice(-12) // Last 12 months
    .map(([month, data]) => ({
      month,
      conversionRate: ((data.won / data.total) * 100).toFixed(1),
      totalDeals: data.total,
      wonDeals: data.won,
      tooltip: `${month}: ${data.total} deals, ${data.won} won (${((data.won / data.total) * 100).toFixed(1)}%)`
    }));
};

export const generateDealDurationData = () => {
  const closedDeals = mockDealData.filter(deal => deal.duration && (deal.status === 'Won' || deal.status === 'Lost'));
  const durationRanges: Record<string, number> = {
    '0-30 days': 0,
    '31-60 days': 0,
    '61-90 days': 0,
    '90+ days': 0
  };
  
  closedDeals.forEach(deal => {
    if (deal.duration! <= 30) durationRanges['0-30 days']++;
    else if (deal.duration! <= 60) durationRanges['31-60 days']++;
    else if (deal.duration! <= 90) durationRanges['61-90 days']++;
    else durationRanges['90+ days']++;
  });
  
  return Object.entries(durationRanges).map(([range, count]) => ({
    range,
    count,
    percentage: closedDeals.length > 0 ? ((count / closedDeals.length) * 100).toFixed(1) : '0',
    tooltip: `${range}: ${count} deals (${closedDeals.length > 0 ? ((count / closedDeals.length) * 100).toFixed(1) : '0'}%)`
  }));
};

export const generateDealProgressData = () => {
  const stageData: Record<string, number> = {};
  mockDealData.filter(deal => deal.status === 'Open').forEach(deal => {
    stageData[deal.stage] = (stageData[deal.stage] || 0) + 1;
  });
  
  const totalCount = Object.values(stageData).reduce((a, b) => a + b, 0);
  return Object.entries(stageData).map(([stage, count]) => ({
    stage,
    count,
    percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0',
    tooltip: `${stage}: ${count} deals (${totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0'}%)`
  }));
};

export const generateDealProductsData = () => {
  const productData: Record<string, { count: number; totalValue: number; wonDeals: number }> = {};
  mockDealData.forEach(deal => {
    deal.products.forEach(product => {
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
      winRate: ((data.wonDeals / data.count) * 100).toFixed(1),
      tooltip: `${product}: ${data.count} deals, $${data.totalValue.toLocaleString()} total value`
    }));
};
export const generateDailyPerformanceData = () => {
  const dailyData: Record<string, Record<string, number>> = {};
  
  // Get all deals from last 30 days
  mockDealData.forEach(deal => {
    const dealDate = new Date(deal.addTime);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - dealDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Only include deals from last 30 days
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
    .slice(-20) // Show last 20 days with data
    .map(([day, data]) => ({
      month: day,
      won: data.won || 0,
      lost: data.lost || 0,
      open: data.open || 0,
      total: data.total,
      totalValue: data.value,
      tooltip: `${day}: ${data.total} total deals (Won: ${data.won}, Lost: ${data.lost}, Open: ${data.open})`
    }));
};

export const generateYearlyPerformanceData = () => {
  const yearlyData: Record<string, Record<string, number>> = {};
  mockDealData.forEach(deal => {
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
      totalValue: data.value,
      tooltip: `${year}: ${data.total} total deals (Won: ${data.won}, Lost: ${data.lost}, Open: ${data.open})`
    }));
};