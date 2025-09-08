import React, { useState } from 'react';
import { mockDealData } from '../../data/mockDealData';

interface DashboardReportChartProps {
  report: any;
}

const DashboardReportChart: React.FC<DashboardReportChartProps> = ({ report }) => {
  const [hoveredBar, setHoveredBar] = useState<{index: number, x: number, y: number, data: any} | null>(null);

  // Use exact same filtering logic as ReportView
  const getFilteredData = () => {
    let filteredData = mockDealData;
    const appliedFilters = report.conditions || [];
    
    appliedFilters.forEach((filter: any) => {
      if (!filter.value || !filter.field || !filter.operator) {
        return;
      }
      
      switch (filter.field) {
        case 'Status':
          filteredData = filteredData.filter(deal => 
            filter.operator === '=' ? deal.status === filter.value : deal.status !== filter.value
          );
          break;
        case 'Pipeline':
          filteredData = filteredData.filter(deal => 
            filter.operator === '=' ? deal.pipeline === filter.value : deal.pipeline !== filter.value
          );
          break;
        case 'Owner':
          filteredData = filteredData.filter(deal => 
            filter.operator === '=' ? deal.owner === filter.value : deal.owner !== filter.value
          );
          break;
        case 'Deal value':
          const value = parseFloat(filter.value);
          if (!isNaN(value)) {
            filteredData = filteredData.filter(deal => {
              switch (filter.operator) {
                case '>': return deal.value > value;
                case '<': return deal.value < value;
                case '=': return deal.value === value;
                case '!=': return deal.value !== value;
                default: return true;
              }
            });
          }
          break;
        case 'Deal created on':
          if (filter.value) {
            filteredData = filteredData.filter(deal => {
              const dealDate = deal.addTime.split('T')[0];
              switch (filter.operator) {
                case '>': return dealDate > filter.value;
                case '<': return dealDate < filter.value;
                case '=': return dealDate === filter.value;
                case '!=': return dealDate !== filter.value;
                default: return true;
              }
            });
          }
          break;
      }
    });
    
    return filteredData;
  };

  // Use same filtered data for all report types, just display differently
  const getReportData = () => {
    const filteredDeals = getFilteredData();
    const frequency = report.frequency || 'Monthly';
    
    // Always use monthly performance data as base, just format display differently
    let data: Array<any>;
    if (frequency === 'Daily') {
      data = generateDailyPerformanceDataFromDeals(filteredDeals);
    } else if (frequency === 'Yearly') {
      data = generateYearlyPerformanceDataFromDeals(filteredDeals);
    } else {
      data = generateMonthlyPerformanceDataFromDeals(filteredDeals);
    }
    
    return data;
  };

  // Copy exact functions from ReportView
  const generateMonthlyPerformanceDataFromDeals = (deals: any[]) => {
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

  const generateDailyPerformanceDataFromDeals = (deals: any[]) => {
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

  const generateYearlyPerformanceDataFromDeals = (deals: any[]) => {
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

  const generateConversionDataFromDeals = (deals: any[]) => {
    console.log('Generating conversion data from deals:', deals.length);
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
    
    console.log('Monthly conversion data:', monthlyConversion);
    
    const result = Object.entries(monthlyConversion)
      .filter(([_, data]) => data.total > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => ({
        month,
        conversionRate: data.total > 0 ? ((data.won / data.total) * 100).toFixed(1) : '0',
        totalDeals: data.total,
        wonDeals: data.won
      }));
    
    console.log('Final conversion result:', result);
    return result;
  };

  const generateDurationDataFromDeals = (deals: any[]) => {
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
    
    // Return data even if no closed deals, but with zero counts
    return Object.entries(durationRanges).map(([range, count]) => ({
      range,
      count,
      percentage: closedDeals.length > 0 ? ((count / closedDeals.length) * 100).toFixed(1) : '0'
    }));
  };

  const generateProgressDataFromDeals = (deals: any[]) => {
    const openDeals = deals.filter(deal => deal.status === 'Open');
    const stageData: Record<string, number> = {};
    
    // Initialize with common stages to ensure we always have data
    const commonStages = ['Lead In', 'Contact Made', 'Needs Analysis', 'Proposal', 'Negotiation'];
    commonStages.forEach(stage => {
      stageData[stage] = 0;
    });
    
    openDeals.forEach(deal => {
      stageData[deal.stage] = (stageData[deal.stage] || 0) + 1;
    });
    
    const totalCount = Object.values(stageData).reduce((a, b) => a + b, 0);
    return Object.entries(stageData)
      .filter(([_, count]) => count > 0 || totalCount === 0) // Show all stages if no data, or only stages with data
      .map(([stage, count]) => ({
        stage,
        count,
        percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0'
      }));
  };

  const generateProductsDataFromDeals = (deals: any[]) => {
    const productData: Record<string, { count: number; totalValue: number; wonDeals: number }> = {};
    
    deals.forEach(deal => {
      if (deal.products && Array.isArray(deal.products)) {
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
      }
    });
    
    const result = Object.entries(productData)
      .sort(([,a], [,b]) => b.totalValue - a.totalValue)
      .map(([product, data]) => ({
        product,
        totalDeals: data.count,
        wonDeals: data.wonDeals,
        totalValue: data.totalValue,
        avgValue: data.count > 0 ? Math.round(data.totalValue / data.count) : 0,
        winRate: data.count > 0 ? ((data.wonDeals / data.count) * 100).toFixed(1) : '0'
      }));
    
    // Return at least one item if no products found
    return result.length > 0 ? result : [{
      product: 'No Products',
      totalDeals: 0,
      wonDeals: 0,
      totalValue: 0,
      avgValue: 0,
      winRate: '0'
    }];
  };

  // Use exact same chart rendering as ReportView (simplified for dashboard)
  const renderBarColumnChart = (data: any[], displayName: string) => {
    const chartType = report.chartType || 'column';
    const isHorizontal = chartType === 'bar';
    const displayedData = data.slice(0, Math.min(data.length, 6));
    const values = displayedData.map(item => {
      switch (report.type) {
        case 'Performance': return item.totalValue || 0;
        case 'Conversion': return item.total > 0 ? ((item.won / item.total) * 100) : 0;
        case 'Duration': return item.total || 0;
        case 'Progress': return item.open || 0;
        case 'Products': return item.totalValue || 0;
        default: return item.totalValue || 0;
      }
    });
    const maxValue = values.length > 0 ? Math.max(...values) : 1;
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '280px', padding: '12px' }}>
        <div className="chart-bars" style={{ 
          height: '220px', 
          display: 'flex', 
          flexDirection: isHorizontal ? 'column' : 'row',
          alignItems: isHorizontal ? 'flex-start' : 'flex-end', 
          gap: isHorizontal ? '6px' : '10px', 
          overflow: 'hidden'
        }}>
        {displayedData.map((item, index) => {
          let value: number, label: string, displayValue: string;
          
          // All report types use same data structure, just display differently
          label = item.month || 'N/A';
          
          switch (report.type) {
            case 'Performance':
              value = item.totalValue || 0;
              displayValue = `$${(value/1000).toFixed(0)}K`;
              break;
            case 'Conversion':
              // Calculate conversion rate from same data
              const conversionRate = item.total > 0 ? ((item.won / item.total) * 100) : 0;
              value = conversionRate;
              displayValue = `${conversionRate.toFixed(1)}%`;
              break;
            case 'Duration':
              value = item.total || 0;
              displayValue = `${value} deals`;
              break;
            case 'Progress':
              value = item.open || 0;
              displayValue = `${value} open`;
              break;
            case 'Products':
              value = item.totalValue || 0;
              displayValue = value > 1000 ? `$${(value/1000).toFixed(0)}K` : value.toString();
              break;
            default:
              value = item.totalValue || 0;
              displayValue = `$${(value/1000).toFixed(0)}K`;
          }
          
          const barSize = maxValue > 0 ? (value / maxValue) * (isHorizontal ? 70 : 180) : 0;
          const getStatusColor = (index: number) => {
            const statusColors = ['#90EE90', '#f4a261', '#ADD8E6'];
            return statusColors[index % 3];
          };
          const barColor = getStatusColor(index);
          
          return (
            <div key={index} className={`d-flex ${isHorizontal ? 'flex-row align-items-center' : 'flex-column align-items-center'}`} style={{ 
              flex: isHorizontal ? 'none' : '1 1 0px', 
              minWidth: isHorizontal ? '100%' : '45px',
              marginBottom: isHorizontal ? '4px' : '0',
              width: isHorizontal ? '100%' : 'auto'
            }}>
              <div className="text-center mb-1">
                <small className="fw-bold" style={{ color: barColor, fontSize: '10px' }}>{displayValue}</small>
              </div>
              
              <div 
                className="rounded d-flex position-relative" 
                style={{
                  width: isHorizontal ? `${barSize}%` : '40px',
                  height: isHorizontal ? '28px' : `${barSize}px`,
                  minHeight: isHorizontal ? '28px' : '20px',
                  minWidth: isHorizontal ? '5%' : '40px',
                  maxWidth: isHorizontal ? '80%' : '40px',
                  cursor: 'pointer',
                  flexDirection: isHorizontal ? 'row' : 'column',
                  overflow: 'hidden',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {report.type === 'Performance' && item.total > 0 ? (
                  <>
                    <div style={{
                      backgroundColor: '#28a745',
                      flex: item.won / item.total,
                      minWidth: isHorizontal ? '2px' : '100%',
                      minHeight: isHorizontal ? '100%' : '2px'
                    }}></div>
                    <div style={{
                      backgroundColor: '#f4a261',
                      flex: item.lost / item.total,
                      minWidth: isHorizontal ? '2px' : '100%',
                      minHeight: isHorizontal ? '100%' : '2px'
                    }}></div>
                    <div style={{
                      backgroundColor: '#ADD8E6',
                      flex: item.open / item.total,
                      minWidth: isHorizontal ? '2px' : '100%',
                      minHeight: isHorizontal ? '100%' : '2px'
                    }}></div>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: barColor,
                    width: '100%',
                    height: '100%'
                  }}></div>
                )}
              </div>
              
              <div className="text-center mt-1">
                <small style={{ fontSize: '9px', color: '#666' }}>
                  {label.length > 6 ? label.substring(0, 6) + '...' : label}
                </small>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    const data = getReportData();
    const displayName = report.name;
    
    console.log(`Rendering chart for ${report.type} report:`, data);
    
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-muted py-4">
          <small>No data available for the selected filters</small>
        </div>
      );
    }
    
    return renderBarColumnChart(data, displayName);
  };

  return (
    <div className="bg-white shadow-sm rounded p-3 h-100" style={{ minHeight: '380px', border: '1px solid #e9ecef' }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="flex-grow-1">
          <h6 className="mb-1" style={{ fontSize: '15px', fontWeight: '600', color: '#2c3e50' }}>
            {report.name}
          </h6>
          <small className="text-muted" style={{ fontSize: '11px' }}>
            {report.entity} • {report.type}
          </small>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default DashboardReportChart;