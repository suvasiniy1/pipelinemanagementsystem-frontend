import React, { useState } from "react";
import { Form, Button, Badge, Dropdown, Tab, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  faPlus, 
  faTimes, 
  faChartBar, 
  faChartLine, 
  faTable,
  faDownload,
  faFilter,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { ReportDefinition } from '../../models/reportModels';
import { 
  generateDealPerformanceData, 
  generateDealConversionData, 
  generateDealDurationData, 
  generateDealProgressData, 
  generateDealProductsData,
  generateDailyPerformanceData,
  generateYearlyPerformanceData,
  mockDealData 
} from '../../data/mockDealData';

interface ReportViewProps {
  entity: string;
  reportType: string;
  reportDefinition?: ReportDefinition;
  onBack: () => void;
}

interface FilterCondition {
  id: string;
  entity: string;
  field: string;
  operator: string;
  value: string;
  displayText: string;
}

const ReportView: React.FC<ReportViewProps> = ({ entity, reportType, reportDefinition, onBack }) => {
  const [appliedFilters, setAppliedFilters] = useState<FilterCondition[]>(
    reportDefinition?.conditions.map(condition => ({
      id: condition.id.toString(),
      entity: 'Deal',
      field: condition.field,
      operator: condition.operator,
      value: condition.value.toString(),
      displayText: `${condition.field} ${condition.operator} ${condition.value}`
    })) || []
  );
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState({
    entity: 'Deal',
    field: '',
    operator: '',
    value: ''
  });
  const [chartType, setChartType] = useState<"column" | "bar" | "pie" | "scorecard" | "table">("column");
  const [viewBy, setViewBy] = useState("Deal created on");
  const [frequency, setFrequency] = useState(reportDefinition?.frequency || "Daily");
  const [segmentBy, setSegmentBy] = useState("Status");
  const [activeTab, setActiveTab] = useState("deals");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [chartExpanded, setChartExpanded] = useState(true);
  const [tableExpanded, setTableExpanded] = useState(true);
  const [dealsCurrentPage, setDealsCurrentPage] = useState(1);
  const [dealsPageSize, setDealsPageSize] = useState(25);
  const [hoveredBar, setHoveredBar] = useState<{index: number, x: number, y: number, data: any} | null>(null);
  const [savedFilters, setSavedFilters] = useState<FilterCondition[]>(
    reportDefinition?.conditions.map(condition => ({
      id: condition.id.toString(),
      entity: 'Deal',
      field: condition.field,
      operator: condition.operator,
      value: condition.value.toString(),
      displayText: `${condition.field} ${condition.operator} ${condition.value}`
    })) || []
  );


  const getFilteredData = () => {
    let filteredData = mockDealData;
    console.log('Filtering data with appliedFilters:', appliedFilters);
    console.log('Current newCondition:', newCondition);
    console.log('Original data count:', mockDealData.length);
    
    // Include current newCondition if it's complete and there are no applied filters
    const filtersToApply = [...appliedFilters];
    if (appliedFilters.length === 0 && newCondition.field && newCondition.operator && newCondition.value) {
      filtersToApply.push({
        id: 'temp',
        entity: newCondition.entity,
        field: newCondition.field,
        operator: newCondition.operator,
        value: newCondition.value,
        displayText: `${newCondition.field} ${newCondition.operator} ${newCondition.value}`
      });
    }
    
    filtersToApply.forEach(filter => {
      // Skip filters with empty values
      if (!filter.value || !filter.field || !filter.operator) {
        console.log('Skipping incomplete filter:', filter);
        return;
      }
      
      console.log('Applying filter:', filter);
      const beforeCount = filteredData.length;
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
              const dealDate = deal.addTime.split('T')[0]; // Get date part only
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
      
      const afterCount = filteredData.length;
      console.log(`Filter ${filter.field} ${filter.operator} ${filter.value}: ${beforeCount} -> ${afterCount} deals`);
    });
    
    console.log('Final filtered data count:', filteredData.length);
    return filteredData;
  };

  const removeFilter = (filterId: string) => {
    const updatedFilters = appliedFilters.filter(f => f.id !== filterId);
    setAppliedFilters(updatedFilters);
    // If removing the last filter, clear the draft condition too
    if (updatedFilters.length === 0) {
      setNewCondition({ entity: 'Deal', field: '', operator: '', value: '' });
    }
  };

  const handleAddConditionClick = () => {
    if (showAddCondition) {
      if (newCondition.field && newCondition.operator && newCondition.value) {
        const condition: FilterCondition = {
          id: Date.now().toString(),
          entity: newCondition.entity,
          field: newCondition.field,
          operator: newCondition.operator,
          value: newCondition.value,
          displayText: `${newCondition.field} ${newCondition.operator} ${newCondition.value}`
        };
        setAppliedFilters([...appliedFilters, condition]);
        setNewCondition({ entity: 'Deal', field: '', operator: '', value: '' });
        setShowAddCondition(false);
      }
    } else {
      setShowAddCondition(true);
    }
  };

  const getFieldOptions = () => [
    { value: 'Deal created on', label: 'Deal created on' },
    { value: 'Deal value', label: 'Deal value' },
    { value: 'Status', label: 'Status' },
    { value: 'Pipeline', label: 'Pipeline' },
    { value: 'Owner', label: 'Owner' }
  ];

  const getValueOptions = (field: string) => {
    const uniqueValues = new Set<string>();
    mockDealData.forEach(deal => {
      switch (field) {
        case 'Status':
          uniqueValues.add(deal.status);
          break;
        case 'Pipeline':
          uniqueValues.add(deal.pipeline);
          break;
        case 'Owner':
          uniqueValues.add(deal.owner);
          break;
      }
    });
    return Array.from(uniqueValues).sort().map(value => ({ value, label: value }));
  };

  const operatorOptions = [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Does not equal' },
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' }
  ];

  const getReportData = () => {
    const reportName = reportDefinition?.name || `${entity} ${reportType} Report`;
    const filteredDeals = getFilteredData();
    let data: Array<any>;
    
    // Generate data based on filtered deals
    if (reportName === 'Deal Performance Report') {
      if (frequency === 'Daily') {
        data = generateDailyPerformanceDataFromDeals(filteredDeals);
      } else if (frequency === 'Yearly') {
        data = generateYearlyPerformanceDataFromDeals(filteredDeals);
      } else {
        data = generateMonthlyPerformanceDataFromDeals(filteredDeals);
      }
    } else {
      switch (reportName) {
        case 'Deal Conversion Analysis':
          data = generateConversionDataFromDeals(filteredDeals);
          break;
        case 'Deal Duration Tracking':
          data = generateDurationDataFromDeals(filteredDeals);
          break;
        case 'Deal Progress Overview':
          data = generateProgressDataFromDeals(filteredDeals);
          break;
        case 'Deal Products Analysis':
          data = generateProductsDataFromDeals(filteredDeals);
          break;
        default:
          data = generateMonthlyPerformanceDataFromDeals(filteredDeals);
      }
      
      // Apply frequency filtering for non-performance reports
      if (frequency === 'Daily' && data.length > 7) {
        data = data.slice(-7);
      } else if (frequency === 'Yearly' && data.length > 3) {
        data = data.slice(-3);
      }
    }
    
    return data;
  };

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
    
    return Object.entries(durationRanges).map(([range, count]) => ({
      range,
      count,
      percentage: closedDeals.length > 0 ? ((count / closedDeals.length) * 100).toFixed(1) : '0'
    }));
  };

  const generateProgressDataFromDeals = (deals: any[]) => {
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

  const generateProductsDataFromDeals = (deals: any[]) => {
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

  const renderChart = () => {
    const data = getReportData();
    const reportName = reportDefinition?.name || `${entity} ${reportType} Report`;
    
    if (chartType === 'table') {
      return renderDataGrid(data, reportName);
    }
    
    if (chartType === 'scorecard') {
      return renderScoreCard(data, reportName);
    }
    
    return (
      <div className="chart-container">
        <div className="bg-white border rounded p-4" style={{ minHeight: '400px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">{reportName} - {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</h6>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-1">
                  <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#28a745' }}></div>
                  <small>Won</small>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#F08080' }}></div>
                  <small>Lost</small>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <div className="rounded" style={{ width: '12px', height: '12px', backgroundColor: '#ADD8E6' }}></div>
                  <small>Open</small>
                </div>
              </div>
              <small className="text-muted">Frequency: {frequency}</small>
            </div>
          </div>
          {renderChartVisualization(data, reportName)}
        </div>
      </div>
    );
  };

  const renderChartVisualization = (data: any[], reportName: string) => {
    if (!data.length) return <div className="text-center text-muted py-5">No data available</div>;
    
    if (chartType === 'column' || chartType === 'bar') {
      return renderBarColumnChart(data, reportName);
    }
    
    if (chartType === 'pie') {
      return renderPieChart(data, reportName);
    }
    
    return <div className="text-center text-muted py-5">Chart visualization coming soon</div>;
  };

  const renderBarColumnChart = (data: any[], reportName: string) => {
    const isHorizontal = chartType === 'bar';
    const displayedData = data.slice(0, isHorizontal ? 6 : Math.min(data.length, 12));
    const maxValue = Math.max(...displayedData.map(item => {
      switch (reportName) {
        case 'Deal Performance Report': return item.totalValue;
        case 'Deal Conversion Analysis': return parseFloat(item.conversionRate);
        case 'Deal Duration Tracking': return item.count;
        case 'Deal Progress Overview': return item.count;
        case 'Deal Products Analysis': return item.totalValue;
        default: return 0;
      }
    }));
    
    return (
      <div style={{ position: 'relative', width: '100%', height: '400px', padding: '20px' }}>
        {/* Y-axis for column chart with horizontal grid lines */}
        {!isHorizontal && (
          <>
            <div style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '20px', 
              height: '320px', 
              display: 'flex', 
              flexDirection: 'column-reverse', 
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#666'
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ textAlign: 'right', paddingRight: '5px' }}>
                  {Math.round((maxValue / 5) * i / 1000)}K
                </div>
              ))}
            </div>
            {/* Horizontal grid lines for Y-axis */}
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: '40px',
                right: '20px',
                top: `${20 + (320 - (320 / 5) * i)}px`,
                height: '1px',
                backgroundColor: '#e0e0e0',
                zIndex: 1
              }} />
            ))}
          </>
        )}
        
        {/* Chart area */}
        <div className="chart-bars" style={{ 
          height: '320px', 
          display: 'flex', 
          flexDirection: isHorizontal ? 'column' : 'row',
          alignItems: isHorizontal ? 'flex-start' : 'flex-end', 
          gap: isHorizontal ? '6px' : '12px', 
          marginLeft: isHorizontal ? '0' : '40px',
          marginBottom: isHorizontal ? '0' : '30px',
          width: isHorizontal ? '100%' : 'calc(100% - 40px)',
          overflow: 'hidden'
        }}>
        {displayedData.map((item, index) => {
          let value: number, label: string, displayValue: string;
          switch (reportName) {
            case 'Deal Performance Report':
              value = item.totalValue;
              label = item.month;
              displayValue = `$${(value/1000).toFixed(0)}K`;
              break;
            case 'Deal Conversion Analysis':
              value = parseFloat(item.conversionRate);
              label = item.month;
              displayValue = `${value}%`;
              break;
            case 'Deal Duration Tracking':
              value = item.count;
              label = item.range;
              displayValue = value.toString();
              break;
            case 'Deal Progress Overview':
              value = item.count;
              label = item.stage;
              displayValue = value.toString();
              break;
            case 'Deal Products Analysis':
              value = item.totalValue;
              label = item.product;
              displayValue = `$${(value/1000).toFixed(0)}K`;
              break;
            default:
              value = 0;
              label = 'N/A';
              displayValue = '0';
          }
          
          const barSize = (value / maxValue) * (isHorizontal ? 70 : 280); // Percentage for horizontal, pixels for vertical
          const colors = ['#28a745', '#F08080', '#ADD8E6']; // Won, Lost, Open
          const getStatusColor = (index: number) => {
            const statusColors = ['#90EE90', '#F08080', '#ADD8E6']; // Won, Lost, Open
            return statusColors[index % 3];
          };
          const barColor = getStatusColor(index);
          
          return (
            <div key={index} className={`d-flex ${isHorizontal ? 'flex-row align-items-center' : 'flex-column align-items-center'}`} style={{ 
              flex: isHorizontal ? 'none' : '1 1 0px', 
              minWidth: isHorizontal ? '100%' : `${Math.max(50, Math.min(100, 800 / displayedData.length))}px`,
              maxWidth: isHorizontal ? '100%' : '100px',
              marginBottom: isHorizontal ? '8px' : '0',
              width: isHorizontal ? '100%' : 'auto'
            }}>
              {isHorizontal && (
                <div className="text-start me-3" style={{ minWidth: '100px' }}>
                  <small className="text-muted fw-bold" style={{ fontSize: '11px' }}>
                    {label.length > 15 ? label.substring(0, 15) + '...' : label}
                  </small>
                </div>
              )}
              
              <div className="text-center mb-2">
                <small className="fw-bold" style={{ color: barColor }}>{displayValue}</small>
              </div>
              
              <div 
                className="rounded d-flex position-relative" 
                style={{
                  width: isHorizontal ? `${barSize}%` : '60px',
                  height: isHorizontal ? '35px' : `${barSize}px`,
                  minHeight: isHorizontal ? '35px' : '30px',
                  minWidth: isHorizontal ? '5%' : '60px',
                  maxWidth: isHorizontal ? '85%' : '60px',
                  cursor: 'pointer',
                  flexDirection: isHorizontal ? 'row' : 'column',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredBar({
                    index,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                    data: { label, item, displayValue, value }
                  });
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {reportName === 'Deal Performance Report' && item.total > 0 && (
                  <>
                    <div style={{
                      backgroundColor: '#28a745',
                      flex: item.won / item.total,
                      minWidth: isHorizontal ? '3px' : '100%',
                      minHeight: isHorizontal ? '100%' : '3px',
                      transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{
                      backgroundColor: '#F08080',
                      flex: item.lost / item.total,
                      minWidth: isHorizontal ? '3px' : '100%',
                      minHeight: isHorizontal ? '100%' : '3px',
                      transition: 'all 0.3s ease'
                    }}></div>
                    <div style={{
                      backgroundColor: '#ADD8E6',
                      flex: item.open / item.total,
                      minWidth: isHorizontal ? '3px' : '100%',
                      minHeight: isHorizontal ? '100%' : '3px',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </>
                ) || (
                  <div style={{
                    backgroundColor: barColor,
                    width: '100%',
                    height: '100%',
                    transition: 'all 0.3s ease'
                  }}></div>
                )}
              </div>
              

            </div>
          );
        })}
        </div>
        
        {/* X-axis for column chart with grid lines */}
        {!isHorizontal && (
          <>
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              left: '40px', 
              right: '20px', 
              height: '20px', 
              display: 'flex', 
              justifyContent: 'space-evenly',
              alignItems: 'center',
              fontSize: '11px',
              color: '#666',
              borderTop: '1px solid #ddd'
            }}>
              {displayedData.map((item, index) => {
                let label: string;
                switch (reportName) {
                  case 'Deal Performance Report':
                    label = item.month;
                    break;
                  case 'Deal Conversion Analysis':
                    label = item.month;
                    break;
                  case 'Deal Duration Tracking':
                    label = item.range;
                    break;
                  case 'Deal Progress Overview':
                    label = item.stage;
                    break;
                  case 'Deal Products Analysis':
                    label = item.product;
                    break;
                  default:
                    label = 'N/A';
                }
                return (
                  <div key={index} style={{ textAlign: 'center', fontSize: '10px' }}>
                    {label.length > 8 ? label.substring(0, 8) + '...' : label}
                  </div>
                );
              })}
            </div>

          </>
        )}
        
        {/* X-axis for bar chart with vertical grid lines */}
        {isHorizontal && (
          <>
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              left: '20px', 
              right: '20px', 
              height: '20px', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: '#666',
              borderTop: '1px solid #ddd'
            }}>
              <span>0</span>
              <span>{Math.round(maxValue / 1000)}K</span>
            </div>
            {/* Vertical grid lines for X-axis */}
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${20 + (80 / 5) * i}%`,
                top: '20px',
                bottom: '30px',
                width: '1px',
                backgroundColor: '#e0e0e0',
                zIndex: 1
              }} />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderPieChart = (data: any[], reportName: string) => {
    const colors = ['#28a745', '#F08080', '#ADD8E6']; // Won, Lost, Open
    
    return (
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="position-relative" style={{ width: '200px', height: '200px' }}>
            <div 
              className="rounded-circle border border-5 d-flex align-items-center justify-content-center"
              style={{ 
                width: '200px', 
                height: '200px', 
                background: `conic-gradient(${data.map((item, index) => {
                  const percentage = parseFloat(item.percentage || '0');
                  return `${colors[index % colors.length]} ${index * (100/data.length)}% ${(index + 1) * (100/data.length)}%`;
                }).join(', ')})`,
                borderColor: '#dee2e6'
              }}
            >
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                <div className="text-center">
                  <div className="fw-bold">{data.length}</div>
                  <small className="text-muted">Items</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="legend">
            {data.map((item, index) => {
              let label, value;
              switch (reportName) {
                case 'Deal Performance Report':
                  label = item.month;
                  value = `$${(item.totalValue/1000).toFixed(0)}K`;
                  break;
                case 'Deal Conversion Analysis':
                  label = item.month;
                  value = `${item.conversionRate}%`;
                  break;
                case 'Deal Duration Tracking':
                  label = item.range;
                  value = `${item.count} (${item.percentage}%)`;
                  break;
                case 'Deal Progress Overview':
                  label = item.stage;
                  value = `${item.count} (${item.percentage}%)`;
                  break;
                case 'Deal Products Analysis':
                  label = item.product;
                  value = `$${(item.totalValue/1000).toFixed(0)}K`;
                  break;
                default:
                  label = 'N/A';
                  value = '0';
              }
              
              return (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div 
                    className="rounded me-2" 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: colors[index % colors.length] 
                    }}
                  ></div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span className="small">{label}</span>
                      <span className="small fw-bold">{value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderChartData = (data: any[], reportName: string) => {
    if (!data.length) return <p className="text-muted">No data available</p>;
    
    switch (reportName) {
      case 'Deal Performance Report':
        return (
          <div className="row">
            {data.slice(-6).map((item, index) => (
              <div key={index} className="col-md-4 mb-2">
                <div className="card border-0 bg-white">
                  <div className="card-body p-2 text-center">
                    <small className="text-muted">{item.month}</small>
                    <div className="d-flex justify-content-around mt-1">
                      <span className="badge text-white" style={{ backgroundColor: '#28a745' }}>
                        <span className="me-1">✓</span>{item.won} Won
                      </span>
                      <span className="badge text-white" style={{ backgroundColor: '#F08080' }}>
                        <span className="me-1">✗</span>{item.lost} Lost
                      </span>
                      <span className="badge text-dark" style={{ backgroundColor: '#ADD8E6' }}>
                        <span className="me-1">○</span>{item.open} Open
                      </span>
                    </div>
                    <small className="text-primary">${(item.totalValue/1000).toFixed(0)}K</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Deal Conversion Analysis':
        return (
          <div className="row">
            {data.slice(-6).map((item, index) => (
              <div key={index} className="col-md-4 mb-2">
                <div className="card border-0 bg-white">
                  <div className="card-body p-2 text-center">
                    <small className="text-muted">{item.month}</small>
                    <h6 className="text-success mb-1">{item.conversionRate}%</h6>
                    <small className="text-muted">{item.wonDeals}/{item.totalDeals}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Deal Duration Tracking':
        return (
          <div className="row">
            {data.map((item, index) => (
              <div key={index} className="col-md-6 mb-2">
                <div className="card border-0 bg-white">
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{item.range}</small>
                      <span className="badge bg-primary">{item.count}</span>
                    </div>
                    <small className="text-success">{item.percentage}%</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Deal Progress Overview':
        return (
          <div className="row">
            {data.map((item, index) => (
              <div key={index} className="col-md-6 mb-2">
                <div className="card border-0 bg-white">
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">{item.stage}</small>
                      <span className="badge bg-info">{item.count}</span>
                    </div>
                    <small className="text-primary">{item.percentage}%</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'Deal Products Analysis':
        return (
          <div className="row">
            {data.map((item, index) => (
              <div key={index} className="col-md-6 mb-2">
                <div className="card border-0 bg-white">
                  <div className="card-body p-2">
                    <small className="text-muted fw-bold">{item.product}</small>
                    <div className="d-flex justify-content-between mt-1">
                      <small>Deals: {item.totalDeals}</small>
                      <small className="text-success">Win: {item.winRate}%</small>
                    </div>
                    <small className="text-primary">${(item.avgValue/1000).toFixed(0)}K avg</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <p className="text-muted">No data visualization available</p>;
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const renderScoreCard = (data: any[], reportName: string) => {
    const getScoreCardMetrics = () => {
      switch (reportName) {
        case 'Deal Performance Report':
          const totalDeals = data.reduce((sum, item) => sum + item.total, 0);
          const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);
          const wonDeals = data.reduce((sum, item) => sum + item.won, 0);
          return [
            { title: 'Total Deals', value: totalDeals, color: 'primary', icon: 'bi-graph-up' },
            { title: 'Total Value', value: `$${totalValue.toLocaleString()}`, color: 'success', icon: 'bi-currency-dollar' },
            { title: 'Won Deals', value: wonDeals, color: 'info', icon: 'bi-trophy' },
            { title: 'Win Rate', value: `${((wonDeals/totalDeals)*100).toFixed(1)}%`, color: 'warning', icon: 'bi-percent' }
          ];
        case 'Deal Conversion Analysis':
          const avgConversion = data.reduce((sum, item) => sum + parseFloat(item.conversionRate), 0) / data.length;
          const totalClosedDeals = data.reduce((sum, item) => sum + item.totalDeals, 0);
          return [
            { title: 'Avg Conversion', value: `${avgConversion.toFixed(1)}%`, color: 'success', icon: 'bi-arrow-up-circle' },
            { title: 'Total Closed', value: totalClosedDeals, color: 'primary', icon: 'bi-check-circle' }
          ];
        case 'Deal Duration Tracking':
          const fastDeals = data.find(item => item.range === '0-30 days')?.count || 0;
          return [
            { title: 'Fast Deals (0-30d)', value: fastDeals, color: 'success', icon: 'bi-lightning' },
            { title: 'Total Analyzed', value: data.reduce((sum, item) => sum + item.count, 0), color: 'info', icon: 'bi-clock' }
          ];
        case 'Deal Progress Overview':
          return data.map(item => ({
            title: item.stage,
            value: item.count,
            color: 'primary',
            icon: 'bi-kanban'
          }));
        case 'Deal Products Analysis':
          const topProduct = data.sort((a, b) => b.totalValue - a.totalValue)[0];
          return [
            { title: 'Top Product', value: topProduct?.product || 'N/A', color: 'success', icon: 'bi-star' },
            { title: 'Top Value', value: `$${topProduct?.totalValue.toLocaleString() || 0}`, color: 'warning', icon: 'bi-gem' }
          ];
        default:
          return [];
      }
    };

    const metrics = getScoreCardMetrics();
    return (
      <div className="row g-3">
        {metrics.map((metric, index) => (
          <div key={index} className="col-md-3">
            <div className={`card border-${metric.color} h-100`}>
              <div className="card-body text-center">
                <i className={`bi ${metric.icon} fs-1 text-${metric.color} mb-2`}></i>
                <h6 className="card-title text-muted">{metric.title}</h6>
                <h4 className={`text-${metric.color} mb-0`}>{metric.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDataGrid = (data: any[], reportName: string) => {
    if (!data.length) return <p className="text-muted">No data available</p>;
    
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    
    const getTableHeaders = () => {
      switch (reportName) {
        case 'Deal Performance Report':
          return ['Month', 'Won', 'Lost', 'Open', 'Qualified', 'Proposal', 'Negotiation', 'Total Value'];
        case 'Deal Conversion Analysis':
          return ['Month', 'Total Deals', 'Won Deals', 'Conversion Rate'];
        case 'Deal Duration Tracking':
          return ['Duration Range', 'Count', 'Percentage'];
        case 'Deal Progress Overview':
          return ['Stage', 'Count', 'Percentage'];
        case 'Deal Products Analysis':
          return ['Product', 'Total Deals', 'Won Deals', 'Win Rate', 'Avg Value', 'Total Value'];
        default:
          return ['Data'];
      }
    };
    
    const getTableRows = () => {
      switch (reportName) {
        case 'Deal Performance Report':
          return paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>
              <td><span className="badge text-white" style={{ backgroundColor: '#28a745' }}><span className="me-1">✓</span>{item.won}</span></td>
              <td><span className="badge text-white" style={{ backgroundColor: '#F08080' }}><span className="me-1">✗</span>{item.lost}</span></td>
              <td><span className="badge text-dark" style={{ backgroundColor: '#ADD8E6' }}><span className="me-1">○</span>{item.open}</span></td>
              <td><span className="badge bg-info">{item.qualified}</span></td>
              <td><span className="badge bg-secondary">{item.proposal}</span></td>
              <td><span className="badge bg-primary">{item.negotiation}</span></td>
              <td className="text-success fw-bold">${item.totalValue.toLocaleString()}</td>
            </tr>
          ));
        case 'Deal Conversion Analysis':
          return paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>
              <td>{item.totalDeals}</td>
              <td className="text-success">{item.wonDeals}</td>
              <td><span className="badge bg-success">{item.conversionRate}%</span></td>
            </tr>
          ));
        case 'Deal Duration Tracking':
          return paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.range}</td>
              <td><span className="badge bg-primary">{item.count}</span></td>
              <td>{item.percentage}%</td>
            </tr>
          ));
        case 'Deal Progress Overview':
          return paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.stage}</td>
              <td><span className="badge bg-info">{item.count}</span></td>
              <td>{item.percentage}%</td>
            </tr>
          ));
        case 'Deal Products Analysis':
          return paginatedData.map((item, index) => (
            <tr key={index}>
              <td className="fw-bold">{item.product}</td>
              <td>{item.totalDeals}</td>
              <td className="text-success">{item.wonDeals}</td>
              <td><span className="badge bg-success">{item.winRate}%</span></td>
              <td className="text-primary">${item.avgValue.toLocaleString()}</td>
              <td className="text-success fw-bold">${item.totalValue.toLocaleString()}</td>
            </tr>
          ));
        default:
          return <tr><td>No data</td></tr>;
      }
    };
    
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">Show</span>
            <Form.Select 
              size="sm" 
              style={{ width: '80px' }} 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </Form.Select>
            <span className="text-muted">entries</span>
          </div>
          <div className="text-muted">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th key={index} scope="col">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getTableRows()}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination pagination-sm">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="report-view" style={{ padding: "20px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="link" onClick={onBack} className="p-0 me-3">
            ← Back
          </Button>
          <h4 className="d-inline">
            {entity} {reportType} Report
          </h4>
        </div>

      </div>

      {/* Filters Section */}
      <div
        className="filters-section mb-4"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e4cb9a",
        }}
      >
        <div
          style={{
            padding: "15px",
            cursor: "pointer",
            borderBottom: filtersExpanded ? "1px solid #e4cb9a" : "none",
          }}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              <span className="fw-bold">Filters ({appliedFilters.length}) - Applied: ({savedFilters.length})</span>
            </div>
            <FontAwesomeIcon
              icon={filtersExpanded ? faChevronUp : faChevronDown}
            />
          </div>
        </div>

        {filtersExpanded && (
          <div style={{ padding: "15px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              {appliedFilters.map((filter, index) => (
                <div
                  key={filter.id}
                  className={index > 0 ? "mt-3 pt-3" : ""}
                  style={{
                    borderTop: index > 0 ? "1px solid #e9ecef" : "none",
                  }}
                >
                  <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                      <label className="form-label small">Entity</label>
                      <Form.Select
                        size="sm"
                        value={filter.entity}
                        onChange={(e) => {
                          const updatedFilters = appliedFilters.map((f) =>
                            f.id === filter.id
                              ? { ...f, entity: e.target.value }
                              : f
                          );
                          setAppliedFilters(updatedFilters);
                        }}
                      >
                        <option value="Deal">Deal</option>
                        <option value="Contact">Contact</option>
                        <option value="Activity">Activity</option>
                      </Form.Select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Field</label>
                      <Form.Select
                        size="sm"
                        value={filter.field}
                        onChange={(e) => {
                          const updatedFilters = appliedFilters.map((f) =>
                            f.id === filter.id
                              ? { ...f, field: e.target.value, value: '' }
                              : f
                          );
                          setAppliedFilters(updatedFilters);
                        }}
                      >
                        {getFieldOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small">Operator</label>
                      <Form.Select
                        size="sm"
                        value={filter.operator}
                        onChange={(e) => {
                          const updatedFilters = appliedFilters.map((f) =>
                            f.id === filter.id
                              ? { ...f, operator: e.target.value }
                              : f
                          );
                          setAppliedFilters(updatedFilters);
                        }}
                      >
                        {operatorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small">Value</label>
                      {['Status', 'Pipeline', 'Owner'].includes(filter.field) ? (
                        <Form.Select
                          size="sm"
                          value={filter.value}
                          onChange={(e) => {
                            const updatedFilters = appliedFilters.map((f) =>
                              f.id === filter.id
                                ? { ...f, value: e.target.value }
                                : f
                            );
                            setAppliedFilters(updatedFilters);
                          }}
                        >
                          <option value="">Select value</option>
                          {getValueOptions(filter.field).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      ) : filter.field === 'Deal created on' ? (
                        <Form.Control
                          size="sm"
                          type="date"
                          value={filter.value}
                          onChange={(e) => {
                            const updatedFilters = appliedFilters.map((f) =>
                              f.id === filter.id
                                ? { ...f, value: e.target.value }
                                : f
                            );
                            setAppliedFilters(updatedFilters);
                          }}
                        />
                      ) : (
                        <Form.Control
                          size="sm"
                          type={filter.field === 'Deal value' ? 'number' : 'text'}
                          value={filter.value}
                          onChange={(e) => {
                            const updatedFilters = appliedFilters.map((f) =>
                              f.id === filter.id
                                ? { ...f, value: e.target.value }
                                : f
                            );
                            setAppliedFilters(updatedFilters);
                          }}
                          placeholder={filter.field === 'Deal value' ? 'Enter amount' : 'Enter value'}
                        />
                      )}
                    </div>
                    <div className="col-md-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFilter(filter.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {showAddCondition && (
                <div className={appliedFilters.length > 0 ? "mt-3" : ""}>
                  <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">Entity</label>
                      <Form.Select
                        size="sm"
                        value={newCondition.entity}
                        onChange={(e) =>
                          setNewCondition({
                            ...newCondition,
                            entity: e.target.value,
                          })
                        }
                      >
                        <option value="Deal">Deal</option>
                        <option value="Contact">Contact</option>
                        <option value="Activity">Activity</option>
                      </Form.Select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Field</label>
                      <Form.Select
                        size="sm"
                        value={newCondition.field}
                        onChange={(e) =>
                          setNewCondition({
                            ...newCondition,
                            field: e.target.value,
                            value: ''
                          })
                        }
                      >
                        <option value="">Select field</option>
                        {getFieldOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label small fw-bold">
                        Operator
                      </label>
                      <Form.Select
                        size="sm"
                        value={newCondition.operator}
                        onChange={(e) =>
                          setNewCondition({
                            ...newCondition,
                            operator: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {operatorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Value</label>
                      {['Status', 'Pipeline', 'Owner'].includes(newCondition.field) ? (
                        <Form.Select
                          size="sm"
                          value={newCondition.value}
                          onChange={(e) =>
                            setNewCondition({
                              ...newCondition,
                              value: e.target.value,
                            })
                          }
                        >
                          <option value="">Select value</option>
                          {getValueOptions(newCondition.field).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      ) : newCondition.field === 'Deal created on' ? (
                        <Form.Control
                          size="sm"
                          type="date"
                          value={newCondition.value}
                          onChange={(e) =>
                            setNewCondition({
                              ...newCondition,
                              value: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Form.Control
                          size="sm"
                          type={newCondition.field === 'Deal value' ? 'number' : 'text'}
                          value={newCondition.value}
                          onChange={(e) =>
                            setNewCondition({
                              ...newCondition,
                              value: e.target.value,
                            })
                          }
                          placeholder={newCondition.field === 'Deal value' ? 'Enter amount' : 'Enter value'}
                        />
                      )}
                    </div>
                    <div className="col-md-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setNewCondition({ entity: 'Deal', field: '', operator: '', value: '' });
                          setShowAddCondition(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={
                  appliedFilters.length > 0 || showAddCondition ? "mt-3" : ""
                }
              >
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddConditionClick}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  {showAddCondition ? "Add condition" : "Add condition"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div
        className="chart-section mb-4"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e4cb9a",
        }}
      >
        <div
          style={{
            padding: "15px",
            cursor: "pointer",
            borderBottom: chartExpanded ? "1px solid #e4cb9a" : "none",
          }}
          onClick={() => setChartExpanded(!chartExpanded)}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0">Chart</h6>
            <FontAwesomeIcon
              icon={chartExpanded ? faChevronUp : faChevronDown}
            />
          </div>
        </div>

        {chartExpanded && (
          <div style={{ padding: "20px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-3">
                <div className="d-flex gap-1">
                  <Button
                    variant={
                      chartType === "column" ? "primary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setChartType("column")}
                    title="Column Chart"
                  >
                    <FontAwesomeIcon icon={faChartBar} />
                  </Button>
                  <Button
                    variant={
                      chartType === "bar" ? "primary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setChartType("bar")}
                    title="Bar Chart"
                  >
                    <FontAwesomeIcon
                      icon={faChartLine}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </Button>
                  <Button
                    variant={
                      chartType === "pie" ? "primary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setChartType("pie")}
                    title="Pie Chart"
                  >
                    ⭕
                  </Button>
                  <Button
                    variant={
                      chartType === "scorecard"
                        ? "primary"
                        : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setChartType("scorecard")}
                    title="Score Card"
                  >
                    📊
                  </Button>
                  <Button
                    variant={
                      chartType === "table" ? "primary" : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setChartType("table")}
                    title="Table"
                  >
                    <FontAwesomeIcon icon={faTable} />
                  </Button>
                </div>

                <Form.Select
                  size="sm"
                  style={{ width: "150px" }}
                  value={viewBy}
                  onChange={(e) => setViewBy(e.target.value)}
                >
                  <option value="Deal created on">Deal created on</option>
                  <option value="Deal updated on">Deal updated on</option>
                  <option value="Deal closed on">Deal closed on</option>
                </Form.Select>

                <Form.Select
                  size="sm"
                  style={{ width: "120px" }}
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </Form.Select>

                <Form.Select
                  size="sm"
                  style={{ width: "120px" }}
                  value={segmentBy}
                  onChange={(e) => setSegmentBy(e.target.value)}
                >
                  <option value="Status">Status</option>
                  <option value="Pipeline">Pipeline</option>
                  <option value="Owner">Owner</option>
                </Form.Select>
              </div>

              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" size="sm">
                  <FontAwesomeIcon icon={faDownload} className="me-1" />
                  Export
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Export as CSV</Dropdown.Item>
                  <Dropdown.Item>Export as PDF</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {appliedFilters.length > 0 || (newCondition.field && newCondition.operator && newCondition.value) ? (
              <div key={JSON.stringify(appliedFilters) + JSON.stringify(newCondition)}>
                {renderChart()}
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <p>No filter conditions applied. Add filters to view data.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Table Section */}
      <div
        className="table-section"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #e4cb9a",
        }}
      >
        <div
          style={{
            padding: "15px",
            cursor: "pointer",
            borderBottom: tableExpanded ? "1px solid #e4cb9a" : "none",
          }}
          onClick={() => setTableExpanded(!tableExpanded)}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0">Data Table</h6>
            <FontAwesomeIcon
              icon={tableExpanded ? faChevronUp : faChevronDown}
            />
          </div>
        </div>

        {tableExpanded && (
          <div className="p-3">
            {appliedFilters.length > 0 || (newCondition.field && newCondition.operator && newCondition.value) ? (
              <>
                <div className="mb-3">
                  <small className="text-muted">Showing {getFilteredData().length} deals (Filters: {appliedFilters.length + (appliedFilters.length === 0 && newCondition.field && newCondition.operator && newCondition.value ? 1 : 0)})</small>
                </div>
                <div style={{ height: 500, width: "100%" }} key={JSON.stringify(appliedFilters) + JSON.stringify(newCondition)}>
                  <DataGrid
                rows={getFilteredData().map((deal) => ({
                  id: deal.id,
                  title: deal.title,
                  value: deal.value,
                  pipeline: deal.pipeline,
                  owner: deal.owner,
                  status: deal.status,
                  addTime: deal.addTime,
                  closeTime: deal.closeTime,
                }))}
                columns={[
                  { field: "title", headerName: "Title", width: 250 },
                  {
                    field: "value",
                    headerName: "Deal Value",
                    width: 150,
                    renderCell: (params) => (
                      <span style={{ color: "#28a745", fontWeight: "bold" }}>
                        ${params.value.toLocaleString()}
                      </span>
                    ),
                  },
                  { field: "pipeline", headerName: "Pipeline", width: 120 },
                  { field: "owner", headerName: "Owner", width: 150 },
                  {
                    field: "status",
                    headerName: "Status",
                    width: 120,
                    renderCell: (params) => (
                      <Badge
                        style={{
                          backgroundColor:
                            params.value === "Won"
                              ? "#28a745"
                              : params.value === "Lost"
                              ? "#F08080"
                              : "#ADD8E6",
                          color:
                            params.value === "Won" || params.value === "Lost"
                              ? "white"
                              : "black",
                        }}
                      >
                        {params.value === "Won"
                          ? "✓ Won"
                          : params.value === "Lost"
                          ? "✗ Lost"
                          : "○ Open"}
                      </Badge>
                    ),
                  },
                  { field: "addTime", headerName: "Deal Created On", width: 150 },
                  {
                    field: "closeTime",
                    headerName: "Expected Close Date",
                    width: 180,
                    renderCell: (params) => params.value || "TBD",
                  },
                ]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                pagination
                paginationMode="client"
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-footerContainer': {
                    minHeight: 52,
                    display: 'flex !important',
                  },
                }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-muted py-5">
                <p>No filter conditions applied. Add filters to view data.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Tooltip */}
      {hoveredBar && (
        <div
          style={{
            position: "fixed",
            left: hoveredBar.x - 100,
            top: hoveredBar.y - 120,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "12px",
            zIndex: 1000,
            minWidth: "200px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            {hoveredBar.data.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#28a745",
                  borderRadius: "50%",
                }}
              ></div>
              <span>Won: {hoveredBar.data.item.won || 0}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#F08080",
                  borderRadius: "50%",
                }}
              ></div>
              <span>Lost: {hoveredBar.data.item.lost || 0}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#ADD8E6",
                  borderRadius: "50%",
                }}
              ></div>
              <span>Open: {hoveredBar.data.item.open || 0}</span>
            </div>
          </div>
          <div
            style={{
              marginTop: "8px",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              Total: {hoveredBar.data.item.total || hoveredBar.data.value} deals
            </div>
            <div style={{ fontWeight: "bold" }}>
              Value: {hoveredBar.data.displayValue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;